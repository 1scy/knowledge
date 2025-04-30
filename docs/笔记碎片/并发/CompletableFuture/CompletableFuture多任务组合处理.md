# CompletableFuture多任务组合处理


`CompletableFuture` 除了处理单个异步任务外，其强大的能力在于可以方便地组合（Compose）和协调（Combine）多个异步任务。这使得处理复杂的异步流程变得更加容易和可读。

以下是 `CompletableFuture` 中用于多任务组合处理的几种主要方法及其详细说明和代码示例：

主要的多任务组合模式：

1.  **串行依赖 (Sequential Dependency):** 一个任务的结果作为下一个任务的输入。
2.  **并行独立后组合结果 (Parallel Independent & Combine):** 多个独立的任务并行执行，等它们都完成后，将它们的结果合并处理。
3.  **等待所有任务完成 (Wait for All):** 启动一组独立的任务，等待所有任务都完成后再继续，不关心单个结果的组合，只关心“全部完成”这个状态。
4.  **等待任一任务完成 (Wait for Any):** 启动一组独立的任务，只关心其中最快完成的那一个的结果。

下面我们详细介绍对应的方法：

### 1. 串行依赖: `thenCompose()`

当一个异步任务的结果需要作为启动**另一个**异步任务的输入时，使用 `thenCompose()`。它接收一个 `Function`，这个 `Function` 接收上一个 CompletableFuture 的结果，并返回一个新的 `CompletionStage` (通常是另一个 `CompletableFuture`)。`thenCompose()` 的作用是**展平 (flatten)** 结果，避免出现 `CompletableFuture<CompletableFuture<T>>` 这样的嵌套。

**方法签名:**
`<U> CompletableFuture<U> thenCompose(Function<? super T, ? extends CompletionStage<U>> fn)`
`<U> CompletableFuture<U> thenComposeAsync(Function<? super T, ? extends CompletionStage<U>> fn)`
`<U> CompletableFuture<U> thenComposeAsync(Function<? super T, ? extends CompletionStage<U>> fn, Executor executor)`

**场景:** 先根据用户 ID 异步获取用户信息，再根据用户信息中的某个字段（如订单 ID）异步获取订单详情。

**代码示例:**

```java
import java.util.concurrent.*;
import java.util.function.Function;

public class ThenComposeExample {

    public static void main(String[] args) {
        System.out.println("主线程开始，线程: " + Thread.currentThread().getName());

        // 模拟异步获取用户ID
        CompletableFuture<String> userIdFuture = CompletableFuture.supplyAsync(() -> {
            System.out.println("  > 任务1: 异步获取用户ID，线程: " + Thread.currentThread().getName());
            try {
                TimeUnit.SECONDS.sleep(1);
            } catch (InterruptedException e) {
                throw new IllegalStateException(e);
            }
            System.out.println("  > 任务1: 用户ID获取完毕.");
            return "user123"; // 假设获取到的用户ID
        });

        // 使用 thenCompose: 当 userIdFuture 完成后，使用其结果启动另一个异步任务
        CompletableFuture<String> orderDetailsFuture = userIdFuture.thenCompose(userId -> {
            System.out.println("  > 任务2: 依赖用户ID(" + userId + ")，开始异步获取订单详情，线程: " + Thread.currentThread().getName());
             // 模拟根据用户ID获取订单详情的异步任务
            return CompletableFuture.supplyAsync(() -> {
                try {
                    TimeUnit.SECONDS.sleep(2);
                } catch (InterruptedException e) {
                    throw new IllegalStateException(e);
                }
                System.out.println("  > 任务2: 订单详情获取完毕.");
                return "Order details for " + userId + ": ItemA, ItemB"; // 假设获取到的订单详情
            });
        });

        // 获取最终结果并打印 (会阻塞主线程等待)
        System.out.println("主线程等待订单详情...");
        try {
            String orderDetails = orderDetailsFuture.join(); // 或 get()
            System.out.println("最终获取到的订单详情: " + orderDetails);
        } catch (CompletionException e) { // join() 抛出 CompletionException 包装底层异常
            System.err.println("获取订单详情出错: " + e.getCause().getMessage());
        }


        System.out.println("主线程结束。");

        // 注意：supplyAsync 默认使用 ForkJoinPool，无需手动关闭 ExecutorService
    }
}
```

