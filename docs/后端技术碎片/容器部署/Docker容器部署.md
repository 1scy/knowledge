---
title: Docker 环境配置
category: docker
tag: docker
---

::: info 相关信息
官网：[https://www.docker.com](https://www.docker.com/) - Mac、Windows、Linux
介绍：Docker 是一个开源的应用容器引擎，让开发者可以打包他们的应用以及依赖包到一个可移植的镜像中，然后发布到任何流行的 Mac、Linux或Windows操作系统的机器上，也可以实现虚拟化。容器是完全使用沙箱机制，相互之间不会有任何接口。总之它加快构建、共享和运行现代应用程序的速度。
:::

##  一、基础安装

### 1. 查看系统的内核版本

```sh
uname -r
```

x86 64位系统，如果是32位是不能安装 docker 的

### 2. yum 更新到最新版本

```sh
sudo yum update
```

看到显示 `Complete` 就代表完成了，整个过程需要 5-10 分钟左右

###  3. 安装Docker所需的依赖包

```sh
sudo yum install -y yum-utils device-mapper-persistent-data lvm2
```

看到显示 `Complete` 就代表完成了，整个过程需要 1-3 分钟左右

### 4. 设置Docker的yum的源

```sh
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
```
鉴于国内网络问题，强烈建议使用国内源。以下是阿里云的软件源。**如果是海外如AWS云就不要设置yum源**

```bash
sudo sed -i 's|download.docker.com|mirrors.aliyun.com/docker-ce|g' /etc/yum.repos.d/docker-ce.repo
```

### 5. 查看仓库所有Docker版本

```sh
yum list docker-ce --showduplicates | sort -r
```

``
这里可以看到你能安装的最新版本

### 6. 安装Docker

```sh
sudo yum install docker
```

安装默认最新版本的 Docker

```java
sudo yum install docker-ce-20.10.11.ce
```

安装指定版本

###  7. 安装Docker-Compose

#### 7.1 正常安装

```shell
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

```

#### 7.2 离线安装

```shell
# 下载；docker-compose-`uname -s`-`uname -m` 查看版本；https://github.com/docker/compose/releases/tag/v2.18.1
# 重命名
mv docker-compose-Linux-x86_64  docker-compose
# 加入执行权限
sudo chmod +x /usr/local/bin/docker-compose
# 查看docker-compose版本
docker-compose -v
```


```sh
sudo chmod +x /usr/local/bin/docker-compose
docker-compose -v
```


### 8. 启动Docker并添加开机自启动

```sh
sudo systemctl start docker
```

启动 Docker

```sh
systemctl enable docker
```

设置开机启动 Docker

### 9. 查看 Docker 版本

```sh
docker --version
```


### 10. 卸载 Docker

```sh
sudo yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-selinux \
                  docker-engine-selinux \
                  docker-engine
```


### 11. Docker 常用命令

```sh
docker --help				                        #Docker帮助
docker --version			                        #查看Docker版本
docker search <image>		                        #搜索镜像文件，如：docker search mysql
docker pull <image>		                            #拉取镜像文件， 如：docker pull mysql
docker images				                        #查看已经拉取下来的所以镜像文件
docker rmi <image>		                            #删除指定镜像文件
docker run --name <name> -p 80:8080 -d <image>		#发布指定镜像文件
docker ps					                        #查看正在运行的所有镜像
docker ps -a				                        #查看所有发布的镜像
docker rm <image>			                        #删除执行已发布的镜像
```

### 12. 设置国内源

阿里云提供了镜像源：[https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors](https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors) - 登录后你会获得一个专属的地址。

使用以下命令来设置 Docker 国内源：- 或者你可以通过 `vim /etc/docker/daemon.json` 进入修改添加 registry-mirrors 内容后重启 Docker

```text
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://***替换为你的地址***.mirror.aliyuncs.com"]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```


这个命令会创建一个 `/etc/docker/daemon.json` 文件，并将国内源的配置写入其中。然后你只需要重启 Docker 服务即可使配置生效，可以通过运行 `sudo systemctl restart docker` 命令来重启 Docker 服务。