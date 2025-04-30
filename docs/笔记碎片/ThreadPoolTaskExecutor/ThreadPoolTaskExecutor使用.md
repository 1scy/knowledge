# ThreadPoolTaskExecutor使用

::: info
@Configuration(proxyBeanMethods = true) (默认)：通过代理确保 @Bean 方法之间的相互调用返回的是 Spring 容器中的单例 bean
实例。这是大多数情况下你想要的行为。

@Configuration(proxyBeanMethods = false)：禁用代理。@Bean 方法之间的相互调用将是普通的 Java 方法调用，每次调用都会创建一个新的实例。这适用于配置类中没有
@Bean 方法相互依赖的情况，可以减少代理开销。

重要提示： 如果你的 @Configuration 类中的 @Bean 方法之间存在相互调用以建立 bean 依赖关系，并且你希望这些依赖指向容器中的单例
bean，那么 不要 设置 proxyBeanMethods = false。否则会导致 bean 实例不一致的问题。只有在你确定不需要这种代理行为时才使用
false。
:::

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
}

```