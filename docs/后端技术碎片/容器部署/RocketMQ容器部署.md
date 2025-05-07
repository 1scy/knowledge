---
title: 部署RocketMQ
category: docker
tag: docker
---


## 部署RabbitMQ容器

以下脚本用于启动并配置RabbitMQ容器，包含以下关键配置：
- 容器名称：rabbitmq
- 自动重启策略：always
- 端口映射：宿主机5672和15672分别映射到容器的对应端口
- 默认用户与密码：admin/admin
- 使用镜像版本：rabbitmq:3.13.2


```sh
#!/bin/bash

# 启动 RabbitMQ 容器
docker run -d \
  --name rabbitmq \
  --restart always \
  -p 5672:5672 \
  -p 15672:15672 \
  -e RABBITMQ_DEFAULT_USER=admin \
  -e RABBITMQ_DEFAULT_PASS=admin \
  rabbitmq:3.13.2
```

## 开启后台管理功能
```sh
rabbitmq-plugins enable rabbitmq_management
```

