# Caffeine快速入门

* * *

## [本地缓存](#本地缓存)

Caffeine 是一个 Java 的本地缓存库,提供了非常强大和灵活的缓存功能。

Guava Cache也是一个本地缓存库，但是目前它也推荐使用Caffeine

## [使用示例](#使用示例)

**引入依赖：**

```xml
<!---->
<dependency>
    <groupId>com.github.ben-manes.caffeine</groupId>
    <artifactId>caffeine</artifactId>
</dependency>
```

> SpringBoot的pom内指定了caffeine的版本，所以一般无需自行指定版本 如自定指定，2024可以使用3.1.8版本

**测试：**

```java
public static Cache<String, String> localCache = Caffeine.newBuilder()
        .expireAfterWrite(5, TimeUnit.SECONDS)
        .build();

@Test
void cacheTest() {
    String username = localCache.getIfPresent("username");
    if (username != null) {
        System.out.println(username);
    }
    username = "zisu";
    localCache.put("username", username);
    System.out.println(username);
}
```