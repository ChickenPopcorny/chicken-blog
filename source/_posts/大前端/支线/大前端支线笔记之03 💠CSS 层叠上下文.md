---
title: 大前端支线笔记之03 💠 CSS 层叠上下文
date: 2020-01-23 7:17:55
abbrlink: xsvc751j
tags: CSS
categories: 
- 大前端
- 支线
excerpt: 与 BFC 类似，某些元素也具有层叠上下文（Stacking Context）的特性，在同一个层叠上下文中的元素，会按照下列顺序层叠在一起。
---

# 💠 CSS 层叠上下文

与 BFC 类似，某些元素也具有层叠上下文（Stacking Context）的特性，在同一个层叠上下文中的元素，会按照下列顺序层叠在一起。

![](https://pic2.superbed.cn/item/5dfadcdb76085c3289b81f74.jpg)

> 注意，其中**负数**的`z-index`定位元素甚至比文档流中的元素位置还要低。

要使一个元素拥有层叠上下文特性，只需满足下列条件之一：

* 根元素`<html>`
* `z-index`不为`auto`
* `opcacity`的值小于`1`
* `transform`的值不为`none`
* `perspective`的值不为`none`

在下面的代码中，`.a`元素没有定位，`.a-child`元素使用了绝对定位，并设置了`z-index: 1`，`.b`元素也设置了绝对定位，但是没有设置层叠顺序，因此它们的位置应该是`.a-child`最高，中间是`.b`，最底层是`.a`。（左图）

```html
<div class="a">
    <div class="a-child"></div>
</div>

<div class="b"></div>
```

```css
.a-child {
    position: absolute;
    z-index: 1;
}

.b {
    position: absolute;
    z-index: 0;
}
```

但是，如果`.a`设置了`transform: scale(1)`，那么它就会创建一个**独立的层叠上下文**。此时，由于`.a`的层级不如`.b`高（`.b`有绝对定位，而`.a`没有定位），那么无论`.a-child`层级有多高，也无法摆脱`.a`的限制。也就是说，`.a-child`设置的`z-index`只能与`.a`的其它子元素相比，而无法与整个文档的元素相比了。（右图）

```css
.a {
    transform: scale(1);
}
```

![](https://pic3.superbed.cn/item/5dfae5d076085c3289b9b3c6.jpg)