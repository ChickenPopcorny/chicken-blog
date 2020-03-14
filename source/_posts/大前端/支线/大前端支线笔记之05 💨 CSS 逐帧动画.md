---
title: 大前端支线笔记之05 💨 CSS 逐帧动画
date: 2020-01-24 0:04:24
abbrlink: m69g0i43
tags: CSS
categories: 
- 大前端
- 支线
excerpt: 过渡和动画默认的调速函数都是贝塞尔曲线，它会在动画的关键帧之间进行插值运算，使得关键帧之间变化的非常平滑和自然。但是，如果要实现类似于翻书的走马灯效果，那么中间的过渡反而是多余的。
---

# 大前端支线笔记之05 💨 CSS 逐帧动画

过渡和动画默认的调速函数都是贝塞尔曲线，它会在动画的关键帧之间进行插值运算，使得关键帧之间变化的非常平滑和自然。但是，如果要实现类似于翻书的走马灯效果，那么中间的过渡反而是多余的。

> 使用 GIF 图片也是一种选择，但是 GIF 颜色十分单一，并且不具备半透明效果，同时也不方便修改动画速度等参数。

使用调速函数（`transition-timing-function`或`animation-timing-function`）的`steps()`函数可以使动画逐帧显示，其中的整数值参数表示将**两个关键帧之间的部分**分成几份，而不是整段动画，这一点对于关键帧动画来说尤其需要注意。

首先，使用逐帧动画实现进度条填充的效果，为了方便理解，将其简化成两个阶段，分别为阶段 1（`0px ~ 250px`）和阶段 2（`250px ~ 500px`）。

![](http://q45cwniav.bkt.clouddn.com/superbed/2020/01/24/5e29d11d2fb38b8c3c4e5e11.gif)

```html
<div class="container">
    <div class="bar"></div>
</div>
```

```css
.container { width: 500px; }

.bar {
    width: 0%; /* 为了还原现象，需要手动设置进度条的初始值为 0，否则它的默认值为 100% */
    animation: progress 2s steps(2); /* 分为两个阶段，因此设置参数为 2 */
}

@keyframes progress { /* 定义两个关键帧，将这两个帧之间的动画分为两份 */
    0% { width: 0%; }
    100% { width: 100%; }
}
```

但是，出现的效果可能与想象中有所不同：

![](http://q45cwniav.bkt.clouddn.com/superbed/2020/01/24/5e29d1f52fb38b8c3c4e7070.gif)

这是因为，虽然动画阶段有两个，但是分隔后的动画却包含三个关键帧，分别为`0%`的`0px`，`50%`的`250px`和`100%`的`500px`。而`steps()`只能呈现其中的两个，也就是说**第一帧和最后一帧不能同时出现**。

因此要么只能看到从宽度`0px`到`250px`，然后动画结束回到初始状态`0px`（前提是`animation-fill-mode`为默认值）；要么只能看到从宽度`250px`到宽度`500px`，然后动画结束变为`0px`。这两种方式分别对应`steps()`第二个参数的`end`（默认）和`start`值（注意顺序正好是相反的）。

```css
.bar { animation: progress 2s steps(2, start); }
```

如果要显示类似进度条填充的效果，那么需要将进度条的初始宽度设置为`500px`（或者默认的`auto`、`100%`），这样虽然动画只能显示宽度从`0`到`250px`，但是由于动画结束时会恢复到初始状态，也就是宽度为`500px`，看起来就构成了一段完整的动画。

```css
.bar {
    width: 100%; /* 用于动画回到初始状态 */
    animation: progress 2s steps(2);
}
```

或者，也可以使用`animation-fill-mode: forwards`设置动画结束时维持在最后一帧（即默认时`@keyframes`中`100%`的状态），而不回到初始状态。由于最后一帧定义的为`width: 100%`，因此也可以实现同样效果。

```css
.bar {
    animation: progress 2s steps(2) forwards; /* 维持在 @keyframes 的最后一帧 */
}
```

但是，如果动画属性使用了`infinite`值，那么情况就会变得更麻烦。比如将之前的两种解决方式添加`infinite`：

```css
.bar { animation: progress 2s steps(2) infinite forwards; }
```

![](http://q45cwniav.bkt.clouddn.com/superbed/2020/01/24/5e29fe6b2fb38b8c3c52afe0.gif)

此时发现效果又没有出现，这是因为，添加了`infinite`的动画效果没有**完成期**，与`forwards`根本就没有关系，而且由于它在不断的循环**执行期**，也没法回到动画结束时的初始状态。

为了方便理解，再次将效果简化，只需要`0% → 100% → 0%`这样一个循环的过程。

![](http://q45cwniav.bkt.clouddn.com/superbed/2020/01/24/5e2a020e2fb38b8c3c52edd7.gif)

根据之前的分析，这次只有两个关键帧，因此设置为`steps(1)`即可。但是这样由于最后一帧不会出现，那么进度条永远为第一帧的白色，不会变成蓝色。

为了解决这个问题，这次需要定义三个关键帧，由于第三个关键帧没法显示，因此将第二个和第三个关键帧设置为同一个状态。为了使时间均匀分布，第二个关键帧的位置需要选在`50%`。此时`100%`的关键帧可以省略，因为它默认就与前一帧相同。

```css
@keyframes progress {
    0% { width: 0%; }
    50% { width: 100%; }
    100% { width: 100%; } /* 可以省略 */
}
```