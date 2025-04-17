import {arraySidebar} from "vuepress-theme-hope";

export const 后端技术碎片 = arraySidebar([

    {
        text: "SpringCloud",
        icon: "star",
        collapsible: true,
        prefix: "SpringCloud/",
        children: [],
    },

    {
        text: "运维实践手册",
        icon: "star",
        collapsible: true,
        prefix: "运维实践手册/",
        children: [
            {
                text: "Arthas（阿尔萨斯）",
                link: "arthas",
                icon: "mdi:number-1-circle-outline",
            },
            {
                text: "Docker镜像提取与加载",
                link: "Docker镜像提取与加载",
                icon: "mdi:number-2-circle-outline",
            },
            {
                text: "kubectl常用命令",
                link: "kubectl常用命令",
                icon: "mdi:number-3-circle-outline",
            },
        ],
    },
    {
        text: "容器部署",
        icon: "star",
        collapsible: true,
        prefix: "容器部署/",
        children: [
            {
                text: "JDK包容器部署",
                link: "JDK包容器部署",
                icon: "mdi:number-1-circle-outline",
            },

            {
                text: "RocketMQ容器部署",
                link: "RocketMQ容器部署",
                icon: "mdi:number-2-circle-outline",
            },
            {
                text: "redis容器部署",
                link: "redis容器部署",
                icon: "mdi:number-3-circle-outline",
            },

        ],
    },

    {
        text: "配置文件",
        icon: "star",
        collapsible: true,
        prefix: "配置文件/",
        children: [
            {
                text: "nacos配置文件",
                link: "nacos配置文件",
                icon: "mdi:number-1-circle-outline",
            },
        ],
    },
]);
