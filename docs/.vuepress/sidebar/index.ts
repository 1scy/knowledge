import { sidebar } from "vuepress-theme-hope";

import { 面经 } from "./面经.js";
import { 关于作者 } from "./关于作者.js";
import { 前端技术碎片 } from "./前端技术碎片.js";
import { 后端技术碎片 } from "./后端技术碎片.js";
import { 必知必会 } from "./必知必会.js";
import { 好文分享 } from "./好文分享.js";
import { 开源项目 } from "./开源项目.js";

export default sidebar({
  // 应该把更精确的路径放置在前边
  "/面经/": 面经,
  "/开源项目/": 开源项目,
  "/前端技术碎片/": 前端技术碎片,
  "/后端技术碎片/": 后端技术碎片,
  "/关于作者/": 关于作者,
  "/必知必会/": 必知必会,
  "/好文分享/": 好文分享,
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
