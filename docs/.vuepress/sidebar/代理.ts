import { arraySidebar } from "vuepress-theme-hope";

export const 代理 = arraySidebar([
    {
        text: "Git",
        icon: "experience",
        collapsible: true,
        children: [
            {
                text: "Git",
                icon: "about",
                link: "/代理/Git/Git.md",
            },
        ],
    },
    {
        text: "工具",
        icon: "chat",
        collapsible: true,
        children: [
            {
                text: "工具",
                icon: "about",
                link: "/代理/工具/Steamcommunity.md",
            },
        ],
    },
]);
