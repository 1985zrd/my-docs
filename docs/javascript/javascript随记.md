# javascript随记

## 模拟 new 运算符

1. 创建一个新对象
2. 新对象原型指向构造函数的原型对象
3. 调用构造函数，将this指向新对象
4. 如果构造函数有返回且是对象（Object），则返回构造函数的返回值，否则返回新对象

```
function Person () {
  this.name = 1234
  // return {}
}
Person.prototype.getname = function() {
  console.log(this.name)
}

function CreateObj () {
  let fn = [].shift.call(arguments)
  let args = arguments
  let obj = new Object()
  let ret = fn.apply(obj, args)
  // obj.__proto__ = fn.prototype
  Object.setPrototypeOf(obj, fn.prototype)
  return typeof ret === 'object' ? ret : obj
}

let a = CreateObj(Person)
console.log(a)
```

## 深拷贝

## 手写reduce

## 节流防抖函数

## Redux源码（重要）

## Node.js EventLoop

## less循环
```
.loop(@n, @i: 1) when (@i < @n) {
    .tree-child-@{i} > ul {
      position: relative;
    }
    .tree-child-@{i} > ul::before {
      position: absolute;
      top: 0;
      left: 34px;
      width: 1px!important;
      height: (@i - 1)*32px+36px-14px; // 14是32的一半-2
      // margin: 22px 0;
      border-left: 1px dashed #AEAEAE;
      content: ' ';
    }
    .tree-child-@{i}:not(:last-child) > ul::after {
      position: absolute;
      top: -2px;
      left: 12px;
      z-index: 99;
      width: 1px!important;
      height: (@i - 1)*32px+40px; // 14是32的一半-2
      // margin: 22px 0;
      border-left: 1px dashed #AEAEAE;
      content: ' ';
    }
    .loop(@n, (@i + 1));
}
.loop(100);
```

## sass循环
```
@for $i from 0 through 24 {
  .el-col-#{$i} {
    width: (1 / 24 * $i * 100) * 1%;
  }

  .el-col-offset-#{$i} {
    margin-left: (1 / 24 * $i * 100) * 1%;
  }

  .el-col-pull-#{$i} {
    position: relative;
    right: (1 / 24 * $i * 100) * 1%;
  }

  .el-col-push-#{$i} {
    position: relative;
    left: (1 / 24 * $i * 100) * 1%;
  }
}
```

## 本地起的服务，局域网其他同事打不开页面
控制面板 => 防火墙 => 启用和关闭防火墙  关闭防火墙
