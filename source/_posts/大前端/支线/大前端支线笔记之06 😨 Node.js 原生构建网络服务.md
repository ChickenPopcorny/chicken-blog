---
title: 大前端支线笔记之06 😨 Node.js 原生构建网络服务
date: 2020-01-24 0:04:24
abbrlink: tb618gp3
tags: Node.js
categories: 
- 大前端
- 支线
excerpt: 施工中
---

# 大前端支线笔记之06 😨 Node.js 原生构建网络服务


> 施工中，修改时间


### 创建服务器

下面的代码可以创建一个最简单的服务器：

```js
const http = require('http') // 引入模块
const app = http.createServer() // 创建服务器
app.listen(3000, function() { // 监听端口
    console.log('服务器启动成功，正在监听 3000 端口')
})
```

### 接收请求

当服务器接收的请求时会触发服务器对象的`request`事件，Node.js 也是通过`on()`方法监听事件，该方法定义在`Events`模块中。

```js
app.on('request', (req, res) => { // req 和 res 分别为请求对象与响应对象
  // 处理请求
})
```

请求行和请求头可以通过请求对象获取：

```js
app.on('request', (req, res) => {
    req.method  // 请求方式，值为 'GET' 或 'POST'
    req.url     // 请求 URL 的 path 部分，如 /index?id=233，使用 URL 模块可以提取出 GET 方式传递的参数
    req.headers // 请求头的信息，使用方括号传入键名可以获取对应的值
})
```

请求体（比如`POST`方式传递的参数）的获取比较麻烦，因为它是通过流的方式传递的。

当流接收到新的缓存`Buffer`时会触发`data`事件，但是这时的内容可能并不完全，当流接收到全部内容时，会触发`end`事件。因此最好是在`data`事件中将缓存数组拼接起来，然后在`end`事件中输出：

```js
app.on('request', (req, res) => {
    let reqBody = '' // 声明一个变量，表示请求体数据
    req.on('data', temp => reqBody += temp) // 拼接获取的缓冲
    req.on('end', () => reqBody) // 传输完毕后获取请求体
})
```

### 返回响应

当请求处理完毕后，应当给客户端返回响应，否则客户端会一直处于等待状态（浏览器转圈）。

不过在此之前，可以先通过`writeHead()`方法设置一下响应行和响应头。因为默认情况下，服务器响应的数据为 UTF-8 编码，但是如果没有在响应头中声明，或者在 HTML 文件中使用`<meta charset="UTF-8">`告知浏览器的话，那么浏览器会采用当前操作系统的编码即 GBK 来解析，会出现乱码问题。

> * 参数①：HTTP 状态码
> * 参数②：可选，响应头信息的键值对
> * 返回值：调用它的响应对象，可以链式编程

```js
app.on('request', (req, res) => {
    res.writeHead(200, { // 第一个参数为响应行的状态码，第二个参数为响应头的键值对
        'content-type': 'text/html;charset=utf8' // 设置响应头中的资源类型和编码
    })
})
```

最后，通过`end()`方法为客户端返回响应，同时设置响应体。

> * 参数①：字符串类型的响应体，如果是复杂数据不要忘记转换成 JSON

```js
app.on('request', (req, res) => {
    res.end('<h1>hello</h1>') // 响应内容
})
```

### 页面路由

然而此时无论用户访问任何地址，服务器都只能响应相同的内容。如果希望实现用户请求不同路径，返回对应内容，首先要根据请求对象的`url`解析出`pathname`部分（使用 url 模块），然后根据不同的`pathname`返回对应的内容。

下面的代码实现了简单的页面路由，可以看出，**用户请求的路径与实际返回的内容是完全没有关系的**，全凭服务器如何处理。

```js
const url = require('url')

app.on('request', (req, res) => {
    // req.url 是包含参数的，如 /index?id=233，使用 parse() 可以提取出 /index 部分
    let pathname = url.parse(req.url).pathname
    
     // 根据请求路径返回对应内容
    switch (pathname) {
        case '/':
        case '/index':
            res.end('欢迎来到主页')
            break
        case '/list':
            res.end('欢迎来到列表页')
            break
        default:
            res.end('您访问的页面不存在')
            break
    }
})
```




> *参考资料*
> - 《深入浅出 Node.js》