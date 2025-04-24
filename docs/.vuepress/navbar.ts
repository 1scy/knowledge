import { navbar } from "vuepress-theme-hope";
import {必知必会} from "./sidebar/必知必会";

export default navbar([
  { text: "博客", icon: "logos:airflow-icon", link: "/blog.md" },
  { text: "面试指南", icon: "logos:java", link: "/面经/" },
  { text: "开源项目", icon: "logos:github-icon", link: "/开源项目/" },
  { text: "前端技术碎片", icon: "logos:bigpanda", link: "/前端技术碎片/" },
  { text: "后端技术碎片", icon: "logos:sherlock-icon", link: "/后端技术碎片/" },
  {
    text: "入职必知必会",
    icon: "logos:feathersjs",
    children: [
      {
        text: "框架使用",
        icon: "logos:arangodb-icon",
        link: "/必知必会/框架使用/",
      },
      {
        text: "代理",
        icon: "logos:internetexplorer",
        link: "/必知必会/代理/",
      },
      {
        text: "好文分享",
        icon: "logos:fresh",
        link: "/必知必会/好文分享/",
      },
    ],
  },
  {
    text: "问题合集",
    icon: "logos:browserslist",
    children: [
      {
        text: "后端问题",
        icon: "logos:intellij-idea",
        link: "/问题合集/后端问题/",
      },
      {
        text: "前端问题",
        icon: "logos:appcode",
        link: "/问题合集/前端问题/",
      },
      {
        text: "运维问题",
        icon: "logos:solidjs-icon",
        link: "/问题合集/运维问题/",
      },
      {
        text: "非开发问题",
        icon: "logos:broccoli",
        link: "/问题合集/非开发问题/",
      },
    ],
  },
  { text: "笔记碎片", icon: "logos:blueprint", link: "/笔记碎片/" },
  { text: "快速工具", icon: "logos:google-play-console-icon", link: "/快速工具/" },
  {
    text: "知识星球",
    icon: "logos:wmr",
    children: [
      {
        text: "星球介绍",
        icon: "about",
        link: "/星球介绍/readme.md",
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
      { text: "关于作者", icon: "zuozhe", link: "/关于作者/" },
      {
        text: "更新历史",
        icon: "history",
        link: "/timeline/",
      },
    ],
  },
  { text: "娱乐生活", icon: "logos:codeigniter-icon", link: "/娱乐生活/" },
]);
