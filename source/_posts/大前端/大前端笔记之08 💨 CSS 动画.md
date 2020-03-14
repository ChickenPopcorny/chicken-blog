---
title: 大前端笔记之08 💨 CSS 动画
date: 2020-01-23 23:27:28
abbrlink: sa91bwec
tags: CSS
categories: 大前端
excerpt: CSS3 中提供了原生的动画效果，相比于之前使用 JavaScript 操作 DOM 实现的动画效果，它的性能更高。
---

# 大前端笔记之08 💨 CSS 动画

CSS3 中提供了原生的动画效果，相比于之前使用 JavaScript 操作 DOM 实现的动画效果，它的性能更高。

## 过渡

过渡可以使元素从一种状态平滑的过渡到另外一种状态。

### 过渡属性

首先，在要过渡的元素上添加`transition-property`属性，指明要过渡的属性。

| 适用于 | 继承性 | 默认值 |
| --- | --- | --- |
| 所有元素 | 不可继承 | `all` |

| 可选值 | 描述 |
| --- | --- |
| `all` | 表示所有可过渡的属性（并不是所有的属性都可以被过渡） |
| 属性名 | 要过渡的属性，如果有多个属性以逗号分隔 |

```css
div { transition-property: width, height; }
```

### 过渡时间

使用`transition-duration`设置过渡的持续时间。**该属性不能省略**，因为它的默认值为`0s`，即没有过渡效果。

| 适用于 | 继承性 | 默认值 |
| --- | --- | --- |
| 所有元素 | 不可继承 | `0s` |

| 可选值 | 描述 |
| --- | --- |
| 时间值 | 表示过渡的持续时间 |

```css
div { transition-duration: .3s; }
```

### 调速函数

使用`transition-timing-function`设置过渡的调速函数。

| 适用于 | 继承性 | 默认值 |
| --- | --- | --- |
| 所有元素 | 不可继承 | `ease` |

| 可选值 | 描述 |
| --- | --- |
| `ease` | 中间速度快，开始和结束速度慢 |
| `ease-in-out` | 中间速度慢，开始和结束速度快 |
| `ease-in` | 开始时速度慢，然后逐渐加速 |
| `ease-out` | 开始时速度快，然后逐渐减速 |
| `linear` | 匀速 |
| `steps()` | 将平滑的动画切割成[逐帧动画](/posts/m69g0i43.html)显示 |

```css
div { transition-timing-function: linear; }
```

### 延迟时间

使用`transition-delay`设置过渡的延迟时间。

| 适用于 | 继承性 | 默认值 |
| --- | --- | --- |
| 所有元素 | 不可继承 | `0s` |

| 可选值 | 描述 |
| --- | --- |
| 时间值 | 表示过渡的延迟时间，`0s`表示立刻开始 |

### 过渡属性简写

使用`transition`简写上述所有属性。除了`transition-duration`之外，其它值均可以被省略，而且顺序也不重要。不过，如果有两个时间值，则前者表示持续时间，后者表示延迟时间；如果只有一个时间值，那么它表示持续时间。如果要同时定义多个不同的过渡属性，那么使用逗号将其隔开。

```css
div {
    transition: 
        width 3s ease 0.5s,
        height 1s ease 0s;
}
```

## 关键帧动画

过渡只能实现两种状态之间的变化，如果需要更复杂的动画效果，CSS 还提供了更强大的关键帧动画。

> 与过渡一样，关键帧动画也可以使用`animation-duration`、`animation-timing-function`和`animation-delay`设置动画的持续时间，调速函数和延迟时间。这些属性的用法与可选值与过渡完全一样，不再赘述。

### 关键帧

要使用关键帧动画，首先需要使用`@keyframes`定义关键帧，它由关键帧名称以及关键帧块组成。在关键帧块中可以设置动画过程中某个时间节点的属性值，它们的值可以是：

| 时间节点 | 描述 |
| --- | --- |
| 百分比值 | 设置动画具体的时间节点，`0%`为动画开始节点，`100%`为动画结束节点 |
| 关键字 | `from`相当于`0%`、`to`相当于`100%` |

```css
@keyframes change-color {
    from { background-color: orange; }
    to { background-color: green; }
}

@keyframes change-shape {
    0% { width: 50px }
    50% { width: 100px; }
    100% { width: 200px; }
}
```

