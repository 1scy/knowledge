>  :house_with_garden: [Arthas（阿尔萨斯）](https://arthas.aliyun.com/)**官网**

---

## 1.拷贝 arthas

```js
curl -O https://arthas.aliyun.com/arthas-boot.jar
```

## 2.其次需要知道查看的容器ID

```js
docker ps -a | grep 容器名
```

## 3.拷贝arthas程序包到容器目录下

```js
docker cp arthas-boot.jar 容器ID:/
```

## 4.进入到容器目录

```js
 docker exec -it 容器ID /bin/bash 
```

#### 可使用```ll```去查看是否存在 arthas-boot.jar

## 5.启动

```js
java -jar arthas-boot.jar
```
#### 看到 Arthas的标志，表示arthas已经启动成功,并选择想要操作的进程序号
