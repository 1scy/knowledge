import { arraySidebar } from "vuepress-theme-hope";

export const abilitys = arraySidebar([
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
]);
