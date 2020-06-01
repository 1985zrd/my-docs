# markdown常用语法

## 一、标题
```
#      一级标题
##     二级级标题
###    二级级标题
####   二级级标题
#####  二级级标题
###### 二级级标题
```
#      一级标题
##     二级级标题
###    二级级标题
####   二级级标题
#####  二级级标题
###### 二级级标题

## 二、字体

1、**加粗**  `**加粗**`

2、*斜体* `*斜体*`

3、***斜体加粗*** `***斜体加粗***`

4、~~删除线~~ `~~删除线~~ `

## 三、引用

> 这是个引用 `> 这是个引用`

>> 可以多个 `>> 可以多`

## 四、分割线

---
```
---或跟多 -----------
```

### 五、图片
![图片加载失败显示](https://www.baidu.com/img/pc_2e4ef5c71eaa9e3a3ed7fa3a388ec733.png)
```
![图片加载失败显示，img alt](图片地址)
```

## 六、超链接
[baidu](https://www.baidu.com/ "title")

<a href="https://www.baidu.com/">baidu</a>

```
[baidu](https://www.baidu.com/ "title")

<a href="https://www.baidu.com/">baidu</a>
```

## 七、列表

1、无序列表

- a
- b
* c
+ d

2、有序列表
1. a
2. b
3. c

3、列表嵌套
1. a
   1. b
   2. c
```
1、无序列表 减号、加好、星号都可以，加空格
- a
- b
* c
+ d

2、有序列表 数字+点+空格
1. a
2. b
3. c

3、列表嵌套 下一级+3个空格
1. a
   1. b
   2. c
```

## 八、表格

表头 | 表头 | 表头
 - | - | -
内容 | 内容 | 内容
内容 | 内容 | 内容
```
表头 | 表头 | 表头
 - | - | -
内容 | 内容 | 内容
内容 | 内容 | 内容
-（表格内容居左），:-（居左），-：（居右），:-：（居中）
```

## 九、代码
```
let a = 1;
```
```
//```
//这是代码
//```
// `这是单行代码`
多行用三个反引号，单行用一个
```

## 十、流程图
> 很多markdown插件不能写流程图

``` flow
st => start: 开始
op => operation: my operation
cond => condition: yes or no?
e => end

st -> op -> cond
cond(yes) -> e
cond(no) -> op
```
```
// ``` flow
st => start: 开始
op => perration: my operation
cond => condition: yes or no?
e => end

st -> op -> cond
cond(yes) -> e
cond(no) -> op
// ```
```

## 字体

<font face="黑体" size=10 color=red>我是黑体字</font>
```
<font face="黑体" size=10 color=red>我是黑体字</font>
```

## 居中

```
<h1 align="center">balabala~</h1>
// 有些地方是用center标签
<center>
    <h1>balabala~</h1>
<center>
// 在有道云笔记，center标签会影响后面的内容居中
```
<center>
    <h1 align="center">balabala~</h1>
<center>