**说明:** `thenCompose` 中的 Lambda 表达式接收 `userId`，并返回一个新的 `CompletableFuture<String>` (模拟获取订单详情)。`thenCompose` 会等待这个新的 `CompletableFuture` 完成，并将其结果作为整个 `orderDetailsFuture` 的结果。

### 2. 并行独立后组合结果: `thenCombine()`

当有两个**相互独立**的异步任务并行执行，并且需要在它们**都完成后**将它们各自的结果组合起来进行进一步处理时，使用 `thenCombine()`。

**方法签名:**
`<U, V> CompletableFuture<V> thenCombine(CompletionStage<? extends U> other, BiFunction<? super T, ? super U, ? extends V> fn)`
`<U, V> CompletableFuture<V> thenCombineAsync(CompletionStage<? extends U> other, BiFunction<? super T, ? super U, ? extends V> fn)`
`<U, V> CompletableFuture<V> thenCombineAsync(CompletionStage<? extends U> other, BiFunction<? super T, ? super U, ? extends V> fn, Executor executor)`

**场景:** 并行获取商品的美元价格和当前的美元兑人民币汇率，然后计算出人民币价格。

**代码示例:**

```java
import java.util.concurrent.*;
import java.util.function.BiFunction;

public class ThenCombineExample {

    public static void main(String[] args) {
        System.out.println("主线程开始，线程: " + Thread.currentThread().getName());

        // 模拟异步获取美元价格
        CompletableFuture<Double> usdPriceFuture = CompletableFuture.supplyAsync(() -> {
            System.out.println("  > 任务1: 异步获取美元价格，线程: " + Thread.currentThread().getName());
            try {
                TimeUnit.SECONDS.sleep(2); // 模拟耗时 2 秒
            } catch (InterruptedException e) {
                throw new IllegalStateException(e);
            }
            System.out.println("  > 任务1: 美元价格获取完毕.");
            return 100.0; // 假设美元价格是 100
        });

        // 模拟异步获取汇率 (独立于获取价格)
        CompletableFuture<Double> exchangeRateFuture = CompletableFuture.supplyAsync(() -> {
            System.out.println("  > 任务2: 异步获取汇率，线程: " + Thread.currentThread().getName());
            try {
                TimeUnit.SECONDS.sleep(3); // 模拟耗时 3 秒
            } catch (InterruptedException e) {
                throw new IllegalStateException(e);
            }
             System.out.println("  > 任务2: 汇率获取完毕.");
            return 7.1; // 假设汇率是 7.1
        });

        // 使用 thenCombine: 当 usdPriceFuture 和 exchangeRateFuture 都完成后，组合它们的结果
        // thenCombine 接收另一个 CompletionStage (exchangeRateFuture) 和一个 BiFunction
        // BiFunction 接收两个参数：第一个 CompletableFuture 的结果 (price) 和第二个 CompletableFuture 的结果 (rate)
        CompletableFuture<Double> rmbPriceFuture = usdPriceFuture.thenCombine(exchangeRateFuture, (price, rate) -> {
            System.out.println("  > 组合任务: 两个异步任务都已完成，开始计算人民币价格，线程: " + Thread.currentThread().getName());
            // 这里执行组合逻辑
            return price * rate;
        });

        // 获取最终结果并打印 (会阻塞主线程等待)
        System.out.println("主线程等待人民币价格...");
        try {
            Double rmbPrice = rmbPriceFuture.join(); // 或 get()
            System.out.println("计算出人民币价格: " + rmbPrice); // 100 * 7.1 = 710.0
        } catch (CompletionException e) {
             System.err.println("计算价格出错: " + e.getCause().getMessage());
        }


        System.out.println("主线程结束。");
    }
}
```

**说明:** `usdPriceFuture` 和 `exchangeRateFuture` 会并行执行。`thenCombine` 注册的回调函数 (`(price, rate) -> { ... }`) 会等待两者都完成后才执行，并接收两者的结果作为输入。最终的 `rmbPriceFuture` 会在组合计算完成后得到结果。

### 3. 等待所有任务完成: `allOf()`

