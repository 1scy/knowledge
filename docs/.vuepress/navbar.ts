import { navbar } from "vuepress-theme-hope";

export default navbar([
  { text: "面试指南", icon: "java", link: "/home.md" },
  { text: "开源项目", icon: "github", link: "/open-source-project/" },
  { text: "技术碎片", icon: "logos:bigpanda", link: "/enact/" },
  {
    text: "技能掌握",
    icon: "logos:feathersjs",
    link: "/ability/",
  },
  {
    text: "知识星球",
    icon: "planet",
    children: [
      {
        text: "星球介绍",
        icon: "about",
        link: "/about-the-author/readme.md",
      },
      {
        text: "星球优质主题汇总",
        icon: "star",
        link: "https://www.yuque.com/yuqueyonghuvg7acx/vwqzcq",
      },
    ],
  },
  {
    text: "网站相关",
    icon: "about",
    children: [
      { text: "关于作者", icon: "zuozhe", link: "/about-the-author/" },
      {
        text: "更新历史",
        icon: "history",
        link: "/timeline/",
      },
    ],
  },
]);
