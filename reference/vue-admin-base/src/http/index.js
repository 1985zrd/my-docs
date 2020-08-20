import axios from 'axios'
import Vue from 'vue'
import config from '@config/index'
import loading from './loading'

const { tjb } = config

// 创建axios实例
const $request = axios.create({
  baseURL: tjb,
  timeout: 30000
})

// 请求拦截器
$request.interceptors.request.use(config => {
  // 如果某个请求不需要 loading 呢，那么可以定义个API数组看config.url是否在这个数组中。在请求拦截和响应拦截时判断下该请求是否需要loading，需要 loading 再去调用loading.start()方法即可
  // 自定义header信息（比如token）
  // config.headers['Token'] =
  loading.start()
  return config
}, (error) => {
  return Promise.reject(error)
})

// 响应拦截器
$request.interceptors.response.use(response => {
  loading.end()
  return response
}, (error) => {
  // 公共错误判断
  // if (error.response) {
  //   switch (error.response.status) {
  //     case 404:
  //       console.log('找不到页面'); break
  //     case 500:
  //       console.log('服务器错误'); break
  //     default: break
  //   }
  // }
  // 结束loading
  loading.end()
  return Promise.reject(error)
})

// 切换页面时候,取消上个页面的请求的方法
Vue.$httpRequestList = []
const cancelToken = () => {
  return new axios.CancelToken(cancel => {
    // cancel就是取消请求的方法
    Vue.$httpRequestList.push({ cancel })
  })
}

const getData = (url, data = {}, method = 'GET', headers, baseURL) => {
  method = method.toUpperCase()
  const obj = {
    url,
    method,
    headers,
    baseURL,
    cancelToken: cancelToken()
  }
  if (method === 'GET' || method === 'DELETE') {
    // get请求防止IE缓存
    if (!!window.ActiveXObject || 'ActiveXObject' in window) {
      data.t = new Date().getTime()
    }
    obj.params = data
  } else {
    obj.data = data
  }
  return $request(obj)
}

export default getData