当你有一组独立的 `CompletableFuture`，并且需要等待它们**全部**完成后再执行下一步操作时，使用 `allOf()`。它返回一个 `CompletableFuture<Void>`，这个 Future 在所有输入的 Future 都完成后完成。如果任一输入的 Future 异常完成，那么 `allOf` 返回的 Future 也会异常完成。

`allOf` 本身不返回所有 Future 的结果，因为它们的类型可能不同。你需要在 `allOf` 完成后，分别调用每个原始 Future 的 `join()` 或 `get()` 方法来获取它们的结果（此时调用 `join()` 或 `get()` 是非阻塞的，因为 Future 已经完成了）。

**方法签名:**
`static CompletableFuture<Void> allOf(CompletableFuture<?>... cfs)`

**场景:** 启动多个数据导入任务，等待所有任务都完成后，发送一个完成通知。

**代码示例:**

```java
import java.util.concurrent.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.List;

public class AllOfExample {

    public static void main(String[] args) {
        System.out.println("主线程开始，线程: " + Thread.currentThread().getName());

        // 创建多个独立的异步任务
        CompletableFuture<String> task1 = CompletableFuture.supplyAsync(() -> {
            System.out.println("  > 任务1 开始，线程: " + Thread.currentThread().getName());
            try {
                TimeUnit.SECONDS.sleep(2);
            } catch (InterruptedException e) {
                 Thread.currentThread().interrupt();
            }
            System.out.println("  > 任务1 完成.");
            return "Result of Task 1";
        });

        CompletableFuture<String> task2 = CompletableFuture.supplyAsync(() -> {
            System.out.println("  > 任务2 开始，线程: " + Thread.currentThread().getName());
            try {
                TimeUnit.SECONDS.sleep(3);
            } catch (InterruptedException e) {
                 Thread.currentThread().interrupt();
            }
            System.out.println("  > 任务2 完成.");
            return "Result of Task 2";
        });

        CompletableFuture<String> task3 = CompletableFuture.supplyAsync(() -> {
            System.out.println("  > 任务3 开始，线程: " + Thread.currentThread().getName());
            try {
                TimeUnit.SECONDS.sleep(1);
            } catch (InterruptedException e) {
                 Thread.currentThread().interrupt();
            }
             System.out.println("  > 任务3 完成.");
             return "Result of Task 3";
            // 可以取消注释下一行模拟异常
            // throw new RuntimeException("任务3 出错啦!");
        });

        // 使用 allOf 等待所有任务完成
        // allOf 接收可变参数，或 CompletableFuture 数组
        CompletableFuture<Void> allTasks = CompletableFuture.allOf(task1, task2, task3);

        // 当所有任务都完成后执行一个动作 (thenRun 或 thenAccept)
        CompletableFuture<Void> finalAction = allTasks.thenRun(() -> {
            System.out.println("\n  > 所有任务都已完成！线程: " + Thread.currentThread().getName());
            // 在这里可以处理所有任务的结果，因为此时调用 join/get 是非阻塞的
            try {
                 String result1 = task1.join(); // 此时 join() 会立即返回结果
                 String result2 = task2.join();
                 String result3 = task3.join();
                 System.out.println("  > 任务结果集: [" + result1 + ", " + result2 + ", " + result3 + "]");
             } catch (CompletionException e) {
                  System.err.println("  > 捕获到某个任务的异常: " + e.getCause().getMessage());
             }
        });

        // 等待 allOf 完成后的最终动作 (会阻塞主线程)
        System.out.println("主线程等待所有任务完成...");
        finalAction.join(); // 等待所有任务和后续动作完成

        System.out.println("主线程结束。");
    }
}
```

**说明:** `task1`, `task2`, `task3` 会并行开始。`allOf(task1, task2, task3)` 返回的 `allTasks` 会等待它们全部进入完成状态（正常完成或异常完成）。`thenRun` (或 `thenAccept`) 在 `allTasks` 完成后执行。在 `thenRun` 的 Lambda 中，因为知道所有前置 Future 都已完成，调用 `join()` 或 `get()` 是安全的且不会阻塞。如果其中任何一个任务异常，`allTasks` 会异常完成，`thenRun` 可能不会执行，而 `finalAction.join()` 会抛出 `CompletionException`。你可以通过在 `allOf` 之后链式调用 `exceptionally` 来统一处理所有任务的异常。

