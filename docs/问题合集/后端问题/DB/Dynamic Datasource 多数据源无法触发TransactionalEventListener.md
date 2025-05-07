## 背景

服务中需要用到多个数据源的数据，因此使用 Dynamic Datasource 动态多数据源框架。

其中，master数据源是MySQL，slave数据源是Oracle

## 问题现象

在代码中使用了`SpringEvent`并结合`@TransactionalEventListener`

**发送消息：**

```java
@DSTransactional(rollbackFor = Exception.class)
public void updateLogisticsFee(LogisticsFeeSaveReqVO updateReqVO) {
    // 校验门店
    LogisticsStoreDO logisticsStoreDO = logisticsStoreMapper.selectByCode(updateReqVO.getStoreCode());
    if (logisticsStoreDO == null) {
        throw ServiceExceptionUtil.exception(ErrorCodeConstants.LOGISTICS_FEE.STORE_NOT_EXISTS);
    }
    // 校验存在
    LogisticsFeeDO oldLogisticsFeeDO = logisticsFeeMapper.selectById(updateReqVO.getId());
    if (Objects.isNull(oldLogisticsFeeDO)) {
        throw ServiceExceptionUtil.exception(ErrorCodeConstants.LOGISTICS_FEE.LOGISTICS_FEE_NOT_EXISTS);
    }
    // 更新
    LogisticsFeeDO updateObj = LogisticsFeeConverter.INSTANCE.toUpdateLogisticsFeeDO(updateReqVO);
    logisticsFeeMapper.updateById(updateObj);
    
    // 发送消息
    LogisticsFeeUpdateDTO logisticsFeeUpdateDTO = new LogisticsFeeUpdateDTO().setLogisticsFeeCode(updateObj.getLogisticsCode());
    ApplicationContext applicationContext = SpringUtil.getApplicationContext();
    applicationContext.publishEvent(new LogisticsFeeUpdateEvent(logisticsFeeUpdateDTO));
}
```

其中，校验门店的查询操作使用到了Oracle数据源，更新操作使用的是MySQL数据源

**监听消息：**

```java
@Async("threadPoolTaskExecutor")
@TransactionalEventListener(value = {LogisticsFeeUpdateEvent.class})
public void recalcLogisticsFee(LogisticsFeeUpdateEvent logisticsFeeUpdateEvent) {
    LogisticsFeeUpdateDTO logisticsFeeUpdateDTO = (LogisticsFeeUpdateDTO) logisticsFeeUpdateEvent.getSource();
    LogisticsFeeRespVO logisticsFeeRespVO = logisticsFeeService.getByLogisticsCode(logisticsFeeUpdateDTO.getLogisticsFeeCode());
    if (Objects.isNull(logisticsFeeRespVO)) {
        return;
    }
    logisticsFeeService.recalcLogisticsFeeByLogisticsCode(logisticsFeeRespVO.getLogisticsCode());
}
```

在生产环境，发现每次调接口执行完updateLogisticsFee方法后，`@TransactionalEventListener`对应的方法始终没有被触发

## 猜测原因

SpringEvent事件丢失

## 定位问题

### AFTER\_COMMIT未执行

因为`@TransactionalEventListener`默认处理的事务阶段是AFTER\_COMMIT

既然无法接收到SpringEvent触发，那我就手动写一个after commit的回调来处理

在updateLogisticsFee的最后，加上以下处理来用作调试

```java
TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
    @Override
    public void afterCommit() {
        // 处理业务
    }
});
```

发现依旧没触发，说明**事务根本就没提交**，然而整个过程也没异常，那么只有可能是事务根本就没开启

在进入updateLogisticsFee后打断点，要检查当前方法是否在 Spring 管理的活动事务中执行， 执行`TransactionSynchronizationManager.isActualTransactionActive()`

发现结果为false。说明当前方法没有开启事务，连事务都没有开启，怎么会有AFTER\_COMMIT

### 多数据源事务

事务没开启，检查事务注解，发现使用的是`@DSTransactional(rollbackFor = Exception.class)`，是因为应用中使用了Dynamic Datasource 动态多数据源框架

Spring在事务的处理中，只会绑定第一个使用的数据源，也就是说，一开始操作了MySQL，就会绑定了MySQL的数据源，后续都是操作MySQL，就无法切换数据源了

所以当时一开始使用`@Transactional`时会发现有切换数据源失败的问题

而Dynamic Datasource框架提供了`@DSTransactional`注解，就可以在事务中动态切换数据源，所以就使用了该注解

