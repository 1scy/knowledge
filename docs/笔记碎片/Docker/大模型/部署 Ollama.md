---
title: 部署 Ollama
category: 大模型
tag: 大模型
---

## docker部署

```sh

#!/bin/bash

# 拉取 Ollama 镜像
docker pull ollama/ollama:0.6.5

# 启动 Ollama 容器
docker run -d \
  --name ollama \
  --restart unless-stopped \
  -p 11434:11434 \
  ollama/ollama:0.6.5

echo "Ollama 容器已启动，可以通过 http://localhost:11434 访问"

```


以下是 Ollama 的一些常用命令及其功能：

### 运行相关：

* **运行指定大模型** ：`ollama run 模型名`
    * 可在 `docker exec -it ollama /bin/sh` 进入容器后执行。如 `ollama run llama3:8b-text`，会启动该模型并响应输入，用于生成文本等任务。

* **查看运行中的大模型** ：`ollama ps`
    * 在容器内执行，列出当前正在运行的大模型，方便用户查看哪些模型处于运行状态，以便进行管理或操作。

### 模型管理相关：

* **查看本地大模型列表** ：`ollama list`
    * 列出本地已安装的大模型，用户可以快速了解本地可用的模型资源，从而选择合适的模型进行运行或管理。

* **删除本地指定大模型** ：`ollama rm 模型名`
    * 删除本地不再需要的大模型，释放存储空间。例如，`ollama rm llama3:8b-text` 可删除对应模型。

* **拉取大模型** ：`ollama pull 模型名`
    * 从远程仓库拉取指定模型到本地，丰富本地模型资源。如 `ollama pull llama3:8b-text`。

* **保存大模型** ：`ollama save 模型名 文件路径`
    * 将本地大模型保存到指定文件路径，便于备份或迁移。比如 `ollama save llama3:8b-text /path/to/model`。

* **更新大模型** ：`ollama update 模型名`
    * 检查并更新本地大模型到最新版本，确保使用的是最新功能和修复。