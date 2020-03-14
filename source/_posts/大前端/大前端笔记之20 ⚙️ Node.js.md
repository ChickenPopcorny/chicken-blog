---
title: 大前端笔记之20 ⚙️ Node.js
date: 2020-02-09 13:57:38
abbrlink: o48l9v2o
tags: Node.js
categories: 大前端
excerpt: Node.js 是一个类似于 Chrome V8 引擎的 JavaScript 运行环境，它使得 JavaScript 可以工作在服务器端，实现操作文件、构建网络服务等功能。
---

# 大前端笔记之20 ⚙️ Node.js

Node.js 是一个类似于 Chrome V8 引擎的 JavaScript 运行环境，它使得 JavaScript 可以工作在服务器端，实现操作文件、构建网络服务等功能。

## 安装与配置

首先在[官网](https://nodejs.org/en/download/)选择对应的版本下载安装。然后打开 CMD 输入`node -v`命令，如果安装成功，则会显示当前 Node.js 的版本号。

> Node.js 安装版会自动配置环境变量，如果没有，则需要自行配置。

新建一个 JavaScript 文件（如`app.js`），在其中写入 JavaScript 代码。保存后，在 CMD 输入`node app.js`，即可执行该文件。可见，虽然现在的宿主环境由之前的浏览器变成了 Node.js，但是 ECMAScript 的基本语法与之前是完全一样的，只不过缺少了 DOM 和 BOM 等浏览器提供的接口，取而代之的是 Node.js 提供的服务器相关接口。

## 模块化

虽然 [ES6](/posts/j5h1kgw7.html#模块化) 已经提出了模块化相关的功能，但是 Node.js 在创建早期就已经实现了自己特有的模块化方式 CommonJS，并且由于历史原因，即使是最新版本（v12.14.1）的 Node.js 也无法原生支持 ES6 模块化的语法，必须通过 Babel 转换后才可以使用，因此这里依然需要使用 CommonJS。

与 ES6 模块化一样，每个单独的 JavaScript 文件被称为一个模块。

### 导入模块

首先，使用`require()`方法可以导入一个模块并**自动执行其中的代码**。

| 参数 | 描述 |
| --- | --- |
| 字符串 | 模块路径或名称 |

| 返回值 | 描述 |
| --- | --- |
| 对象 | `module.exports`对象，用于接收模块导出的变量，见下文 |

根据传入的参数不同，查找模块的方式也略有不同。

如果传入的是一个路径，则：

- 如果是完整路径，则直接查找该文件
- 如果省略了后缀名，那么会先查找同名的`.js`文件，再查找同名文件夹
- 如果找到了文件夹，则找其中的`index.js`文件
- 如果没有找到，则找其中的`package.json`文件，寻找`main`属性配置的入口文件
- 如果没有找到配置文件或入口文件，则报错

如果传入的是一个名称，那么引擎会认为这是一个系统模块或第三方模块，并在当前的`node_modules`文件夹中先查找同名文件，再查找同名文件夹，之后的步骤与上面一样。

因此，如果要加载的是当前路径下的模块，必须要传入`./`表示当前路径，否则会被识别成模块名。

```js
// hello.js
require('./includes.js') // 加载自定义模块
```

### 导出属性和方法

模块之间通过`module.exports`对象进行信息传递，它默认是一个空对象`{}`，可以为其添加属性和方法，如果只有一个要导出的值，也可以直接将其覆盖。

```js
// includes.js
const msg = '这是要传递的信息啦'

module.exports = msg // 覆盖了 module.exports 对象
module.exports.msg = msg // 或者将变量添加到 module.exports 对象中
```

通过`require()`方法的返回值可以获取`module.exports`对象，从而调用其中的属性或方法：

```js
// hello.js
var includes = require('./includes') // 引入模块

// 如果是直接导出的，那么该对象就是导出的值
includes // => '这是要传递的信息啦'

// 如果属性和方法在对象中，那么也要先取出才能访问
includes // => { msg: '这是要传递的信息啦' }
includes.msg // => '这是要传递的信息啦'
```

## 系统模块

Node.js 将很多系统功能也封装成了单独的模块，需要时再加载即可。

### 全局属性和方法

与浏览器环境不同，Node.js 中的全局对象不再是`window`，而是`global`。它也包含类似于定时器的全局方法，注意不要与`window`混淆。

#### __dirname

当前模块的物理路径。注意它有单独的实现方式，并不是位于`global`中，但是可以在全局任意位置直接调用。

```js
// 当前文件路径为 D:\htdocs\test.js
__dirname // => D:\htdocs
```

### Path

`Path`模块提供了与路径相关的功能。

```js
const path = require('path')
```

#### join()

拼接路径。将需要拼接的部分作为参数传入，它会自动忽略掉每个部分两端的路径分隔符，并使用**当前系统环境的分隔符**将其拼接起来。

| 参数 | 描述 |
| --- | --- |
| 字符串若干 | 要拼接的文件夹、文件名或路径 |

| 返回值 | 描述 |
| --- | --- |
| 字符串 | 拼接后的路径 |

```js
path.join(__dirname, 'dist', 'index.html') // => D:\htdocs\dist\index.html
```

#### resolve()

将若干路径片段拼接成绝对路径。

| 参数 | 描述 |
| --- | --- |
| 字符串若干 | 要拼接的路径片段 |

| 返回值 | 描述 |
| --- | --- |
| 字符串 | 拼接后的绝对路径 |

给出的路径参数会从右向左解析并拼接，一旦发现了绝对路径（开头为`/`），则停止解析。

```js
path.resolve('foo', '/src', 'dist') // => D:\src\dist
```

如果没有发现绝对路径，那么以当前工作目录（命令行的执行位置）作为绝对路径拼接。

```js
// 当前命令行指向 D:\WorkSpace\test
path.resolve('dist') // => D:\WorkSpace\test\dist
```

### URL

`URL`模块提供了与 URL 相关的功能。

```js
const url = require('url')
```

#### parse()

解析一个 URL。

| 参数 | 描述 |
| --- | --- |
| 字符串 | 要解析的 URL |
| 布尔值 | 默认为`false`，表示以字符串获取`query`部分。如果为`true`则以对象方式获取 |

| 返回值 | 描述 |
| --- | --- |
| 对象 | 解析后的对象 |

```js
let myURL = url.parse('https://user:pass@sub.example.com:8080/p/a/t/h?id=233#hash')
let port = myURL.port // => 8080
// { protocol: 'https:',
//   slashes: true,
//   auth: 'user:pass',
//   host: 'sub.example.com:8080',
//   port: '8080',
//   hostname: 'sub.example.com',
//   hash: '#hash',
//   search: '?id=233',
//   query: 'id=233',
//   pathname: '/p/a/t/h',
//   path: '/p/a/t/h?id=233',
//   href: 'https://user:pass@sub.example.com:8080/p/a/t/h?id=233#hash' }

let myURL = url.parse('https://sub.example.com:8080?id=233', true)
myURL.query // => {id: 233}
```

### File System

`fs`模块提供了与文件操作相关的功能。

```js
const fs = require('fs')
```

#### readFile()

读取文件的内容。

| 参数 | 描述 |
| --- | --- |
| 字符串 | 文件路径 |
| 字符串 | 可选，文件的编码类型，默认为当前系统的编码，可以设置为`utf8` |
| 函数 | 回调函数，该函数包含两个参数，第一个参数表示错误对象，如果没有错误则为`null`，第二个参数表示读取的文件内容，如果发生错误则为`null` |

| 返回值 | 描述 |
| --- | --- |
| 对象 | 解析后的对象 |

```js
fs.readFile('./test.txt', 'utf8', function(err, content) {
    if (err) {
        console.log(err) // 如果出现错误，则输出错误信息
    } else {
        console.log(content) // 否则输出文件内容
    }
})
```

#### writeFile()

向文件写入内容。

| 参数 | 描述 |
| --- | --- |
| 字符串 | 文件路径，如果文件不存在则自动创建 |
| 字符串 | 要写入的文件内容 |
| 函数 | 回调函数，该函数包含一个参数表示错误对象，如果没有错误则为`null` |

| 返回值 | 描述 |
| --- | --- |
| 对象 | 解析后的对象 |

```js
fs.writeFile('./test.txt', '这里是文件内容啦', function(err) {
    if (err) {
        console.log(err) // 如果出现错误，则输出错误信息
    } else {
        console.log('文件写入成功！')
    }
})
```


### Util

`util`模块提供了各种常用的功能。

```js
const util = require('util')
```

#### promisify()

将 Node.js 中原本的异步任务改造成返回`Promise`对象的函数。

| 参数 | 描述 |
| --- | --- |
| 函数 | 普通的异步函数 |

| 返回值 | 描述 |
| --- | --- |
| 函数 | 包装后的新函数，返回`Promise`对象 |

```js
const readFile = require('util').promisify(fs.readFile) // 包装后的异步任务
readFile().then() // 调用后返回 Promise 对象
```

## npm

Node.js 也有很多其它开发者提供的第三方功能，由于这些功能通常由多个模块组成，因此将它们统称为包。Node.js 内置了一个称为 [npm](https://www.npmjs.com/)（Node Package Manager）的包管理工具，使用它输入命令后可以在公共平台上自动下载安装这些第三方包。

使用`npm install`命令（可以简写为`i`）可以在**命令行的当前路径**安装对应的包。如果在后面添加`-g`参数，则表示全局安装，也就是在任何项目下都可以使用该包。

```powershell
npm install 包名称
npm i 包名称
npm i 包名称 -g
```

在当前项目安装的包，会保存到项目根目录下的`node_modules`文件夹下，在下载包时该文件夹会自动生成，无需手动创建。

模块分为**项目依赖**和**开发依赖**。项目依赖表示开发和实际环境都需要使用的模块（比如 jQuery），这也是上述默认的安装方式；而开发依赖仅需要在开发时使用，与实际运行无关（比如之后的 Gulp 等自动化构建工具），需要在安装命令后添加`--save-dev`参数。

```powershell
npm i 包名称 --save-dev
```

使用`npm uninstall`命令可以卸载已经安装的包。

```powershell
npm uninstall 包名称
```

### 配置文件

但是如果需要将项目拷贝给其它人时，单凭这一个文件夹很难判断出项目依赖的模块和对应的版本，并且由于包文件很多，也会影响拷贝的速度。

因此，使用`npm init`命令可以生成一个配置文件`package.json`，它保存了项目的版本号、依赖模块等信息。

```powershell
npm init        # 按回车表示使用默认值
npm init -y     # 全部使用默认值
```

项目运行时依赖的模块会保存在配置文件的`dependencies`属性中，而开发依赖的模块保存到`devDependencies`属性中。当模块下载或更新后，这些属性自动也会同步更新。

要拷贝项目时，只需要将源代码和该文件复制到新的工作路径，然后使用`npm install`命令就会自动根据配置文件下载对应的模块。

```powershell
npm install
npm i               # 简写形式
npm i --production  # 实际部署项目时使用，只下载项目依赖模块，不下载开发依赖模块
```

### 常用的全局包

下面安装几个常用的全局包。它们均是方便开发的命令行工具，因此使用全局安装。

#### nodemon

nodemon 可以监控文件保存状态，并自动重新运行文件。

```powershell
npm i nodemon -g
```

安装成功后，不需要使用`node`，而是使用`nodemon`执行当前目录下的文件，可以看到命令行窗口多出了一些`[nodemon]`开头的信息，而且当执行完毕后，并没有将控制台释放给系统，依然是等待的状态。如果修改了文件，可以看到控制台中自动输出了更改后的信息。

如果要断开链接，可以连续按下两次<kbd>CTRL + C</kbd>。

#### nrm

nrm 可以切换默认的下载节点。由于 npm 默认的下载站点在国外，因此下载速度可能会比较慢。

```powershell
npm i nrm -g
```

安装完成后，使用`nrm ls`命令可以列出所有的下载节点，前面的`*`表示当前正在使用的节点：

![](https://ae01.alicdn.com/kf/H9e2aab62e7a74fc4961ca7e095435719o.jpg)

然后，使用`nrm use taobao`将下载节点切换为国内的淘宝。此时继续使用`npm`下载包时，会自动使用国内的镜像站，速度应该有明显提升。

### npx

npm 从 5.2 版本开始提供了`npx`命令，使用该命令可以方便地调用项目内部安装的模块。例如，在项目中安装了本地（非全局）的 webpack，如果需要在命令行中使用 webpack，那么必须要手动在`node_modules`中找到 webpack 的可执行文件，因为**只要是在终端直接运行的命令，它会去全局环境中寻找**。由于这里使用了局部安装，因此直接使用`webpack`命令自然是找不到的。

```powershell
./node_modules/.bin/webpack
```

> `.bin`是`node_modules`目录下的一个文件夹，里面保存着模块的可执行文件，不是什么特殊的指令~

如果使用 npx，那么只需要在项目中调用如下命令即可。它的原理非常简单，也就是自动到项目的`node_modules/.bin`以及环境变量中寻找命令是否存在。

```powershell
npx webpack
```

> *参考资料*
> 
> [npx 使用教程](https://www.ruanyifeng.com/blog/2019/02/npx.html)

### npm scripts

npm 允许在项目中`package.json`中，使用`scripts`属性定义脚本命令。例如，我们需要将`less`目录中的`test.less`编译为`css`目录中的`test.css`文件：

```powershell
lessc ./less/test.less ./css/test.css
```

但是这样写太麻烦了，于是可以在`package.json`中添加这样一个属性：

```json
// ...
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "less": "lessc ./less/test.less ./css/test.css"
},
// ...
```

这样，只需要使用`npm run 属性名`命令就可以执行这段脚本：

```powershell
npm run less
```

注意，与在终端中直接运行命令不同的是，npm scripts 会**优先从本地寻找该命令**，如果找不到才会去全局环境中寻找。所以，除了使用`npx webpack`可以运行本地 webpack 以外，也可以在 npm scripts 中先定义好运行 webpack 的脚本，然后使用`npm run build`即可运行本地的 webpack。

```json
"scripts": {
    "build": "webpack"
},
```

> *参考资料*
> 
> [npm scripts 使用指南](https://www.ruanyifeng.com/blog/2016/10/npm_scripts.html)

## 构建网络服务

Node.js 不需要像 PHP 一样依赖于 Apache 等服务器软件，它内置了多个模块如`Net`、`Dgram`、`HTTP`和`HTTPS`分别来处理 TCP、UDP、HTTP 和 HTTPS 的网络请求。

由于诸如 Express 这样的主流框架已经对这些功能进行了高级封装，实际应用中也几乎不可能自己去实现一个服务器，所以如果希望了解原理，请参考[另一篇文章](/posts/tb618gp3.html)，本文直接使用[Express](https://expressjs.com/)构建网络服务。

```powershell
npm i express
```

### 创建服务器

使用下面的代码可以创建一个最简单的服务器，Express 会帮你自动设置 MIME 类型、编码和状态码（见[HTTP 协议](/posts/dzta2ga7.html#HTTP)一节）。对于没有配置的路径，也会自动返回`404`状态码和错误页面。

```js
const express = require('express') // 引入模块
const app = express() // 创建服务器对象
const port = 3000 // 端口号

// 监听端口
app.listen(port, function() {
    console.log(`服务器启动成功，正在监听 ${port} 端口`)
})
```

### 页面路由

创建服务器后，需要根据用户请求的路径来返回相应的内容，这被称之为页面路由（Routing）。这里的内容通常来说是一个 HTML 页面，但是也可以是一个普通字符串、一段 JSON 等等。

使用`METHOD()`方法设置当客户端以特定方式（如`GET`、`POST`等）请求特定路径时所返回的内容。这里的`METHOD`需要替换成具体的方式，其详细列表见[官网](https://expressjs.com/en/4x/api.html#app.METHOD)。

| 参数 | 描述 |
| --- | --- |
| 字符串或正则表达式 | 要匹配的请求路径 |
| 函数 | 匹配后的处理函数，该函数包含两个参数，分别为请求对象和响应对象 |

匹配成功后，可以使用响应对象的`send()`方法返回响应内容，否则客户端会一直停留在等待状态。

| 参数 | 描述 |
| --- | --- |
| 字符串 / 数组 / 对象 | 当参数为字符串时，返回的`Content-Type`为`text/html`，否则为`application/json` |

```js
app.get('/', function(req, res) {
    res.send('欢迎来到首页！')
})

app.post('/login', function(req, res) {
    res.send('登录成功！')
})

app.post(/a/, function(req, res) { // 正则表达式，表示任何包含字符 a 的路径
    res.send('嗯？')
})
```

#### 页面重定向

通过`res`对象的`redirect()`方法可以实现页面重定向，Express 会自动返回`302`状态码，并使客户端跳转到重定向后的页面。

```js
res.redirect('/admin/login')
```

#### 模块化路由

> 模块化路由需要使用中间件，可以先跳过本节，看完下文的中间件之后再回来。

如果一个网站页面比较多，那么将所有的路由写到`app.js`中会使其难以维护。为此 Express 提供了模块化路由，通过它可以将一级路径与路由对象绑定，然后在路由对象中继续定义二级路由，相当于创建了一个小型的`app`对象。这样的方式可以将二级路由放到单独的模块中，并返回路由对象，在`app.js`中只需要引入模块并获取路由对象，然后将其绑定即可。

使用`express`对象的`Router()`方法可以创建一个路由对象，然后使用`use()`中间件将路由对象与一级路径匹配，就表示这个一级路径下的所有请求都交给该路由对象处理，然后再通过路由对象创建二级路由即可。

```js
// blog.js 单独的路由模块
const blog = express.Router() // 创建路由对象

blog.get('/list', (req, res) => { // blog 下的二级路由，匹配 /blog/list
    res.send('欢迎来到博客列表页')
})

module.exports = blog
```

```js
// app.js 主模块
const blog = require('./blog.js')

app.use('/blog', blog) // 将所有 /blog 交给路由对象处理
```

注意，在其它路由模块中不需要重复创建`app`对象，使用请求对象`req.app`也可以获取到`app`对象。

### 接收参数

#### GET 请求参数

使用请求对象的`query`属性可以获取`GET`请求参数。

```js
// localhost/index?name=daisy&age=18
app.get('/index', function(req, res) {
    req.query // => {name: daisy, age: 18}
}) 
```

#### POST 请求参数

要获取 POST 请求参数，需要先安装一个 Express 的扩展模块[express-formidable](https://www.npmjs.com/package/express-formidable)。然后使用中间件（见下文）拦截所有请求：

```
npm install express-formidable
```

```js
const formidable = require('express-formidable')

// 中间件：获取并处理请求参数
app.use(formidable())

app.post('/add', function(req, res) {
    req.fields // POST 请求参数
})
```

#### 路由参数

路由参数是另一种传递 GET 参数的方式，它使参数看起来像是路由的一部分，而不是问号引导的形式。目前主流的前端框架也都实现了这种传递参数的方式，使路径看起来更加的友好。

要使用路由参数，需要在路由后面使用`/:参数`作为占位符，当服务器接收到这样的请求时，就会将占位符的部分作为参数了。注意，路由参数的获取需要使用`req.params`属性，而不是普通`GET`请求方式的`req.query`。

```js
// 当请求路径为 localhost/user/add/233，那么 233 就会被识别为 id 参数
// 注意，如果是路径为 localhost/user/add，那么不会匹配到该路由
app.get('/add/:id', function(req, res) {
    req.params // => { id: 233 }
})
```

### 中间件

中间件指的是位于接收请求和发送响应之间的处理模块，它们通常不会用来处理请求和响应。可以理解成污水到最终排放之间，需要经过层层过滤和处理，这个过程就需要若干个中间件来完成。

使用`use()`可以创建一个中间件，拦截服务器接收的请求。注意，中间件会拦截所有以某路径**开头**的路由，而不仅仅是当前指定的路由。如配置的拦截参数是`/test`，那么它会拦截所有`/test/a`、`/test/a/b`等所有子路由。

| 参数 | 描述 |
| --- | --- |
| 字符串或正则表达式 | 要拦截的请求路径 |
| 函数 | 匹配后的处理函数，该函数包含三个参数，分别为请求对象、响应对象和函数`next()` |

一旦中间件拦截成功，那么默认不会执行下面匹配的其它中间件。如果需要继续匹配，那么需要手动调用`next()`函数。

```js
app.use('/test', function (req, res) { // 拦截了 /test 的请求
    console.log('被拦截了！')
    // next() // 除非调用 next()
})

app.get('/test', function (req, res) { // 虽然这个路由也匹配，但是不会执行
    res.send('hello')
})
```

反之，如果将上述两个函数调换位置，那么中间件也永远不会被执行，因为路由函数`get()`表示该路由已经处理完毕，也没有`next()`函数可供调用。

### 静态资源

但是很多情况下，并不是所有的请求都需要额外处理，比如客户端请求一个 CSS / JS 文件、一张图片等等，如果要将这些请求都手动进行路由，那么实在有些过于繁琐了。而 Express 提供了`static()`方法可以直接访问这些**静态资源**。我们通常将静态资源目录命名为`public`，将其与根目录拼接即可获得物理路径。

| 参数 | 描述 |
| --- | --- |
| 字符串 | 静态资源目录的路径 |

这是一个中间件函数，它需要放到`use()`中才可以正确执行。

```js
app.use(express.static(path.join(__dirname, 'public'))) // 托管的目录相当于 D:\WorkSpace\Test\public
```

它会自动根据静态资源目录下的文件生成路由。例如，现在的项目目录结构如下，其中`public`是放置静态资源的目录。那么当配置静态资源托管之后，Express 会自动拦截如`/300.png`、`/css/a.css`、`/index.html`这些路由，并自动返回静态资源的目录下对应的文件。

```
Test
├─ app.js
├─ node_modules
├─ public
│    ├─ 300.png
│    ├─ css
│    │    └─ layout.css
└─   └─ index.html
```

因此如果需要链接一个 CSS 文件，那么可以写作：

```html
<link rel="stylesheet" href="/css/layout.css">
<!-- 自动返回 /public/css/layout.css 文件 -->
```

### 模板引擎

实际当中，我们很少将内容完全固定的页面直接返回，而通常是先从数据库查询出需要的数据，然后填充到页面结构中，再将整个页面响应给客户端。与 PHP、JSP 等语言不同，Node.js 并没有这类将前端页面和后端语言结合的语法，因此需要借助模板引擎来实现这一功能。

也就是说，我们不再写直接交给客户端的 HTML 页面，而是按照模板引擎的语法写出页面，将其交给模板引擎。模板引擎会根据其中的代码进行数据拼接等操作，然后将其处理成最终的页面响应给客户端。

或者，如果你采用了「前后端分离」的开发模式（前端只通过接口获取 JSON 数据，而不是直接获取渲染后的页面），那么也可以将模板引擎部署在浏览器端。否则必须通过 JavaScript 动态创建元素，将数据存放在元素中，再追加到页面上。而这样并不利于文档结构的维护，因此同样需要借助模板引擎拼接 HTML 和数据。

模板引擎有很多种，比如[EJS](https://ejs.co/)、[Jade](http://www.nooong.com/docs/jade_chinese.htm)等等，它们的用法大同小异，这里使用的是国内制作的[art-template](/posts/3q4y7l2d.html)。

```powershell
npm install express-art-template art-template
```

使用下面的代码在 Express 中部署 art-template 模板引擎。这些参数均为 Express 中[要求配置的参数](http://expressjs.com/en/5x/api.html#app.set)，并不属于 art-template 模板引擎，因此其它模板引擎配置的方式也基本一样。

```js
// 根据要渲染的文件后缀名（也就是下面 render() 文件的后缀名），来引入相应的模板引擎，必须设置
app.engine('html', require('express-art-template'))

// 设置模板的存放目录，默认值为 process.cwd() + '/views'，process.cwd() 为当前 Node.js 的进程工作目录，也就是项目根目录下的 views 文件夹
app.set('views', path.join(__dirname, 'views'))

// 设置要渲染的文件后缀名省略时，默认补充的后缀
app.set('view engine', 'html')

// 使用 render() 方法响应模板内容，后面传入数据参数
// 如果 views 下面还有子目录 home，那么要使用 res.render('home/index.html')，不要在 home 前添加斜杠了
app.get('/', (req, res) => {
    res.render('index.html', { name: 'aui', age: 18 }) // 这里使用了后缀名，如果省略，则根据 view engine 的配置自动补充
})
```

对于每个模板都需要使用的公共数据，可以将其配置到`app.locals`对象中，这样每个模板都能直接获取到该数据。

```js
app.locals.user = { name: '啦啦啦', age: 18 } // 在模板中，直接使用`user`即可获取到该对象
```

### Session

在我们浏览网站时，经常会见到这样一些功能：如果用户登录成功了，那么在某段时间内，用户不再需要重复登录。或者，用户只有在登录之后才能访问特定的页面。

这些需求看似常见，然而并不容易实现。因为 **HTTP 协议是无状态的**，当客户端与服务器的一次请求结束后，服务器就不再认识客户端了。也就是说，虽然用户本次登录成功了，但是服务器无法知道本次与下次登录的是不是同一个用户，只能当作一个新用户来要求其重新登录。或者，如果用户直接访问登录后的页面，那么服务器也无法判断这个用户是否已经登录成功。

> 为了理解这个问题，可以看生活中的一个例子：有一家烤鸭店搞活动，只要一个顾客购买 5 只烤鸭，就可以免费再获得 1 只。但是客人这么多，烤鸭店要如何记住每一个客人呢？店铺可以制作一些带有卡号的会员卡，然后在店里准备一个记录本，将顾客的会员卡号与购买的烤鸭数记录下来。这样，当顾客购买烤鸭前，先出示一下会员卡，这样店铺就知道顾客之前购买过几只烤鸭了，从而判断是否要赠送烤鸭。

其实解决方案与上述例子很相似，为了使服务器（烤鸭店）记住客户端（顾客），那么也要准备一个记录本和会员卡，记录本是服务器的 session 对象，以 sessionID 识别用户，它可以位于服务器内存、文件、数据库，甚至专门的服务器集群中；而会员卡是客户端的本地存储 cookie。当用户首次登录（购物）后，服务器会生成一个随机的 sessionID（卡号），记录到客户端的 cookie 中（会员卡）。

当客户端再次发送 HTTP 请求时，会将本地**同域**的 cookie 携带在请求头中，一同发送到服务器（出示会员卡）。于是服务器可以检查 session 中（记录本）是否包含之前生成的 sessionID（卡号），如果找到了，则说明用户之前登录成功过（购买过烤鸭）。

> session 的本义是「会话」，而无论是服务端的 session 对象，还是 cookie 中记录的 sessionID，都是 session 的**具体实现**。session 的实现并不一定需要依赖于 cookie，只不过 cookie 是目前最简单有效的实现方式之一。

在 Node.js 中要实现服务端 session，需要安装扩展包[express-session](https://www.npmjs.com/package/express-session)。

```
npm install express-session
```

```js
const session = require('express-session')
```

`session`的构造函数是一个中间件函数，它可以传入一个对象，进行初始化配置：

```js
app.use(session({ 
    secret: 'open-sesame', // 增加生成 sessionID 的强度，防止被篡改，类似于盐值
    resave: false, // cookie 过期之前，客户端再次访问是否重复保存 session，建议 false
    saveUninitialized: false // 是否保存未添加实际内容的 session，建议 false,
    cookie: { 
    	maxAge: 24 * 60 * 60 * 1000, // 默认关闭浏览器就会清除，因此要设置 cookie 过期时间，单位为毫秒，这里表示的是一天
	} 
}))
```

当客户端登录成功后，可以在 session 中记录一个变量（如登录的用户名），如果设置了`saveUninitialized: false`，那么此时服务器会将同时生成的 sessionID 保存到客户端的 cookie 中：

```js
app.post('/login', function (req, res) {
    if (isValid) { // 如果登录成功
        req.session.username = result.username // 在 session 中记录用户名，或者其它值
        // 跳转到登录后页面
    }
})
```

![](https://ae01.alicdn.com/kf/H714549ade3d8483bb2d87b604fb6a11df.jpg)

之后在其它页面只需要先验证该变量是否存在，然后根据情况返回不同页面即可。

```js
app.get('/user', function (req, res) {
    req.session.username ? res.render('admin/user.html') : res.render('admin/login.html')
})
```

使用响应对象的`clearCookie()`可以清除当前客户端保存的 cookie，该方法要求传入一个 cookie 名称。

```js
app.get('/', function (req, res) {
    res.clearCookie('connect.sid') // 清除客户端保存的 sessionID
})
```

## 数据库

Node.js 与其它后端语言一样，都可以与数据库进行交互。由于 MongoDB 是直接操作 JSON 数据，因此与 Node.js 结合使用会更加方便。

MongoDB 本身提供了连接 Node.js 的一系列接口，但是原生代码一向比较复杂。因此与 Express 一样，这里直接使用第三方模块[Mongoose](https://mongoosejs.com/) 操作 MongoDB，对于 MongoDB 本身的安装与使用，请查看[另一篇文章](/posts/e6q2910w.html)。

```powershell
npm install mongoose
```

```js
const mongoose = require('mongoose')
```

### 连接数据库

首先，使用`mongoose`对象的`connect()`方法连接数据库。由于 MongoDB 不需要手动创建数据库，因此这里的数据库名称可以随意填写，之后创建文档后会自动创建。

| 参数 | 描述 |
| --- | --- |
| 字符串 | 数据库地址 |
| 对象 | 配置参数 |

```js
// 参数均是清除一些警告信息，需要的时候加上即可
mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true, useUnifiedTopology: true })
// 如果数据库有密码
mongoose.connect('mongodb://admin:123456@localhost/test', { useNewUrlParser: true, useUnifiedTopology: true })
```

### Schema

由于 MongoDB 本身对存入的数据没有任何约束，因此即便传入错误的数据（甚至是某些字段没有传入），MongoDB 也都会将它们保存起来。为了解决这一问题，Mongoose 引入了规则（Schema）这一概念，它类似于表结构，规定了一个集合（表）的字段类型。

使用`mongoose.Schema()`构造函数可以创建一个规则，它的参数为一个对象，其属性为各个字段的名称，而属性值为该字段的类型。字段的类型有很多，而且针对于不同的类型，还可以进一步作出约束。

常用的字段类型如下：

- `String`：字符串，如果传入了一个非字符串值，那么 Mongoose 会自动调用`toString()`方法尝试自动转换
- `Number`：数值，如果传入了一个非数值，那么 Mongoose 会尝试自动转换
  - `null`、`undefined`不会被转换
  - `NaN`、没有`valueOf()`的数组或对象会导致转换错误
- `Date`：日期
- `Boolean`：布尔值，除了下列值以外，其它任何值都会导致转换错误
  - 被转换成`true`的值：`'true'`、`1`、`'1'`、`yes`
  - 被转换成`false`的值：`'false'`、`0`、`'0'`、`no`
- `ObjectId`：由于 MongoDB 中的`id`并不是一个简单的字符串，因此 Mongoose 提供了这样一个单独的类型

```js
// 创建了一个 游戏 的规则
const GameSchema = new mongoose.Schema({
    id: mongoose.ObjectId, // ID
    name: String, // 游戏名称
    type: String, // 游戏类型
    isPublished: Boolean, // 是否发售
    publishDate: Date, // 发售日期
    endings: Number // 结局数量
})
```

如果需要更详细的约束，那么属性的值可以为一个对象。这里只列出较为常见的约束，全部类型详见[官方文档](https://mongoosejs.com/docs/schematypes.html)。

- 所有的类型都可以包含的约束：
  - `required`：布尔值，非空约束。要求该字段必须提供，且值不能为`null`、`undefined`、`''`
  - `default`：任意类型，如果**插入文档**（更新文档无效）时该字段为`undefined`（对`null`或`''`无效），所使用的默认值
  - `validate`：对象，自定义验证规则，包含`validator`和`message`两个属性。前者为一个函数，其返回值为验证规则；后者为字符串，表示自定义的错误信息
  - `get`：函数，获取数据时，对数据进行自定义处理
  - `set`：函数，传入数据时，对数据进行自定义处理
- 只有字符串类型可以包含的约束：
  - `lowercase`：布尔值，是否调用`toLowerCase()`将传入值转换成小写
  - `uppercase`：布尔值，是否调用`toUppercase()`将传入值转换成大写
  - `trim`：布尔值，是否调用`trim()`去除传入值两端的空格
  - `match`：正则表达式，验证传入值是否匹配
  - `enum`：数组，验证传入值是否为其中之一
  - `minlength`：数值，验证传入值的长度是否符合条件
  - `maxlength`：数值，验证传入值的长度是否符合条件
- 只有数值类型可以包含的约束：
  - `min`：数值，验证传入值的长度是否符合条件
  - `max`：数值，验证传入值的长度是否符合条件
  - `enum`：数组，验证传入值是否为其中之一，对于`null`和`undefined`无效

```js
const GameSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,             // 不能为空
        default: 'Resident Evil',   // 默认值
        minlength: 2,               // 最小字符数，汉字也算 1 个字符
        maxlength: 50,              // 最大字符数
        trim: true,                 // 自动去除字符串两端空格
    },
    type: {
        type: String,
        enum: ['ACT', 'RPG']        // 只能是这两个值之一
    }
    endings: {
        validate: {                                    // 自定义验证规则，v 表示要验证的值
            validator: v => { return v > 3 },          // 如果传入的值大于 3，表示验证通过
            message: '什么破游戏, 连 3 个结局都没有!'    // 验证失败时的错误信息
        },
        get: v => Math.round(v),    // 获取或存入数据时，对其进行处理
        set: v => Math.round(v),
        min: 3,                     // 最小值
        max: 10,                    // 最大值
    }
})
```

上述`required`、`max`、`min`、`enum`、`match`、`minlength`和`maxlength`会调用内置的验证器，将这些值放到数组中，并传入第二个字符串元素，可以自定义这些验证器的错误信息。

```js
const GameSchema = new mongoose.Schema({
    endings: {
        max: [99, '最大值不能超过99啦']
        enum: [[22, 33], '只能是 22 或者 33']
    }
})
```

对于不符合验证规则的数据，Mongoose 会抛出一个错误。在下面增删查改的方法中可以使用`Promise`的`catch()`，或者在回调函数中获取这个错误对象。使用`错误对象.errors.字段名.message`可以获取到错误提示信息。

```js
const GameSchema = new mongoose.Schema({
    endings: {
        validate: {
            validator: v => v === 233, // 只能传入 233
            message: '传的什么鬼东西！'
        }
    }
})

GameModel.create({endings: 666}).catch(function (err) { // err 为错误对象
    err.errors.endings.message
})
```

### Model

将定义的规则传入`model()`方法可以创建一个模型（Model），模型是 Mongoose 特有的概念，可以理解成集合（表）。

| 参数 | 描述 |
| --- | --- |
| 字符串 | 要操作的集合（表）名称，这里建议采用**首字母大写的单数形式**，然后 Mongoose 会将其转换成**全部小写的复数形式**，与数据库中的集合对应 |
| `Schema`对象 | 之前创建的包含集合规则的对象 |

| 返回值 | 描述 |
| --- | --- |
| `Model`对象 | 模型对象，用来对数据库进行操作 |

```js
const GameModel = mongoose.model('Game', GameSchema) // 集合名称为 Game，则数据库实际操作的集合名称为 games
```

然后，使用模型就可以调用一系列增删查改方法对数据库进行基本操作了。

#### create()

插入若干条文档。

| 参数 | 描述 |
| --- | --- |
| 若干对象 / 数组 | 要添加的数据 |
| 函数 | 可选，回调函数，可以使用`Promise`替代。第一个参数为错误对象，如果没有错误则为`null`；之后若干参数为插入的数据，包括自动生成的`_id` |

| 返回值 | 描述 |
| --- | --- |
| `Promise`对象 | 可以取代回调函数 |

```js
// 参数是若干个单独的对象
GameModel.create(
    { name: 'Resident Evil', isPublish: true, endings: 1 },
    { name: 'Enter the Gungeon', isPublish: true, endings: 8 },
    function(err, p1, p2) {
        err // 错误对象
        p1 // { _id: 5e4687310a6da6283498057d, name: 'Resident Evil', isPublish: true, endings: 1 }
        p2 // { _id: 5e4687310a6da6283498057d, name: 'Enter the Gungeon', isPublish: true, endings: 8 }
    }
)

// 参数是一个对象数组
GameModel.create([
    { name: 'Resident Evil', isPublish: true, endings: 1 },
    { name: 'Enter the Gungeon', isPublish: true, endings: 8 }],
).then(function(p1, p2) {})
.catch(function(err) {})
```

#### find()

根据条件查询文档。

| 参数 | 描述 |
| --- | --- |
| 对象 | 可选，表示[查询条件](/posts/e6q2910w.html#查询操作符)，如果省略则表示查询全部 |
| 函数 | 可选，回调函数，可以使用`Promise`替代。第一个参数为错误对象，如果没有错误则为`null`；第二个参数为查询结果，无论结果数据是多条、单条还是没有，均为**对象数组** |

| 返回值 | 描述 |
| --- | --- |
| `Query`对象 | [查询结果对象](#Query) |

```js
// 查询 name 为 'Enter the Gungeon' 的文档
GameModel.find({ name: 'Enter the Gungeon' })
// 查询全部文档
GameModel.find()
```

注意，MongoDB 中的`_id`在 JavaScript 中会表现为`Object`类型，**并不是字符串**，因此在使用时可以直接使用 Mongoose 自动生成的`id`属性来获取字符串类型的`_id`，而不需要手动去调用`_id.toString()`。

#### findOne()

根据条件查询一条文档。如果有多个符合条件的文档，只返回其中的第一条。

| 参数 | 描述 |
| --- | --- |
| 对象 | 可选，表示[查询条件](/posts/e6q2910w.html#查询操作符)，如果省略则表示查询全部 |
| 函数 | 可选，回调函数，可以使用`Promise`替代。第一个参数为错误对象，如果没有错误则为`null`；第二个参数为查询结果，如果查询到文档则返回单个对象，如果没有找到文档则返回`null` |

| 返回值 | 描述 |
| --- | --- |
| `Query`对象 | [查询结果对象](#Query) |

```js
// 查询第一条文档
GameModel.findOne({ name: 'Enter the Gungeon' })
```

#### findById()

根据文档`_id`查询一条文档，与`findOne({ _id: id })`效果相同，如果要实现这一功能，建议使用该方法。

| 参数 | 描述 |
| --- | --- |
| 字符串 | 文档的`_id` |
| 函数 | 可选，回调函数，可以使用`Promise`替代。第一个参数为错误对象，如果没有错误则为`null`；第二个参数为查询结果，如果查询到文档则返回单个对象，如果没有找到文档则返回`null` |

| 返回值 | 描述 |
| --- | --- |
| `Query`对象 | [查询结果对象](#Query) |

```js
GameModel.findById('5db6cbb42b004b2840128f79')
```

#### countDocuments()

获取查询的文档数量。

| 参数 | 描述 |
| --- | --- |
| 对象 | 可选，表示[查询条件](/posts/e6q2910w.html#查询操作符)，如果省略则表示查询全部 |
| 函数 | 可选，回调函数，可以使用`Promise`替代。第一个参数为错误对象，如果没有错误则为`null`；第二个参数为符合条件的文档数量 |

| 返回值 | 描述 |
| --- | --- |
| `Query`对象 | [查询结果对象](#Query) |

```js
GameModel.countDocuments({ ending: 3 }, function(err, result) {
    result // 结局数为 3 的游戏数量
})
```

#### updateOne()

根据条件修改一条文档。

| 参数 | 描述 |
| --- | --- |
| 对象 | 可选，表示[查询条件](/posts/e6q2910w.html#查询操作符)，如果省略则表示不修改 |
| 对象 | 要修改的值组成的对象 |
| 函数 | 可选，回调函数，可以使用`Promise`替代。第一个参数为错误对象，如果没有错误则为`null`；第二个参数为包含修改条数的结果对象 |

| 返回值 | 描述 |
| --- | --- |
| `Query`对象 | [查询结果对象](#Query) |

```js
// 将 id 为 5d9f6b147589b70e201eca72 的文档的 name 修改为 'Biohazard'
GameModel.updateOne({ _id: '5d9f6b147589b70e201eca72' }, { name: 'Biohazard' })
```

#### updateMany()

根据条件修改多条文档。

| 参数 | 描述 |
| --- | --- |
| 对象 | 可选，表示[查询条件](/posts/e6q2910w.html#查询操作符)，如果省略则表示不修改 |
| 对象 | 要修改的值组成的对象 |
| 函数 | 可选，回调函数，可以使用`Promise`替代。第一个参数为错误对象，如果没有错误则为`null`；第二个参数为包含修改条数的结果对象 |

| 返回值 | 描述 |
| --- | --- |
| `Query`对象 | [查询结果对象](#Query) |

```js
// 将所有 type 为 'AVG' 的文档的 name 修改为 'Biohazard'
GameModel.updateMany({ type: 'AVG' }, { name: 'Biohazard' })
```

#### deleteOne()

删除符合条件的第一条文档。

| 参数 | 描述 |
| --- | --- |
| 对象 | 可选，表示[查询条件](/posts/e6q2910w.html#查询操作符)，如果省略则表示删除全部文档的第一条 |
| 函数 | 可选，回调函数，可以使用`Promise`替代。第一个参数为错误对象，如果没有错误则为`null`；第二个参数为包含删除条数的结果对象 |

| 返回值 | 描述 |
| --- | --- |
| `Query`对象 | [查询结果对象](#Query) |

```js
// 删除 endings 为 3 的第一条文档
GameModel.deleteOne({ endings: 3 })
```

#### deleteMany()

删除符合条件的多条文档。

| 参数 | 描述 |
| --- | --- |
| 对象 | 可选，表示[查询条件](/posts/e6q2910w.html#查询操作符)，如果省略则表示**不删除** |
| 函数 | 可选，回调函数，可以使用`Promise`替代。第一个参数为错误对象，如果没有错误则为`null`；第二个参数为包含删除条数的结果对象 |

| 返回值 | 描述 |
| --- | --- |
| `Query`对象 | [查询结果对象](#Query) |

```js
// 删除 endings 为 3 的所有文档
GameModel.deleteMany({ endings: 3 })
```

### Query

`Query`对象是 Mongoose 提供的一个查询结果对象，其中包含了一些处理查询结果的常用方法，并且封装了`then()`和`catch()`，可以当作`Promise`来使用，但是它并不是真正的`Promise`。

#### select()

设置查询的字段。

| 参数 | 描述 |
| --- | --- |
| 字符串 | 要查询的字段。多个字段以空格隔开，字段名前加`-`表示不查询该字段 |

| 返回值 | 描述 |
| --- | --- |
| `Query`对象 | 调用它的`Query`对象 |

```js
// 仅查询所有文档的 name 和 type 字段
GameModel.find().select('name type').then()
// 不查询所有文档的 name 字段
GameModel.find().select('-name').then()
```

#### sort()

对查询结果排序，默认为升序。

| 参数 | 描述 |
| --- | --- |
| 字符串 | 要排序的字段，字段名前加`-`表示降序 |

| 返回值 | 描述 |
| --- | --- |
| `Query`对象 | 调用它的`Query`对象 |

```js
// 将查询结果按照结局数 由小到大 排序
GameModel.find().sort('endings')
// 将查询结果按照结局数 由大到小 排序
GameModel.find().sort('-endings')
```

#### skip()

跳过若干条文档。

| 参数 | 描述 |
| --- | --- |
| 数值 | 跳过的文档数量 |

| 返回值 | 描述 |
| --- | --- |
| `Query`对象 | 调用它的`Query`对象 |

```js
// { _id: 5e4685ffd96f66282c100c61, endings: 3 },
// { _id: 5e468608bc19a50e64ae6263, endings: 233 },
// { _id: 5e46860c31150e222cd388f1, endings: 0 }
GameModel.find().skip(1) // 跳过第一条，即没有 endings: 3 这一条
```

#### limit()

限制返回的文档数。

| 参数 | 描述 |
| --- | --- |
| 数值 | 限制查询的文档数量 |

| 返回值 | 描述 |
| --- | --- |
| `Query`对象 | 调用它的`Query`对象 |

```js
GameModel.find().limit(1) // 只查询 1 条文档，相当于 findOne()
```
