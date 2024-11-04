import { arraySidebar } from "vuepress-theme-hope";

export const interview = arraySidebar([
    {
      text: "必看",
      icon: "star",
      collapsible: true,
      prefix: "base/",
      children: [
        {
          text: "Java基础面试题",
          icon: "about",
          link: "/interview/basic.md",
        },
      ],
    },
]);
