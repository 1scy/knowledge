---
title: Async失效场景
category: 并发
tag: 并发
---
  

解释 `@Async` 注解异步失效的常见场景。

首先，确保你的主应用类或配置类上启用了异步支持（除了在场景 5 中演示缺少该注解的情况外）：

```java
// SpringBootApplication.java (或你的主要配置类)
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync // 启用 Spring 的异步方法执行能力
public class YourApplication {

    public static void main(String[] args) {
        SpringApplication.run(YourApplication.class, args);
    }
}
```

---

**场景 1: 自身调用 (Self-invocation)**

当同一个 bean 内部的一个方法调用另一个 `@Async` 方法时，异步会失效。

```java
// MyService.java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class MyService {

    private static final Logger logger = LoggerFactory.getLogger(MyService.class);

    // 这个方法将被外部调用
    public void startAsyncProcess() {
        logger.info("进入 startAsyncProcess 方法, 当前线程: {}", Thread.currentThread().getName());
        // 在同一个对象内部调用 @Async 方法
        // **** 问题所在 ****：这是自身调用，@Async 将失效
        this.doAsyncWork();
        logger.info("退出 startAsyncProcess 方法"); // 这行会立即执行
    }

    @Async // 理论上应该异步执行
    public void doAsyncWork() {
        logger.info("进入 doAsyncWork 方法, 当前线程: {}", Thread.currentThread().getName());
        try {
            // 模拟耗时操作
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        logger.info("退出 doAsyncWork 方法");
    }
}
```

**解释：**

在 `startAsyncProcess` 方法中，`this.doAsyncWork()` 调用直接发生在 `MyService` 对象的引用上。Spring 的 AOP 代理是在对象 *外部* 包裹的。当你通过 `this` 调用时，你绕过了 Spring 创建的代理，直接调用了原始对象的方法。因此，`@Async` 注解的逻辑（在单独线程中执行方法）没有被应用。`doAsyncWork` 会在调用者 (`startAsyncProcess`) 的同一个线程中同步执行。

**工作示例 (使用自注入或 helper 类)：**

```java
// MyService.java (使用自注入 - 需要 @Lazy 避免循环依赖)
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class MyService {

    private static final Logger logger = LoggerFactory.getLogger(MyService.class);

    // 将 MyService 的代理注入自身
    // @Lazy 是必要的，否则会因为互相依赖而导致循环引用错误
    @Autowired
    @Lazy
    private MyService self;

    public void startAsyncProcess() {
        logger.info("进入 startAsyncProcess 方法, 当前线程: {}", Thread.currentThread().getName());
        // 调用注入的代理对象上的方法
        self.doAsyncWork(); // **** 工作了 ****：通过代理调用
        logger.info("退出 startAsyncProcess 方法"); // 这行会立即执行
    }

    @Async // 理论上应该异步执行
    public void doAsyncWork() {
        logger.info("进入 doAsyncWork 方法 (Async), 当前线程: {}", Thread.currentThread().getName());
        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        logger.info("退出 doAsyncWork 方法 (Async)");
    }
}
```

或者，创建另一个服务类来放置异步方法：

```java
// AsyncHelperService.java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class AsyncHelperService {
    private static final Logger logger = LoggerFactory.getLogger(AsyncHelperService.class);

    @Async
    public void doAsyncWork() {
        logger.info("进入 doAsyncWork 方法 (AsyncHelper), 当前线程: {}", Thread.currentThread().getName());
        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        logger.info("退出 doAsyncWork 方法 (AsyncHelper)");
    }
}

// MyService.java (调用 AsyncHelperService)
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MyService {

    private static final Logger logger = LoggerFactory.getLogger(MyService.class);

    @Autowired
    private AsyncHelperService asyncHelperService; // 注入 helper service

    public void startAsyncProcess() {
        logger.info("进入 startAsyncProcess 方法, 当前线程: {}", Thread.currentThread().getName());
        // 调用另一个 bean 的 @Async 方法
        asyncHelperService.doAsyncWork(); // **** 工作了 ****：通过注入的代理调用
        logger.info("退出 startAsyncProcess 方法"); // 这行会立即执行
    }
}
```

---

**场景 2: 私有方法 (Private Methods)**

`@Async` 注解对私有方法无效。

