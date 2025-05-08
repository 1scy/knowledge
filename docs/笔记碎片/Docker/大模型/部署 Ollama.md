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