---
title: 📘 大前端笔记之 Part1 HTML
date: 2020-01-10 22:32:43
abbrlink: andb1byi
tags: HTML
categories: 大前端
excerpt: HTML 是用来标识互联网传输数据语义的一门语言。浏览器根据不同的 HTML 标签将数据进行解析，才能呈现出具有含义的页面。
---

# 📘 大前端笔记之 Part1 HTML

<abbr title="Hyper Text Markup Language，超文本标记语言">HTML</abbr>是用来标识互联网传输数据语义的一门语言，浏览器根据不同的 HTML 标签将数据进行解析，才能呈现出具有含义的页面。

HTML 标签也称 HTML 元素，它由标签名称和其中内容组成。标签名外侧由尖括号`<>`包裹，并且**不区分大小写**（这一点很重要，因为之后会用到自定义标签），因此如果有多个单词会使用**短横线式命名法**。

> 短横线式命名法（kebab-case）指的是以短横线分隔多个单词（如`my-name`），其中 kebab 的含义是「烤肉串」，可见还是比较形象的。与此对应的还有驼峰式命名法（camel-case），以大写字母作为单词分隔（如`myName`或者`MyName`），其中小写字母开头称为小驼峰式，而大写字母开头则称为大驼峰式。

HTML 元素分为单标签元素和双标签元素，前者只需要一个标签，而没有内容。后者需要开始标签和结束标签成对出现，结束标签的名称前会有一个`/`作为标识。

