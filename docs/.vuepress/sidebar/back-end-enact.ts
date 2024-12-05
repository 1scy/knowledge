import { arraySidebar } from "vuepress-theme-hope";

export const backEndEnact = arraySidebar([

  {
    text: "SpringCloud",
    icon: "star",
    collapsible: true,
    prefix: "SpringCloud/",
    children: [
    ],
  },

  {
    text: "运维",
    icon: "star",
    collapsible: true,
    prefix: "operations/",
    children: [
      {
        text: "Arthas（阿尔萨斯）",
        link: "arthas",
        icon: "logos:partytown-icon",
      },
    ],
  },
]);
