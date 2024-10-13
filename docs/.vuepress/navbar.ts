import { navbar } from "vuepress-theme-hope";

export default navbar([
  { text: "面试指南", icon: "logos:java", link: "/home.md" },
  { text: "开源项目", icon: "logos:github-icon", link: "/open-source-project/" },
  { text: "前端技术碎片", icon: "logos:bigpanda", link: "/front-enact/" },
  { text: "后端技术碎片", icon: "logos:sherlock-icon", link: "/back-end-enact/" },
  {
    text: "入职必知必会",
    icon: "logos:feathersjs",
    link: "/abilitys/",
  },
  {
    text: "知识星球",
    icon: "logos:egghead",
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
    icon: "logos:sitepoint",
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
