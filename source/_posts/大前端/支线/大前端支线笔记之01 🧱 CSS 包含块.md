---
title: 大前端支线笔记之01 🧱 CSS 包含块
date: 2020-01-22 6:22:00
abbrlink: vv37590w
tags: CSS
categories: 
- 大前端
- 支线
excerpt: 包含块（containing block）是 CSS 布局中比较重要的一个概念，因为一个元素的布局或宽高均是由自身的包含块决定的。在不同的布局方式中，一个元素的包含块也会有所不同。
---

# 大前端支线笔记之01 🧱 CSS 包含块

包含块（containing block）是 CSS 布局中比较重要的一个概念，因为一个元素的布局或宽高均是由自身的包含块决定的。在不同的布局方式中，一个元素的包含块也会有所不同。

## 普通文档流

在普通文档流中，一个元素的包含块是其**最近父元素的内容区**。此时，子元素在**水平方向**上的`margin`、`border`、`padding`和`width`之和必须与包含块的宽度相等。

由于其中的`border`和`padding`只能是固定值，而`margin`和`width`能够设置为`auto`，表示根据情况来调整自身大小，以确保这个等式被满足。

注意，只要`margin`与任何其它属性同时为`auto`，那么`margin`的`auto`会被视为`0`。

首先，当只有一个值为`auto`时，该值会自动调整宽度，以满足等式。

```html
<div>
    <p></p>
</div>
```

```css
div { width: 500px; }
p {
    margin-left: auto; /* auto 会被计算为 300px */
    margin-right: 100px;
    width: 100px;
}
```

当两个`margin`的值为`auto`时，那么它们会**等分剩余的距离**以满足等式，从而使该元素在包含块中居中，这是**块级元素水平居中方式**之一。

```css
div { width: 500px; }
p {
    margin-left: auto; 
    margin-right: auto; /* 左右外边距均是（ 500-300 ）/ 2 = 100px */
    width: 300px;
}
```

当三个属性都为固定值，而且加起来也不够包含块的宽度，此时浏览器会**强制将`margin-right`设置为`auto`**，以满足等式。

```css
div { width: 500px; }
p {
    margin-left: 100px; 
    margin-right: 100px; /* 右外边距会被强行设置为 auto，从而被计算为 300px */
    width: 100px;
}
```

如果三个固定值加起来超过了包含块宽度，那么子元素就会超出包含块，导致一部分位于包含块外部。

## 定位元素

定位元素的包含块与普通文档流有所不同：

* 绝对定位：为最近的**定位**父元素，直到最外层的`<html>`元素
    * 如果父元素是块级盒子，那么包含块是父元素的**内边距**
    * 如果父元素是行内盒子，那么包含块是父元素的**内容区**
* 相对定位：为最近的父元素内容区
* 固定定位：为浏览器窗口

与普通文档流一样，定位元素也要满足包含块的等式。但是，普通文档流的等式仅针对水平方向，而定位元素的公式也同时适用于**垂直方向**。

以水平方向为例，定位元素水平方向上的`margin`、`border`、`padding`、`width`、`left`和`right`之和必须与包含块宽度相等。

其中`border`和`Padding`的值只能是固定值，而`margin`、`width`、`left`和`right`都能够设置为`auto`从而根据情况来调整自身大小，以确保这个等式被满足。注意，只要`margin`和任何一个属性都为`auto`，那么`margin`的`auto`会被视为`0`。

当 5 个值（`margin-left`、`margin-right`、`width`、`left`、`right`）中只有一个为`auto`，该值会自动调整宽度，以满足等式。

```css
div { 
    position: relative;
    width: 500px; 
}
p {
    position: absolute;
    left: 0;
    right: 0;
    margin-left: auto; /* auto 会被计算为 300px */
    margin-right: 100px;
    width: 100px;
}
```

当 2 个`margin`的值为`auto`，那么它们会**等分剩余的距离**以满足等式，如果要居中元素，最好将对立的偏移量设置为**同一个值**（比如`0`）.

```css
p {
    position: absolute;
    left: 0;
    right: 0;
    margin-left: auto; /* ( 500-100 ) / 2 = 200px */
    margin-right: auto; /* 同上 */
    width: 100px;
}
```

当 2 个偏移量为`auto`，那么元素位于**定位之前的位置**。相当于仅仅为一个元素设置了绝对定位，而没有设置偏移量。

当`width`和 1 个偏移量为`auto`，那么`width`会收缩到最小，由偏移量满足公式。

当`width`和 2 个偏移量为`auto`，那么`width`会收缩到最小，元素位于定位之前的位置。

当 5 个属性都为固定值，而且加起来也不够包含块的宽度，`right`会被视为`auto`。