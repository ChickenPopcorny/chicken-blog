---
title: 大前端笔记之22 📦 webpack
date: 2020-02-20 16:21:01
abbrlink: 1zcig0yl
tags: webpack
categories: 大前端
excerpt: webpack 是一个前端项目的自动化构建工具，更确切地来说，它是一个模块打包器。模块化可以使得越来越复杂的前端项目中的文件依赖变得清晰，更容易管理。但是由于浏览器的兼容性问题，ES6、CommonJS 等模块化语法并不能得到很好的支持。而 webpack 提供了各种模块化方式的支持，可以将这些包含模块化语法的代码进行打包合并，转换成浏览器能够运行的代码。可见，虽然它也具有类似于 Gulp 提供诸如代码转换（ES6 → ES5、Less → CSS ）、代码压缩等功能，但是提供模块化支持，才是它更强大的地方。
---

# 大前端笔记之22 📦 webpack

[webpack](https://www.webpackjs.com/concepts)是一个前端项目的自动化构建工具，更确切地来说，它是一个模块打包器。模块化可以使得越来越复杂的前端项目中的文件依赖变得清晰，更容易管理。但是由于浏览器的兼容性问题，ES6、CommonJS 等模块化语法并不能得到很好的支持。而 webpack 提供了各种模块化方式的支持，可以将这些包含模块化语法的代码进行打包合并，转换成浏览器能够运行的代码。可见，虽然它也具有类似于 Gulp 提供诸如代码转换（ES6 → ES5、Less → CSS ）、代码压缩等功能，但是提供模块化支持，才是它更强大的地方。

## 基本概念

webpack 是一个基于 Node.js 的工具，需要使用 npm 安装。由于它仅仅是一个开发工具，因此将其作为开发依赖即可：

```powershell
npm i webpack webpack-cli --save-dev
```

接下来在项目目录中新建一个`src`目录，用来存放源代码文件，等待 webpack 处理。

```powershell
test
├─ node_modules         # 模块文件夹
├─ package-lock.json
├─ package.json         # 使用 npm init 生成的
├─ index.html           # 用于引入打包后的 js 文件，临时放到这里作为测试
└─ src                  # 存放源代码文件
    └─ index.js         # 随便写了一行 console.log() 代码
```

接下来使用[npx](/posts/o48l9v2o.html#npx)执行 webpack 进行项目打包。

```powershell
npx webpack
```

此时会发现项目下多出了一个`dist`文件夹，它用来存放处理后的代码，当前包含了打包后的`main.js`文件。打开该文件发现，虽然源文件中只有一行`console.log()`，但是打包后的文件是经过压缩后的一串复杂代码，这是因为 webpack 提供了模块化支持。

然后在`index.html`引入刚生成的`main.js`，可以发现源文件`index.js`中的代码被正确执行了。

如果要修改 webpack 的配置，需要在项目根目录下新建一个`webpack.config.js`文件，该文件是一个模块，且**只能使用 CommonJS 语法**，因此配置对象需要通过模块化导出。

```js
/* webpack.config.js */
module.exports = {
    // 配置参数
}
```

## loader

webpack 除了可以管理 JavaScript 文件以外，也可以管理诸如 CSS、图片等各种静态资源，也就是说，可以使用模块化语法直接导入这些其它类型的资源文件，而不仅仅是 JavaScript 文件。不过，要管理这些资源，需要首先安装对应的 loader，不同的资源有不同的 loader，对应的配置方式也不太相同。

### 样式文件

管理 CSS 样式文件需要使用[css-loader](https://www.webpackjs.com/loaders/css-loader/)和[style-loader](https://www.webpackjs.com/loaders/style-loader/)两个 loader，前者负责导入 CSS 文件并提供返回的 CSS 代码，后者负责将 CSS 代码嵌入到页面的 DOM 使其生效。因此你只需在页面中引用一个输出的 JavaScript 文件，就可以使页面拥有样式了！

```powershell
npm install style-loader css-loader --save-dev 
```

```js
module.exports = {
    module: {
        rules: [{
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }]
    }
}
```

> 注意配置文件中加载 loader 的顺序，是**从右向左**执行的，因此`css-loader`必须要写在后面（先执行）才能正确运行。

如果还需要管理 Less 文件，则需要使用[less-loader](https://www.webpackjs.com/loaders/less-loader/)和 Less 本身。并且由于 Less 最终依然会转换为 CSS，因此也需要依赖`css-loader`和`style-loader`。

```powershell
npm install --save-dev less-loader less
```

```js
module.exports = {
    module: {
        rules: [{
            test: /\.less$/,
            use: ['style-loader', 'css-loader', 'less-loader']
        }]
    }
}
```

> 注意，虽然这里的规则中也使用了`css-loader`和`less-loader`，但是如果希望正确处理 CSS 文件的话，依然需要之前 CSS 的规则，这里的规则仅仅用于管理 Less 文件，不会管理 CSS 文件。

### 图片文件

当其它文件中引入图片文件时（比如 CSS 文件中通过`url()`设置了背景图片），那么需要使用[file-loader](https://www.webpackjs.com/loaders/file-loader/)来管理图片文件。

```powershell
npm install --save-dev file-loader
```

```js
module.exports = {
    module: {
        rules: [{
            test: /\.(png|jpg|gif)$/,
            use: ['file-loader']
        }]
    }
}
```

可以看到`dist`目录中生成了一个随机文件名的图片文件，不过由于此时`index.html`文件的位置问题导致图片路径不正确，因此图片无法正常显示，之后处理 HTML 文件时就会解决这个问题。

除此之外，还可以使用[url-loader](https://www.webpackjs.com/loaders/url-loader/)将比较小的图片转换成 Base64。当图片的体积小于`limit`（单位为字节）时，webpack 会将图片转换为 Base64。如果大于`limit`，则会自动调用 file-loader。

> 注意！一旦配置了 url-loader，虽然 file-loader 必须安装，但是**千万不要配置**！否则会由于冲突导致打包结果不正确！

```powershell
npm install --save-dev url-loader
```

```js
module.exports = {
    module: {
        rules: [{
            test: /\.(png|jpg|gif)$/,
            use: [
                {
                    loader: 'url-loader',
                    options: {
                        limit: 8192 // 相当于 8KB
                    }
                }
            ]
        }]
    }
}
```

### Babel

使用[babel-loader](https://www.webpackjs.com/loaders/babel-loader/)可以将 ES6 语法转换成兼容性比较好的 ES5 语法。

```powershell
npm install -D babel-loader @babel/core @babel/preset-env
```

```js
module.exports = {
    module: {
        rules: [{
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        }]
    }
}
```

## 管理输出

### 入口

使用`entry`设置项目的起点，默认为`./src/index.js`。

```js
module.exports = {
    entry: './src/main.js' // 修改为 main.js 文件
}
```

### 出口

使用`output`设置编译后的文件名称和保存位置，默认为`./dist/main.js`。该属性是一个对象，它包含`path`和`filename`两个属性，前者用来设置保存位置，后者设置文件名称。注意，其中`path`必须为**绝对路径**，因此需要引入`path`模块拼接路径。

```js
const path = require('path')

module.exports = {
    output: { // 将打包后的文件修改为 项目目录下的 output/bundle.js
        path: path.join(__dirname, 'output'),
        filename: 'bundle.js'
    }
}
```

## 插件

插件可以对 webpack 进行功能上的扩充，比如代码压缩、添加版权信息等。与 loader 不同的是，loader 用于将特定类型的文件进行转换，而插件则是将转换后的代码作出进一步处理。

### 自动生成 HTML 文件

使用[HtmlWebpackPlugin](https://github.com/jantimon/html-webpack-plugin#configuration)可以在发布目录中自动生成一个 HTML 文件，并引入包含打包后`.js`文件。

```powershell
npm i --save-dev html-webpack-plugin
```

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    plugins: [
        new HtmlWebpackPlugin()
    ]
}
```

调用插件时可以传入一个对象作为配置参数，比如希望以自定义的模板来创建 HTML，可以使用[template 属性](https://github.com/jantimon/html-webpack-plugin/blob/master/docs/template-option.md)。它依然会自动在最后添加打包文件的引用，不需要手动添加。

```js
module.exports = {
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html' // 相对于 webpack.config.js 文件所在目录
        })
    ]
}
```

### 代码压缩

使用[UglifyjsWebpackPlugin](https://www.webpackjs.com/plugins/uglifyjs-webpack-plugin/)可以对代码进行压缩。

> 在 webpack4 中，如果配置了`mode: 'production'`（默认）选项，那么 webpack 会自动进行压缩，这里等用到时再研究。

## 其它功能

### 本地服务器

使用[webpack-dev-server](https://www.webpackjs.com/configuration/dev-server/)可以快速构建一个基于 Node.js 的本地服务器，它内置了 [Express 框架](/posts/o48l9v2o.html#构建网络服务)，可以用于本地调试。

```powershell
npm install webpack-dev-server --save-dev
```

```js
module.exports = {
    devServer: {
        contentBase: path.join(__dirname, "dist"), // 根路径，通常配置为部署目录 dist
        port: 9000 // 端口，默认为 8080
    }
}
```

然后运行项目本地的`webpack-server-dev`启动服务器，使用 npx 或者 npm scripts 均可。

```powershell
npx webpack-server-dev
```

> 也可以直接使用 VSCode 中的 live-server 扩展。

### 分离配置文件

使用[webpack-merge](https://github.com/survivejs/webpack-merge)可以将配置文件分离成开发环境与生产环境，然后根据环境再合并为一个统一的配置文件。






