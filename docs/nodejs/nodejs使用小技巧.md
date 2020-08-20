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

## 复制文件 
`createReadStream` | `createWriteStream` | `mkdirSync` | `readdir` | `stat` | `isDirectory`

```js
var copyFile = function(srcPath, tarPath, cb) {
  var rs = fs.createReadStream(srcPath) // 可读流
  rs.on('error', function(err) {
    if (err) {
      console.log('read error', srcPath)
    }
    cb && cb(err)
  })
  rs.on('data', function(data) {
    if (rs.path.indexOf('index.html') !== -1) {
      let str = data.toString()
      let newStr = str.replace(/<\/head>/, script + '</head>')
      ws.write(newStr)
    } else if (rs.path.indexOf('shareConfig.json') !== -1) {
      let str = data.toString()
      let newStr = str.replace(/true/, false)
      ws.write(newStr)
    } else {
      ws.write(data)
    }
  })

  var ws = fs.createWriteStream(tarPath) // 可写流
  ws.on('error', function(err) {
    if (err) {
      console.log('write error', tarPath)
    }
    cb && cb(err)
  })
  ws.on('close', function(ex) {
    cb && cb(ex)
  })
}

var copyFolder = function(srcDir, tarDir, cb) {
  rm(tarDir, function (err) { // 清空目标文件夹 rm是第三方插件rimraf
    if (err) {
      console.log(err)
      return
    }
    fs.mkdirSync(tarDir) // 同步新建文件夹
    fs.readdir(srcDir, function(err, files) { // 读取文件夹
        var count = 0
        var checkEnd = function() {
          ++count == files.length && cb && cb()
        }
    
        if (err) {
          checkEnd()
          return
        }
    
        files.forEach(function(file) {
          var srcPath = path.join(srcDir, file)
          var tarPath = path.join(tarDir, file)
    
          fs.stat(srcPath, function(err, stats) { // 检查文件是否存在
            if (stats.isDirectory()) { // 是不是文件夹
              console.log('mkdir', tarPath)
              fs.mkdir(tarPath, function(err) {
                if (err) {
                  console.log(err)
                  return
                }
    
                copyFolder(srcPath, tarPath, checkEnd)
              })
            } else {
              copyFile(srcPath, tarPath, checkEnd)
            }
          })
        })
    
        //为空时直接回调
        files.length === 0 && cb && cb()
      })
    })
  
}

copyFolder('./dist', './production', function (err) {
  if (err) {
    console.log(err)
  }
})
```

