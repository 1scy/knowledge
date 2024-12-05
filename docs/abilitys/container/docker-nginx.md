# Nginx
### 拉取官方nginx镜像
```js
docker pull nginx
```
### 创建Nginx容器。
```js
docker run -di --name nginx -p 80:80 nginx
```

将容器内的配置文件拷贝到指定目录（请先提前创建好目录）。

### 创建目录
```js
mkdir -p /home/ruoyi/nginx
```

### 将容器内的配置文件拷贝到指定目录
```js
docker cp nginx:/etc/nginx /home/ruoyi/nginx/conf
```

### 终止并删除容器
```js
docker stop nginx
docker rm nginx
```
### 创建Nginx容器，并将容器中的/etc/nginx目录和宿主机的/home/ruoyi/nginx/conf目录进行挂载。
```js
docker run -di --name nginx -p 80:80 -v /home/ruoyi/nginx/conf:/etc/nginx nginx
```