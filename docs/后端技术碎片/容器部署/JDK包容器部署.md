# 制作JDK包

## Dockerfile文件
### Dockerfile说明
该Dockerfile定义了基于OpenJDK 17的Alpine Linux容器镜像。设置作者标签，暴露48084端口，指定工作目录为/home，并配置容器启动时执行run.sh脚本。

```js
# 使用 Alpine Linux 作为基础镜像
FROM openjdk:17-alpine

# 设置作者信息
LABEL author="zisu"

# 暴露端口（根据你的应用程序需求修改）
EXPOSE 48084

WORKDIR /home

# 设置容器启动时运行的命令
CMD ["/bin/sh","-c","chmod +x ./run.sh && sh ./run.sh"]

```

## 构建镜像
### 构建镜像命令说明
该命令使用指定的Dockerfile构建镜像，标签为zisu/openjdk:17。

```js
docker build -t zisu/openjdk:17 -f ./Dockerfile .
```

## 运行镜像
### 容器运行脚本说明
该脚本用于以守护模式运行容器，映射端口48085到容器的48084，挂载数据和日志卷，并指定镜像版本。

docker-run.sh:

```js
docker run -d  \
	--name=report \
	-p 48085:48084 \
	-v /opt/docker/report/data:/home \
	-v /opt/docker/report/logs:/root/logs \
      zisu/openjdk:17
```

### config.properties
### 配置文件说明
Spring配置文件，设置本地环境激活，指定Nacos服务发现的IP地址，并启用注册功能。


```js
spring.profiles.active=local
spring.cloud.nacos.discovery.ip=192.168.0.84
spring.cloud.nacos.discovery.register-enabled=true
```

### run.sh
### 启动脚本说明
该脚本启动Java应用，设置JVM初始和最大堆内存为1G，并指定额外的配置文件位置。


```js
java -jar \
    -Xms1g \
    -Xmx1g \
    app.jar \
    --spring.config.additional-location=file:./config.properties
```