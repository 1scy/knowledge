---
title: ThreadPoolTaskExecutor使用
category: 并发
tag: 并发
---
 

`ThreadPoolTaskExecutor` 是 Spring 框架提供的一个非常有用的工具，它是 `TaskExecutor` 接口的一个实现，用于通过线程池来执行异步任务。使用线程池可以有效地管理线程的生命周期，避免频繁地创建和销毁线程带来的开销，从而提高应用程序的性能和资源利用率。

### 主要特点和优势

* **线程池管理：** 重用固定或动态数量的线程来执行多个任务，减少线程创建和销毁的开销。
* **灵活配置：** 提供丰富的配置选项，可以根据应用程序的需求精细调整线程池的行为。
* **与 Spring 集成：** 与 Spring 的 `@Async` 注解无缝集成，轻松实现方法的异步执行。
* **任务管理：** 当线程池中的所有线程都在忙碌时，管理一个等待执行的任务队列。

::: info
@Configuration(proxyBeanMethods = true) (默认)：通过代理确保 @Bean 方法之间的相互调用返回的是 Spring 容器中的单例 bean
实例。这是大多数情况下你想要的行为。

@Configuration(proxyBeanMethods = false)：禁用代理。@Bean 方法之间的相互调用将是普通的 Java 方法调用，每次调用都会创建一个新的实例。这适用于配置类中没有
@Bean 方法相互依赖的情况，可以减少代理开销。

重要提示： 如果你的 @Configuration 类中的 @Bean 方法之间存在相互调用以建立 bean 依赖关系，并且你希望这些依赖指向容器中的单例
bean，那么 不要 设置 proxyBeanMethods = false。否则会导致 bean 实例不一致的问题。只有在你确定不需要这种代理行为时才使用
false。
:::

### 配置

```java

@EnableAsync // 启用 Spring 的异步方法执行能力
@Configuration // 配置类
public class ThreadPoolConfig {
    // 配置一个线程池供 @Async 使用
    @Bean(name = "taskExecutor")
    public ThreadPoolTaskExecutor threadPoolTaskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(10); //核心线程池
        executor.setMaxPoolSize(20); //最大线程池
        executor.setKeepAliveSeconds(60); // 线程池维护线程所允许的空闲时间
        executor.setQueueCapacity(200); // 线程池所使用的缓冲队列
        executor.setThreadNamePrefix("report-thread-pool-"); // 线程池的前缀
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy()); // 拒绝策略
        executor.initialize(); // 进行加载
        return executor;
    }


    @Override
    public AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler() {
        // 可选：为异步任务提供自定义的异常处理器
        return new MyAsyncExceptionHandler();
    }
}
```


**关键配置属性解释：**

* `corePoolSize`：核心线程数。即使线程处于空闲状态，也会保留这些线程，除非设置了 `allowCoreThreadTimeOut(true)`。这是线程池中保持的最小活跃线程数。
* `maxPoolSize`：线程池允许创建的最大线程数。只有当任务队列满了之后，线程数才会增加到这个最大值。
* `queueCapacity`：用于存放待执行任务的阻塞队列的容量。有界队列可以防止内存消耗过大，并在系统过载时提供背压。无界队列（`Integer.MAX_VALUE` 或 -1）意味着 `maxPoolSize` 将基本被忽略，因为任务总是会被添加到队列中。
* `keepAliveSeconds`：当线程数超过核心线程数 (`corePoolSize`) 时，空闲线程在终止之前等待新任务的最长时间（以秒为单位）。
* `allowCoreThreadTimeOut`：如果设置为 `true`，允许核心线程在空闲超过 `keepAliveSeconds` 后超时并终止。
* `threadNamePrefix`：线程池创建的线程的名称前缀，有助于调试和监控。
* `rejectedExecutionHandler`：定义当任务无法被执行器接受时（例如，队列已满且达到最大线程数）的处理策略。常见的策略包括 `AbortPolicy`（默认，抛出 `RejectedExecutionException` 异常）、`CallerRunsPolicy`（在调用线程中执行任务）、`DiscardPolicy`（静默丢弃任务）和 `DiscardOldestPolicy`（丢弃队列中最旧的任务，然后重试当前任务）。

### 使用方式

将 `ThreadPoolTaskExecutor` 配置为 Spring Bean 后，可以将其注入到其他组件中，用于执行 `Runnable` 或 `Callable` 任务。

#### 使用 `@Async` 注解

在 Spring 中，最常用的方式是结合 `@Async` 注解来使用 `ThreadPoolTaskExecutor`。通过启用 `@EnableAsync` 并配置一个 `TaskExecutor` Bean（使用默认名称 `taskExecutor` 或在 `@Async` 注解中指定名称），被 `@Async` 注解标记的方法将在线程池中的一个单独线程中执行。

```java
@Service
public class MyService {

    @Async
    public void performAsyncTask() {
        // 这个方法将在异步线程中执行
        System.out.println("正在线程中执行异步任务: " + Thread.currentThread().getName());
        // ... 执行一些耗时操作
    }

    @Async("taskExecutor") // 如果使用非默认名称的 executor，需要指定 Bean 名称
    public void performAsyncTaskWithNamedExecutor() {
        System.out.println("正在线程中执行异步任务: " + Thread.currentThread().getName());
        // ...
    }
}
```

当调用 `performAsyncTask()` 或 `performAsyncTaskWithNamedExecutor()` 方法时，Spring 会拦截该调用，并将方法执行作为一个任务提交给配置的 `ThreadPoolTaskExecutor`。

#### 直接注入和使用 Executor

你也可以将 `ThreadPoolTaskExecutor` Bean 直接注入到你的类中，并使用其 `execute()` 方法提交 `Runnable` 任务，或使用 `submit()` 提交 `Callable` 任务。

```java
@Service
public class AnotherService {

    @Resource(name = "taskExecutor")
    private TaskExecutor taskExecutor;

    public void startTask() {
        taskExecutor.execute(() -> {
            // 这段代码将在任务执行器的线程中运行
            System.out.println("正在线程中直接执行任务: " + Thread.currentThread().getName());
            // ...
        });
    }
}
```

**区别：**

| 特性         | `execute(Runnable task)`                    | `submit()`                                          |
| :----------- | :------------------------------------------ | :-------------------------------------------------- |
| 所属接口     | `Executor`                                  | `ExecutorService`                                   |
| 接受任务类型 | 仅 `Runnable`                               | `Runnable` 或 `Callable`                            |
| 返回值       | `void`                                      | `Future<?>` (`Runnable`) 或 `Future<T>` (`Callable`) |
| 异常处理     | 由线程池或线程的 Handler 处理，调用者不易感知和处理 | 异常被封装在 `Future` 中，调用 `get()` 时抛出，易于捕获 |
| 获取结果     | 不支持                                      | 支持 (通过 `Future.get()`)                          |
| 适用场景     | “即发即弃”的任务，不关心执行结果和内部异常    | 需要获取任务执行结果、检查状态、取消任务或在调用点处理任务内部异常 |