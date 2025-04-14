import {arraySidebar} from "vuepress-theme-hope";

export const abilitys = arraySidebar([

  {
    text: "容器部署",
    icon: "star",
    collapsible: true,
    prefix: "container/",
    children: [
      {
        text: "docker容器部署",
        link: "docker",
        icon: "mdi:number-0-circle-outline",
      },
      {
        text: "Nginx容器部署",
        link: "docker-nginx",
        icon: "mdi:number-1-circle-outline",
      },
      {
        text: "Redis容器部署",
        link: "docker-redis",
        icon: "mdi:number-2-circle-outline",
      },
      {
        text: "JDK包",
        link: "JDK包",
        icon: "mdi:number-3-circle-outline",
      },
      {
        text: "Docker镜像提取与加载",
        link: "Docker镜像提取与加载",
        icon: "mdi:number-4-circle-outline",
      },
      {
        text: "部署RocketMQ",
        link: "部署RocketMQ",
        icon: "mdi:number-5-circle-outline",
      },
      {
        text: "部署redis",
        link: "部署redis",
        icon: "mdi:number-5-circle-outline",
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
        text: "nacos文件",
        link: "nacos",
        icon: "mdi:number-0-circle-outline",
      },
    ],
  },
]);
