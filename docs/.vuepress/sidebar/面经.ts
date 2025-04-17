import { arraySidebar } from "vuepress-theme-hope";

export const 面经 = arraySidebar([
    {
      text: "必看",
      icon: "star",
      collapsible: true,
      prefix: "base/",
      children: [
        {
          text: "Java基础面试题",
          icon: "about",
          link: "/面经/Java基础面试题.md",
        },
      ],
    },
]);
