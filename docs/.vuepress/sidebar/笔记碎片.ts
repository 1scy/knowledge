import {arraySidebar} from "vuepress-theme-hope";

export const 笔记碎片 = arraySidebar([
    {
        text: "ThreadPoolTaskExecutor",
        icon: "experience",
        collapsible: true,
        prefix: "/笔记碎片/并发/",
        children: [
            {
                text: "ThreadPoolTaskExecutor使用",
                icon: "about",
                link: "ThreadPoolTaskExecutor/ThreadPoolTaskExecutor使用.md",
            },
        ],
    },
    {
        text: "@Asycn",
        icon: "experience",
        collapsible: true,
        prefix: "/笔记碎片/并发/",
        children: [
            {
                text: "@Asycn失效场景",
                icon: "about",
                link: "@Asycn/@Asycn失效场景.md",
            },
        ],
    },
    {
        text: "CompletableFuture",
        icon: "experience",
        collapsible: true,
        prefix: "/笔记碎片/并发/",
        children: [
            {
                text: "CompletableFuture创建异步任务",
                icon: "about",
                link: "CompletableFuture/CompletableFuture创建异步任务.md",
            },
            {
                text: "CompletableFuture异步回调处理",
                icon: "about",
                link: "CompletableFuture/CompletableFuture异步回调处理.md",
            },
            {
                text: "CompletableFuture多任务组合处理",
                icon: "about",
                link: "CompletableFuture/CompletableFuture多任务组合处理.md",
            },
        ],
    },
]);
