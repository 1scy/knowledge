---
title: TransactionSynchronizationManager使用
category: 并发
tag: 并发
---

```java
//在事务提交后调用
TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
    @Override
    public void afterCommit () {
        // 发送企微消息
        sendMessageWeChat(updateReqVO);
    }
```