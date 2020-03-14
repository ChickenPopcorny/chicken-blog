---
title: 大前端笔记之07 🎨 CSS 背景
date: 2020-01-23 0:53:12
abbrlink: 86mehcq2
tags: CSS
categories: 大前端
excerpt: 元素可以通过下面的属性设置背景颜色或图片。
---

# 大前端笔记之07 🎨 CSS 背景

元素可以通过下面的属性设置背景颜色或图片。

## 背景颜色

使用`background-color`设置元素的背景颜色。

| 适用于 | 继承性 | 默认值 |
| --- | --- | --- |
| 所有元素 | 不可继承 | `transparent` |

| 可选值 | 描述 |
| --- | --- |
| `transparent` | 透明背景 |
| 颜色值 | 设置具体的背景颜色 |

## 背景图片

使用`background-image`设置元素的背景图片。

| 适用于 | 继承性 | 默认值 |
| --- | --- | --- |
| 所有元素 | 不可继承 | `none` |

| 可选值 | 描述 |
| --- | --- |
| `none` | 没有背景图片 |
| `url()` | 图片的 URL |
| `linear-gradient()` | 设置[渐变](/posts/qvto1gxk.html)背景 |

如果同时设置了背景颜色和图片，那么**图片永远在最上层**，只有图片没有覆盖的区域才会显示为背景色。

如果要同时添加多个背景图片，只要将路径使用逗号隔开即可。此时**最左边的图片层叠优先级最高**，向右依次递减：

```css
div { background-image: url("bg01.png"), url("bg02.gif"); }
```

## 背景平铺

使用`background-repeat`设置背景的平铺方式。

| 适用于 | 继承性 | 默认值 |
| --- | --- | --- |
| 所有元素 | 不可继承 | `repeat` |

下面的四个值可以出现最多两次，以空格隔开，分别设置水平和垂直方向的平铺方式。如果省略了其中一个，表示该值同时作用于两个方向。

| 可选值 | 描述 |
| --- | --- |
| `repeat` | 在水平和垂直方向平铺 |
| `no-repeat` | 不平铺 |
| `space` | 根据元素的宽高自动调整背景平铺的数量，图片不会被裁切或压缩，多余的空间会被平分为图片的间隔。例如，背景图片宽为`300px`，元素宽度为`800px`，那么会显示两张图片，其余的`200px`作为背景的间隔 |
| `round` | 根据元素的宽高自动调整背景平铺的数量，图片会被压缩，因此不会产生多余空间。例如，背景图片宽为`300px`，元素宽度为`800px`，那么会显示三张图片，每张图片宽度调整为`266.67px` |

下面的两个值只能出现一次，表示仅在某个方向平铺，而另外一个方向不平铺。

| 可选值 | 描述 |
| --- | --- |
| `repeat-x` | 仅在水平方向平铺 |
| `repeat-y` | 仅在垂直方向平铺 |

```css
div { 
    background-repeat: repeat no-repeat;
    /* 相当于 */
    background-repeat: repeat-x;
}
```

## 背景位置

使用`background-position`设置背景在元素中的位置。

| 适用于 | 继承性 | 默认值 |
| --- | --- | --- |
| 所有元素 | 不可继承 | `0% 0%` |

| 可选值 | 描述 |
| --- | --- |
| 长度值 | 表示以元素**左上角**为起始点的偏移量，可以为负值 |
| `top`/`right`/`bottom`/`left`/`center` | 表示背景紧靠该方向 |
| 百分比值 | 相对的值为**元素的宽高 - 背景的宽高**，因此左上角为`0% 0%`，右下角为`100% 100%`，居中则是`50% 50%` |

上述可选值根据数量不同，表示的含义也不同：

| 值的数量 | 描述 |
| --- | --- |
| 1 个长度值 | 该值表示水平方向，垂直方向为`center` |
| 2 个长度值 | 前者表示水平方向，后者表示垂直方向 |
| 1 个关键字 | 表示背景紧靠该方向，另外一个方向为`center` |
| 2 个关键字 | 分别表示水平和垂直方向，顺序并不重要，只要方向不冲突即可 |
| 1 个关键字 + 1 个长度值 | 前者表示水平方向，后者表示垂直方向。如果前面的值不为水平方向关键字，后面的值不为垂直方向关键字，那么该值无效 |
| 4 个值 | 1 个关键字和 1 个长度表示**与这个方向的距离** |

