import { getDirname, path } from "vuepress/utils";
import { hopeTheme } from "vuepress-theme-hope";

import navbar from "./navbar.js";
import sidebar from "./sidebar/index.js";

const __dirname = getDirname(import.meta.url);

export default hopeTheme({
  hostname: "https://www.chengxuyuandusu.icu/",
  logo: "/logo.png",
  favicon: "/favicon.ico",
  iconPrefix: "",
  iconAssets: "iconify",

  // iconAssets: "//at.alicdn.com/t/c/font_2922463_o9q9dxmps9.css",

  author: {
    name: "DuSu",
    url: "https://www.chengxuyuandusu.icu/",
  },

  // repo: "https://github.com/Snailclimb/DuSuGuide",
  docsDir: "docs",
  // 纯净模式：https://theme-hope.vuejs.press/zh/guide/interface/pure.html
  pure: true,
  breadcrumb: false,
  navbar,
  sidebar,
  footer:
    '<a href="https://beian.miit.gov.cn/" target="_blank">鄂ICP备2020015769号-1</a>',
  displayFooter: true,

  pageInfo: ["Author", "Category", "Tag", "Original", "Word", "ReadingTime"],

  blog: {
    intro: "/about-the-author/",
    sidebarDisplay: "mobile",
    medias: {
      Zhihu: "https://www.zhihu.com/people/javaguide",
      Github: "https://github.com/Snailclimb",
      Gitee: "https://gitee.com/SnailClimb",
    },
  },

  plugins: {
    components: {
      rootComponents: {
        // https://plugin-components.vuejs.press/zh/guide/utilities/notice.html#%E7%94%A8%E6%B3%95
        // notice: [
        //   {
        //     path: "/",
        //     title: "PDF面试资料（2024版）",
        //     showOnce: true,
        //     content:
        //       "2024最新版原创PDF面试资料来啦！涵盖 Java 核心、数据库、缓存、分布式、设计模式、智力题等内容，非常全面！",
        //     actions: [
        //       {
        //         text: "点击领取",
        //         link: "https://oss.javaguide.cn/backend-notekbook/official-account-traffic-backend-notebook-with-data-screenshot.png",
        //         type: "primary",
        //       },
        //     ],
        //   },
        // ],
      },
    },
    copyCode: {}, // 开启代码复制
    blog: true,

    copyright: {
      author: "DuSuGuide(chengxuyuandusu.icu)",
      license: "MIT",
      triggerLength: 100,
      maxLength: 700,
      canonical: "https://www.chengxuyuandusu.icu/",
      global: true,
    },

    feed: {
      atom: true,
      json: true,
      rss: true,
    },

    mdEnhance: {
      align: true,
      codetabs: true,
      figure: true,
      gfm: true,
      hint: true,
      include: {
        resolvePath: (file, cwd) => {
          if (file.startsWith("@"))
            return path.resolve(
              __dirname,
              "../snippets",
              file.replace("@", "./"),
            );

          return path.resolve(cwd, file);
        },
      },
      tasklist: true,
    },

    search: {
      isSearchable: (page) => page.path !== "/",
      maxSuggestions: 10,
    },
  },
});