所以，**猜测是Dynamic Datasource框架自己实现了一个事务机制，打破了Spring只能才能绑定一个数据源的限制**

那么也就可以说得通，为什么`TransactionSynchronizationManager.isActualTransactionActive()`未false，aftercommit没触发了

因为都不是同一套事务机制了，Spring无法识别到Dynamic Datasource的事务操作

## 原因分析

Dynamic Datasource的官方文档是收费的，所以，想要自己研究只能参考公开的资料和源码

DynamicDataSourceAopConfiguration#dynamicTransactionAdvisor这里注册了Bean

```java
@Role(BeanDefinition.ROLE_INFRASTRUCTURE)
@Bean
@ConditionalOnProperty(prefix = DynamicDataSourceProperties.PREFIX, name = "seata", havingValue = "false", matchIfMissing = true)
public Advisor dynamicTransactionAdvisor() {
    DynamicDatasourceAopProperties aopProperties = properties.getAop();
    DynamicLocalTransactionInterceptor interceptor = new DynamicLocalTransactionInterceptor(aopProperties.getAllowedPublicOnly());
    return new DynamicDataSourceAnnotationAdvisor(interceptor, DSTransactional.class);
}
```

@DsTransactional注解的核心切面拦截器就是DynamicLocalTransactionInterceptor

```java
@Slf4j
public class DynamicLocalTransactionInterceptor implements MethodInterceptor {
    private final TransactionalTemplate transactionalTemplate;
    private final DataSourceClassResolver dataSourceClassResolver;

    public DynamicLocalTransactionInterceptor(Boolean allowedPublicOnly) {
        transactionalTemplate = new TransactionalTemplate();
        dataSourceClassResolver = new DataSourceClassResolver(allowedPublicOnly);
    }

    @Override
    public Object invoke(final MethodInvocation methodInvocation) throws Throwable {
        final Method method = methodInvocation.getMethod();

        TransactionalExecutor transactionalExecutor = new TransactionalExecutor() {
            @Override
            public Object execute() throws Throwable {
                return methodInvocation.proceed();
            }

            @Override
            public TransactionalInfo getTransactionInfo() {
                return dataSourceClassResolver.findTransactionalInfo(method, methodInvocation.getThis(), DSTransactional.class);
            }
        };
        return transactionalTemplate.execute(transactionalExecutor);
    }

}
```

再查看`transactionalTemplate.execute(transactionalExecutor)`

`com.baomidou.dynamic.datasource.tx.TransactionalTemplate#execute`这里面就是执行事务操作了

`execute`方法中调用了一个`doExecute`，`doExecute`有个关键的工具类`LocalTxUtil`

`LocalTxUtil`内有startTransaction、commit、rollback操作。很明显，就是Dynamic Datasource自己实现了一套事务处理

`@TransactionalEventListener`是基于Spring的，所以是无法识别到Dynamic Datasource事务的具体提交事件的

## 问题原因

`@TransactionalEventListener`是基于Spring的提交事件来执行，而`@DSTransactional`使用的是Dynamic Datasource自身实现的一套事务机制

所以`@TransactionalEventListener`无法识别到Dynamic Datasource事务的具体操作，当然也就无法触发了

## 解决方法

### 事务传播机处理

既然是事务的问题，那么只需要去除掉多数据源下无关数据源的事务就好了

+   Oracle的操作主要是读，所以其实不必使用事务，因此，可以将其事务传播设置为 `@Transactional(propagation = Propagation.NOT_SUPPORTED)`
+   MySQL有读写操作，依然使用`@Transactional(rollbackFor = Exception.class)`

经过调整后，发现`@TransactionalEventListener`可以正常接收到消息了，也说明有after commit事件了，并且整个流程中可以正常切换到Oracle数据源再切回MySQL

那么问题来了，如果Oracle也有写操作应该怎么办呢？

+   不要求同时提交、回滚，其实就拆成两个单独的写库操作即可，使用Spring的事务机制可以解决
+   要同时提交、回滚，其实这就是分布式事务的问题了，想要控制多个数据源的同时提交、回滚，单靠Dynamic Datasource也不行，需要考虑Seata这种分布式事务中间件才行

### [DsTxEventListener(不推荐)](#dstxeventlistener-不推荐)

使用`DsTxEventListener`，这是Dynamic Datasource提供的代替`@TransactionalEventListener` 的一个注解。但是关于它的文档很少，为了防止之后引出更多的问题，不推荐使用

## 防范措施

对于使用Dynamic Datasource的东西要谨慎，文档较少