```java
// PrivateMethodService.java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class PrivateMethodService {

    private static final Logger logger = LoggerFactory.getLogger(PrivateMethodService.class);

    public void startProcess() {
        logger.info("进入 startProcess 方法, 当前线程: {}", Thread.currentThread().getName());
        this.privateAsyncMethod(); // 调用私有方法
        logger.info("退出 startProcess 方法"); // 这行会立即执行
    }

    @Async // 注解在这里
    private void privateAsyncMethod() { // **** 问题所在 ****：方法是私有的
        logger.info("进入 privateAsyncMethod 方法, 当前线程: {}", Thread.currentThread().getName());
        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        logger.info("退出 privateAsyncMethod 方法");
    }
}
```

**解释：**

Spring 的 AOP 代理通常只能拦截对公共方法的调用。将 `@Async` 应用于私有方法是无效的，它会被忽略，方法将像普通私有方法一样同步执行。

**工作示例：** 将方法改为 `public`。

```java
// PrivateMethodService.java (修改后)
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class PrivateMethodService {

    private static final Logger logger = LoggerFactory.getLogger(PrivateMethodService.class);

    public void startProcess() {
        logger.info("进入 startProcess 方法, 当前线程: {}", Thread.currentThread().getName());
        this.publicAsyncMethod(); // 调用公共方法
        logger.info("退出 startProcess 方法"); // 这行会立即执行
    }

    @Async // 注解在这里
    public void publicAsyncMethod() { // **** 工作了 ****：方法是公共的
        logger.info("进入 publicAsyncMethod 方法 (Async), 当前线程: {}", Thread.currentThread().getName());
        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        logger.info("退出 publicAsyncMethod 方法 (Async)");
    }
}
```

---

**场景 3: 静态方法 (Static Methods)**

`@Async` 注解对静态方法无效。

```java
// StaticMethodAsync.java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component; // 可以是 Component，但调用方式不同

@Component // 或者只是一个普通类
public class StaticMethodAsync {

    private static final Logger logger = LoggerFactory.getLogger(StaticMethodAsync.class);

    // @Async 注解在这里
    @Async // **** 问题所在 ****：方法是静态的
    public static void staticAsyncMethod() {
        logger.info("进入 staticAsyncMethod 方法, 当前线程: {}", Thread.currentThread().getName());
        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        logger.info("退出 staticAsyncMethod 方法");
    }

    // 如果从同一个类中调用
    public void callStaticAsyncMethod() {
        logger.info("进入 callStaticAsyncMethod 方法, 当前线程: {}", Thread.currentThread().getName());
        StaticMethodAsync.staticAsyncMethod(); // 直接调用静态方法
        logger.info("退出 callStaticAsyncMethod 方法");
    }
}
```

**解释：**

静态方法不属于任何对象实例，而是属于类本身。Spring 的 AOP 代理是基于对象实例的。因此，`@Async` 注解无法应用于静态方法，它会被忽略，方法将同步执行。

**工作示例：** 将方法改为非静态，并确保类是一个 Spring bean，通过 Spring 容器获取实例进行调用。

```java
// StaticMethodAsync.java (修改为非静态)
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component // 必须是 Spring 管理的 bean
public class StaticMethodAsync {

    private static final Logger logger = LoggerFactory.getLogger(StaticMethodAsync.class);

    @Async // **** 工作了 ****：方法是非静态的
    public void nonStaticAsyncMethod() {
        logger.info("进入 nonStaticAsyncMethod 方法 (Async), 当前线程: {}", Thread.currentThread().getName());
        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        logger.info("退出 nonStaticAsyncMethod 方法 (Async)");
    }
}

// 在另一个服务类中调用:
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CallerService {
    @Autowired
    private StaticMethodAsync staticMethodAsync; // 注入 bean

    public void triggerAsync() {
        staticMethodAsync.nonStaticAsyncMethod(); // 通过注入的 bean 调用
    }
}
```

---

**场景 4: `@Async` 与事务 (Transactions) 的交互问题**

事务是线程绑定的。当一个有事务的方法调用一个 `@Async` 方法时，事务上下文不会传播到异步执行的新线程。

