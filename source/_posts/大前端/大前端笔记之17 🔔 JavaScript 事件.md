---
title: 大前端笔记之17 🔔 JavaScript 事件
date: 2020-02-05 14:39:44
abbrlink: g6oz01bg
tags: JavaScript
categories: 大前端
excerpt: 事件是程序的各个组成部分之间的一种通信方式，可以认为是元素的一种行为。将事件与监听函数绑定，当事件触发时，那么就会执行对应的监听函数。
---

# 大前端笔记之17 🔔 JavaScript 事件

事件是程序的各个组成部分之间的一种通信方式，可以认为是元素的一种行为。将事件与监听函数绑定，当事件触发时，那么就会执行对应的监听函数。

## 绑定事件

由于元素对象会自动获取所有自带的属性，而事件属性也属于其中之一，因此可以直接通过元素的事件属性可以绑定事件。

```js
btn.onclick = function() { alert('事件似乎被触发了！') }
```

但是，此时每个元素的同一事件只能绑定一个监听函数，如果再次定义了同一事件，那么之前的监听函数会被覆盖，因此不推荐使用。

更多情况下，都会使用元素对象的`addEventListener()`方法绑定事件。而使用该方法绑定的事件，可以使用该元素对象的`removeEventListener()`方法移除，而且它们的参数都是一样的。

| 参数 | 描述 |
| --- | --- |
| 字符串 | 事件名称，注意没有`on`前缀 |
| 函数 | 事件触发时执行的监听函数 |

```js
function sendMsg() { alert('事件似乎被触发了！') }

btn.addEventListener('click', sendMsg)
btn.removeEventListener('click', sendMsg)
```

> IE9 之前有一个类似的绑定事件方法`attachEvent()`，但是已被从规范中移除，不要使用。

## 事件对象

每当事件被触发时，都会产生一个事件对象作为监听函数的参数，这些事件对象均继承自`Event`对象。

```js
// e 为事件对象，可以是任何名称
btn.addEventListener('click', function (e) {})
```

### target

获取触发事件的元素对象。注意，监听函数中的`this`指代**绑定事件**的对象，而`target`获取的是**触发事件**的对象，由于事件具有冒泡特性，因此两者未必是相同的。

在下面的代码中，事件绑定在`<ul>`上，而点击的是`<li>`元素，因此`this`指代的是`<ul>`，而`target`指代的是`<li>`：

```html
<ul>
    <li>冥灯龙</li>
    <li>灭尽龙</li>
</ul>
```

```js
ul.addEventListener('click', function (e) {
    this // => ul
    e.target // => li
})
```

### type

获取触发的事件类型。

```js
div.addEventListener('click', function (e) {
    e.type // => click
})
```

### preventDefault()

阻止元素自带的默认事件，比如`<a>`元素拥有默认事件`click`，当事件触发时会跳转到指定页面：

```html
<a href="http://www.bilibili.com">哔哩哔哩</a>
```

```js
a.addEventListener('click', function (e) {
    e.preventDefault() // 阻止页面跳转
})
```

> 除此之外，还可以在监听函数中加入`return false`语句，但是它不仅会阻止默认事件，还会**阻止事件冒泡**。由于它的双重作用，因此不推荐使用这种方式。

### 鼠标位置

使用事件对象的下列属性可以获取鼠标位置的相关信息，它们的值均**没有单位**，而且为只读。

| 属性 | 描述 |
| --- | --- |
| `offsetX`/`offsetY` | 鼠标相对于**触发事件元素**内边距区域的水平 / 垂直方向坐标 |
| `clientX`/`clientY` | 鼠标相对于**视口**的水平 / 垂直方向坐标 |
| `pageX`/`pageY` | 鼠标相对于**页面文档**的水平 / 垂直方向坐标 |
| `screenX`/`screenY` | 鼠标相对于**设备屏幕**的水平 / 垂直方向坐标 |

```js
document.addEventListener('mousemove', function (e) {
    e.pageX
})
```

