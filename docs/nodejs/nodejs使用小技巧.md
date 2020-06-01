# nodejs使用小技巧

## 图形验证码
[svg-captcha](https://www.npmjs.com/package/svg-captcha)

```
npm install --S svg-captcha

let svgCaptcha = require('svg-captcha');
svgCaptcha.create(options)
```
`svgCaptcha.create`返回：
   - data: string // svg path data 展示到前端的图片
   - text: string // captcha text 图片里的数字，用于校验

`options`: 
   - size: 4 // size of random string 4位数字
   - ignoreChars: '0o1i' // filter out some characters like 0o1i 过滤掉一些不好辨认的字符
   - noise: 1 // number of noise lines 图片噪点数
   - color: true // characters will have distinct colors instead of grey, true if background option is set  配合background设置背景色
   - background: '#cc9966' // background color of the svg image 配合color设置背景色


## jwt
[jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)

```
npm install jsonwebtoken -S

const jwt = require("jsonwebtoken")

jwt.sign(
    {
      username: userinfo.username || ''
    },
    secret, // 秘钥
    {
      expiresIn: '2h' // 过期时间
    }
)

jwt.sign({数据}, 秘钥, {options}) 返回token
```

token校验：[koa-jwt](https://www.npmjs.com/package/koa-jwt)

```
npm install koa-jwt -S

const jwtAuth = require("koa-jwt")

app.use(jwtAuth({
  secret // 秘钥
}).unless({ // 排除不需要token校验的接口
  path: [/^\/api\/user\/[signUp|signIn]/]
}))
```

前端拦截器：

```
$request.interceptors.request.use(config => {
    const token = app.store.state.token || ''
    config.headers.common['Authorization'] = 'Bearer ' + token
    return config
}, error => {
    return Promise.reject(error)
})
```

