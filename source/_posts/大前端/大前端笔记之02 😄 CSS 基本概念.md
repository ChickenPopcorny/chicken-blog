---
title: 大前端笔记之02 😄 CSS 基本概念
date: 2020-01-20 16:38:18
abbrlink: vayido08
tags: CSS
categories: 大前端
excerpt: CSS（Cascading Style Sheets，层叠样式表）是一种样式表语言，可以用来对 HTML 文档进行装饰。
---

# 大前端笔记之02 😄 CSS 基本概念

CSS（Cascading Style Sheets，层叠样式表）是一种样式表语言，可以用来对 HTML 文档进行装饰。

## 基础语法

CSS 的语法非常简单，每个 CSS 文档由若干条规则组成，每条规则以选择器开头，然后紧跟一个声明块`{}`。声明块中包含若干条声明，每条声明需要以分号结尾。每条声明又由两部分组成，分别为属性名和属性值，以`:`隔开。

```css
div { /* 选择器 */
    font-size: 16px; /* 声明 */
    color: #66ccff;
}
```

## 引入 CSS

要在 HTML 文档中加载创建好的 CSS 共有以下三种方式。

第一种是直接在元素上使用`style`属性，将声明作为属性值写在里面，那么这些声明就会应用在该元素上，这样的方式称为**内联样式**。但是这样的方式不方便 CSS 规则的重用，修改起来也非常麻烦，因此并不常用。

```html
<div style="color: #66ccff;"></div>
```

第二种方式是在`<head>`中使用`<style>`元素，然后将规则写在里面。但是如果 CSS 规则比较多，那么就会使得 HTML 页面变得很长，可读性变差。

```html
<head>
    <style>
        div { color: #66ccff; }
    </style>
</head>
```

第三种是将规则定义在一个单独的 CSS 文件中，然后在`<head>`中使用`<link>`元素将文件引入。这样的方式符合结构与样式分离的原则，最为常用。

| 属性 | 描述 |
| --- | --- |
| `rel` | 通常为固定值`stylesheet`，表示引入的外部文件是样式表，不可省略 |
| `href` | 样式表的 URL |

```html
<head>
    <link rel="stylesheet" href="test.css">
</head>
```

```css
/* CSS 文件 test.css */
div { color: #66ccff; }
```

## 元素分类

CSS 将元素分成了不同的种类，有些属性只能适用于特定种类的元素。注意，HTML 也规定了块级元素和行内元素，例如行内元素`<span>`只能包含其它行内元素，但是不能包裹`<p>`这样的块级元素。但是 CSS 定义的块级元素和行内元素只是让元素拥有特定的样式表现，并且可以通过`display`属性修改。然而这并不能修改其本身的定义，也就是说，在任何情况下让`<span>`包裹`<p>`都是不合法的。

CSS 中块级元素与行内元素的主要区别在于：

|  | 块级元素 | 行内元素 |
| --- | --- | --- |
| 宽高 | 通过`width`和`height`控制 | 只能通过`line-height`控制高度 |
| 边距和边框 | 四个方向均有效果 | 只有**水平**方向生效，垂直方向虽然可以添加，但是**不会影响布局** |
| 排列方式 | 独占一行 | 相互紧靠排列 |
| 默认宽度 | 与父元素的宽度相等 | 根据内容收缩 |
| 嵌套 | 可以包裹块级元素（`<p>`除外）或行内元素 | 只能包裹行内元素（`<a>`除外）|

除此之外还有一种比较特殊的行内块元素，它既可以像行内元素与其它元素排在一行，也可以设置宽高。

元素还分为替换元素和非替换元素两种。替换元素是指其内容可以被替换的元素，这些内容并不会在文档中直接表现出来，如`<img>`元素以及各类表单控件元素。替换元素的一个明显特征就是**自带宽度和高度**，除此之外，它与**行内块元素**的表现效果基本是一样的。

## 特性

CSS 本身有一些语法上的特性，了解这些特性可以更好地理解某些情况下最终渲染出的效果。

### 继承性

CSS 属性可以继承，也就是说，一些样式不仅会应用于选择的元素上，还会影响它的后代元素。注意，有些属性（如盒模型属性）没有继承性。

在下面的代码中，`<h1>`和`<em>`中的文本都会变成灰色，因为`<em>`从`<h1>`继承了`color`属性。

```html
<h1>Meerkat<em>Central</em></h1>
```

```css
h1 { color: gray; }
```

### 优先级

如果有多个样式适用于同一个元素，那么浏览器会计算每个样式的优先级，优先级最高的样式最终会被应用到元素上，其它的样式则会被忽略。

```css
/* 标题的实际颜色为 橙色 */
body h1 { color: orange; }
h1 { color: red; }
```

优先级由[选择器](/posts/1lc5rbtd.html)决定，可以使用一个五位数`00000`（不能进位）来表示优先级。具体规则如下：

- 行内样式，加`1000`分
- 选择器每包含一个`#id`，加`100`分
- 选择器每包含一个`.class`、`[attr]`或者`:pseudo-class`，加`10`分
- 选择器每包含一个`元素名`或者`::pseudo-element`，加`1`分
- 通配选择器`*`加`0`分
- 选择器组合没有特定性
- 继承的属性没有特定性
- 带有`!important`的规则，加`10000`分（继承的`!important`也没有特定性）

注意，优先级为`0`依然比没有优先级要高。在下面的代码中，`<strong>`会从`<p>`继承红色，并且通配符又设置该元素为灰色。那么由于通配符的优先级为`0`，而继承的红色没有优先级，因此`<strong>`最终会显示为灰色。

```html
<p>看我<strong>变色</strong>啦~</p>
```

```css
* { color: gray; }
p { color: red; }
```

如果两个规则的优先级相同，那么后引入的样式表中的规则更重要，如果两个规则在同一张样式表中，那么靠后的规则更重要。

## 浏览器渲染引擎

有些属性前可能会带有`-webkit-`这样的前缀，这是因为一些属性处于实验性状态或者是该浏览器专有，使用前缀标明之后，就可以防止与其它浏览器的同属性发生冲突。

下面是目前常见浏览器的引擎和前缀：

| 浏览器 | 引擎 | CSS 前缀 |
| --- | --- | --- |
| IE | Trident | `-ms-` |
| Edge | ~~EdgeHTML~~ → Blink | `-ms-`和`-webkit-`（Blink） |
| Firefox | Gecko | `-moz-` |
| Opera | ~~Presto~~ → Blink | `-o-`（Presto）和`-webkit-`（Blink）|
| Safari | Webkit | `-webkit-` |
| Chrome | ~~Webkit~~ → Blink | `-webkit-` |

> 注意，这只是浏览器样式的渲染引擎，对于解析 JavaScript 来说，使用的通常是 V8 引擎。