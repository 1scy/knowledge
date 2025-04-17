import { arraySidebar } from "vuepress-theme-hope";

export const 关于作者 = arraySidebar([
  {
    text: "个人经历",
    icon: "experience",
    collapsible: false,
    children: [
      {
        text: "个人经历",
        icon: "about",
        link: "/关于作者/个人经历.md",
      },
    ],
  },
  {
    text: "杂谈",
    icon: "chat",
    collapsible: false,
    children: [
      {
        text: "杂谈",
        icon: "about",
        link: "/关于作者/杂谈.md",
      },
    ],
  },
]);
