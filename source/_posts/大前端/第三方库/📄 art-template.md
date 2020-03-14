---
title: 📄 art-template
date: 2020-01-10 22:32:43
abbrlink: 3q4y7l2d
tags: 模板引擎
categories: 
- 大前端
- 第三方库
excerpt: 施工中...
---

# 📄 art-template

施工中，修改时间


[art-template](http://aui.github.io/art-template/zh-cn/docs/)是一款国内开发的模板引擎，由于有中文文档，并且语法简单容易上手，非常适合初学者使用。

```powershell
npm install art-template
```

```js
const template = require('art-template')
```

### 拼接模板和数据

首先通过`template()`方法将模板和数据拼接起来。

> * 参数①：模板的路径
>* 参数②：要拼接的数据，必须是对象
> * 返回值：拼接后的 HTML 代码

```js
resPage = template('/list.html', { name: '御坂美琴', age: 16 }) // => 我是御坂美琴，今年16岁啦！
```

接下来，在模板中使用特定的语法即可使用传入的数据。

```ejs
我是 {{ name }}，今年 {{ age }} 岁啦！
```

## 基本语法

### 输出

使用下面的方式可以直接取出对象或数组中的值进行输出，并且支持简单的表达式运算。注意，模板引擎会自动将 HTML 标记进行转义处理，不会进行解析。

```js
template(tplPath, { 
    name: '御坂美琴', 
    age: 16, 
    hobbies: ['打人', '放电'], 
    friend: { name: '白井黑子' } 
})
```

```
{{ name }} // => 御坂美琴
{{ hobbies[0] }} // => 打人，通常用下面的循环来遍历数组
{{ friend.name }} // => 白井黑子
{{ age > 18 ? '已成年' : '未成年' }} // => 未成年，注意其中显示的值要用单引号包裹
```

### 条件

根据数据可以判断某些 HTML 是否出现。

```
{{if age > 18}} 我要上网吧！{{/if}}

{{if price < 10}}
    这个好便宜
{{else if price < 20}}
    还可以
{{else}}
    太贵了！
{{/if}}
```

### 循环

通过循环可以遍历数组和对象。在循环中使用`$value`和`$index`可以获取当前元素的值和索引。

```
{{ each hobbies }}
	当前为 {{ $index }} 号元素，值为{{ $value }}
{{ /each }}
```

如果只需要遍历指定的次数（比如循环输出分页按钮），那么只能使用原始语法：

```ejs
<% for(var i = 0; i < totalPage; i++){ %>
    <li class="page-item"><a class="page-link" href="/admin/user/?page={{ i }}"> {{ i }} </a></li>
<% } %>
```

### 子模板

通过子模板可以将页面公共的部分抽离出来，方便统一维护。注意这里的路径使用相对路径即可，它相对的是当前模板，而不是调用它的 JavaScript 文件。

```
{{ include './list.art' }} 
```

### 模板继承

通过模板继承可以使多个页面模板继承共同的一个 HTML 骨架，对于每个页面独有的内容，可以在骨架页面中预留位置，子模板只需要设置预留位置的内容即可。

下面的骨架模板中通过双标记`{{block}}`预留了两个位置，为了区分它们，可以在其中自定义一个名称。

```
// 骨架模板 layout.art
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    {{block 'title'}} {{/block}}
</head>
<body>
    {{block 'content'}} {{/block}}
</body>
</html>
```

接下来，在子模板中使用`extend`引入骨架，并设置预留内容。

```
{{extend './layout.art'}}

{{block 'title'}}
    <title>首页</title>
{{/block}}

{{block 'content'}}
    <p>这里是首页啦</p>
{{/block}}
```

## 配置选项

配置选项通过`template.defaults`对象设置。

### extname

模板默认的后缀名是`.art`，如果传入路径参数时省略了后缀名，那么模板引擎会自动补充。

```js
template.defaults.extname = '.html'
```

### root

模板通常会放到统一的文件夹中，使用该属性可以修改模板的根目录。

```js
template.defaults.root = path.join(__dirname, 'views')
// 引入模板时，可以省略拼接路径和后缀了
template('index', data)
```

## 浏览器环境

前台的模板语法不能直接写在页面上，因为其中的语法部分会被浏览器当做普通文本呈现出来。为了避免这个问题，可以将模板放入`<script>`标签中，它的内容默认会被浏览器隐藏，而且只要将其设置为`type="text/html"`就能将其中的 HTML 元素正常着色。

```html
<script id="tpl-users" type="text/html"></script>
```

然后，依然使用模板引擎的`template()`方法，将模板与数据联系起来。

> * 参数①：模板元素的`id`
>* 参数②：要拼接的数据，必须是对象
> * 返回值：拼接后的 HTML 代码

```js
let html = template('tpl-users', { name: '御坂美琴', age: 16 })
```

接下来，通过模板引擎的语法在模板中解析数据：

```html
<script id="tpl-users" type="text/html">
    我是{{ name }}，今年{{ age }}岁啦！
</script>
```

最后，将`template()`方法返回的拼接字符串追加到页面元素中即可。

```js
$('.msg').html(html)
```