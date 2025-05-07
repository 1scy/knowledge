---
title: Nacos容器部署
category: docker
tag: docker
---


## 单机版部署
nacos 默认使用自带的 derby 数据库（类似于 sqlite 的文件型数据库）， 在开发环境部署单机版 nacos ，可以直接使用。

```sh
#!/bin/bash

# 定义版本和镜像
VERSION="1.0.0"
IMAGE="nacos/nacos-server:v2.3.1"

# 定义容器名称
CONTAINER_NAME="nacos"

# 定义映射端口
WEB_PORT="8848:8848"
GRPC_PORT="9848:9848"

# 定义环境变量
MODE="MODE=standalone"

# 定义卷挂载
LOGS_MOUNT="$PWD/logs:/home/nacos/logs"

# 启动容器
docker run -d \
  --name $CONTAINER_NAME \
  --restart always \
  -p $WEB_PORT \
  -p $GRPC_PORT \
  -e $MODE \
  -v $LOGS_MOUNT \
  $IMAGE
```



首先需要在 mysql 中随便创建一个数据库（比如数据库名叫做 nacos）， 然后运行 nacos 提供的 sql 脚本初始化数据库

```sh
#!/bin/bash

# 定义版本和镜像
VERSION="1.0.0"
IMAGE="nacos/nacos-server:v2.3.1"

# 定义容器名称
CONTAINER_NAME="nacos"

# 定义映射端口
WEB_PORT="8848:8848"
GRPC_PORT="9848:9848"

# 定义环境变量
ENV_VARS=(
    "MODE=standalone"
    "SPRING_DATASOURCE_PLATFORM=mysql"
    "MYSQL_SERVICE_HOST=192.168.0.213"
    "MYSQL_SERVICE_PORT=13306"
    "MYSQL_SERVICE_DB_NAME=nacos"
    "MYSQL_SERVICE_USER=root"
    "MYSQL_SERVICE_PASSWORD=EverFavour@2024"
    "MYSQL_DB_PARAM=characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true&serverTimezone=Asia/Shanghai"
)

# 定义卷挂载
LOGS_MOUNT="$PWD/logs:/home/nacos/logs"

# 启动容器
docker run -d \
  --name $CONTAINER_NAME \
  --restart always \
  -p $WEB_PORT \
  -p $GRPC_PORT \
  ${ENV_VARS[@]/#/ -e} \
  -v $LOGS_MOUNT \
  $IMAGE
```