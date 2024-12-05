# Docker 环境安装
安装详细说明参考官方文档：https://docs.docker.com/get-docker
以CentOS为例。

安装所需的软件包
安装yum-utils包
```js
yum install -y yum-utils
```
设置存储库

### 官方地址（比较慢）
```js
yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo
	
### 阿里云地址（国内地址，相对更快）
yum-config-manager \
    --add-repo \
    http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```

安装Docker引擎
```js
yum install docker-ce docker-ce-cli containerd.io
```
安装完成后，运行下面的命令，验证是否安装成功。
```js
docker version # 查看Docker版本信息

systemctl start docker		# 启动 docker 服务:
systemctl stop docker		  # 停止 docker 服务:
systemctl status docker		# 查看 docker 服务状态
systemctl restart docker	# 重启 docker 服务
```
