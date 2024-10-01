import { sidebar } from "vuepress-theme-hope";

import { aboutTheAuthor } from "./about-the-author.js";
import { enacts } from "./enacts.js";
import { abilitys } from "./abilitys.js";
import { openSourceProject } from "./open-source-project.js";

export default sidebar({
  // 应该把更精确的路径放置在前边
  "/open-source-project/": openSourceProject,
  "/enact/": enacts,
  "/about-the-author/": aboutTheAuthor,
  "/ability/": abilitys,
  "/zhuanlan/": [

  ],
  // 必须放在最后面
  "/": [
    {
      text: "必看",
      icon: "star",
      collapsible: true,
      prefix: "javaguide/",
      children: [],
    },
  ],
});