```java
// TransactionalService.java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TransactionalService {

    private static final Logger logger = LoggerFactory.getLogger(TransactionalService.class);

    @Autowired
    private AsyncService asyncService;

    @Transactional // 外部事务
    public void performTransactionalAsyncCall() {
        logger.info("进入 performTransactionalAsyncCall 方法, 当前线程: {}, 事务状态: {}",
                Thread.currentThread().getName(),
                // 实际检查事务状态需要 TransactionSynchronizationManager 或类似工具
                "checking..."); // 简化表示这里有事务

        // 模拟一些事务内的操作
        // userRepository.save(...);

        // 调用异步方法
        asyncService.doAsyncWork(); // **** 问题所在 ****：外部事务不传播到这里

        // 模拟一些事务内的操作
        // anotherRepository.save(...);

        logger.info("退出 performTransactionalAsyncCall 方法");
        // 事务在这里提交 (如果一切顺利) 或回滚 (如果抛出 RuntimeException)
    }
}

// AsyncService.java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // 这里的 @Transactional 需要小心

@Service
public class AsyncService {

    private static final Logger logger = LoggerFactory.getLogger(AsyncService.class);

    @Async // 异步执行
    // 如果这里也需要事务，通常需要 Propagation.REQUIRES_NEW
    // @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void doAsyncWork() {
        logger.info("进入 doAsyncWork 方法 (Async), 当前线程: {}, 事务状态: {}",
                Thread.currentThread().getName(),
                 "checking..."); // 简化表示这里是新线程，可能没有外部事务

        // 模拟一些操作
        // thirdRepository.save(...);

        // 如果这里没有 @Transactional，且上面的方法抛异常，这里的操作不会回滚
        // 如果这里有 @Transactional(REQUIRES_NEW)，则这里有独立事务，与外部事务无关
        // 如果这里有 @Transactional(REQUIRED)，则因为新线程没有外部事务，会创建新事务

        logger.info("退出 doAsyncWork 方法 (Async)");
    }
}
```

**解释：**

Spring 的事务管理器默认使用 `ThreadLocal` 来绑定当前线程的事务。当 `@Async` 方法在一个新的线程中执行时，这个新线程没有继承调用线程的 `ThreadLocal` 事务上下文。因此，在 `asyncService.doAsyncWork()` 方法中执行的数据库操作默认不会包含在 `TransactionalService` 的外部事务中。如果在 `TransactionalService` 的 `performTransactionalAsyncCall()` 方法中调用 `asyncService.doAsyncWork()` 之后抛出异常，`TransactionalService` 中的操作会回滚，但 `asyncService.doAsyncWork()` 中（如果它自身没有启动新事务的话）已提交的操作不会回滚。

**工作示例 (使异步方法拥有自己的事务)：**

```java
// AsyncService.java (使异步方法拥有自己的新事务)
import org.slf4j.Logger;
import org.slf44j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AsyncService {

    private static final Logger logger = LoggerFactory.getLogger(AsyncService.class);

    @Async
    @Transactional(propagation = Propagation.REQUIRES_NEW) // **** 工作了 ****：在新线程中启动独立事务
    public void doAsyncWorkWithNewTransaction() {
        logger.info("进入 doAsyncWorkWithNewTransaction 方法 (Async), 当前线程: {}, 事务状态: {}",
                Thread.currentThread().getName(),
                "checking..."); // 简化表示这里有新事务

        // 模拟一些操作
        // thirdRepository.save(...); // 这些操作会包含在新的事务中

        logger.info("退出 doAsyncWorkWithNewTransaction 方法 (Async)");
        // 这个新事务在这里提交 (如果顺利) 或回滚 (如果抛异常)
    }
}

// TransactionalService 仍然调用这个方法
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TransactionalService {

    private static final Logger logger = LoggerFactory.getLogger(TransactionalService.class);

    @Autowired
    private AsyncService asyncService;

    @Transactional // 外部事务
    public void performTransactionalAsyncCallCorrectly() {
        logger.info("进入 performTransactionalAsyncCallCorrectly 方法, 当前线程: {}, 事务状态: {}",
                Thread.currentThread().getName(),
                "checking..."); // 外部事务

        // 模拟一些事务内的操作
        // userRepository.save(...);

        // 调用异步方法，它将运行在独立的新事务中
        asyncService.doAsyncWorkWithNewTransaction(); // **** 工作了 ****：异步方法有自己的事务

        // 模拟一些事务内的操作
        // anotherRepository.save(...);

        logger.info("退出 performTransactionalAsyncCallCorrectly 方法");
        // 外部事务在这里提交 (如果顺利) 或回滚 (如果抛出 RuntimeException)
        // 异步方法中的事务独立于此
    }
}
```

**注意：** `@Transactional` 注解在被 `@Async` 注解的方法 **内部** 生效是没有问题的，因为 `@Async` 会创建一个新的线程，而 `@Transactional` 会在该新线程中开始或加入一个事务（取决于传播行为）。问题在于 **从外部事务方法调用异步方法时，外部事务不会传播到异步线程**。

---