如果省略了`100%`的关键帧，那么它会与之前最近的关键帧相同。

### 动画名称

使用`animation-name`将关键帧绑定到某个元素上，就可以使其拥有关键帧的动画效果，该属性不能省略。

| 适用于 | 继承性 | 默认值 |
| --- | --- | --- |
| 所有元素 | 不可继承 | `none` |

| 可选值 | 描述 |
| --- | --- |
| 关键帧名称 | 要绑定到元素上的关键帧 |

```css
div {
    animation-name: change-color;
}
```

### 播放次数

使用`animation-iteration-count`设置动画的播放次数，具体来说，它指的是动画**执行期**的循环次数（见下文）。

| 适用于 | 继承性 | 默认值 |
| --- | --- | --- |
| 所有元素 | 不可继承 | `1` |

| 可选值 | 描述 |
| --- | --- |
| 整数值 | 设置具体的播放次数 |
| `infinite` | 表示循环播放 |

### 动画方向

使用`animation-direction`设置动画的播放方向。

| 适用于 | 继承性 | 默认值 |
| --- | --- | --- |
| 所有元素 | 不可继承 | `normal` |

| 可选值 | 描述 |
| --- | --- |
| `normal` | 正常播放 |
| `reverse` | 逆向播放 |
| `alternate` | 动画正常播放完成后，第二遍重新逆向播放 |
| `alternate-reverse` | 动画逆向播放完成后，第二遍重新正常播放 |

注意，逆向播放指的是第二遍播放动画时再逆向播放一遍，也就是说动画播放次数**至少要两次**才可以看到效果。以`0%`为动画第一帧，`100%`为动画最后一帧为例，通过下表来表示动画播放的方向：

| 属性 | 第一遍动画 | 第二遍动画 |
| --- | --- | --- |
| `normal` | 0% → 100% | 0% → 100% |
| `reverse` | 100% → 0% | 100% → 0% |
| `alternate` | 0% → 100% | 100% → 0% |
| `alternate-reverse` | 100% → 0% | 0% → 100% |

### 结束状态

使用`animation-fill-mode`设置动画结束时的状态。

| 适用于 | 继承性 | 默认值 |
| --- | --- | --- |
| 所有元素 | 不可继承 | `none` |

| 可选值 | 描述 |
| --- | --- |
| `none` | 等待期为初始状态，完成期为初始状态 |
| `backwards` | 等待期为第一帧，完成期为初始状态 |
| `forwards` | 等待期为初始状态，完成期为最后一帧 |
| `both` | 等待期为第一帧，完成期为最后一帧 |

该属性的可选值理解起来比较复杂，需要展开讨论。

首先，动画分为**初始状态、等待期、执行期、完成期**四个阶段。

**初始状态**指的是元素没有设置`animation`时处于的状态，也就是与动画效果无关的状态。只有在动画第一遍执行之前才会出现。

**等待期**是`animation-delay`设置的延迟时间，这段时间内元素的状态会受到该属性影响。

- 如果是`none`或`forwards`，那么等待期为初始状态
- 如果是`both`或`backwards`，那么等待期为第一帧

这里的第一帧根据`animationo-direction`会有所不同：

- 如果是`normal`或`alternate`，第一帧是`0%`
- 如果是`reverse`或`alternate-reverse`，第一帧是`100%`

**执行期**指的是延迟结束后动画的第一帧直到最后一帧。这里的最后一帧根据动画方向`animationo-direction`和播放次数`animation-iteration-count`也有所不同（第一帧与之相反即可）：

- 如果动画方向是`normal`，那么最后一帧为`100%`，与播放次数无关
- 如果动画方向是`reverse`，那么最后一帧为`0%`，与播放次数无关
- 如果动画方向是`alternate`，那么
  - 播放次数为单数，最后一帧为`100%`
  - 播放次数为双数，最后一帧为`0%`
- 如果动画方向是`alternate-reverse`，与`alternate`正好相反

**完成期**指的是动画执行完最后一帧后，元素的状态。注意，`infinite`的动画只有第一遍。

