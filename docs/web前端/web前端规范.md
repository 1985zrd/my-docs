# web前端规范

## 目录
- [开发规范](#开发规范)
   - [javascript编码规范](#javascript编码规范)
   - [代码检测ESLint](#代码检测)
   - [注释规范](#注释规范)
   - [目录规范](#目录规范)
   - [构建工具与包管理](#构建工具与包管理)
   - [CSS 样式编写](#样式)
   - [单元测试](#单元测试)
   - [命名规则](#命名规则)
   - [代码拆分](#代码拆分)

-  [git规范](#git规范)
   - [分支管理](#分支管理)
   - [commit规范](#规范commit)

- [编辑器规范](#编辑器规范)

## 开发规范

#### javascript编码规范
- `UTF-8`编码格式
- 推荐使用`ES6+`、`TypeScript`作为开发语言
- 不要声明多余不使用的变量
- 多用`let`和`const`，不用`var`
- 使用单引号'而不要使用双引号"
- 访问对象属性用`obj.name`，除非属性名不能通过点的方式来访问，如:`obj['a-b hello']`
- 少用递归，因为递归过多会引起内存堆栈异常
- `if`、`for`和`while`内不要再创建`function`
- 缩进推荐2空格，也可以4空格
- 使用全等于`===`和全部不等于`==!`
- 请使用`localStorage`或`sessionStorage`，放弃`Cookie`。因为`Cookie`在每次请求都会带上。
- 推荐使用fetch或者框架自带 http 库，放弃XMLHttpRequest
- 数组遍历使用for `(let i=0, len=arr.length; i<len; i += 1)`或者`arr.forEach()`，不要使用`for...in`，`i++`改成`i += 1`
- 对象遍历使用`Object.keys(obj)`
- `setInterval()`必须有变量保存 `ID`，用于`clearInterval()`，不可泛滥使用
- 异步编写可以多用`await`和`async`
- 不要使用`delete`关键字删除某个字段，如：`delete obj.name`，而是：`obj.name = null`
- `if`、`for`和`while`即使只有一行代码也必须添加`{}`花括号
- 从服务器端取数据必须有`catch`捕获错误，避免服务器端返回数据异常导致页面脚本报错
- 打包时，必须把所有`debugger`、`console`关键字都删除
- 尽量使用封闭或者单一入口变量，避免全局变量命名污染
- 不能使用`eval()`函数
- 使用`JSON.stringify()`必须用`try...catch`捕获异常
- `isPass = obj.age === 18 ? true : false` 可以写成 `isPass = obj.age === 18`
- 尽量避免过多的`dom`操作

#### 代码检测
> ESLint 是在 ECMAScript/JavaScript 代码中识别和报告模式匹配的工具，它的目标是保证代码的一致性和避免错误。

一个项目或多个项目使用同一个`.eslintrc`文件，后期更好维护。一般情况下，我们使用`standard`模式。

#### 注释规范
1. 单行注释，注释首尾留空格
错误示例：
```
//这是注释内容
```
正确示例：
```
// 这是注释内容，加空格
```
2. 多行注释
错误示例：
```
/*注释内容*/
或
/*
*xxxx  描述较多的时候可以使用多行注释
*xxxx
*/
```
正确示例：
```
/* 注释内容 */
或
/*
* xxxx  描述较多的时候可以使用多行注释
* xxxx
*/
```
3. 函数(方法)注释 参考jsdoc

注释名 | 语法 | 含义 | 示例
| -- | -- | -- | -- |
@parame | @parame 参数名 {参数类型} 描述信息 | 表示函数、类的方法的参数 | @parame name {String} 名称
@return | @return {返回类型} 返回值描述 | 描述返回值的信息 | @return {Number} 返回值描述
@example | @example 示例代码 | 演示函数的使用 | @example multiply(3, 2);
@author | @author 作者信息 [附属信息：如邮件、日期] | 描述作者信息 | @author 张三 2020/5/7
@version | @version XX.XX.XX | 版本号 | @version 1.2.10


#### 目录规范
以下列出了一个项目下必须的目录结构，实际可能会更多，但不能比以下列出的更少
```
├── README.md # 此项目的详细阐述
├── dist  # 打包后临时存放目录
├── docs  # 文档
├── node_modules # npm包目录, GIT不要提交这个目录
├── package.json # 项目必须的文件，整体性描述项目信息以及依赖
├── src # 源码目录
├── .gitignore # Git忽略提交配置文件
├── .eslintrc # eslint配置文件
├── .editorconfig # 编辑器统一配置文件 详细请看 http://editorconfig.org
├── tests # 自动化测试代码配置以及编码都放在这里
```

#### 构建工具与包管理
必须使用`npm`或`cnpm`或者`yarn`做为包管理工具，所有的依赖必须保存在`package.json`文件内。一个项目如果用`npm`又用`cnpm`，可能会出错。

`package.json`内必须定义几个固定的`scripts`
- build 打包项目，打包完的代码写到根目录dist文件夹内
- unit 运行单元测试
- lint 代码格式检测
- dev 启动开发

#### 样式
- 选择器尽量不要太长，`body #id p a {}`。
- 选择器尽量不要用`tab`标签，尽量给`tab`标上`class`类名。如：
```
<p class="msg"></p>
p {}
.msg {}
```
- 能用`class`，就不要用`id`
- 尽量少用`important`
- 少用`em`和`px`，多用`rem`
- 多用`flex`
- 不要直接引入第三方在线资源，如字体、图片。下载到本地。
- 如果可以，必须使用 `CSS` 预处理器

#### 单元测试
单元测试根据人员构成情况定，推荐使用jest（各端写法统一）。

要求所有单元测试都必须要输出单元测试代码覆盖率。覆盖率根据各项目要求，至少80%。

#### 命名规则
1. 文件、文件夹命名
   - 文件夹、文件的命名统一用小写，保证项目有良好的可移植性，可跨平台。[参考](http://www.ruanyifeng.com/blog/2017/02/filename-should-be-lowercase.html)
   - 如果多词，用连词线，如：`reset-font-size.js`
2. js变量
   - 命名方式：小驼峰
   - 命名规范：前缀名词
   - 命名建议：语义化
```
// 友好
let maxCount = 10; 
let tableTitle = 'LoginTable';

// 不友好
let setCount = 10;
let getTitle = 'LoginTable';
```
3. js常量
   - 命名方式：全部大写
   - 命名规范：使用大写字母和下划线来组合命名，下划线用以分割单词
   - 命名建议：语义化
```
const MAX_COUNT = 10;
const URL = 'http://www.foreverz.com';
```
4. 函数
   - 命名方式：小驼峰式命名法
   - 命名规范：前缀应当为动词
   - 命名建议：语义化

动词 | 含义 | 返回值
| -- | -- | -- |
can | 判断是否可执行某个动作 | 返回一个布尔值。true：可执行，false：不可执行
has | 判断是否含有某个值 | 返回一个布尔值。true：含有此值，false：不含有此值
is | 判断是否为某个值 | 返回一个布尔值。true：为某个值，false：不为某个值
get | 获取某个值 | 返回获取的值
set | 设置某个值 | 无返回、返回是否成功或返回链式对象
load | 加载某些数据 | 无返回或返回是否加载完成

5. 类、构造函数
   - 命名方式：大驼峰式命名法，首字母大写
   - 命名规范：前缀为名称
   - 命名建议：语义化
6. 私有变量、私有方法
   - 前缀加_，如：`_name = 'name'  _fn = () => {}`
7. class、id命名
   - class命名使用BEM其实是块（block）、元素（element）、修饰符（modifier）的缩写，利用不同的区块，功能以及样式来给元素命名。这三个部分使用__与--连接（这里用两个而不是一个是为了留下用于块的命名）。
   - id一般不参与样式，命名的话使用小驼峰，如果是给js调用钩子就需要设置为js_xxxx的方式
```
.block{}
.block__element{}
.block--modifier{}

block 代表了更高级别的抽象或组件
block__element 代表 block 的后代，用于形成一个完整的 block 的整体
block--modifier代表 block 的不同状态或不同版本
```

#### 代码拆分
文件拆分要合理，不要把所有场景的业务逻辑都写在一个`js`文件里，打包时我们会合并。怎么算合理拆分？多个相同处理的，可以封装成函数，函数尽量**功能单一**。

   - 如果一行代码过长，阅读的时候就需要拖动滚动条才能看全，是不是恨不能忍受？所以单行代码最好可以在一屏里显示全，如果过长就需换行。
   - 根据长期经验来看，单个方法最佳在30行以内，如果超过30行就过长了，需要将某一些长的逻辑块抽出来形成新的方法。
   - 组件的体积最好控制在200行以内，如果超出就需要将某些方法抽象成新的组件来减少组件的体积。

## git规范

#### 分支管理
长期存在分支：
   - `master` 稳定的版本
   - `develop` 开发分支

项目存在短期的分支，主要类型有写新功能，修复问题，预发布（也称测试）

项目开始master（主分支） => develop（开发） => feature（功能开发） => develop（开发完合并到develop） => release（测试） => master（上线） => fix（如果有bug，修复） => release（修复完了验证，或直接master）

因为release会有bug修复，上线前要合并到develop和master，在master上线

上线之后打tag，删除其他分支（除master和develop）

#### 规范commit
Commit 规范我们统一遵循使用 Angular 团队提议的[《AngularJS Git Commit Message Conventions》](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#heading=h.uyo6cb12dt6w)

格式如下：
```
<type>(<scope>): <subject> 必须填写
空一行
<body> 选填
空一行
<footer> 选填
```
- type 类型有如下，只能从一下列表选择
   - build：影响生成系统或外部依赖性的更改
   - ci: 更改 CI 配置文件和脚本
   - feat: 新功能（feature）
   - fix: 修补 bug
   - perf: 提高性能的代码更改
   - docs: 文档（documentation）
   - style: 不影响代码含义的更改（不影响代码运行的变动）
   - refactor: 代码修改既不修复错误，也不添加特征（即不是新增功能，也不是修改 bug 的代码变动）
   - test: 添加缺失测试或纠正现有测试
   - revert: 撤回
- scope 影响范围
- subject 是 commit 目的的简短描述，不超过 72 个字符
- body Body 部分是对本次 commit 的详细描述，可以分成多行
- footer 不兼容变动主要及一些额外说明
```
feat($browser): onUrlChange event (popstate/hashchange/polling)

Added new event to $browser:
- forward popstate event if available
- forward hashchange event if popstate not available
- do polling when neither popstate nor hashchange available

Breaks $browser.onHashChange, which was removed (use onUrlChange instead)
```

一般项目`<type>(<scope>): <subject>`就够了。如：`fix(XX页面): 修改了某个bug`

commit前一定要eslint校验。[husky](https://www.npmjs.com/package/husky)
```
npm install husky --save-dev

// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm lint"
    }
  }
}
```

## 编辑器规范
`根目录下的.editorconfig文件`
> 帮助开发人员在不同的编辑器和IDE之间定义和维护一致的编码样式

```
# 告诉EditorConfig插件，这是根文件，不用继续往上查找
root = true

# 匹配全部文件
[*]
# 结尾换行符，可选"lf"、"cr"、"crlf"
end_of_line = lf
# 在文件结尾插入新行
insert_final_newline = true
# 删除一行中的前后空格
trim_trailing_whitespace = true
# 匹配js和py结尾的文件
[*.{js,py}]
# 设置字符集
charset = utf-8

# 匹配py结尾的文件
[*.py]
# 缩进风格，可选"space"、"tab"
indent_style = space
# 缩进的空格数
indent_size = 4

# 以下匹配，类同
[Makefile]
indent_style = tab
# tab的宽度
tab_width = 4

# 以下匹配，类同
[lib/**.js]
indent_style = space
indent_size = 2

[{package.json,.travis.yml}]
indent_style = space
indent_size = 2
```