**场景 5: 缺少 `@EnableAsync`**

如果没有在 Spring 配置中启用异步功能，`@Async` 注解将被完全忽略。

```java
// YourApplication.java (缺少 @EnableAsync)
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
// import org.springframework.context.annotation.EnableAsync; // **** 问题所在 ****：缺少此注解

@SpringBootApplication
// @EnableAsync // 缺少这行
public class YourApplication {

    public static void main(String[] args) {
        SpringApplication.run(YourApplication.class, args);
    }
}

// MyServiceWithAsync.java (与场景 1 中的 MyService 类似)
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class MyServiceWithAsync {

    private static final Logger logger = LoggerFactory.getLogger(MyServiceWithAsync.class);

    public void triggerAsyncMethod() {
         logger.info("进入 triggerAsyncMethod 方法, 当前线程: {}", Thread.currentThread().getName());
         this.doAsyncWork(); // 或者调用另一个 bean 的方法
         logger.info("退出 triggerAsyncMethod 方法"); // 这行会等待 doAsyncWork 完成
    }

    @Async // 注解在这里
    public void doAsyncWork() { // **** 问题所在 ****：@EnableAsync 未启用，此注解无效
        logger.info("进入 doAsyncWork 方法, 当前线程: {}", Thread.currentThread().getName());
        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        logger.info("退出 doAsyncWork 方法");
    }
}
```

**解释：**

`@EnableAsync` 注解是告诉 Spring 容器需要处理 `@Async` 注解的“开关”。如果没有启用，Spring 容器在扫描 bean 时会忽略 `@Async` 注解，不会为其创建异步执行的代理逻辑。

**工作示例：** 在配置类上添加 `@EnableAsync`。

```java
// YourApplication.java (添加 @EnableAsync)
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.EnableAsync; // **** 工作了 ****：添加此注解

@SpringBootApplication
@EnableAsync // 添加这行
public class YourApplication {

    public static void main(String[] args) {
        SpringApplication.run(YourApplication.class, args);
    }
}

// MyServiceWithAsync 就可以正常工作了 (假设没有其他问题，如自身调用)
```

---

**场景 6: 从非 Spring 管理的对象中调用**

`@Async` 注解仅对 Spring IoC 容器管理的 bean 中的方法有效。

```java
// NotASpringBean.java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
// import org.springframework.stereotype.Component; // **** 问题所在 ****：这不是一个 Spring Bean

public class NotASpringBean { // 没有 @Component, @Service 等注解

    private static final Logger logger = LoggerFactory.getLogger(NotASpringBean.class);

    @Async // 注解在这里
    public void doAsyncWork() { // **** 问题所在 ****：对象不是 Spring 管理的
        logger.info("进入 doAsyncWork 方法, 当前线程: {}", Thread.currentThread().getName());
        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        logger.info("退出 doAsyncWork 方法");
    }
}

// 在某个地方这样使用它
public class SomeOtherClass {

    public void demonstrateIssue() {
        NotASpringBean nonBean = new NotASpringBean(); // **** 问题所在 ****：手动创建对象
        nonBean.doAsyncWork(); // 调用方法，@Async 无效
    }
}
```

**解释：**

Spring 的 AOP 代理和 `@Async` 的处理机制是在 Spring 容器管理 bean 的生命周期中应用的。如果你手动使用 `new` 关键字创建对象，Spring 容器不会介入，也不会为这个对象创建代理。因此，对象上的 `@Async` 注解会被忽略。

**工作示例：** 将类声明为 Spring Bean，并通过依赖注入获取它。

```java
// NotASpringBean.java (修改为 Spring Bean)
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component; // **** 工作了 ****：声明为 Spring Bean

@Component // 或 @Service 等
public class NotASpringBean {

    private static final Logger logger = LoggerFactory.getLogger(NotASpringBean.class);

    @Async // 注解在这里
    public void doAsyncWork() { // **** 工作了 ****：对象是 Spring 管理的，通过代理调用
        logger.info("进入 doAsyncWork 方法 (Async), 当前线程: {}", Thread.currentThread().getName());
        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        logger.info("退出 doAsyncWork 方法 (Async)");
    }
}

// 在 Spring 管理的另一个类中注入并使用它
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SomeOtherService {

    @Autowired
    private NotASpringBean springBean; // **** 工作了 ****：通过依赖注入获取 Spring Bean

    public void demonstrateCorrectUse() {
        springBean.doAsyncWork(); // 调用方法，@Async 会生效
    }
}
```

