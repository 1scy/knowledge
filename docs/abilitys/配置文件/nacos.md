# Nacos配置发现服务不注册服务


### 配置说明
此配置用于禁用Spring Cloud Nacos客户端向服务发现注册中心注册当前服务实例。  
适用场景：当应用仅作为服务消费者或不需要被其他服务发现时，通过设置`register-enabled`为`false`可避免不必要的注册行为，优化网络通信和注册中心负载。  
关键参数：  
- `spring.cloud.nacos.discovery.register-enabled`：布尔值配置项，`false`表示禁用服务注册，`true`（默认）表示启用服务注册。  
该配置仅影响服务注册行为，服务发现功能仍可通过` discovery.enabled`独立控制。
```yaml
--spring.cloud.nacos.discovery.register-enabled=false
```