### 4. 等待任一任务完成: `anyOf()`

当你有一组独立的 `CompletableFuture`，并且只需要等待**其中任何一个**最快完成的任务的结果时，使用 `anyOf()`。它返回一个 `CompletableFuture<Object>`，当输入的任何一个 Future 完成时，这个 Future 就完成，其结果是最先完成的那个 Future 的结果。如果最先完成的 Future 是异常完成，`anyOf` 返回的 Future 也会异常完成。

`anyOf` 返回结果是 `Object` 类型，使用时需要进行类型转换。

**方法签名:**
`static CompletableFuture<Object> anyOf(CompletableFuture<?>... cfs)`

**场景:** 从多个数据源查询相同的信息，只需要最快返回的结果。

**代码示例:**

```java
import java.util.concurrent.*;

public class AnyOfExample {

    public static void main(String[] args) {
         System.out.println("主线程开始，线程: " + Thread.currentThread().getName());

        // 创建多个不同耗时的异步任务
        CompletableFuture<String> taskA = CompletableFuture.supplyAsync(() -> {
            System.out.println("  > 任务A 开始，需要 3 秒，线程: " + Thread.currentThread().getName());
            try {
                TimeUnit.SECONDS.sleep(3);
            } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
            System.out.println("  > 任务A 完成.");
            return "Result A";
        });

        CompletableFuture<String> taskB = CompletableFuture.supplyAsync(() -> {
            System.out.println("  > 任务B 开始，需要 1 秒，线程: " + Thread.currentThread().getName());
            try {
                TimeUnit.SECONDS.sleep(1);
            } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
             System.out.println("  > 任务B 完成.");
            return "Result B (Fastest!)";
        });

        CompletableFuture<String> taskC = CompletableFuture.supplyAsync(() -> {
            System.out.println("  > 任务C 开始，需要 2 秒，线程: " + Thread.currentThread().getName());
            try {
                TimeUnit.SECONDS.sleep(2);
            } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
             System.out.println("  > 任务C 完成.");
            return "Result C";
        });

        // 使用 anyOf 等待任一任务完成
        CompletableFuture<Object> anyTask = CompletableFuture.anyOf(taskA, taskB, taskC);

        // 当任一任务完成后执行一个回调，处理最快完成的结果
        CompletableFuture<Void> processFastest = anyTask.thenAccept(firstResult -> {
             System.out.println("\n  > 某个任务已完成！获取到的最快结果是: " + firstResult + ", 线程: " + Thread.currentThread().getName());
             // 注意：firstResult 是 Object 类型，可能需要根据预期类型进行判断和转换
             if (firstResult instanceof String) {
                 String result = (String) firstResult;
                 System.out.println("  > 转换后的结果 (String): " + result);
             }
        }).exceptionally(ex -> { // 如果最快完成的任务是异常完成，在这里处理
             System.err.println("  > 最快完成的任务异常了: " + ex.getCause().getMessage() + ", 线程: " + Thread.currentThread().getName());
             return null; // 对于 thenAccept().exceptionally() 链，返回 null
        });


        // 等待 anyOf 完成后的后续动作 (会阻塞主线程)
        System.out.println("主线程等待任一任务完成...");
        processFastest.join(); // 等待任一任务和后续处理完成

        System.out.println("主线程结束。");
    }
}
```

**说明:** `taskA`, `taskB`, `taskC` 会并行开始。因为 `taskB` 设置的延迟最短 (1秒)，它会最先完成。当 `taskB` 完成后，`anyOf(taskA, taskB, taskC)` 返回的 `anyTask` 就会立即完成，其结果就是 `taskB` 的结果 `"Result B (Fastest!)"`。链式调用的 `thenAccept` 会接收到这个结果并执行。其他尚未完成的任务（`taskA`, `taskC`）会继续执行直到完成，但它们的结果不会影响 `anyTask` 的结果。

**总结:**

`CompletableFuture` 提供的 `thenCompose`、`thenCombine`、`allOf`、`anyOf` 等方法，以清晰的链式调用和函数式编程风格，极大地简化了 Java 中多任务异步处理的复杂性，提高了代码的可读性和可维护性，是进行复杂异步流程编排的强大工具。