---
title: CompletableFuture异步回调处理
category: 并发
tag: 并发
---
 

如何使用 Java 中的 `CompletableFuture` 来实现“异步回调处理”。

`CompletableFuture` 是 Java 8 引入的强大工具，它代表一个异步计算的结果，并且允许你以非阻塞的方式在其完成时执行一系列操作（也就是我们这里所说的“回调”或者更准确地说是“continuation”，延续操作）。

`CompletableFuture` 并非直接使用像 JavaScript 那种将回调函数作为最后一个参数的模式，而是通过链式调用的方式来定义在异步任务完成后需要执行的后续操作。这些链式方法 (`thenApply`, `thenAccept`, `thenRun` 等) 就充当了回调的角色。
(`thenApply`, `thenAccept`, `thenRun` 等) 后面＋Async(`thenApplyAsync`, `thenAcceptAsync`, `thenRunAsync` 等)在子任务中可能是另起一个线程执行任务，并且可以自定义线程池，默认的使用ForkJoinPool.commonPool()线程池。

我们通过一个代码示例来详细说明：

```java
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;
import java.util.function.Supplier;
import java.util.function.Function;
import java.util.function.Consumer;

public class CompletableFutureCallbackExample {

    public static void main(String[] args) throws InterruptedException {
        System.out.println("主线程开始执行，线程: " + Thread.currentThread().getName());

        // --- 第一步：启动一个异步任务 ---
        // 使用 CompletableFuture.supplyAsync 启动一个异步任务，该任务会计算并“供应”一个结果。
        // supplyAsync 默认会在 ForkJoinPool.commonPool() 中执行。
        // 它接收一个 Supplier<T> 函数式接口，Supplier 的 get() 方法定义了异步执行的逻辑并返回结果 T。
        CompletableFuture<String> futureResult1 = CompletableFuture.supplyAsync(() -> {
            System.out.println(" -> 第一步异步任务开始，模拟耗时操作，线程: " + Thread.currentThread().getName());
            try {
                TimeUnit.SECONDS.sleep(2); // 模拟耗时 2 秒
            } catch (InterruptedException e) {
                // 处理中断异常
                throw new IllegalStateException(e);
            }
            System.out.println(" -> 第一步异步任务完成，返回结果");
            return "Hello, CompletableFuture!"; // 返回第一步的结果 (String)
        });

        // --- 第二步：在第一步任务完成后执行一个回调/继续任务 (转换结果) ---
        // 使用 thenApply 方法。它接收一个 Function<T, R> 函数式接口，
        // T 是上一步的结果类型 (这里是 String)，R 是当前步骤返回的结果类型 (这里是 Integer)。
        // thenApply 会在上一步 (futureResult1) 完成后被调用，并接收上一步的结果作为输入。
        // thenApply 本身也会返回一个新的 CompletableFuture，代表当前步骤的结果。
        CompletableFuture<Integer> futureResult2 = futureResult1.thenApply(result1 -> {
            System.out.println(" --> 第二步回调 (thenApply) 执行，接收到第一步结果: '" + result1 + "', 线程: " + Thread.currentThread().getName());
            try {
                TimeUnit.SECONDS.sleep(1); // 模拟耗时 1 秒
            } catch (InterruptedException e) {
                throw new IllegalStateException(e);
            }
             System.out.println(" --> 第二步回调完成，返回结果的长度");
            return result1.length(); // 转换结果：返回字符串的长度 (Integer)
        });

        // --- 第三步：在第二步任务完成后执行另一个回调/继续任务 (消费结果) ---
        // 使用 thenAccept 方法。它接收一个 Consumer<T> 函数式接口。
        // T 是上一步的结果类型 (这里是 Integer)。
        // thenAccept 会在上一步 (futureResult2) 完成后被调用，并接收上一步的结果作为输入。
        // Consumer 的 accept(T t) 方法用于“消费”结果，但它不返回任何值 (void)。
        // thenAccept 返回一个 CompletableFuture<Void>。
        CompletableFuture<Void> futureResult3 = futureResult2.thenAccept(result2 -> {
             System.out.println(" ---> 第三步回调 (thenAccept) 执行，接收到第二步结果: " + result2 + ", 线程: " + Thread.currentThread().getName());
             try {
                TimeUnit.SECONDS.sleep(1); // 模拟耗时 1 秒
             } catch (InterruptedException e) {
                throw new IllegalStateException(e);
             }
             System.out.println(" ---> 第三步回调完成");
             // 这里只是打印结果，没有返回值
        });

        // --- 第四步：处理链中可能发生的异常 ---
        // exceptionally 方法用于处理链中任何阶段抛出的异常。
        // 它接收一个 Function<Throwable, T> 函数式接口，Throwable 是发生的异常，T 是一个用于从异常中恢复的备用结果。
        // 如果前面的 CompletableFuture 正常完成，exceptionally 不会被调用。
        // 如果发生异常，exceptionally 会被调用，并接收异常对象，其返回值将成为当前 CompletableFuture 的结果。
        // 对于 CompletableFuture<Void>，通常返回 null 表示异常已被处理。
         CompletableFuture<Void> finalFuture = futureResult3.exceptionally(ex -> {
             System.err.println(" ----> 发生异常，进入 exceptionally 处理，异常信息: " + ex.getMessage() + ", 线程: " + Thread.currentThread().getName());
             // 可以在这里进行错误日志记录、资源清理等操作
             return null; // 由于 futureResult3 是 CompletableFuture<Void>，这里返回 null
         });


        System.out.println("主线程继续执行，不等异步链完成...");
        // 注意：这行代码会在上面的 CompletableFuture 任务开始后立即执行。
        // 这体现了主线程的“非阻塞”。

        // 在实际应用中，你可能不会在主线程中阻塞等待结果（除非是命令行工具或需要等待最终结果的地方）。
        // 但为了示例能完整运行并看到最终输出，我们在主线程中等待异步链完成。
        System.out.println("主线程等待异步链完成...");
        finalFuture.join(); // 阻塞当前线程，直到 finalFuture（包括其依赖的所有 CompletableFuture）完成。

        System.out.println("整个异步链执行完毕，主线程结束。");
    }
}
```

