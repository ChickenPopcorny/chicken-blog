---
title: 大前端支线笔记之04 🌈 CSS 渐变
date: 2020-01-23 9:15:55
abbrlink: qvto1gxk
tags: CSS
categories: 
- 大前端
- 支线
excerpt: 渐变的本质是图片，因此只要是允许使用图片路径<code>url()</code>的属性，都可以使用渐变。CSS 中的渐变分为两种，线性渐变和径向渐变。
---

# 大前端支线笔记之04 🌈 CSS 渐变

渐变的**本质是图片**，因此只要是允许使用图片路径`url()`的属性，都可以使用渐变。CSS 中的渐变分为两种，线性渐变和径向渐变。

## 线性渐变

使用`linear-gradient()`设置线性渐变，它可以包含下面三个参数，参数之间使用逗号隔开。

### 渐变方向

第一个参数是渐变方向，它的可选值为：

| 参数 | 描述 |
| --- | --- |
| `to top`/`to right`/`to bottom`/`to left` | 表示**朝某个方向**渐变 |
| 角度值 | `0deg`表示从元素的正下方开始渐变，然后顺时针旋转，度数随之增加，如`90deg`表示从左到右渐变 |

```css
div { background-image: linear-gradient(to right); }
```

### 色标

第二个参数是色标，分别表示渐变的起始色和终止色。

默认情况下，第一个色标的位置为`0%`，最后一个色标的位置为`100%`，色标所在的位置也就是该颜色（纯色）的位置。如下面左图中，元素的最右侧即`100%`的位置正好是正黄色。如果有多个色标，那么它们会**平均分布**（右图）。

```css
div {
    background-image: linear-gradient(90deg, #66ccff, yellow); /* 两个色标 */
    background-image: linear-gradient(90deg, #66ccff, yellow, orange); /* 三个色标 */
}
```

![](https://pic1.superbed.cn/item/5dfb118176085c3289c102f3.jpg)

如果要修改色标的位置，可以在颜色值后面添加一个长度值或者百分比值（相对于元素大小）。

此时由于渐变并不足以铺满整个元素，因此到`50%`的位置就结束了，**剩余的位置以最后的色标来填充**。如果渐变的距离大于元素，那么多余的渐变也会被直接截掉。

```css
div {
    background-image: linear-gradient(90deg, #66ccff, yellow 25%, orange 50%);
}
```

![](https://pic3.superbed.cn/item/5dfb132376085c3289c14bef.jpg)

如果两个色标的位置相同，那么它们之间不会有渐变的效果。

```css
div {
    background-image: linear-gradient(90deg, #66ccff, yellow 50%, orange 50%);
}
```

![](https://pic1.superbed.cn/item/5dfb142a76085c3289c17c47.jpg)

### 中色点

在两个色标参数之间还可以插入一个百分比值，作为第三个参数中色点。默认情况下，两种颜色之间的渐变，中间`50%`的位置正好是两个颜色的中点。如果设置了中色点，那么这个中间颜色就会向前 / 向后推移。

```css
div {
    background-image: linear-gradient(90deg, #66ccff, 25%, orange);
}
```

![](http://q45cwniav.bkt.clouddn.com/superbed/2020/01/23/5e29c1a02fb38b8c3c4cd3f1.jpg)

## 径向渐变

径向渐变`radial-gradient()`的语法与线性渐变基本一致，但是不需要设置方向，取而代之的是形状、尺寸和位置。

### 形状

径向渐变的形状可选值为圆形`circle`和椭圆`ellipse`，默认与元素的形状一致。如果设置一个正方形的元素为椭圆形状的渐变，那么也不会看出效果，因为即便是椭圆，它的长和宽也是一样的。

```css
div {
    width: 200px;
    height: 100px;
    background-image: radial-gradient(ellipse, orange, #333); /* 左图 */
    background-image: radial-gradient(circle, orange, #333);  /* 右图 */
}
```

![](https://pic3.superbed.cn/item/5dfb2a9176085c3289c5b705.jpg)

### 尺寸

在形状的后面还可以添加长度值表示渐变的大小。1 个值同时表示水平和垂直方向，只能用于圆形；2 个值则前者表示水平，后者表示垂直方向，只能用于椭圆。

```css
div {
    width: 200px;
    height: 200px;
    background-image: radial-gradient(100px, orange, #333); /* 左图 */
    background-image: radial-gradient(50px 200px, orange, #333); /* 右图 */
}
```

![](https://pic3.superbed.cn/item/5dfb2abe76085c3289c5c33b.jpg)

### 位置

默认情况下，径向渐变圆心的位置为元素的中心，在尺寸值的后面（如果有的话）添加`at 位置`可以设置圆心的位置。位置参数与背景`background-position`属性的值完全一样，区别在于位置参数的默认值不是`0% 0%`，而是`center`。

```css
div {
    width: 200px;
    height: 200px;
    background-image: radial-gradient(100px at left bottom, orange, #333);
}
```

![](https://pic3.superbed.cn/item/5dfb2d9276085c3289c64dea.jpg)