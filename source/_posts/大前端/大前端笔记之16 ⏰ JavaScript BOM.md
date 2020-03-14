---
title: 大前端笔记之16 ⏰ JavaScript BOM
date: 2020-02-05 14:00:41
abbrlink: gjqbkyw3
tags: JavaScript
categories: 大前端
excerpt: BOM（Browser Object Model，浏览器对象模型）也是浏览器提供的一个 API。通过 BOM 可以控制浏览器视口以外的部分，比如浏览器的窗口和框架等等。
---

# 大前端笔记之16 ⏰ JavaScript BOM

BOM（Browser Object Model，浏览器对象模型）也是浏览器提供的一个 API。通过 BOM 可以控制浏览器视口以外的部分，比如浏览器的窗口和框架等等。

下面的大部分属性和方法均属于`window`对象，它指代当前的浏览器窗口，是当前页面中的顶层对象。调用它的属性和方法均可以省略`window`，比如可以写`alert()`而不是`window.alert()`。

## 弹框

下列原生的浏览器弹框样式无法修改，并且在对话框弹出期间，浏览器窗口处于冻结状态，用户无法进行其它操作，因此不推荐使用。

### alert()

弹出普通提示框。

| 参数 | 描述 |
| --- | --- |
| 字符串 | 对话框内容 |

```js
alert('烦人的对话框')
```

### prompt()

弹出输入对话框，用来获取用户输入。

| 参数 | 描述 |
| --- | --- |
| 字符串 | 对话框内容 |
| 字符串 | 可选，输入框的默认值 |

| 返回值 | 描述 |
| --- | --- |
| 字符串 / `null` | 用户输入的内容，如果用户点击取消则返回`null` |

```js
var result = prompt('请输出您的年龄', 38)
```

### confirm()

弹出判断对话框，用来获取用户输入。

| 参数 | 描述 |
| --- | --- |
| 字符串 | 对话框内容 |

| 返回值 | 描述 |
| --- | --- |
| 布尔值 | 用户点击确定返回`true`，否则返回`false` |

```js
var result = confirm('您确定要离开吗？')
```

## 定时器

定时器可以用来设置某段代码在特定时间之后 / 每隔特定时间执行。

### setTimeout() / setInterval()

创建定时器。区别在于前者是延迟一段时间执行，后者是每隔一段时间执行。

| 参数 | 描述 |
| --- | --- |
| 函数 | 要定时执行的函数 |
| 整数值 | 延迟时间 / 间隔时间，单位为毫秒 |
| 若干对象 | 执行函数的参数 |

| 返回值 | 描述 |
| --- | --- |
| 整数值 | 定时器的编号 |

```js
var id1 = setTimeout(function(){
    console.log('延迟一秒后输出！')
}, 1000)

var id2 = setInterval(function(){
    console.log('每隔一秒输出！')
}, 1000)

setTimeout(function(msg) { // 1 秒后输出 hello
    console.log(msg)
}, 1000, 'hello') 
```

### clearTimeout() / clearInterval()

清除定时器。

| 参数 | 描述 |
| --- | --- |
| 整数值 | 定时器的编号 |

```js
var id = setTimeout(function(){
    console.log('延迟一秒后输出！')
}, 1000)

clearTimeout(id)
```

## Location

使用`window.location`属性可以获取`Location`对象，它包含了与 URL 相关的属性和方法。

### 相关属性

下列属性都是**可读写**的，因此修改`href`属性的值会导致页面发生跳转。

```js
// 当前 URL 为：http://www.example.com:4097/path/a.html?x=111#part1

location.href      // 完整 URL："http://www.example.com:4097/path/a.html?x=111#part1"
location.protocol  // 协议："http:"
location.host      // 主机："www.example.com:4097"
location.hostname  // 主机名称："www.example.com"
location.port      // 端口号："4097"
location.pathname  // 路径："/path/a.html"
location.search    // 提交参数："?x=111"
location.hash      // 哈希值："#part1"
```

### replace() / assign()

| 参数 | 描述 |
| --- | --- |
| 字符串 | 要跳转的页面地址 |