**代码详细说明：**

1.  **`CompletableFuture.supplyAsync(() -> { ... })`**:
    * 这是整个异步链的起点。`supplyAsync` 方法用来启动一个异步任务，这个任务会产生一个结果。
    * 它接收一个 `Supplier<T>` 函数式接口作为参数。`Supplier` 的 `get()` 方法包含了异步执行的逻辑，并需要返回一个类型为 `T` 的结果。
    * 在这个例子中，我们模拟了一个耗时 2 秒的任务，并返回字符串 `"Hello, CompletableFuture!"`。
    * `supplyAsync` 方法会立即返回一个 `CompletableFuture<String>` 对象，表示这个未来会完成并产生一个 `String` 结果的异步任务。主线程不会在这里等待。

2.  **`.thenApply(result1 -> { ... })`**:
    * 这是链接在 `futureResult1` 后面的第一个“回调”或者说“延续操作”。
    * `thenApply` 方法表示“当前面的 CompletableFuture 完成时，执行这个函数，并使用它的返回值作为下一个 CompletableFuture 的结果”。
    * 它接收一个 `Function<T, R>` 函数式接口。这里的 `T` 是上一个 CompletableFuture 的结果类型 (`String`)，`R` 是 `thenApply` 本次回调的返回值类型 (`Integer`)。
    * `result1 -> { ... }` 是一个 Lambda 表达式，实现了 `Function` 接口。它接收上一步的结果 `result1` (即 `"Hello, CompletableFuture!"`) 作为输入。
    * Lambda 内部模拟了另一个耗时 1 秒的操作，然后返回 `result1.length()`，即字符串的长度 (`23`)。
    * `thenApply` 方法返回一个新的 `CompletableFuture<Integer>`，代表这个转换操作的结果。

