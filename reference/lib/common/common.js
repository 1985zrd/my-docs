/**
 * 获取url里的参数
 * @param {*} str
 * 传入'a=b&c=d' => {a: 'b', c: 'd'}
 */
export const formatSearch = function (str) {
  let o = {}
  let reg = /(\w+)=(\w+)/gi
  let match
  while ((match = reg.exec(str))) {
    o[match[1]] = match[2]
  }
  return o
}


/**
 * 获取数据类型
 * @param {*} data
 * '1' => 'string'  1 => 'number'
 */
export function getType (data) { // 类型判断，返回字符串
  const reg = /\s(\w+)\]/g
  const result = reg.exec(Object.prototype.toString.call(data))
  return result && result[1] ? result[1].toLowerCase() : ''
}

/**
 * 设置html字体大小
 */
export const setFontSize = function () {
  function getWdith () {
    let myWidth = 0
    if (typeof (window.innerWidth) === 'number') {
      myWidth = window.innerWidth
    } else if (document.documentElement && (document.documentElement.clientWidth)) {
      myWidth = document.documentElement.clientWidth
    } else if (document.body && (document.body.clientWidth)) {
      myWidth = document.body.clientWidth
    }
    return parseInt(myWidth)
  }
  
  let screenWidth = window.screen.width > getWdith() ? getWdith() : window.screen.width
  
  if (screenWidth >= 768) {
    screenWidth = 768
  }
  document.documentElement.style.fontSize = screenWidth / (750 / 40) + 'px' // px2rem插件的转换基数也是40
}

/**
 * @description 获取当前域名环境
 * @return {API_ENV}
 */
export function getPreHost () {
  const ENV_LIST = ['LOCAL', 'TEST', 'UAT', 'PRE', 'PROD']
  const hostname = window.location.hostname
  const searchPreHost = hostname.match(/^[a-z]+(?=\.|-)/g) // 查找以 test uat pre .或- 开头的域名，并保存结果，找不到则为 null
  if (/^localhost|^127\.0\.0\.1|^192\.168\.|^10\.105\./.test(hostname)) {
    return 'LOCAL' // 本机开发模拟
  }
  if (!searchPreHost) {
    return 'PROD' // 生产
  }
  const hostENV = searchPreHost[0].toUpperCase()

  return ENV_LIST.includes(hostENV) ? hostENV : 'PROD'
}

export function copy (obj) {
	if (typeof obj !== 'object') {
		return obj
	}
	let target = Array.isArray(obj) ? [] : {}
	for (let key in obj) {
		if (obj.hasOwnProperty(key)) {
			if (obj[key] && typeof obj[key] === 'object') {
				target[key] = arguments.callee(obj[key])
			} else {
				target[key] = obj[key]
			}
		}
	}
	return target
}

// TODO haha
