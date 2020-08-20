import { getPreHost } from '@utils/index'

export const API_ENV = { // 环境一般都包含test（自试）、uat（用户验收测试）、pre（预生产）、prod（生产）环境
  TEST: 'test',
  UAT: 'uat',
  PROD: 'prod',
  PRE: 'pre'
}

const apiPrefix = { // 配置各环境api的baseUrl
  [API_ENV.TEST]: {
    tjb: 'http://test.op2c.ikang.com/admin1'
  },
  [API_ENV.UAT]: {
    tjb: 'http://test.op2c.ikang.com/admin1'
  },
  [API_ENV.PRE]: {
    tjb: 'http://test.op2c.ikang.com/admin1'
  },
  [API_ENV.PROD]: {
    tjb: 'http://test.op2c.ikang.com/admin1'
  }
}

export const global = {
  mock: API_ENV.UAT, // 当前程序使用的环境，最后会由getPreHost函数返回正确的环境
  domain: '', // cookie设置的域
  cookieExpires: 1, // cookie设置的过期时间
  TOKEN_KEY: 'access_token' // cookie设置的键值
}

export default apiPrefix[getPreHost()] // 返回的是环境api的baseUrl，可自行设置返回
