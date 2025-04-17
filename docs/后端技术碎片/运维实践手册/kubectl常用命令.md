# Kubernetes 以下是排查和解决方法：

### 说明

- `<pod-name>`：替换为实际的 Pod 名称。
- `<namespace>`：替换为实际的命名空间。

### 1. **查看Pod 名称**

```bash
kubectl get pods
```

### 2. **命名空间**

如果 Pod 不在默认命名空间中，需要指定命名空间：

要查看 Kubernetes 集群中的所有命名空间，可以使用以下命令：

```bash
kubectl get namespaces
```

```bash
kubectl get pods -n <namespace>
```

### 3. **排查问题**

如果 Pod 存在但状态不正常（如 `CrashLoopBackOff` 或 `Error`），可以查看 Pod 的日志来排查问题：
查看指定 Pod 的日志，可以使用以下命令：

```bash
kubectl logs <pod-name> -n <namespace>
```

### 示例

```bash
kubectl logs yudao-module-trade-7f68449b68-wx6qp -n default
```

