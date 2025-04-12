# 部署redis

 部署Redis容器并配置持久化存储和自定义配置文件
 该命令启动Redis容器，包含以下关键配置：
 - 端口映射：将容器6379端口暴露到主机
 - 数据持久化：通过挂载卷保存数据到宿主机/opt/redis/data目录
 - 配置文件挂载：使用宿主机的/opt/redis/conf/redis.conf配置文件
 - 自动重启策略：除非手动停止，否则容器随Docker服务自动重启


```sh
docker run \
-d \
--name redis \
-p 6379:6379 \
--restart unless-stopped \
-v /opt/redis/data:/data \
-v /opt/redis/conf/redis.conf:/etc/redis/redis.conf \
redis:latest \
redis-server /etc/redis/redis.conf
```
### [配置文件参考](https://redis.io/docs/latest/operate/oss_and_stack/management/config/)
