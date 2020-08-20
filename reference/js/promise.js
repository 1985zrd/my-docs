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
