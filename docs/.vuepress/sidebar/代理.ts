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
                link: "/必知必会/代理/Git/Git.md",
            },
            {
                text: "Sourcetree",
                icon: "about",
                link: "/必知必会/代理/Git/Sourcetree.md",
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
                link: "/必知必会/代理/工具/Steamcommunity.md",
            },
        ],
    },
    {
        text: "VPN",
        icon: "chat",
        collapsible: true,
        children: [
            {
                text: "ikuuu",
                icon: "about",
                link: "/必知必会/代理/VPN/ikuuu.md",
            },
        ],
    },
]);
