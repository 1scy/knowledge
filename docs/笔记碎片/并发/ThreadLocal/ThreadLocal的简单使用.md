---
title: ThreadLocal的简单使用
category: 并发
tag: 并发
---
 

::: info
### `ThreadLocal` 的核心原理 (简化版)

每个 `Thread` 对象内部都有一个 `ThreadLocal.ThreadLocalMap` 类型的成员变量。当你创建一个 `ThreadLocal` 对象，并在某个线程中第一次调用它的 `set()` 或 `get()` 方法时：

* 这个线程会访问自己的 `ThreadLocalMap`。
* `ThreadLocal` 实例本身作为 `key`，你要存储的值作为 `value`，一起存入这个 `ThreadLocalMap` 中。
* 当同一个线程再次访问同一个 `ThreadLocal` 实例时，它会从自己的 `ThreadLocalMap` 中找到对应的 `key`（即那个 `ThreadLocal` 实例），然后取出之前存储的 `value`。
* 不同线程访问同一个 `ThreadLocal` 实例时，它们会操作各自独立的 `ThreadLocalMap`，因此获取到的值是各自线程私有的。

### `ThreadLocal` 的主要方法

* `void set(T value)`: 设置当前线程中该 `ThreadLocal` 变量的值为 `value`。
* `T get()`: 获取当前线程中该 `ThreadLocal` 变量的值。如果当前线程没有为这个 `ThreadLocal` 设置过值，第一次调用时会调用 `initialValue()` 方法（或者使用 `withInitial()` 方法指定的初始化逻辑）获取初始值并存储起来，然后返回。
* `void remove()`: 移除当前线程中该 `ThreadLocal` 变量的值。这是一个**非常重要**的方法，特别是在使用线程池时，用于防止内存泄露（后面会详细说明）。

:::

ThreadLocal 的简单使用就是为了让每个线程拥有自己独立的一份变量副本。

最核心的用法就是创建 `ThreadLocal` 实例，然后在需要的地方通过 `set()` 设置当前线程的值，通过 `get()` 获取当前线程的值。

下面是一个最简单的示例，展示了在两个不同的线程中，同一个 `ThreadLocal` 实例如何存储和获取到不同的值：

```java
public class SimpleThreadLocalExample {

    // 1. 创建一个 ThreadLocal 实例
    // 我们可以指定它存储的数据类型，这里是 String
    // 使用 withInitial() 提供一个初始值（可选，不提供则默认为 null）
    private static final ThreadLocal<String> THREAD_PRIVATE_DATA =
            ThreadLocal.withInitial(() -> "默认初始值来自 " + Thread.currentThread().getName());


    public static void main(String[] args) throws InterruptedException {
        System.out.println("主线程 [" + Thread.currentThread().getName() + "] 开始。");

        // 在主线程中获取和设置 THREAD_PRIVATE_DATA
        System.out.println("主线程第一次获取值: " + THREAD_PRIVATE_DATA.get()); // 会获取到初始值
        THREAD_PRIVATE_DATA.set("主线程存放的数据"); // 主线程设置自己的值
        System.out.println("主线程设置值后获取: " + THREAD_PRIVATE_DATA.get());


        // 2. 创建并启动一个新的线程
        Thread workerThread = new Thread(() -> {
            System.out.println("\n工作线程 [" + Thread.currentThread().getName() + "] 开始。");

            // 在工作线程中获取 THREAD_PRIVATE_DATA 的值
            // 第一次获取会触发工作线程的初始化逻辑
            System.out.println("工作线程第一次获取值: " + THREAD_PRIVATE_DATA.get());

            // 在工作线程中设置 THREAD_PRIVATE_DATA 的值
            // 这个值只属于工作线程，不会影响主线程
            THREAD_PRIVATE_DATA.set("工作线程存放的数据");
            System.out.println("工作线程设置值后获取: " + THREAD_PRIVATE_DATA.get());

            System.out.println("工作线程 [" + Thread.currentThread().getName() + "] 结束。");

            // !!! 重要提示：在这个简单的示例中省略了 remove()，但在实际应用中（尤其线程池）强烈推荐使用 remove() !!!
            // 例如： THREAD_PRIVATE_DATA.remove(); // 移除当前线程的值
        }, "WorkerThread-1"); // 给线程取个名字方便区分

        workerThread.start(); // 启动工作线程


        // 等待工作线程执行完毕 (为了让主线程在它之后打印结果)
        workerThread.join();


        // 3. 回到主线程，再次获取 THREAD_PRIVATE_DATA 的值
        // 验证主线程的值没有被工作线程修改
        System.out.println("\n主线程 [" + Thread.currentThread().getName() + "] 再次获取值 (工作线程执行后): " + THREAD_PRIVATE_DATA.get());

         // 主线程执行完毕，如果不再需要，也应该移除自己的值
         // THREAD_PRIVATE_DATA.remove();


        System.out.println("主线程 [" + Thread.currentThread().getName() + "] 结束。");
    }
}
```

**运行上面的代码，你会看到类似如下的输出：**

```
主线程 [main] 开始。
>>> [main] 正在初始化 ThreadLocal 值...
主线程第一次获取值: 默认初始值来自 main
主线程设置值后获取: 主线程存放的数据

工作线程 [WorkerThread-1] 开始。
>>> [WorkerThread-1] 正在初始化 ThreadLocal 值...
工作线程第一次获取值: 默认初始值来自 WorkerThread-1
工作线程设置值后获取: 工作线程存放的数据
工作线程 [WorkerThread-1] 结束。

主线程 [main] 再次获取值 (工作线程执行后): 主线程存放的数据
主线程 [main] 结束。
```

可以看到，尽管主线程和工作线程都访问了同一个 `THREAD_PRIVATE_DATA` 实例，但它们各自通过 `get()` 和 `set()` 操作的是自己独立的值副本，互不干扰。

**重要提示：关于 `remove()`**

上面的简单示例为了突出核心用法省略了 `remove()`，**但在实际开发中，尤其是在使用线程池（线程会被复用）时，** 务必在任务结束时调用 `threadLocalInstance.remove()` 来清除当前线程中存储的值。

这是为了防止内存泄露。因为线程会长时间存活，如果不移除值，旧的任务遗留的数据会一直占用内存。

**带 `remove()` 的正确简单用法示例 (在线程任务代码块中)：**

```java
// ... (ThreadLocal 实例创建部分同上)

// 在线程任务内部执行时
new Thread(() -> {
    // ...
    try {
        // 在这里使用 ThreadLocal 的 set() 和 get()

        // 示例：设置值
        THREAD_PRIVATE_DATA.set("这是线程的临时数据");
        System.out.println("线程中获取到的数据: " + THREAD_PRIVATE_DATA.get());

        // ... 执行任务逻辑 ...

    } finally {
        // !!! 关键步骤：在 finally 块中调用 remove() 确保清理 !!!
        THREAD_PRIVATE_DATA.remove();
        System.out.println("线程 [" + Thread.currentThread().getName() + "] 的 ThreadLocal 值已移除.");
    }
    // ...
}).start();

// ... (main 方法其余部分)
```

总之，`ThreadLocal` 的简单使用核心在于 `set()` 和 `get()` 来实现线程隔离，而正确、安全的简单使用则必须加上 `remove()` 来进行清理。