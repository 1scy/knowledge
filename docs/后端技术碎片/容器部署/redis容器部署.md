---
title: 部署redis
category: docker
tag: docker
---


### 参数说明：
1. `-d`：后台运行容器
2. `--name redis`：指定容器名称为"redis"
3. `-p 6379:6379`：将容器6379端口映射到宿主机同端口
4. `--restart unless-stopped`：设置除非手动停止否则自动重启策略
5. `-v $PWD/conf:/etc/conf`：挂载本地配置目录到容器配置路径
6. `-v $PWD/data:/data`：挂载本地数据目录到容器数据存储路径
7. `redis:6.2.5`：指定使用的Redis镜像版本
8. `redis-server /etc/conf/redis.conf`：指定使用挂载的配置文件启动服务

```sh
docker run \
-d \
--name redis \
-p 6379:6379 \
--restart unless-stopped \
-v $PWD/conf:/etc/conf \
-v $PWD/data:/data \
redis:6.2.5 \
redis-server /etc/conf/redis.conf \
```

### 配置文件说明：
- [配置文件参考文档](https://redis.io/docs/latest/operate/oss_and_stack/management/config/)  
- 若需快速获取配置模板，可先创建临时容器并复制配置文件；
  

