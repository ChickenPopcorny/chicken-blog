---
title: 大前端支线笔记之07 ⚽️ AJAX
date: 2020-02-17 12:00:26
abbrlink: ljghe0it
tags: JavaScript
categories: 
- 大前端
- 支线
excerpt: AJAX（Asynchronous Javascript And XML）指的是异步加载 JavaScript 和 XML，也就是使浏览器异步地向服务器发送请求，以获得新的数据，再通过操作 DOM 实现在不刷新页面的情况下展示新的内容。
---

# 大前端支线笔记之07 ⚽️ AJAX

在传统的 Web 应用中，当用户提交表单时，需要向服务端发送一个请求，服务端处理完收到的表单后，再将一个新的网页响应回来。但是这样的做法有些缺点：首先，填写表单的页面和返回的页面大部分内容都是相同的，浪费了传输的带宽；其次，对于用户来说，提交表单之后需要等待页面重新加载，体验并不友好。

为了解决这些问题，有人提出了 AJAX 这一概念。AJAX（Asynchronous Javascript And XML）指的是异步加载 JavaScript 和 XML，也就是使浏览器异步地向服务器发送请求，以获得新的数据，再通过操作 DOM 实现在不刷新页面的情况下展示新的内容。

这一技术目前已被 JavaScript 正式引入，它通常应用在如页面滚动加载数据、局部更新、实时验证用户表单、搜索框信息提示等多种场景。

> AJAX 名称中之所以包含 XML 是因为早期的互联网信息传输中主要以 XML 为内容格式，但是目前 XML 基本已被 JSON 取代。按道理说，这个名称现在也可以改为 AJAJ，但是由于已经大家习惯了 AJAX，因此它暂时还是被保留了下来。

## 原生 AJAX

JavaScript 通过`XMLHttpRequest`对象提供对 Ajax 的支持，因此需要先实例化该对象。

```js
var xhr = new XMLHttpRequest()
```

然后使用该对象的`open()`方法可以初始化一个请求，建立与服务端的连接。

| 参数 | 描述 |
| --- | --- |
| 字符串 | 请求方式 |
| 字符串 | 请求 URL |

```js
xhr.open('GET', 'http://localhost/test')
```

接下来，使用该对象的`send()`方法发送请求。

```js
xhr.send()
```

如果要传递`GET`请求参数，将其拼接到 URL 一并发送即可。

如果要传递`POST`请求参数，需要先了解请求体的几种类型，通过表单提交数据时，该类型通过`enctype`属性设置，否则的话，需要手动设置请求头中的`Content-Type`属性：

* `application/x-www-form-urlencoded`：表单`POST`提交方式的默认类型，如`name=lucy&age=18`
* `multipart/form-data`：二进制类型，上传文件时经常使用
* `application/json`：JSON 格式数据，不支持表单提交，如`{"name": "lucy", "age": 18}`

然后通过`setRequestHeader()`设置请求体类型：

```js
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
```

最后将数据放到`send()`方法中即可：

```js
xhr.send('name=lucy&age=18')
```

## 接收响应

由于 Ajax 请求是异步操作，因此当请求发送成功后会触发`load`事件，此时通过请求对象的`responseText`属性可以获取服务器响应的结果。

```js
xhr.addEventListener('load', function() {
    this.responseText // => ok
})
```

### 低版本浏览器

低版本浏览器并不支持`load`事件，因此需要通过监听 Ajax 的状态来实现接收响应。当 Ajax 的状态发生变化时，会触发`onreadystatechange`事件，而当前的状态通过`readyState`属性来保存，它共有 5 个数字值，分别为：

* `0`：`open()`方法还未被调用
* `1`：`open()`方法已经被调用
* `2`：`send()`方法已经被调用，并且获取了响应头的信息
* `3`：`responseText`已经获取了部分响应体的数据
* `4`：整个请求过程完毕

也就是说，当`readyState`属性为`4`时，才可以通过`responseText`属性获取响应体的数据和其它响应报文信息。

```js
xhr.addEventListener('readystatechange', function() {
    if (this.readyState == 4) {
        this.responseText // 获取响应体的数据
        this.status // => 200，HTTP 状态码
        this.statusText // => OK，HTTP 状态信息
    }
})
```

## FormData

通过`FormData`对象可以模拟一个表单，并通过 Ajax 将其提交到服务器。首先通过表单元素实例化一个`FormData`对象，使用 Ajax 将`FormData`对象发送到服务器。

```html
<form id="myform">
    <input type="text" id="username" name="username" value="hello">
    <input type="text" id="age" name="age" value="18">
    <button type="button" id="submit">提交</button>
</form>
```

```js
$('#submit').click(function () {
    var formData = new FormData($('#myform')[0])

    var xhr = new XMLHttpRequest()
    xhr.open('POST', 'http://localhost/')
    xhr.send(formData)
})
```

