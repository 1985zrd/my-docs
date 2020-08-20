# Promise解析
> 我们在很多地方都有用到过promise，如：async/await、axios的返回、vue的nextTick、import()等。为了更好的理解promise，我们就来实现一下promise。

## 参考
[英文版promise/A+规范](https://promisesaplus.com/)
[中文版promise/A+规范](http://www.ituring.com.cn/article/66566)
[git地址](https://github.com/then/promise)

## 常规使用
```js
new Promise(function (resolve, reject) {
  setTimeout(() => {
    resolve(1)
  }, 1000)
}).then((data) => {
  console.log(data)
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      resolve(2)
    }, 1000)
  })
}).then((data) => {
  console.log(data)
}).catch((error) => {
  console.log(error)
})

```

## 术语
1. `promise` 是一个拥有 `then` 方法的对象或函数，其行为符合本规范。
2. `thenable` 是一个定义了 `then` 方法的对象或函数，文中译作“拥有 `then` 方法”。
3. 值（`value`）指任何 `JavaScript` 的合法值（包括 `undefined` , `thenable` 和 `promise`）。
4. 异常（`exception`）是使用 `throw` 语句抛出的一个值。
5. 据因（`reason`）表示一个 `promise` 的拒绝原因。

## 要求
1. 一个 `Promise` 的当前状态必须为以下三种状态中的一种：等待态（`Pending`）、执行态（`Fulfilled`）和拒绝态（`Rejected`）。
2. 处于等待态时，可以迁移至执行态或拒绝态。
3. 处于执行态时，不能迁移至其他任何状态、必须拥有一个不可变的终值。
4. 处于拒绝态时，不能迁移至其他任何状态、必须拥有一个不可变的据因。
5. 这里的不可变指的是恒等（即可用 === 判断相等），而不是意味着更深层次的不可变（译者注：盖指当 `value` 或 `reason` 不是基本值时，只要求其引用地址相等，但属性值可被更改）。
6. 一个 `promise` 必须提供一个 `then` 方法以访问其当前值、终值和据因。

## 自定义Promise
> 下面实现一个`Promise`

`promise.then`只是收集回调，真正执行还是在`resolve`、`reject`中。

```js
class MyPromise {
  constructor (handler) {
    this.status = 'PENDING'
    this.value = null
    this.reason = null
    
    this.resolveArr = []
    this.rejectArr = []

    this._handler(handler)
  }
  _handler (handler) {
    // 设置done，这个值用来设置状态不可逆
	  let done = false
    let resolve = value => {
      if (done) return
      done = true
      // 如果value有then函数，先执行
      let then = this._getThen(value)
      // bind做上下文绑定
      if (then) return this._handler(then.bind(value))
      this._resolve(value)
    }
    let reject = error => {
      if (done) return
      done = true
      let then = this._getThen(error)
      if (then) return this._handler(then.bind(error))
      this._reject(error)
    }
    try {
      handler(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }
  _getThen (value) {
    let type = typeof value
    if (value && (type === 'object' || type === 'function')) {
      let then
      if (then = value.then) {
        return then
      }
    }
    return null
  }
  _resolve (value) { // 改变状态和执行then里的第一个函数
    // 这里应该是个微任务
    setTimeout(() => {
      this.status = 'FULFILLED'
      this.value = value
      //执行所有成功
      this.resolveArr.forEach((item) => item(value))
    })
  }
  _reject (error) {
    setTimeout(() => {
      this.status = 'REJECTED'
      this.reason = error
      //执行所有失败
      this.rejectArr.forEach((item) => item(error))
    })
  }
  // 收集成功失败函数
  _done (resolveFn, rejectFn) {
    resolveFn = typeof resolveFn === 'function' ? resolveFn : null
    rejectFn = typeof rejectFn === 'function' ? rejectFn : null
    if (this.status === 'PENDING') {
      resolveFn && this.resolveArr.push(resolveFn)
      rejectFn && this.rejectArr.push(rejectFn)
    // 如果状态已经变成成功或失败，则立即执行
    } else if (this.status === 'FULFILLED') {
      resolveFn && resolveFn(this.value)
    } else if (this.status === 'REJECTED') {
      rejectFn && rejectFn(this.reason)
    }
  }
  then (resolveFn, rejectFn) {
    let _this = this
    return new MyPromise((resolve, reject) => {
      this._done((value) => {
        if (typeof resolveFn !== 'function') { // 如果参数不是函数，则立即执行resolve
          return resolve(resolveFn)
        }
        resolve(resolveFn(value)) // 返回的可能是promise
      }, (error) => {
        if (typeof rejectFn !== 'function') {
          return resolve(rejectFn)
        }
        resolve(rejectFn(error))
      })
    })
  }
  catch (rejectFn) {
    return this.then(null, rejectFn);
  }
  //静态方法
  static all(promiseArr) {
    let result = [];
    //声明一个计数器 每一个promise返回就加一
    let count = 0
    return new Mypromise((resolve, reject) => {
      for (let i = 0; i < promiseArr.length; i++) {
        promiseArr[i].then(
          res => {
          //这里不能直接push数组  因为要控制顺序一一对应(感谢评论区指正)
            result[i] = res
            count++
            //只有全部的promise执行成功之后才resolve出去
            if (count === promiseArr.length) {
              resolve(result);
            }
          },
          err => {
            reject(err);
          }
        );
      }
    });
  }
  //静态方法
  static race(promiseArr) {
    return new Mypromise((resolve, reject) => {
      for (let i = 0; i < promiseArr.length; i++) {
        promiseArr[i].then(
          res => {
          //promise数组只要有任何一个promise 状态变更  就可以返回
            resolve(res);
          },
          err => {
            reject(err);
          }
        );
      }
    });
  }
}

new MyPromise(function (resolve, reject) {
  setTimeout(() => {
    resolve(1)
    reject('我错了')
  }, 1000)
}).then((data) => {
  console.log(data)
  return new MyPromise(function (resolve, reject) {
    setTimeout(() => {
      resolve(2)
    }, 1000)
  })
}, (e)=> {
  console.log(e)
}).then((data) => {
  console.log('ggg')
  console.log(data)
}).catch((error) => {
  console.log('error')
  console.log(error)
})

```
原生`Promise`的实现还是蛮复杂的，这里只是简单的实现，还有很多的问题。请参考 [Promise git地址](https://github.com/then/promise)