使当前页面跳转到新的地址。它们的区别在于，`replace()`方法会删除历史记录中之前的地址，也就是说当页面跳转后，浏览器的后退按钮就无法使用了。而通过`assign()`和`href`跳转的页面依然可以后退。

```js
location.replace('http://www.example.com')

location.assign('http://www.example.com')
location.href = 'http://www.example.com'
```

### reload()

刷新当前页面，相当于浏览器的刷新按钮。

```js
location.reload()
```

## History

使用`window.history`属性可以获取`History`对象，它包含了与历史记录相关的属性和方法。注意，调用这些方法修改页面地址不会导致向服务器发送请求，因此它们也是[前端路由](/posts/ovrgsm0u.html#前端路由)的一种实现方式。

### back() / forward()

跳转到上一个 / 下一个浏览的页面，相当于浏览器的后退 / 前进按钮。如果不存在上一个或下一个页面，那么该方法无效。

```js
history.back()
history.forward()
```

### go()

以当前网址为基准，跳转到前 n 个 / 后 n 个页面。

| 参数 | 描述 |
| --- | --- |
| 整数值 | 负值表示后退，正值表示前进，`0`相当于刷新页面 |

```js
history.go(-1) // 相当于 back()
history.go(1) // 相当于 forward()
history.go(0) // 相当于 刷新页面
```

### pushState()

历史记录本质是一个栈结构，当前的 URL 就是栈顶的值。使用`pushState()`可以向栈中压入一条记录，使当前的 URL 发生改变。

```js
// 使 URL 由 http://localhost:8080/ 变成 http://localhost:8080/home，前两个参数固定为空即可，基本没有作用
history.pushState({}, '', 'home')
```

### replaceState()

与`pushState()`类似，但是它是直接替换栈顶的值，因此虽然当前的 URL 也会发生改变，但是前进后退按钮是不可用的，因为栈中并没有添加新的历史记录。

```js
// 使 URL 由 http://localhost:8080/home 变成 http://localhost:8080/about
history.replaceState({}, '', 'about')
```

## Navigator

使用`window.navigator`属性可以获取`Navigator`对象，它包含了与用户环境相关的属性和方法。

```js
navigator.userAgent // 浏览器的厂商和版本
navigator.platform // 用户的操作系统信息
```

下面的代码可以简单判断用户的设备：

```js
if((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
    /* 手机端 */
} else {
    /* PC 端 */
}
```

## 本地存储

### Cookie

使用`document`对象的`cookie`属性获取`Cookie`对象，包含了本域的所有 Cookie。它的值为字符串，多个 Cookie 以分号隔开，必须手动拆分才能获取每一个 Cookie 的值。

```js
var cookies = document.cookie // => 'foo=bar;baz=bar'

for (var i = 0; i < cookies.length; i++) {
    cookies[i]
}
// => foo=bar
// => baz=bar
```

> 由于原生操作的复杂性，可以使用第三方插件来操作 Cookie，比如 [JavaScript Cookie](https://github.com/js-cookie/js-cookie) 。

### Web Storage

Web Storage 是 HTML5 新增的本地存储 API，同样使用键值对来保存数据。相比于传统的 Cookie，它的存储空间更大，操作也更加方便。使用`window`对象的`sessionStorage`或`localStorage`属性可以获取相应的对象，它们的方法和属性都是相同的，区别在于前者存储的数据在浏览器关闭后就会清空，使用相对较少；后者存储的数据则会一直存在。

它们的主要方法如下：

| 方法 | 描述 |
| --- | --- |
| `setItem()` | 存储一条数据，它的两个参数为**字符串**（不然会类型转换）。对于一些复杂的数据格式，应该转换为 JSON 后再保存 |
| `getItem()` | 根据键获取对应数据 |
| `removeItem()` | 根据键删除对应数据 |
| `clear()` | 清除当前域下的所有数据 |

```js
sessionStorage.setItem('bgcolor', 'red')
localStorage.setItem('name', 'Saber')
localStorage.getItem('name') // => Saber
localStorage.removeItem('name')
localStorage.clear()
```

## Selection

使用`window`对象的`getSelection()`方法可以获取`Selection`对象，它包含了与用户选中文本相关的属性和方法。

### removeAllRanges()

禁止用户选择页面文本。

```js
getSelection().removeAllRanges()
```