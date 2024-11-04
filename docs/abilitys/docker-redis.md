# Redis
拉取官方redis镜像
```js
docker pull redis
```
创建容器
```js
docker run -di --name redis -p 6379:6379 redis
```
连接容器中的Redis时，只需要连接宿主机的IP + 指定的映射端口即可。