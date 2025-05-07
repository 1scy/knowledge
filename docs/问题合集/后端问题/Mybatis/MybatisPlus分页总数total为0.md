---
title: MybatisPlus分页总数total为0
category: Mybatis
tag: Mybatis
---


## [问题现象](#问题现象)

使用MybatisPlus分页时，分页结果中的total、pages一直为0

## [可能原因](#可能原因)

1.  未开启分页配置

## [问题原因](#问题原因)

未配置MybatisPlus分页插件

## [解决方法](#解决方法)

配置MybatisPlus分页插件：

```java
/**
 * 配置MybatisPlus插件
 */
@Bean
public MybatisPlusInterceptor mybatisPlusInterceptor() {
    MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
    // 添加分页插件。如果配置多个插件,分页插件必须在最后
    interceptor.addInnerInterceptor(new PaginationInnerInterceptor(DbType.MYSQL));
    return interceptor;
}
```

若配置插件后仍存在问题，可能是SpringBoot未扫描到该Bean，应检查SpringBoot的`@ComponentScan`的扫描是否有问题


