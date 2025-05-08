import {arraySidebar} from "vuepress-theme-hope";

export const 笔记碎片 = arraySidebar([
    {
        text: "Java",
        icon: "experience",
        collapsible: true,
        prefix: "/笔记碎片/Java/",
        children: [
            {
                text: "ThreadPoolTaskExecutor",
                icon: "experience",
                collapsible: true,
                children: [
                    {
                        text: "ThreadPoolTaskExecutor使用",
                        icon: "about",
                        link: "并发/ThreadPoolTaskExecutor/ThreadPoolTaskExecutor使用.md",
                    },
                ],
            },
            {
                text: "@Async",
                icon: "experience",
                collapsible: true,
                children: [
                    {
                        text: "@Async失效场景",
                        icon: "about",
                        link: "并发/@Async/@Async失效场景.md",
                    },
                ],
            },
            {
                text: "CompletableFuture",
                icon: "experience",
                collapsible: true,
                children: [
                    {
                        text: "CompletableFuture创建异步任务",
                        icon: "about",
                        link: "并发/CompletableFuture/CompletableFuture创建异步任务.md",
                    },
                    {
                        text: "CompletableFuture异步回调处理",
                        icon: "about",
                        link: "并发/CompletableFuture/CompletableFuture异步回调处理.md",
                    },
                    {
                        text: "CompletableFuture多任务组合处理",
                        icon: "about",
                        link: "并发/CompletableFuture/CompletableFuture多任务组合处理.md",
                    },
                ],
            },
            {
                text: "ThreadLocal",
                icon: "experience",
                collapsible: true,
                children: [
                    {
                        text: "ThreadLocal的简单使用",
                        icon: "about",
                        link: "并发/ThreadLocal/ThreadLocal的简单使用.md",
                    },
                ],
            },
            {
                text: "事务",
                icon: "experience",
                collapsible: true,
                children: [
                    {
                        text: "TransactionSynchronizationManager使用",
                        icon: "about",
                        link: "并发/TransactionSynchronizationManager/TransactionSynchronizationManager使用.md",
                    },
                ],
            },
            {
                text: "二进制日志Binlog",
                icon: "experience",
                collapsible: true,
                children: [
                    {
                        text: "二进制日志Binlog",
                        icon: "about",
                        link: "数据库/二进制日志Binlog.md",
                    },
                ],
            },
        ],
    },

]);
