# Docker镜像提取与加载

## 使用docker save命令

格式：```docker save <image_name>:<tag> -o <output_file.tar>```

示例：
```sh
docker save zisu-openjdk:17 -o zisu-openjdk-17.tar
```


## 加载镜像
## 使用docker load命令

格式：```docker load -i <input_file.tar>```

示例：

```sh
docker load -i zisu-openjdk-17.tar
```