> 注意在实现跟随鼠标移动效果时，**不要将鼠标完全放在跟随的元素上**，这样可能会导致一些鼠标事件无法正常触发。比如点击事件正好点在跟随的元素上，而不是原本想要点击的页面元素。

### 键盘按键

使用事件对象的`code`和`key`属性可以获取用户按下的键。但是`code`属性 IE 和 Edge 不支持，`key`属性 IE8 不支持，而且它们的返回值也有所不同。

```js
document.onkeydown = function (e) { // 分别输入回车和字母 A
    e.code // => Enter 和 keyA
    e.key // => Enter 和 a
    e.keyCode // => 13 和 65
    e.which // => 13 和 65
}
```

> 注意，`keyCode`和`which`也可以实现同样功能，但是已经被废弃，不建议使用。jQuery 中将`which`属性进行了封装，可以直接使用。

### 屏幕触摸

使用事件对象的`targetTouches`属性可以获取触发事件时位于**触发事件元素**上的触摸点，它返回一个`TouchList`集合，通过`length`和方括号`[]`可以获取其中的`Touch`对象以及数量。每个`Touch`对象代表当前手指的触摸点，其中包含[鼠标位置](#鼠标位置)中的全部属性（`offsetX`和`offsetY`除外）。

```js
div.addEventListener('touchstart', function (e) {
    e.targetTouches[0].clientX // 获取当前触摸点相对视口的 x 坐标
})
```

使用事件对象的`touches`属性可以获取触发事件时位于**整个屏幕**上的触摸点，而`changedTouches`可以获取触发事件时**触摸状态发生改变**（之前触摸现在松开，或反之）的触摸点。它们的用法与`targetTouches`基本一致。

## 事件传播

如果子元素与父元素重叠在一起，并且都绑定了事件，那么某些操作（比如鼠标点击、移入移出）可能会导致它们的事件同时触发，这个现象称为事件的传播。JavaScript 将事件传播分为三个阶段，使用事件对象的`eventParse`属性可以获取：

* 捕获阶段：从`html`对象传递到目标节点（从顶层传递到底层），`eventParse`值为`1`
* 目标阶段：在目标节点上触发，为嵌套最深的子节点，`eventParse`值为`2`
* 冒泡阶段：从目标节点传递到`html`对象（从底层传递到顶层），`eventParse`值为`3`

![](https://pic2.superbed.cn/item/5dfdbffb76085c3289a866e8.jpg)

默认情况下，事件会绑定在**冒泡阶段**，也就是说事件会从被点击的内层元素开始触发，直到外层元素。

```html
<div id="outer">
    <p id="inner"></p>
</div>
```

```js
inner.addEventListener('click', function (e) {
    console.log('内层元素被点击啦，当前阶段为' + e.eventPhase)
})
outer.addEventListener('click', function (e) {
    console.log('外层元素被点击啦，当前阶段为' + e.eventPhase)
})
// => 内层元素被点击啦，当前阶段为 2
// => 外层元素被点击啦，当前阶段为 3
```

通过`addEventListener()`方法的第三个参数，可以将事件绑定在捕获阶段。该参数为布尔值，将其设置为`true`，表示绑定在捕获阶段。但是通常情况下不需要这么做，使用冒泡阶段即可。

```js
inner.addEventListener('click', function (e) {
    console.log('内层元素被点击啦，当前阶段为' + e.eventPhase)
}, true)
outer.addEventListener('click', function (e) {
    console.log('外层元素被点击啦，当前阶段为' + e.eventPhase)
}, true)
// => 外层元素被点击啦，当前阶段为 1
// => 内层元素被点击啦，当前阶段为 2
```

### 阻止事件传播

通过事件对象的`stopPropagation()`方法可以阻止事件传播。

```js
inner.addEventListener('click', function (e) {
    e.stopPropagation() // 阻止了事件传播，后面的所有阶段不再执行
})
outer.addEventListener('click', function (e) {
    console.log('触发不了啦')
})
```

## 常用事件

下面是一些常用的事件。

### 鼠标事件

| 事件 | 描述 |
| --- | --- |
| `click` | 鼠标左键单击时触发，该事件在触发前会首先触发另外两个事件：`mousedown`与`mouseup` |
| `dblclick` | 鼠标左键双击时触发 |
| `mousedown` | 鼠标键按下时触发 |
| `mouseup` | 鼠标键抬起时触发 |
| `mousemove` | 鼠标在元素上移动时触发 |
| `mouseenter` | 鼠标移入元素时触发（不冒泡），并且当进入该元素的子元素时，**不会**导致该事件再次被触发 |
| `mouseover` | 鼠标移入元素时触发（冒泡），并且当进入该元素的子元素时，会导致该事件再次被触发 |
| `mouseleave` | 鼠标移出元素时触发（不冒泡），并且只会在移出该元素本身时触发一次 |
| `mouseout` | 鼠标移出元素时触发（冒泡），并且当移出父元素进入子元素，或者移出子元素时，都会导致该事件再次被触发 |
| `contextmenu` | 点击右键时弹出菜单，为`document`绑定并阻止默认事件可以禁用弹出菜单 |

### 键盘事件

下面三个事件如果同时注册，那么执行顺序从上到下，即`keydown`一定会优先触发，然后为`keypress`，而`keyup`最后触发。

| 事件 | 描述 |
| --- | --- |
| `keydown` | 键盘按键按下时触发，如果不松开按键该事件也会持续触发 |
| `keypress` | 键盘有值按键（即方向键、<kbd>Ctrl</kbd>等功能键除外）按下时触发，如果不松开按键该事件也会持续触发 |
| `keyup` | 键盘按键抬起时触发 |

### 表单事件

| 事件 | 描述 |
| --- | --- |
| `focus` | 表单元素获得焦点时触发 |
| `blur` | 表单元素失去焦点时触发 |
| `change` | 当`<input>`、`<select>`、`<textarea>`元素的值发生改变时触发 |
| `input` | 与`change`类似，区别在于只要是元素的值发生了改变，该事件会连续触发，而`change`不会 |
| `select` | 当文本框和文本域的内容被选中时触发，通过 DOM 元素调用`select()`方法可以主动选中其中的内容 |
| `submit` | 当表单提交时触发，设置`preventDefault()`可以阻止表单默认提交 |

下面是`change`事件详细的触发条件：

- 激活单选框或复选框时触发
- 在`<select>`或日期控件完成选择时触发
- 当文本框或`<textarea>`元素的值发生改变，并且丧失焦点时触发

### 动画事件

| 事件            | 描述                                   |
| --------------- | -------------------------------------- |
| `transitionend` | 当元素的`transition`动画执行完毕后触发 |
| `animationend`  | 当元素的`animation`动画执行完毕后触发  |

### BOM 事件

| 事件  | 描述 |
| --------- | ------- |
| `scroll`     | 元素的滚动条发生滚动时触发    |
| `load`     | 当页面加载完成时触发，必须绑定给`window`对象  |
| `pageshow` | 当页面加载完成时触发，必须绑定给`window`对象 |
| `DOMContentLoaded` | 当 DOM 元素加载完成时触发，不包括图片、样式等部分，必须绑定给`document`对象 |
| `resize` | 当浏览器窗口发生改变时触发，必须绑定给`window`对象 |

#### 页面加载

`load`和`pageshow`事件都是在页面加载完成后触发，区别在于，火狐浏览器在页面跳转再通过后退按钮返回时，会将页面保存到缓存中，此时`load`事件不会再次触发，而`pageshow`事件则不会有这个问题。

### 触屏事件

| 事件         | 描述                   |
| ------------ | ---------------------- |
| `touchstart` | 手指触摸到元素时触发   |
| `touchmove`  | 手指在元素上滑动时触发 |
| `touchend`   | 手指从元素上松开时触发 |

### 其它事件

| 事件  | 描述 |
| --------- | ------- |
| `selectstart`      | 当用户选择页面文字时触发，为`document`绑定并阻止默认事件可以禁止用户选择页面文字 |


