# web安全
> 随着Web2.0、社交网络、微博等等一系列新型的互联网产品的诞生，基于Web环境的互联网应用越来越广泛，企业信息化的过程中各种应用都架设在Web平台上，Web业务的迅速发展也引起黑客们的强烈关注，接踵而至的就是Web安全威胁的凸显，黑客利用网站操作系统的漏洞和Web服务程序的SQL注入漏洞等得到Web服务器的控制权限，轻则篡改网页内容，重则窃取重要内部数据，更为严重的则是在网页中植入恶意代码，使得网站访问者受到侵害。这也使得越来越多的用户关注应用层的安全问题，对Web应用安全的关注度也逐渐升温。 -- 百度百科



## csrf
> 跨站请求伪造。是一种挟制用户在当前已登录的Web应用程序上执行非本意的操作的攻击方法。CSRF 利用的是网站对用户网页浏览器的信任。

原理：cookie动态上传

过程：用户登录A网站（未退出） => 打开B网站 => B网站发出请求（A网站的接口）会带上A网站的cookie

## xss
> 跨站脚本攻击。攻击者在网站中插入一段代码。XSS 利用的是用户对指定网站的信任。

原理：对用户输入的内容直接渲染到页面，譬如输入: `<script>alert(1)</script>`

过程：A网站评论 => 输入一段js代码（转账或点赞） => 如果不校验就渲染到页面，代码就会执行

<!-- ## sql注入
> 还不太懂 -->

## https
> 是以安全为目标的 HTTP 通道，在HTTP的基础上通过传输加密和身份认证保证了传输过程的安全性。HTTPS 在HTTP 的基础下加入SSL 层，HTTPS 的安全基础是 SSL，因此加密的详细内容就需要 SSL。

`url` => 全局资源定位符
`uri` => 全局资源标识符

`http://www.aa.com/a/b?a=1#b=2`  协议、主机、端口、路径、参数、查询、锚点
`protocol :// hostname[:port] / path / [;parameters][?query]#hash`

请求、响应

- SSL 是为网络通信提供安全及数据完整性的一种安全协议。可确保数据在网络上的传输过程中不会被截取及窃听。
CA下发证书 => 服务器 => 浏览器

https连接过程
- 客户端发送请求到服务器端
- 服务器端返回证书和公开密钥，公开密钥作为证书的一部分而存在
- 客户端验证证书和公开密钥的有效性，如果有效，则生成共享密钥并使用公开密钥加密发送到服务器端
- 服务器端使用私有密钥解密数据，并使用收到的共享密钥加密数据，发送到客户端
- 客户端使用共享密钥解密数据
- SSL加密建立………

**RSA** 非对称加密算法