3.  **`.thenAccept(result2 -> { ... })`**:
    * 这是链接在 `futureResult2` 后面的第二个“回调”。
    * `thenAccept` 方法表示“当前面的 CompletableFuture 完成时，执行这个动作，但不需要返回任何结果”。
    * 它接收一个 `Consumer<T>` 函数式接口。这里的 `T` 是上一个 CompletableFuture 的结果类型 (`Integer`)。
    * `result2 -> { ... }` 是一个 Lambda 表达式，实现了 `Consumer` 接口。它接收上一步的结果 `result2` (即 `23`) 作为输入。
    * Lambda 内部模拟了另一个耗时 1 秒的操作，并打印接收到的结果。它没有返回值（`Consumer` 的 `accept` 方法是 `void`）。
    * `thenAccept` 方法返回一个 `CompletableFuture<Void>`，表示这个动作已完成，但没有产生具体结果。

4.  **`.exceptionally(ex -> { ... })`**:
    * 这是用于处理链中**任何先前阶段**（`futureResult1`, `futureResult2`, `futureResult3`）可能抛出的异常的回调。
    * 如果链中的任何一个 CompletableFuture 以异常结束，那么正常的回调链会中断，exceptionally 方法定义的回调会被执行。
    * 它接收一个 `Function<Throwable, T>` 函数式接口。`Throwable` 是捕获到的异常对象。`T` 是一个用于从异常中“恢复”的默认值或备用结果。
    * 在这个例子中，如果前面的任何一步出错，`ex -> { ... }` 这个 Lambda 会被调用，并接收异常对象 `ex`。我们打印了错误信息。
    * 由于 `futureResult3` 是 `CompletableFuture<Void>`，这里的 Lambda 需要返回一个 `Void` 类型兼容的值，通常是 `null`。这个 `null` 会成为 `finalFuture` 的结果，表示异常已经被处理，链条可以在不抛出异常的情况下结束（尽管结果是 `null`）。

5.  **`System.out.println("主线程继续执行，不等异步链完成...");`**:
    * 这行代码紧跟在所有的 `CompletableFuture` 链式调用之后。你会发现它会先于大多数（甚至全部）异步回调的打印信息出现，因为它是在主线程上立即执行的，没有被异步任务阻塞。

6.  **`finalFuture.join();`**:
    * 在 `main` 方法这样的上下文里，如果主线程比异步任务先结束，异步任务可能就不会有机会运行。
    * `join()` 方法是一个阻塞调用，它会暂停当前线程（这里是主线程），直到 `finalFuture` 代表的整个异步计算链完成（无论是正常完成还是异常完成）。
    * 这确保了我们在程序退出前能看到所有异步任务和回调的执行结果。

**运行流程概览：**

1.  主线程打印“主线程开始...”。
2.  主线程调用 `supplyAsync`，启动第一个异步任务（可能在另一个线程池线程上）。`supplyAsync` 立即返回。
3.  主线程调用 `thenApply`，注册一个在第一步完成后执行的回调。`thenApply` 立即返回。
4.  主线程调用 `thenAccept`，注册一个在第二步完成后执行的回调。`thenAccept` 立即返回。
5.  主线程调用 `exceptionally`，注册一个异常处理回调。`exceptionally` 立即返回。
6.  主线程打印“主线程继续执行...”。
7.  主线程打印“主线程等待异步链完成...”。
8.  主线程在 `finalFuture.join()` 处暂停。
9.  与此同时，在其他线程中：
    * 第一步异步任务执行（模拟耗时 2 秒），打印开始和完成信息，返回结果 `"Hello, CompletableFuture!"`。
    * 第一步完成后，第二步回调（thenApply）在另一个线程（通常）上执行，接收第一步结果，模拟耗时 1 秒，打印信息，返回结果长度 `23`。
    * 第二步完成后，第三步回调（thenAccept）在另一个线程（通常）上执行，接收第二步结果 `23`，模拟耗时 1 秒，打印信息。
    * 第三步完成后，整个链正常结束。`exceptionally` 因为没有异常而不会被触发。
10. `finalFuture` 完成，`join()` 方法解除阻塞。
11. 主线程打印“整个异步链执行完毕...”。

通过这种方式，`CompletableFuture` 使用链式调用的方法优雅地实现了在异步任务完成后执行后续逻辑（回调）的需求，避免了深层嵌套的回调代码（Callback Hell），并提供了强大的组合和错误处理能力。