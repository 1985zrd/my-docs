
function char (s) {
    let target = ''
    for (let i = 0; i < s.length; i++) {
        let t1 = caleCenter(s, i, i)
        let t2 = caleCenter(s, i, i + 1)
        let t = t1.length > t2.length ? t1 : t2
        target = t.length > target.length ? t : target
    }
    return target
}
function caleCenter (s, left, right) {
    let L = left;
    let R = right;
    while (L >= 0 && R < s.length && s.charAt(L) === s.charAt(R)) {
        L--;
        R++;
    }
    L++
    R--
    return s.substring(L, R + 1)
}

// function char (s) {
//     let start = 0, end = 0
//     for (let i = 0; i < s.length; i++) {
//         let len1 = caleCenter(s, i, i)
//         let len2 = caleCenter(s, i, i + 1)
//         let len = Math.max(len1, len2)
//         if (len > end - start) {
//             start = Math.floor(i - (len -1) / 2)
//             end = Math.floor(i + len / 2)
//         }
//         // console.log(start, '===', end)
//     }
    
//     return s.substring(start, end + 1)
// }
// function caleCenter (s, left, right) {
//     let L = left;
//     let R = right;
//     while (L >= 0 && R < s.length && s.charAt(L) === s.charAt(R)) {
//         L--;
//         R++;
//     }
//     L++
//     R--
//     // L = L <= 0 ? 0 : L
//     //console.log(s.substring(L, R + 1))
//     return R - L - 1
// }

// console.log(char('aba'))
// console.log(char('abab'))
// console.log(char('bbbaa'))
// console.log(char('bbbaab'))

function myAtoi (s) {
    let reg = /^\s*([-+]?\d+)/g
    let match = s.match(reg)
    let target
    if (!match || !match.length) return 0;
    target = parseInt(match[0])
    let base = Math.pow(2, 31)
    if (target < -base) {
        return -base
    } else if (target > base -1) {
        return base -1
    }
    return target
}

function longestCommonPrefix (arr) {
    function getSame (arr1, arr2) {
        let t = ''
        let len = Math.min(arr1.length, arr2.length)
        for (let i = 0; i < len; i++) {
            if (arr1[i] === arr2[i]) {
                t += arr1[i]
            } else {
                break
            }
        }
        return t
    }
    let index = 1
    let target = arr[0]
    while (index < arr.length ) {
        target = getSame(target, arr[index])
        index++
    }
    return target
};

// longestCommonPrefix(["flower","flow","flight"]) // => fl
// longestCommonPrefix(["dog","racecar","car"]) // => ""
let input = [
    { "id": "17", "caption": "颜色", "types": ["黑", "棕"] },
    { "id": "23", "caption": "材质", "types": ["牛皮"] },
    { "id": "24", "caption": "尺码", "types": ["40", "41", "42"] }
]
// let output = [
//     { "17": "黑", "23": "牛皮", "24": "40" },
//     { "17": "黑", "23": "牛皮", "24": "41" },
//     { "17": "黑", "23": "牛皮", "24": "42" },
//     { "17": "棕", "23": "牛皮", "24": "40" },
//     { "17": "棕", "23": "牛皮", "24": "41" },
//     { "17": "棕", "23": "牛皮", "24": "42" }
// ]
function formatObj (arr) {
    let newArr = arr.map(item => {
        return item.types.map(type => {
            return {...item, types: [type]}
        })
    }).reduce((acc, val, index) => acc.concat(val), [])
    // let types = arr.map(item => {
    //     return item.types
    // }).reduce((acc, val) => acc.concat(val), [])
    // console.log(types)
    // function setObj (currentObj, targetObj) {
    //     for (let i = 0; i < currentObj.types.length; i++) {

    //     }
    // }

    let target = []
    let i = 0
    let obj = {}
    while (i < arr.length) {
        let j = 0
        let key = arr[i]['id']
        while (j < arr[i].types.length) {
            // let a = arr[1]['id']
            // let b = arr[2]['id']
            console.log(j)
            obj = {
                ...obj,
                [key]: arr[i]['types'][j]
            }
            target.push(obj)
            // target.push({
            //     [key]: arr[i]['types'][j],
            //     // [a]: arr[1]['types'][j%arr[1]['types'].length],
            //     // [b]: arr[2]['types'][j%arr[2]['types'].length]
            // })
            j++
        }
        i++
    }
    console.log(obj)
    // let len = arr.length
    // for (let i = 0; i < arr.length; i++) {
    //     for (let j = 0; j < arr[i].types.length; j++) {
    //         let key = arr[i]['id']
    //         let obj = {
    //             [key]: arr[i].types[i]
    //         }
    //     }
    // }

    return target
}
console.log(formatObj(input))