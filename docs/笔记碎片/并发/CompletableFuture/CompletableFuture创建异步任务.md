---
title: CompletableFuture创建异步任务
category: 并发
tag: 并发
---


`CompletableFuture` **创建异步任务**。

创建异步任务意味着让一段代码在后台线程中执行，而不会阻塞当前的调用线程。`CompletableFuture` 提供了几个核心的静态工厂方法来实现这一点：

**1. 创建带返回值的异步任务: `supplyAsync`**

当你需要执行一个计算密集型或 I/O 密集型的操作，并且这个操作最终会产生一个结果时，使用 `supplyAsync`。

* **`CompletableFuture.supplyAsync(Supplier<U> supplier)`**
    * **作用:** 接收一个 `Supplier<U>` 函数式接口（代表一个无参且返回类型为 `U` 的函数）。它会在 Java 默认的 `ForkJoinPool.commonPool()` 线程池中异步执行这个 `supplier` 的代码。
    * **返回:** 一个 `CompletableFuture<U>`，当后台任务成功完成时，这个 Future 会持有 `supplier` 返回的结果。
    * **示例:**
        ```java
        import java.util.concurrent.CompletableFuture;
        import java.util.concurrent.TimeUnit;
        import java.util.function.Supplier;

        public class CreateSupplyAsync {
            public static void main(String[] args) {
                System.out.println(Thread.currentThread().getName() + ": 开始执行 main 方法");

                // 定义一个耗时的、有返回值的任务
                Supplier<String> longRunningTask = () -> {
                    System.out.println(Thread.currentThread().getName() + ": 后台任务开始执行...");
                    try {
                        // 模拟耗时操作，比如查询数据库或调用远程API
                        TimeUnit.SECONDS.sleep(2);
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                        return "任务被中断";
                    }
                    System.out.println(Thread.currentThread().getName() + ": 后台任务完成");
                    return "后台任务成功返回的结果";
                };

                // 使用 supplyAsync 创建并启动异步任务
                CompletableFuture<String> futureResult = CompletableFuture.supplyAsync(longRunningTask);

                System.out.println(Thread.currentThread().getName() + ": 异步任务已提交，main 方法继续执行其他事情...");

                // (可选) 在未来的某个时间点获取结果
                // 注意：join() 会阻塞当前线程直到异步任务完成，这里仅为演示
                System.out.println(Thread.currentThread().getName() + ": 准备获取异步结果...");
                String result = futureResult.join();
                System.out.println(Thread.currentThread().getName() + ": 获取到的异步结果 = " + result);

                System.out.println(Thread.currentThread().getName() + ": main 方法执行完毕");
                // 输出会显示后台任务在 ForkJoinPool 的 worker 线程执行
            }
        }
        ```

* **`CompletableFuture.supplyAsync(Supplier<U> supplier, Executor executor)`**
    * **作用:** 与上一个版本类似，但允许你**指定一个自定义的线程池 (`Executor`)** 来执行任务。这在需要精细控制线程资源、隔离不同类型任务或避免阻塞共享的 `commonPool` 时非常重要和常用。
    * **示例:**
        ```java
        import java.util.concurrent.CompletableFuture;
        import java.util.concurrent.ExecutorService;
        import java.util.concurrent.Executors;
        import java.util.concurrent.TimeUnit;
        import java.util.function.Supplier;

        public class CreateSupplyAsyncExecutor {
            public static void main(String[] args) {
                // 创建一个固定大小的自定义线程池
                ExecutorService myExecutor = Executors.newFixedThreadPool(2);
                System.out.println(Thread.currentThread().getName() + ": main 方法开始");

                Supplier<String> task = () -> {
                    System.out.println(Thread.currentThread().getName() + ": 任务在自定义线程池执行...");
                    try { TimeUnit.SECONDS.sleep(1); } catch (InterruptedException e) { /* ... */ }
                    return "来自自定义线程池的结果";
                };

                // 使用 supplyAsync 并指定自定义线程池
                CompletableFuture<String> futureResult = CompletableFuture.supplyAsync(task, myExecutor);

                System.out.println(Thread.currentThread().getName() + ": 任务已提交到自定义线程池");

                String result = futureResult.join(); // 等待结果
                System.out.println(Thread.currentThread().getName() + ": 结果 = " + result);

                myExecutor.shutdown(); // 关闭自定义线程池
                System.out.println(Thread.currentThread().getName() + ": main 方法结束");
            }
        }
        ```

**2. 创建无返回值的异步任务: `runAsync`**

当你只需要在后台执行一个操作（例如发送通知、写入日志、执行清理），而不需要关心其返回值时，使用 `runAsync`。

* **`CompletableFuture.runAsync(Runnable runnable)`**
    * **作用:** 接收一个 `Runnable` 函数式接口（代表一个无参无返回值的函数）。它会在 `ForkJoinPool.commonPool()` 中异步执行 `runnable` 的代码。
    * **返回:** `CompletableFuture<Void>`。这里的 `Void` 类型表示这个 Future 完成时没有具体的返回值。你可以用它来知道任务何时完成，或者在其完成后触发其他操作。
    * **示例:**
        ```java
        import java.util.concurrent.CompletableFuture;
        import java.util.concurrent.TimeUnit;

        public class CreateRunAsync {
            public static void main(String[] args) {
                System.out.println(Thread.currentThread().getName() + ": 开始 main");

                // 定义一个无返回值的耗时任务
                Runnable backgroundAction = () -> {
                    System.out.println(Thread.currentThread().getName() + ": 后台动作开始执行...");
                    try {
                        TimeUnit.SECONDS.sleep(1);
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                    }
                    System.out.println(Thread.currentThread().getName() + ": 后台动作执行完毕");
                };

                // 使用 runAsync 创建并启动异步任务
                CompletableFuture<Void> futureCompletion = CompletableFuture.runAsync(backgroundAction);

                System.out.println(Thread.currentThread().getName() + ": 异步动作已提交，main 继续...");

                // (可选) 等待任务完成
                futureCompletion.join(); // 阻塞直到 runAsync 的任务执行完毕
                System.out.println(Thread.currentThread().getName() + ": 确认后台动作已完成");

                System.out.println(Thread.currentThread().getName() + ": main 结束");
            }
        }
        ```

* **`CompletableFuture.runAsync(Runnable runnable, Executor executor)`**
    * **作用:** 与上一个版本类似，但允许你指定自定义的 `Executor` 来执行 `Runnable` 任务。
    * **示例:** (与 `supplyAsync` 指定 `Executor` 的方式类似，只需将 `Supplier` 换成 `Runnable`)

**总结:**

创建异步任务的核心就是使用 `CompletableFuture.supplyAsync(...)`（有返回值）或 `CompletableFuture.runAsync(...)`（无返回值）。关键在于选择是否需要返回值，以及是使用默认的共享线程池还是提供一个自定义的线程池来更好地管理执行资源。