import {arraySidebar} from "vuepress-theme-hope";

export const 后端问题 = arraySidebar([
    {
        text: "DB",
        icon: "experience",
        collapsible: true,
        prefix: "/问题合集/后端问题/DB/",
        children: [
            {
                text: "Dynamic Datasource 多数据源无法触发TransactionalEventListener",
                icon: "about",
                link: "Dynamic Datasource 多数据源无法触发TransactionalEventListener.md",
            },
        ],
    },
]);