![](http://cdn.yesuanzao.cn/superbed/2020/01/24/5e2a109e2fb38b8c3c53ef95.gif)

```html
<div class="box">
    <div class="bar"></div>
</div>
```

```css
.bar { width: 0; /* 初始状态 */ }

@keyframes progress {
    0% { width: 30%; } /* 第一帧 */
    100% { width: 100%; } /* 最后一帧 */
}
```

> *参考资料*
> - [如何理解animation-fill-mode及其使用？- Druidiurd 的回答](https://segmentfault.com/q/1010000003867335)

### 播放状态

使用`animation-play-state`设置动画的播放状态。

| 适用于 | 继承性 | 默认值 |
| --- | --- | --- |
| 所有元素 | 不可继承 | `running` |

| 可选值 | 描述 |
| --- | --- |
| `running` | 正常播放 |
| `paused` | 暂停播放 |

```css
div:hover { animation-play-state: paused; }
```

### 动画属性简写

使用`animation`简写上述除了`animation-play-state`以外所有的属性。除了`animation-name`和`animation-duration`之外，其它值均可以被省略，而且顺序也不重要。不过，如果有两个时间值，则前者表示持续时间，后者表示延迟时间；如果只有一个时间值，那么它表示持续时间。

```css
div { animation: change-color 3s linear 0s infinite alternate forwards; }
```

## 变形

使用`transform`属性可以使元素在二维或三维空间内变形。注意，元素在变形后所占的**实际位置**均与变形前一样，不会影响其它元素的位置。

| 适用于 | 继承性 | 默认值 |
| --- | --- | --- |
| 块级元素和行内替换元素 | 不可继承 | `none` |

| 可选值 | 描述 |
| --- | --- |
| `none` | 没有变形 |

该属性的其它可选值为一个函数列表，包含下面的各种变形函数。要同时使用多个函数，只要将它们用**空格**隔开即可。浏览器会按照顺序从第一个函数开始执行，直到最后一个结束。因此，**即便是相同的函数，但顺序不同，也会导致不同的结果**。

注意，在关键帧动画中使用变形时，每个关键帧都是**相对于元素的初始状态**，而非变形后的状态。

### 移动

使用下列函数可以使元素沿着某条轴进行移动。

| 函数 | 描述 |
| --- | --- |
| `translateX()` | 水平方向移动，参数为长度值或百分比值（相对于自身边框区域宽度），正数表示向右移动，负数表示向左移动 |
| `translateY()` | 垂直方向移动，参数为长度值或百分比值（相对于自身边框区域高度），正数表示向下移动，负数表示向上移动 |
| `translate()` | 同时设置水平和垂直方向移动，如果省略了一个参数，那么它表示水平方向 |
| `translateZ()` | 前后方向移动，参数**只能为长度值**，正数表示向屏幕前方移动，负数表示向屏幕后方移动 |
| `translate3d()` | 同时设置水平、垂直和前后方向移动，三个参数均不能省略 |

```css
div { transform: translateX(100px) };               /* 向右 100px */
div { transform: translateY(100px) };               /* 向下 100px */
div { transform: translate(30px, 30px) };           /* 向右、向下 30px */
div { transform: translateZ(100px) };               /* 向前 100px */
div { transform: translate3d(10px, 30px, 50px) };   /* 向右 10px、向下 30px、向前 50px */
```

由于移动的百分比值是相对于元素自身的`border`区域计算，根据这个特性，也可以使**块级元素水平垂直居中**。首先通过绝对定位将子元素的左上角移动到中心位置，但是不同于之前使用负外边距的作法，而是使用`translate()`将其向回移动自身宽高的一半，这样的好处是不需要知道子元素的宽高，也不需要进行重新计算。

```css
.father {
    position: relative;
    width: 600px;
    height: 600px;
}
.child {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
```

### 缩放

使用下列函数可以将元素缩放。它们的参数均为无单位数值，而且必须是正数，表示原来大小的倍数：

| 函数 | 描述 |
| --- | --- |
| `scaleX()`/`scaleY()`/`scaleZ()` | 设置水平 / 垂直 / 前后的缩放倍数 |
| `scale()` | 同时设置水平和垂直方向的缩放倍数，如果省略了一个参数，那么它同时表示水平和垂直方向 |
| `scale3d()` | 同时设置水平、垂直和前后方向缩放，三个参数均不能省略 |

```css
div { transform: scale(2); } /* 元素会被放大两倍 */
```

注意，如果设置了元素阴影，那么**阴影也会被同时放大**。如果不希望改变阴影的效果，那么直接修改宽高即可。

![](https://ae01.alicdn.com/kf/Hbf26eec560bc4769a79c8283eeed55f4D.png)

### 倾斜

使用下列函数可以将元素倾斜，它们的参数均为角度值：

| 函数 | 描述 |
| --- | --- |
| `skewX()`/`skewY()` | 沿 x 轴 / y 轴倾斜 |

![](https://pic.superbed.cn/item/5dfbf6d376085c3289f17069.jpg)

### 旋转

使用下列函数可以将元素绕某个轴旋转，它们的参数均为角度值，正负均可。

| 函数 | 描述 |
| --- | --- |
| `rotateX()`/`rotateY()`/`rotateZ()` | 分别设置绕 x 轴 / y 轴 / z 轴旋转 |
| `rotate()` | 设置 2D 旋转，类似于`rotateZ()` |

![](https://pic.superbed.cn/item/5dfc068c76085c3289f34043.jpg)

注意，旋转会导致元素的**坐标轴同时旋转**，因此如果移动和旋转同时使用时，切记**先移动，再旋转**，否则元素会朝旋转后的方向移动。

```css
div { transform: translateX(100px) rotateZ(90deg); }
```

> 要记住`rotateX()`和`rotateY()`旋转的方向，可以将左手大拇指指向 x 轴或 y 轴的正方向（右和下），然后手指弯曲的方向就是正角度值旋转的方向。

### 透视

如果在 3D 空间内变形元素，那么必须使用透视才能使其表现出效果。浏览器通过透视值可以模拟出图像的近大远小，从而呈现出立体感。

使用`perspective`属性设置透视值，即**人眼距离屏幕的距离**。一般来说，将透视值固定为`500px`，然后调整元素的 3D 位置即可。注意，该元素必须设置给 3D 变形元素的**父元素**。

| 适用于 | 继承性 | 默认值 |
| --- | --- | --- |
| 变形元素 | 不可继承 | `none` |

| 可选值 | 描述 |
| --- | --- |
| `none` | 没有透视效果 |
| 长度值 | 设置具体的透视值 |

```css
body { perspective: 500px; }
div { transform: rotateX(45deg); }
```

此外，也可以使用函数`perspective()`来设置透视，此时该函数必须放在 3D 变形函数之前才能生效。

```css
div { transform: perspective(500px) rotateX(45deg); }
```

### 保留 3D 效果

使用`transform-style`属性保留元素 3D 变形后的效果，而不是与其它元素合并为一个平面。

| 适用于 | 继承性 | 默认值 |
| --- | --- | --- |
| 变形元素 | 不可继承 | `flat` |

| 可选值 | 描述 |
| --- | --- |
| `none` | 不保留 3D 效果 |
| `preserve-3d` | 保留 3D 效果 |

以 x 轴的旋转为例，当使用`rotateX()`和`perspective()`创建出一个具有透视效果的 3D 旋转后，如果再将父元素进行 3D 旋转，会发现两个元素已经合并到了一个平面，所谓 3D 旋转只是一个假象：

![](https://pic2.superbed.cn/item/5dfc075d76085c3289f3587b.jpg)

要保留 3D 效果，则要在**父元素**中设置`transform-style: preserve-3d`，表示保留变形后的 3D 效果。

![](https://pic2.superbed.cn/item/5dfc07bc76085c3289f3643e.jpg)

```html
<div class="outer">
    <div class="inner"></div>
</div>
```

```css
.outer {
    transform-style: preserve-3d; /* 保留变形后的 3D 效果 */
    transform: perspective(500px) rotateY(60deg);
}
.inner {
    transform: perspective(500px) rotateX(45deg);
}
```

### 变形中心点

使用`transform-origin`设置变形中心点的位置。

| 适用于 | 继承性 | 默认值 |
| --- | --- | --- |
| 变形元素 | 不可继承 | `50% 50%` |

| 可选值 | 描述 |
| --- | --- |
| 长度值 | 基于左上角的偏移量，`0 0`表示左上角 |
| 百分比值 |  |
| `left`/`right`/`top`/`bottom`/`center` | 表示中心点紧贴该方向 |

上述值可以出现一至两次，一个值表示同时表示水平和垂直方向，两个值则前者表示水平方向，后者表示垂直方向。

下图以旋转为例，分别表示参照点为元素中心，以及右下角`right bottom`的情况：

![](https://pic2.superbed.cn/item/5dfc089776085c3289f37f66.jpg)