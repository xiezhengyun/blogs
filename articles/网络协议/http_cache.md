## HTTP的缓存控制
1. 浏览器发现缓存无数据，于是发送请求，向服务器获取资源; 
2. 服务器响应请求，返回资源，同时标记资源的有效期;
3. 浏览器缓存资源，等待下次重用

#### Cache-Control
服务器标记资源有效期使用的头字段是“Cache-Control”。
+ ``max-age=30`` 是HTTP缓存控制最常用的属性，30代表30s。
+ ``no_store`` **不允许缓存**，用于某些变化非常频繁的数据，例如秒杀页面。
+ ``no_cache`` **可以缓存**，但在使用之前必须要去服务器验证是否过期，是否有最新的版本;
+ ``must-revalidate`` 如果缓存不过期就可以继续使用，但过期 了如果还想用就必须去服务器验证。

![](../../Images/http/http_cache.png)

#### 条件请求

##### 验证资源是否失效
常用的是``if-Modified-Since``和``If-None-Match``，收到304就可以复用缓存里的资源。

##### 验证资源是否被修改
验证资源是否被修改的条件有两个:``Last-modified``和``ETag``，需要服务器预先在响应报文里设
置，搭配条件请求使用;


![](../../Images/http/http_cache2.jpg)

[好文](https://mp.weixin.qq.com/s/z_iKW6LYtAXEy60bPmCKcQ)


## 强缓存

### Expires
Expires 是由服务端返回的资源过期时间（GMT 日期格式/时间戳），若用户本地时间在过期时间前，则不发送请求直接从本地获取资源。

- HTTP/1.0 产物。
- 优先级低于 Cache-control: max-age。
- 缺点：使用本地时间判断是否过期，而本地时间是可修改的且并非一定准确的。

### Cache-Control
Cache-Control 是用于页面缓存的通用消息头字段，可以通过指定指令来实现缓存机制。

- HTTP/1.1 产物。
- 优先级高于 Expires。
- 正确区分 no-cache / no-store 的作用

常用字段：
- max-age 设置缓存存储的最大时长，单位秒。
- no-cache 强制客户端向服务器发起请求（禁用强缓存，可用协商缓存）。
- no-store 禁止一切缓存，包含协商缓存也不可用。

### Pragma
Pragma 只有一个属性值，就是 no-cache ，效果和 Cache-Control 中的 no-cache 一致，不使用强缓存，需要与服务器验证缓存是否新鲜，在 3 个头部属性中的优先级最高

## 协商缓存

### ETag / If-None-Match

如果资源请求的响应头里含有 ETag，客户端可以在后续的请求的头中带上 If-None-Match 头来验证缓存。若服务器判断资源标识一致，则返回 304 状态码告知浏览器可从本地读取缓存。

唯一标识内容是由服务端生成算法决定的，可以是资源内容生成的哈希值，也可以是最后修改时间戳的哈希值。所以 Etag 标识改变并不代表资源文件改变，反之亦然。

- 通过唯一标识来验证缓存
- 优先级高于 Last-Modified / If-Modified-Since

### Last-Modified / If-Modified-Since
如果资源请求的响应头里含有 Last-Modified，客户端可以在后续的请求的头中带上 If-Modified-Since 头来验证缓存。若服务器判断资源最后修改时间一致，则返回 304 状态码告知浏览器可从本地读取缓存

- 通过资源的最后修改时间来验证缓存。
- 优先级低于 ETag / If-None-Match。
- 缺点：只能精确到秒，若 1s 内多次修改资源 Last-Modified 不会变化。