---
title: 大前端笔记之09 👀 CSS 其它属性
date: 2020-01-26 8:47:14
abbrlink: lay8q60u
tags: CSS
categories: 大前端
excerpt: 由于一些属性不便于分类，因此在本节讨论。
---

# 大前端笔记之09 👀 CSS 其它属性

由于一些属性不便于分类，因此在本节讨论。

## 元素阴影

使用`box-shadow`为元素添加阴影。

| 适用于 | 继承性 | 默认值 |
| --- | --- | --- |
| 行内元素 | 不可继承 | `none` |

| 可选值 | 描述 |
| --- | --- |
| `none` | 没有元素阴影 |
| 长度值 | 两个值分别表示阴影水平和垂直方向的**偏移量**，正的数值表示阴影向右下方移动，负值表示阴影向左上方移动；如果有第三个长度值，则表示阴影的**模糊半径**，该值不能为负；如果有第四个长度值，则表示阴影的**扩大或缩小**，该效果发生在模糊之后 |
| 颜色值 | 必须放在长度值最后，表示阴影的颜色，默认为黑色 |
| `inset` | 表示阴影会生成在元素**内部**，它不能出现在长度值中间，其它位置均可 |

```css
div { box-shadow: 2px 2px 2px 2px #000 inset; }

/* 用逗号分隔，可以同时添加多个阴影效果 */
div { box-shadow: 1px 1px 2px #ccc, -2px -2px 1px blue; }
```

## 可见性

使用`visibility`设置元素是否可见。注意，设置不可见的元素依然会**影响布局**，相当于设置`opacity`为`0`，如果希望元素彻底消失则应该使用`display: none`。

| 适用于 | 继承性 | 默认值 |
| --- | --- | --- |
| 所有元素 | 不可继承 | `visible` |

| 可选值 | 描述 |
| --- | --- |
| `visible` | 元素可见 |
| `hidden` | 元素不可见 |

## 不透明度

使用`opacity`设置元素的**不透明度**。

| 适用于 | 继承性 | 默认值 |
| --- | --- | --- |
| 所有元素 | 可继承 | `1` |

| 可选值 | 描述 |
| --- | --- |
| 数字值 | `1`表示完全不透明，`0`表示完全透明，可以是`0`到`1`之间的任意数字值 |

## 溢出

使用`overflow`设置元素内容超出自身宽高时的处理方式。

| 适用于 | 继承性 | 默认值 |
| --- | --- | --- |
| 块级元素和行内替换元素 | 不可继承 | `visible` |

| 可选值 | 描述 |
| --- | --- |
| `visible` | 溢出部分会超出元素本身显示 |
| `hidden` | 溢出部分会被隐藏，且无法通过正常方式查看 |
| `scroll` | 总是生成滚动条，无论内容是否溢出 |
| `auto` | 如果内容溢出则生成滚动条，否则不生成 |

## 指针

使用`cursor`设置鼠标指针在元素上的样式，全部的可选值见[MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/cursor)。

| 适用于 | 继承性 | 默认值 |
| --- | --- | --- |
| 所有元素 | 可继承 | 根据元素决定 |

## 点击触摸

使用`pointer-events`使元素的**鼠标和触摸事件**失效，就好像是「透明」一样，可以用来阻止移动端的**图片点击预览**。

| 适用于 | 继承性 | 默认值 |
| --- | --- | --- |
| 所有元素 | 可继承 | `auto` |

| 可选值 | 描述 |
| --- | --- |
| `auto` | 事件正常触发 |
| `none` | 使鼠标和触摸事件失效 |

例如在超链接上覆盖一个半透明的元素，默认情况下，下面的超链接由于被覆盖，是不可以点击的。但是如果为半透明元素设置`pointer-events: none`，那么超链接就可以正常点击了。

![](http://cdn.yesuanzao.cn/superbed/2020/01/26/5e2ce7c02fb38b8c3c89b6a7.gif)

```html
<div class="box box-auto">
    <a href="https://www.google.com">这个链接点不到啦</a>
    <div class="mask"></div>
</div>

<div class="box box-none">
    <a href="https://www.google.com">这个链接可以点</a>
    <div class="mask"></div>
</div>
```

```css
.box {
    position: relative;
    width: 100px;
    height: 100px;
}

.mask {
    position: absolute;
    width: 100%;
    height: 100%;
}

.box-none > .mask { pointer-events: none; }
```

## 列表

使用`list-style-type`可以设置列表的标记样式，全部可选值见[MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/list-style-type)。

| 适用于 | 继承性 | 默认值 |
| --- | --- | --- |
| 列表项`<li>` | 可继承 | `none` |

使用`list-style-position`设置文本在发生换行时，标记在内容中的位置。由于该属性可操作性很低，因此如果使用复杂的列表标记，均是通过伪元素添加背景图片的方式来设置。

| 适用于 | 继承性 | 默认值 |
| --- | --- | --- |
| 列表项`<li>` | 可继承 | `outside` |

| 可选值 | 描述 |
| --- | --- |
| `outside` | 位于内容之外 |
| `inside` | 位于内容之内 |

## 清除点击高亮

使用☢️`-webkit-tap-highlight-color`可以清除移动端链接和按钮在点击时的高亮效果。

```css
a, button {
    -webkit-tap-highlight-color: transparent;
}
```

## 清除 iOS 控件的默认样式

使用☢️`-webkit-appearance`清除 iOS 中默认的表单控件样式（文本框自带内阴影、按钮自带圆角等），否则没法设置其它样式。注意，该属性会使 PC 端的控件消失：

```css
button {
    -webkit-appearance: none;
}
```

## 禁止长按弹出菜单

使用☢️`-webkit-touch-callout`禁止在移动端长按链接和图片时弹出的选择菜单。

```css
a, img {
    -webkit-touch-callout: none;
}
```