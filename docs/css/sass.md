# sass

> 大多时候我们需要安装`sass-loader`、`node-sass`，而npm安装`node-sass`的的时候又总是失败

```js
npm i node-sass --sass_binary_site=https://npm.taobao.org/mirrors/node-sass/

或

npm config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/
```
也可以用**cnpm**安装

## 变量 $

> `sass`使用`$`符号来标识变量，因为`$`符在`CSS`中并无他用，不会导致与现存或未来的css语法冲突。

- 变量也是有**作用域**的。
- 变量中的中划线和下划线是一样的，`$link-color`和`$link_color`其实指向的是同一个变量。
- 变量默认值。如果在默认值之前有定义值，默认值无效（这个值一般通过@import导入，很实用）。

```scss
$nav-color: #000;

$nav-color: #F90 !default;
nav {
  $width: 100px;
  width: $width;
  color: $nav-color;
}

//编译后

nav {
  width: 100px;
  color: #000;
}
```

## 嵌套

- 父选择器的标识符`&`

```scss
#content {
  article {
    h1 { color: #333 }
    p { margin-bottom: 1.4em }
  }
  aside { background-color: #EEE }
}

/* 编译后 */
#content article h1 { color: #333 }
#content article p { margin-bottom: 1.4em }
#content aside { background-color: #EEE }
```

## 导入SASS文件 @import

> css有一个特别不常用的特性，即@import规则，它允许在一个css文件中导入其他css文件。然而，后果是只有执行到@import时，浏览器才会去下载其他css文件，这导致页面加载起来特别慢。

> sass的@import规则在生成css文件时就把相关文件导入进来。这意味着所有相关的样式被归纳到了同一个css文件中，而无需发起额外的下载请求。另外，所有在被导入文件中定义的变量和混合器（参见2.5节）均可在导入文件中使用。

- 默认变量值`default`。如果在默认值之前有导入这个变量的值，默认变量值则无效。

```scss
@import 'var' // 如果文件中有$fancybox-width的值，这下面的默认变量值无效。
$fancybox-width: 400px !default;
.fancybox {
  width: $fancybox-width;
}
```

- 嵌套导入

```scss
.blue-theme {@import "blue-theme"}

```

- sass中只能导入scss后缀的文件，不能导入css后缀的文件（可以把.css改成.scss后导入）。

## 混合器 mixin

> 当你需要重复使用一大段的代码，变量是没法满足的，你可以通过sass的混合器实现大段样式的重用

```scss
@mixin rounded-corners {
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px;
  border-radius: 5px;
}

notice {
  background-color: green;
  border: 2px solid #00aa00;
  @include rounded-corners;
}

//sass最终生成：
.notice {
  background-color: green;
  border: 2px solid #00aa00;
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px;
  border-radius: 5px;
}
```

- 也可以在混合器中设置参数

```scss
@mixin link-colors($normal, $hover, $visited) {
  color: $normal;
  &:hover { color: $hover; }
  &:visited { color: $visited; }
}
a {
  @include link-colors(blue, red, green);
}

//Sass最终生成的是：

a { color: blue; }
a:hover { color: red; }
a:visited { color: green; }
```

## 继承 $extend

```scss
//通过选择器继承继承样式
.error {
  border: 1px solid red;
  background-color: #fdd;
}
.seriousError {
  @extend .error;
  border-width: 3px;
}
```

## 遍历

- $for

```scss
@for $i from 1 through 3 {
  .item-#{$i} { width: 2em * $i; }
}
// 编译为
.item-1 {
  width: 2em; }
.item-2 {
  width: 4em; }
.item-3 {
  width: 6em; }
```

- $each

```scss
@each $animal in puma, sea-slug, egret, salamander {
  .#{$animal}-icon {
    background-image: url('/images/#{$animal}.png');
  }
}

// 编译为
.puma-icon {
  background-image: url('/images/puma.png'); }
.sea-slug-icon {
  background-image: url('/images/sea-slug.png'); }
.egret-icon {
  background-image: url('/images/egret.png'); }
.salamander-icon {
  background-image: url('/images/salamander.png'); }
```

- $while

```scss
$i: 6;
@while $i > 0 {
  .item-#{$i} { width: 2em * $i; }
  $i: $i - 2;
}
// 编译为
.item-6 {
  width: 12em; }
.item-4 {
  width: 8em; }
.item-2 {
  width: 4em; }
```

## 函数

```scss
$grid-width: 40px;
$gutter-width: 10px;

@function grid-width($n) {
  @return $n * $grid-width + ($n - 1) * $gutter-width;
}

#sidebar { width: grid-width(5); }

// 编译为
#sidebar {
  width: 240px; }
```

