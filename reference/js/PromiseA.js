const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

const noop = () => {};

const isFunction = () => {
  return true
};
const isPromise = () => {
  return false
};
const isThenable = () => {
  return false
};

const transition = (promise, state, result) => {
  if (promise.state !== PENDING) return;
  promise.state = state;
  promise.result = result
  setTimeout(() => handlerCallbacks(promise.callbacks, state, result), 0)
};

const handlerCallbacks = (callbacks, state, result) => {
  while (callbacks.length) handlerCallback(callbacks.shift(), state, result);
};

const handlerCallback = (callback, state, result) => {
  const { onFulfilled, onRejected, resolve, reject } = callback;
  try {
    if (state === FULFILLED) {
      isFunction(onFulfilled) ? resolve(onFulfilled(result)) : resolve(result)
    } else if (state === REJECTED) {
      isFunction(onRejected) ? reject(onRejected(result)) : reject(result)
    }
  } catch (e) {
    reject(e)
  }
};

const resolvePromise = (promise, result, resolve, reject) {
  if (result === promise) {
    let reason = new TypeError('Can not fulfill promise with itself')
    return reject(reason)
  }

  if (isPromise(result)) {
    return result.then(resolve, reject)
  }

  if (isThenable(result)) {
    try {
      let then = result.then
      if (isFunction(then)) {
        return new PromiseA(then.bind(result)).then(resolve, reject)
      }
    } catch (e) {
      return reject(e)
    }
  }

  resolve(result)
};

class PromiseA {
  constructor (f) {
    this.state = PENDING;
    this.result = null;
    this.callbacks = [];

    let onFulfilled = value => transition(this, FULFILLED, value);
    let onRejected = reason => transition(this, REJECTED, reason);

    let ignore = false;
    let resolve = value => {
      if (ignore) return;
      ignore = true;
      resolvePromise(this, value, onFulfilled, onRejected);
    }
    let reject = reason => {
      if (ignore) return;
      ignore = true;
      onRejected(reason);
    }

    try {
      f(resolve, reject);
    } catch (e) {
      reject(e)
    }
  }
  then (onFulfilled, onRejected) {
    return new PromiseA((resolve, reject) => {
      let callback = { onFulfilled, onRejected, resolve, reject }
      if (this.state === PENDING) {
        this.callbacks.push(callback)
      } else {
        setTimeout(() => {
          handlerCallback(callback, this.state, this.result)
        }, 0)
      }
    })
  }
  catch (onRejected) {
    return this.then(null, onRejected)
  }
  static resolve (value) {
    return new PromiseA(resolve => resolve(value))
  }
  static reject (reason) {
    return new PromiseA((noop, reject) => reject(reason))
  }
  static all(promiseArr) {
    let result = [];
    //声明一个计数器 每一个promise返回就加一
    let count = 0
    return new PromiseA((resolve, reject) => {
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
  static race(promiseArr) {
    return new PromiseA((resolve, reject) => {
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