```css
div {
    background-position: 10px;                      /* 距离左侧 10px，垂直方向居中 */
    background-position: 10px 20px;                 /* 距离左侧 10px，距离上方 20px */
    background-position: bottom;                    /* 垂直方向位于底部，水平方向居中 */
    background-position: bottom left;               /* 位于左下 */
    background-position: left 10px;                 /* 水平方向位于左侧，垂直方向距离上方 10px */
    background-position: right 10px bottom 5px;     /* 距离右侧 10px，距离底部 15px */
}
```

## 背景固定

使用`background-attachment`设置背景相对于浏览器窗口定位。此时只有当元素位于背景的位置时，背景才能显示出来。即使两个背景的位置重合也没有关系，只要元素覆盖到自己的背景之上，那么背景就会显示出来。

注意，该属性会导致`background-position`相对于浏览器窗口设置位置，而非元素本身。

| 适用于 | 继承性 | 默认值 |
| --- | --- | --- |
| 所有元素 | 不可继承 | `scroll` |

| 可选值 | 描述 |
| --- | --- |
| `scroll` | 背景跟随元素滚动 |
| `fixed` | 背景固定，将元素背景以浏览器窗口作为参照物，而不是元素 |

## 背景区域

使用`background-clip`设置背景的**显示区域**。如果一个元素包含`padding`，而显示区域设置为`content-box`，那么背景会显示不全。

| 适用于 | 继承性 | 默认值 |
| --- | --- | --- |
| 所有元素 | 不可继承 | `border-box` |

| 可选值 | 描述 |
| --- | --- |
| `border-box` | 背景显示在`border`、`padding`和`content`区域 |
| `padding-box` | 背景显示在`padding`和`content`区域 |
| `content-box` | 背景显示在`content`区域 |

使用`background-origin`设置背景的**定位区域**，它可以修改图片渲染的**起始点**，但是不代表其它部分不渲染，只是起始点变了而已。

| 适用于 | 继承性 | 默认值 |
| --- | --- | --- |
| 所有元素 | 不可继承 | `padding-box` |

| 可选值 | 描述 |
| --- | --- |
| `padding-box` | 从`padding`区域开始绘制 |
| `border-box` | 从`border`区域开始绘制 |
| `content-box` | 从`content`区域开始绘制 |

![](https://pic.superbed.cn/item/5dfb1cca76085c3289c2e79d.jpg)

## 背景尺寸

使用`background-size`设置背景尺寸。

| 适用于 | 继承性 | 默认值 |
| --- | --- | --- |
| 所有元素 | 不可继承 | `auto auto` |

下面的值可以出现一至两次，以空格隔开，分别设置水平和垂直方向。如果只有一个值，那么它表示水平方向，垂直方向自动设置为`auto`。

| 可选值 | 描述 |
| --- | --- |
| `auto` | 使用图片本身的尺寸，如果其中一个方向尺寸被改变了，那么`auto`表示等比例缩放 |
| 长度值 | 设置固定的背景尺寸 |
| 百分比值 | 相对于`background-origin`区域的宽度或高度 |
| `cover` | 表示背景图片在**保持比例**的前提下填充满元素，超出的部分不会显示 |
| `contain` | 表示背景图片在**保持比例**的前提下完整的显示，多余的部分以空白填充 |

## 背景属性简写

使用`background`简写上述所有属性。将这些值以空格隔开，它们的顺序并不重要，也可以随意省略。不过注意`background-position`必须与`background-size`用`/`隔开。

```css
div {
    background: 
        orange              /* background-color */
        url("img.png")      /* background-image */
        no-repeat           /* background-repeat */
        fixed               /* background-attachment */
        center center / 50% /* background-position / background-size */
        content-box         /* background-origin */
        content-box;        /* background-clip */
}
```