## 部署 deepseek

::: info 相关信息
[Ollama](https://ollama.com/)
:::

## [Deepseek 参考配置要求](#deepseek-参考配置要求)

+   1.5B：最低硬件需求（显卡非必须 + 8GB 内存），适合基础文本生成。
+   7B：8GB 显存 + 16GB 内存，适合代码生成、轻量客服。
+   14B：16GB 显存 + 32GB 内存，适合复杂推理、长文本生成。
+   32B+：需高端 GPU（如 RTX 4090/A100）和服务器级硬件。

## [部署](#部署)

> 需要先部署好Ollama

1.  搜索模型：进入Ollama搜索对应的模型，例如deepseek-r1
2.  拉取模型：选择参数拉取对应的模型，例如：`ollama pull deepseek-r1:1.5b`
3.  运行模型：`ollama run deepseek-r1:1.5b`

## [调用](#调用)

在ollama运行后直接和模型对话，也可以调用API对话

```bash
curl http://127.0.0.1:11434/api/generate \
-H "Content-Type: application/json" \
-d '{
     "model": "deepseek-r1:1.5b",
     "prompt": "你是谁啊？",
     "stream": false
   }'
```