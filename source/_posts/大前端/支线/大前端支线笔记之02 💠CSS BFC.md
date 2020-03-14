---
title: 大前端支线笔记之02 💠 CSS BFC
date: 2020-01-22 23:20:26
abbrlink: 9obo9xpo
tags: CSS
categories: 
- 大前端
- 支线
excerpt: BFC（Block Formatting Context，块级格式化上下文）指的是一个元素的特性，拥有该特性的元素可以生成一个独立的空间，无论其内部的元素如何改变，都不可能脱离出这个空间。
---

# 大前端支线笔记之02 💠CSS BFC

BFC（Block Formatting Context，块级格式化上下文）指的是一个元素的特性，拥有该特性的元素可以生成一个独立的空间，无论其内部的元素如何改变，都不可能脱离出这个空间。例如，整个文档的根元素`<html>`就具有 BFC 特性，因此所有的元素都不可能从中脱离出去。

要使一个元素拥有 BFC 特性，只需满足下列条件之一：

* 根元素`<html>`
* 浮动元素，即`float`的值不是`none`
* 定位元素，即`position`的值不是`static`或`relative`
* 行内块元素，即`display`的值是`inline-block`
* 弹性元素，即`display`的值是`flex`或`inline-flex`
* `overflow`值不是`visible`的元素

当一个元素满足以上条件之一，那么就会触发该元素的 BFC。

在下面的代码中，容器`.container`仅包含了一个浮动元素和一些文本内容，可以看到容器的高度仅受文本影响，浮动的元素完全超出了容器（左图）。

```html
<div class="container">
    <div class="float-box"></div>
    这是容器的内容啦
</div>
```

```css
.container { width: 300px; }
.float-box {
    float: left;
    width: 100px;
    height: 100px;
}
```

但是如果为容器添加了`overflow: hidden`，即触发了容器的 BFC 之后，那么此时它的子元素是无论如何也不会跑到父元素之外的，因此容器的高度被撑大了。

```css
.container { 
    overflow: hidden;
    width: 300px; 
}
```

![](https://pic1.superbed.cn/item/5dfac6c276085c3289b438d3.jpg)