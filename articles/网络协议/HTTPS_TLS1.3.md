## HTTPS_TLS1.3 
1.3相比1.2做了优化。关键在于删除不安全的算法和提升性能。
+ 精简算法
+ 通过扩展协议（Extension Protocol）的 **supported_groups** 简化 流程

## 新的握手过程
+ 客户端在“Client Hello”消息里直接用“supported_groups”带上支持 的曲线，比如P-256、x25519，用“key_share”带上曲线对应的客户端公钥参数， 用“signature_algorithms”带上签名算法。
+ 服务器收到后在这些扩展里选定一个曲线和参数，再用“key_share”扩展返回服务器这边的公钥参数，就 实现了双方的密钥交换，后面的流程就和1.2基本一样了。

![https_tsl1](../../Images/http/https_tsl1.3M.png)

![https_tsl1.3详情](../../Images/http/https_tsl1.3详情.png)