### 相关方法

此外，它还包括下列的常用方法。

| 方法名     | 描述                                                         |
| ---------- | ------------------------------------------------------------ |
| `get()`    | 获取表单属性的值                                             |
| `set()`    | 设置表单属性的值，如果存在同名属性，则覆盖该属性值；如果不存在则会自动创建 |
| `delete()` | 删除表单属性                                                 |
| `append()` | 添加表单属性                                                 |

```js
formData.get('age') // => 18
formData.set('age', 19) // => { username: 'hello', age: '19' }
formData.delete('age') // => { username: 'hello' }
formData.append('sex', 'male') // => { username: 'hello', age: '19', sex: 'male' }
```

## 同源策略

同源策略是浏览器的一种安全策略，所谓同源指的是两个地址之间的**域名**、**协议**和**端口号**完全相同，只要有其中一项不同，那么这两个地址就是不同源的。只有同源的地址之间才能互相发送 Ajax 请求，不同源之间的相互请求被称为**跨域**。

在下面的请求中，从`http://localhost`向`http://test.io`发送请求，浏览器会出现报错信息。

```js
xhr.open('GET', 'http://test.io')
xhr.send()
```

![](https://ae01.alicdn.com/kf/H6c61e102852f4ae69db13ab91bba9ee2n.jpg)

### 跨域资源共享（☢️IE10）

从上面的报错信息中可以看到，请求被 CORS 策略阻止了，它指的是跨域资源共享（Cross-origin resource sharing）。而后面提示中指出，在响应头信息中没有找到`Access-Control-Allow-Origin`字段，也就是说，如果服务端希望接收来自其它域的 Ajax 请求，只需要添加一条响应头信息即可：

```js
// 通过中间件拦截所有请求
app.use((req, res) => {
    // * 表示对任何请求地址均采用 CORS，如果指定了域名，那么只有来自该域名的请求能正确接收
    res.header('Access-Control-Allow-Origin', '*')
    next()
})
```

> 在跨域资源共享出现之前，是通过 JSONP 来实现这一功能的，但是由于代码比较复杂，不再赘述，直接使用 jQuery 中的 JSONP 即可。
>
> 此外，由于服务端没有同源策略限制，可以先由客户端请求同源的服务器，由服务器再发送跨域请求，获取到数据后再返回给客户端。

### 跨域携带 Cookie

默认情况下，跨域请求是不会携带客户端 Cookie 的。要修改这一点，需要客户端和服务端同时进行设置。

```js
// 客户端
xhr.open('GET', 'http://test.io')
xhr.withCredentials = true // 设置跨域时携带 Cookie
xhr.send()
```

```js
// 服务端
res.header('Access-Control-Allow-Credentials', true) // 响应头也要同时设置
```

## $.ajax()

发送 Ajax 请求。它的参数为一个对象，其中包含若干配置属性：

```js
$.ajax({
    url: '/add', // 请求地址
    type: 'post', // 请求类型
    data: { name: '离散懵逼', age: 38 }, // 传递给服务器的参数，会被自动转换成 urlencode 格式
    // 设置为 dataType: 'jsonp' 表示发送 JSONP 请求
    dataType: 'json', // 要求响应体的数据必须为 JSON 格式，默认为根据响应头的 content-type 自动识别
    
    beforeSend: function() { // 请求发送前的回调函数，可以用来验证数据或者显示 Loading 动画
        return false // 如果返回 false 则取消发送当前请求
    },
    // 根据状态码（是否为 200）判断请求状态
    success: function (res) {}, // res 为服务端返回的响应体内容，会根据 dataType 自动完成转换
    error: function (xhr) {}, // xhr 为原生的 XMLHttpRequest 对象
})
```

## serialize()

将表单控件中的值转换成 URLencoded 格式的字符串。

```js
$('form').serialize() // => name=Lucy&age=18
```

如果要直接转换成对象，可以使用 jQuery 的第三方插件[serializeJSON](https://github.com/marioizquierdo/jquery.serializeJSON )。

## &dollar;.get() / &dollar;.post()

快速发送 GET / POST 请求。

```js
$.get('/add', { age: 18 }, function(res) {})
```

## &dollar;.ajaxStart() / &dollar;.ajaxComplete()

统一设置 Ajax 请求发送之前 / 之后的回调函数，该事件只能绑定到`document`对象上。

```js
$(document).ajaxStart(function () {
    // 请求即将发送
})
```

## load()

在 Ajax 请求成功并获取返回数据后，自动调用`html()`将数据插入到匹配的元素中。

```js
$('div').load('backend/test.php', { key: 'value'}, function(res) {});
```

如果请求返回的是一个页面，还可以在 URL 参数后面添加一个空格，然后追加选择器，来获取更加具体的内容。

```js
$('#div-elem').load('test.php #banner');
```
