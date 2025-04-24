import { sidebar } from "vuepress-theme-hope";

import { 面经 } from "./面经.js";
import { 关于作者 } from "./关于作者.js";
import { 前端技术碎片 } from "./前端技术碎片.js";
import { 后端技术碎片 } from "./后端技术碎片.js";
import { 必知必会 } from "./必知必会.js";
import { 好文分享 } from "./好文分享.js";
import { 开源项目 } from "./开源项目.js";
import {代理} from "./代理.js";
import {问题合集} from "./问题合集.js";
import {运维问题} from "./运维问题.js";
import {框架使用} from "./框架使用.js";
import {笔记碎片} from "./笔记碎片.js";
import {快速工具} from "./快速工具.js";
import {娱乐生活} from "./娱乐生活.js";

export default sidebar({
  // 应该把更精确的路径放置在前边
  "/面经/": 面经,
  "/开源项目/": 开源项目,
  "/前端技术碎片/": 前端技术碎片,
  "/后端技术碎片/": 后端技术碎片,
  "/关于作者/": 关于作者,
  "/必知必会/": 必知必会,
  "/必知必会/好文分享/": 好文分享,
  "/必知必会/代理/": 代理,
  "/必知必会/框架使用/": 框架使用,
  "/问题合集/": 问题合集,
  "/问题合集/运维问题": 运维问题,
  "/笔记碎片/": 笔记碎片,
  "/快速工具/": 快速工具,
  "/娱乐生活/": 娱乐生活,
  "/zhuanlan/": [

  ],
  // 必须放在最后面
  // "/": [
  //   {
  //     text: "必看",
  //     icon: "star",
  //     collapsible: true,
  //     prefix: "javaguide/",
  //     children: [],
  //   },
  // ],
});