![](http://cdn.yesuanzao.cn/superbed/2020/03/11/5e68b532e83c3a1e3a771c5a.jpg)

HTML 元素上可以定义属性，用来对元素作出进一步的解释说明，它由属性名和属性值组成，两者使用`=`连接，属性值使用**双引号**包裹。与标签名称一样，属性也可以自定义，并且**属性名同样不区分大小写**，因此如果有多个单词也应该使用短横线式命名法。

![](http://cdn.yesuanzao.cn/superbed/2020/03/12/5e6a0ab7e83c3a1e3a0a3b3d.jpg)

## 基本元素

这些元素是 HTML 文档的基本结构，几乎在任何一个文档中都必须存在。

### HTML5 规范

使用`<!DOCTYPE html>`元素表示当前文档遵循 HTML5 规范，以便浏览器按照最新的规范来解析。该元素必须位于 HTML 文档的最顶部。

```html
<!DOCTYPE html>
```

### 根元素

使用`<html>`表示 HTML 文档的顶级元素，也称为根元素，所有其他元素必须是此元素的后代。

如果使用 VS Code 等编辑器快速生成页面模板时，会发现该元素带有`lang`属性，它可以设置文档的语种，以便于浏览器针对页面进行翻译或者搜索引擎检索。对于中文页面来说，该属性可以设置为`zh`（谷歌）、`zh-CN`（淘宝）、`zh-Hans`（哔哩哔哩）或者直接不设置（京东、百度）。这些差异是由于规范中将中文根据方言（如普通话、粤语、闽南语等）分成了非常多的子语种，但是浏览器并没有完全实现，从而导致的问题。

```html
<html lang="zh-Hans"></html>
```

### 文档头部

使用`<head>`表示[文档元数据](#文档元数据)的容器，可以包含一些特殊的标签用来对文档解释说明（比如标题、编码等），它们不会显示在页面上。

```html
<html>
    <head></head>
</html>
```

### 文档主体

使用`<body>`表示文档的主体，大部分元素都位于该元素内，用来呈现具体的内容。

```html
<html>
    <body></body>
</html>
```

## 文档元数据

文档元数据指的是并不会被解析在页面上的内容，用来设置文档的一些配置信息，它们通常出现在`<head>`标签中。

### 页面标题

使用`<title>`定义页面的标题，也就是浏览器标签页或者标题栏上的文字。

```html
<title>这是一个神奇的网页</title>
```

### 文档编码

使用`<meta>`的`charset`属性设置文档编码，也就是说，告诉浏览器当前页面应该以什么[字符集](/posts/1x90rjzf.html)解析，通常为`UTF-8`。

它的作用仅仅是告诉浏览器应该以什么字符集来解析，而不是设置文档本身的字符集。如果要设置文档本身的字符集，以 VS Code 为例，在页面的右下角即可修改。因此，只有这两者对应起来才能够正确显示页面文字，否则会出现乱码。

```html
<meta charset="UTF-8" />
```

## 文本内容

接下来的标签均会被直接渲染在页面上，通常放在`<body>`中。

### 标题和段落

使用`<h1>`到`<h6>`定义不同级别的标题，其中`<h1>`为最大的标题，`<h6>`为最小的标题。注意，`<h1>`在一篇文档通常只能出现一次，然后根据结构依次递进，不要因为字体大小或样式滥用标题。

```html
<h1>这是一个一级标题哒~</h1>
```

使用`<p>`定义一个段落。

```html
<p>这是一个段落哒~</p>
```

### 强调和删除

使用`<strong>`或`<em>`将需要强调的内容包裹起来，前者默认为**加粗样式**，后者为*倾斜样式*。

```html
<strong>这是强调内容啦</strong>
```

使用`<del>`将需要删除的内容包裹起来，默认为~~删除线样式~~。

```html
<del>这是删除内容啦</del>
```

### 换行

使用`<br>`定义一个换行符。HTML 会默认将文档中的回车以及多个空格，解析为**一个空格**。

### 超链接

使用`<a>`定义一个超链接，用来在不同页面之间跳转。

| 属性     | 描述                                                              |
| -------- | ----------------------------------------------------------------- |
| `href`   | 跳转的 URL                                                        |
| `target` | 新页面的打开方式，`_self`表示当前页面打开，`_blank`表示新页面打开 |

```html
<!-- 在当前页打开 -->
<a href="http://www.muyumiao.com" target="_self">木鱼喵</a>
<!-- 在新页面打开 -->
<a href="http://www.muyumiao.com" target="_blank">木鱼喵</a>
```

## 页面划分

将页面划分成不同的区域，可以使功能相似的内容归在一起，从而使页面具有清晰的结构。页面划分的元素功能基本一致，但是它们具有不同的语义，应该根据情况选择使用。

| 标签        | 描述                                                                            |
| ----------- | ------------------------------------------------------------------------------- |
| `<header>`  | 页面的头部，通常包含章节的标题、Logo、搜索框等                                  |
| `<main>`    | 页面的主体，只能在页面出现一次，用于替代`<div id="main">`或`<div id="content">` |
| `<nav>`     | 页面的导航，通常包含多个超链接，用于跳转到网站的其它页面                        |
| `<section>` | 页面的区块，可以将多个有联系的内容放在一个区块中                                |
| `<aside>`   | 与页面内容几乎无关的部分，比如侧边栏等                                          |
| `<article>` | 文章内容区域，比如论坛的帖子、新闻、博客或者用户提交的评论                      |
| `<footer>`  | 页面的页脚，通常包含章节作者、版权数据、联系方式等                              |
| `<div>`     | 无语义块级元素，在以上元素均不符合时再考虑使用                                  |
| `<span>`    | 无语义行内元素，在以上元素均不符合时再考虑使用                                  |

## 表格

使用`<table>`可以定义一个数据表格，其中包含`<tr>`标签作为表格的行，而`<tr>`中又包含若干个`<th>`或`<td>`作为表头或普通单元格。

```html
<table>
    <tr>
        <th>姓名</th>
        <th>年龄</th>
    </tr>
    <tr>
        <td>御坂美琴</td>
        <td>16</td>
    </tr>
</table>
```

如果表格比较复杂，可以使用`<thead>`、`<tbody>`、`<tfoot>`将`<tr>`包裹起来，划分表格的区域，方便对不同的区域进行样式控制。

```html
<table>
    <thead>
        <tr>
            <th>姓名</th>
            <th>年龄</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>御坂美琴</td>
            <td>16</td>
        </tr>
    </tbody>
</table>
```

在`<th>`或`<td>`中使用`colspan`或`rowspan`属性可以实现相邻单元格跨列或跨行合并。

```html
<table>
    <tr>
        <!-- 跨列合并，因此 标题 独占一行 -->
        <th colspan="2">标题</th>
    </tr>
    <tr>
        <td>御坂美琴</td>
        <td>16</td>
    </tr>
</table>
```

## 列表

使用`<ul>`和`<ol>`定义一个无序 / 有序列表，在其中使用`<li>`定义列表项。注意，`<ul>`和`<ol>`中只允许包含`<li>`，其它任何元素都是不合法的。

```html
<ul>
    <li>苹果</li>
    <li>香蕉</li>
    <li>橘子</li>
</ul>
```

使用`<dl>`可以定义一个描述列表。它包含两个部分，分别为一个`<dt>`作为描述主题，以及若干个`<dd>`作为描述内容。

```html
<dl>
    <dt>帮助中心</dt>
    <dd>账户管理</dd>
    <dd>入坑指南</dd>
    <dd>订单操作</dd>
</dl>
```

## 表单

使用`<form>`创建一个表单区域，表单中可以包含下列各种交互控件，用来接收用户输入并发送到服务端，然后刷新当前页面以呈现服务端返回的新页面。不过需要注意的是，向服务端发送数据远不止提交表单一种方式，因为提交表单需要刷新页面，用户体验并不是特别好。而且其中的控件并不是依赖于表单才能使用，它们只是供用户输入数据，具体的提交方式还要看客户端如何处理。

| 属性         | 描述                                               | 取值          |
| ------------ | -------------------------------------------------- | ------------- |
| `action`     | 发送请求的服务端 URL                               |               |
| `enctype`    | 设置请求体的编码方式，在之后文件上传的部分才会用到 |               |
| `novalidate` | 布尔属性，禁止浏览器自动验证表单                   |               |
| `method`     | 发送表单数据的方式                                 | `get`或`post` |

### 单行输入控件

使用`<input>`元素创建单行输入控件。它们中的大部分使用`value`属性来保存数据，使用`name`属性值来命名，以便服务器区分。使用`type`属性可以设置控件的类型，根据其属性值的不同，它的功能也有所不同：

| 属性值     | 描述                                                                    |
| ---------- | ----------------------------------------------------------------------- |
| `text`     | 文本框                                                                  |
| `password` | 密码框                                                                  |
| `button`   | 普通按钮，通过`value`属性设置按钮上的文字                               |
| `submit`   | 提交按钮，通过`value`属性设置按钮上的文字                               |
| `radio`    | 单选框，每组单选框的`name`属性值必须相同                                |
| `checkbox` | 复选框，每组复选框的`name`属性值必须相同                                |
| `file`     | 文件上传控件                                                            |
| `email`    | 【☢️HTML5】邮箱地址框，浏览器会自动进行验证                             |
| `url`      | 【☢️HTML5】网址框，浏览器会自动进行验证                                 |
| `tel`      | 【☢️HTML5】电话号码框                                                   |
| `search`   | 【☢️HTML5】搜索框                                                       |
| `number`   | 【☢️HTML5】数字框，在移动端可以唤醒数字键盘，浏览器会自动进行验证       |
| `range`    | 【☢️HTML5】滑动数字框，通过`min`、`max`属性设置最值、`step`属性设置步长 |
| `color`    | 【☢️HTML5】颜色选择框                                                   |
| `date`     | 【☢️HTML5】日期选择框，在移动端可以唤醒日期选择控件                     |

除了上述属性之外，它还可能包含下列的其它属性：

| 属性           | 描述                                                                                       |
| -------------- | ------------------------------------------------------------------------------------------ |
| `checked`      | 布尔属性，设置默认选中，只适用于单选框或复选框                                             |
| `readonly`     | 布尔属性，设置只读                                                                         |
| `placeholder`  | 在文本输入框生成一段提示信息                                                               |
| `autofocus`    | 布尔属性，当页面加载后自动获得焦点。但是该属性拥有兼容性问题，即使是现代浏览器也可能不支持 |
| `autocomplete` | 可选值为`on`或`off`，自动填充之前提交过的表单数据，建议关闭                                |
| `multiple`     | 布尔属性，使文件上传控件可以一次选择多个文件                                               |

### 下拉菜单

通过`<select>`可以创建一个下拉菜单，其中的`<option>`用来设置选项。每个`<option>`的`value`属性值为提交的数据，如果`value`为空，则提交`<option>`包裹的内容。

不过，由于`<select>`表单不可能使用 CSS 在不同浏览器中获得统一的样式，因此建议使用第三方库中对应的插件，或者通过其它元素自己实现一个下拉菜单。

### 按钮

通过`<button>`也可以创建一个按钮，如同`<input type="button">`一样，不过它是一个双标签，包裹的内容为按钮的文字。根据它的`type`属性值不同，按钮的作用也有所不同：

| 取值     | 描述                 |
| -------- | -------------------- |
| `submit` | 默认值，提交表单按钮 |
| `reset`  | 重置表单按钮         |
| `button` | 普通按钮             |

注意，它的`type`属性默认值是`submit`，也就是说，如果它在表单中的话，即便没有设置`type`属性，点击后也会直接提交表单。

### 文本域

通过`<textarea>`可以创建一个文本域，用于输入多行文本。标签包裹的内容为提交的数据，`name`属性值为文本域名称，以便服务器区分。

为文本域添加如下的 CSS 代码，可以禁止用户自由缩放。

```css
textarea {
    resize: none;
}
```

### 标签

通过`<label>`可以为表单控件设置一个标签。如果点击`<label>`内的文本，浏览器就会自动将焦点设置到`<label>`绑定的表单控件上。

它只有一个`for`属性，在其中传入元素的`id`属性值，就可以将标签与表单元素绑定。或者直接将控件放到标签元素中，也可以实现同样效果。

```html
<label for="username">姓名:</label>
<input type="text" id="username" />

<label>姓名:<input type="text"/></label>
```

## 多媒体

### 图片

使用`<img>`定义一张图片。

| 属性    | 描述                       |
| ------- | -------------------------- |
| `src`   | 图片的 URL                 |
| `alt`   | 当图片加载失败时的替代文本 |
| `title` | 当鼠标悬停时的显示文本     |

```html
<img src="test.jpg" alt="这是一张神奇的图片" />
```

### 音频

使用`<audio>`可以定义一个音频，但是目前由于版权问题，浏览器支持的格式各不相同。

| 属性       | 描述                                                                   |
| ---------- | ---------------------------------------------------------------------- |
| `src`      | 音频的 URL                                                             |
| `autoplay` | 布尔属性，音频在就绪后立刻自动播放，2018 年 1 月 Chrome 浏览器将其禁用 |
| `controls` | 布尔属性，显示播放控件，但各个浏览器样式不同                           |
| `loop`     | 布尔属性，开启洗脑循环                                                 |

为了解决这个问题，可以在一个`<audio>`中嵌套多个`<source>`标签，用来加载不同格式的音频。浏览器会从最上面的开始尝试加载，如果遇到不支持的格式，则自动尝试下一个。

```html
<audio autoplay controls loop>
    <source src="Level5.mp3" type="audio/mpeg" />
    <source src="Level5.ogg" type="audio/ogg" />
</audio>
```

### 视频

使用`<video>`定义一个视频，目前多数浏览器均支持`mp4`格式。它的属性如下：

| 属性       | 描述                                                                                    |
| ---------- | --------------------------------------------------------------------------------------- |
| `src`      | 视频的 URL                                                                              |
| `autoplay` | 布尔属性，视频在就绪后立刻自动播放，2018 年 1 月 Chrome 浏览器将其禁用，除非设置`muted` |
| `muted`    | 布尔属性，静音                                                                          |
| `controls` | 布尔属性，显示播放控件，但各个浏览器样式不同                                            |
| `loop`     | 布尔属性，开启洗脑循环                                                                  |

```html
<video src="极乐净土.mp4" autoplay controls loop></video>
```

> 也可以直接将视频传到第三方视频网站（优酷、腾讯等），然后获取视频的分享地址，缺点是有广告植入，优点是节省自己服务器的空间。
