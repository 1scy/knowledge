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
    {
        text: "Mybatis",
        icon: "experience",
        collapsible: true,
        prefix: "/问题合集/后端问题/Mybatis/",
        children: [
            {
                text: "MyBatisPlus 查询总数与实际MySQL总数不一致",
                icon: "about",
                link: "MyBatisPlus 查询总数与实际MySQL总数不一致.md",
            },
            {
                text: "MybatisPlus分页总数total为0",
                icon: "about",
                link: "MybatisPlus分页总数total为0.md",
            },
        ],
    },
]);
