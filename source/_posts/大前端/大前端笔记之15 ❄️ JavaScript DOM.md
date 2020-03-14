---
title: 大前端笔记之15 ❄️ JavaScript DOM
date: 2020-02-02 16:00:46
abbrlink: y57hcuma
tags: JavaScript
categories: 大前端
excerpt: DOM 对象分为不同的种类，包括整个文档、HTML 元素或者元素内的文本。这些对象都继承自一个统一的<code>Node</code>接口，因此它们有许多共同的方法和属性，并统一称为节点。
---

# 大前端笔记之15 ❄️ JavaScript DOM

浏览器将页面上的元素映射成一个树状的结构，树上的每一个元素称为 DOM 对象（或者叫**节点**）。DOM 对象分为不同的种类，它们都统一继承自`Node`对象（通过原型链），因此有许多共同的方法和属性：

- `Document`：整个文档
- `Element`：HTML 元素，根据不同的元素又分为`HTMLDivElement`、`HTMLHeadingElement`等等
- `Text`：元素内的文本

由于节点的继承关系比较复杂，可以随时参考[这里](http://w3help.org/zh-cn/causes/SD9024)。

使用`window.document`属性可以获取文档对象（`window`可以省略）。而其它节点则可以使用本文下面的各种方式获取。

## 操作元素

与元素相关的属性和方法大部分位于`document`（直接获取）或`Element`（根据元素上下级关系获取）中。

### body / documentElement

获取`<body>`/`<html>`元素对象。

```js
document.body // => <body>
document.documentElement // => <html>
```

### getElementById()

根据元素的`id`值获取元素。

| 参数 | 描述 |
| --- | --- |
| 字符串 | 元素的`id`值，区分大小写 |

| 返回值 | 描述 |
| --- | --- |
| 元素对象 | 相应的元素对象，如果有多个元素有相同`id`，则只返回其中第一个 |

```html
<button id="btn">这是按钮啦</button>
```

```js
document.getElementById('btn')
```

### getElementsByName()

根据元素的`name`值获取元素。

| 参数 | 描述 |
| --- | --- |
| 字符串 | 元素的`name`值 |

| 返回值 | 描述 |
| --- | --- |
| `NodeList`集合 | 包含符合条件元素的伪数组 |

```html
<input type='text' name="username">
```

```js
document.getElementsByName('username')[0]
```

### getElementsByTagName()

根据元素的标签名获取元素对象。

| 参数 | 描述 |
| --- | --- |
| 字符串 | 元素的标签名 |

| 返回值 | 描述 |
| --- | --- |
| `HTMLCollection`集合 | 包含符合条件元素的伪数组 |

```js
document.getElementsByTagName('p')[0]
```

元素对象`Element`也定义了该方法，可以返回元素节点的后代中符合条件的元素。

```js
p.getElementsByTagName('span')
```

### getElementsByClassName()

根据元素的类名获取元素对象。

| 参数 | 描述 |
| --- | --- |
| 字符串 | 元素的类名，多个类使用空格隔开即可，顺序并不重要 |

| 返回值 | 描述 |
| --- | --- |
| `HTMLCollection`集合 | 包含符合条件元素的伪数组 |

```js
document.getElementsByClassName('foo bar') // 返回同时具有 foo 和 bar 两个类的元素
```

元素对象`Element`也定义了该方法，可以返回元素节点的后代中符合条件的元素。

```js
p.getElementsByClassName('foo') // 获取 p 元素下具有 foo 类的元素
```

### querySelector() / querySelectorAll()

根据 CSS 选择器获取匹配的第一个 / 全部对象。

| 参数 | 描述 |
| --- | --- |
| 字符串 | CSS 选择器 |

| 返回值 | 描述 |
| --- | --- |
| 元素对象 / `NodeList`集合 | 符合条件的元素 / 包含符合条件元素的伪数组 |

```js
document.querySelector('.btn') // 获取第一个拥有 btn 类的元素
document.querySelectorAll('.btn') // 获取全部拥有 btn 类的元素
```

### firstElementChild / lastElementChild / children

获取该元素的第一个 / 最后一个 / 所有子元素。

| 返回值 | 描述 |
| --- | --- |
| 元素对象 / `HTMLCollection`集合 | 符合条件的元素 / 包含符合条件元素的伪数组 |

```html
<ul id="list">
    <li id="first">冥灯龙</li>
    <li id="second">炎妃龙</li>
</ul>
```

```js
var ul = document.querySelector('#list')
ul.children.length // => 2
ul.firstElementChild // => <li>冥灯龙</li>
ul.lastElementChild // => <li>炎妃龙</li>
```

### previousElementSibling / nextElementSibling

获取该元素的前一个 / 后一个兄弟元素。

| 返回值 | 描述 |
| --- | --- |
| 元素对象 | 符合条件的元素 |

```html
<ul id="list">
    <li id="first">冥灯龙</li>
    <li id="second">炎妃龙</li>
</ul>
```

```js
var first = document.querySelector('#first')
first.nextElementSibling // => <li id="second">炎妃龙</li>
```

### parentElement

获取该元素的父元素。

| 返回值 | 描述 |
| --- | --- |
| 元素对象 | 符合条件的元素 |

```html
<ul id="list">
    <li id="first">冥灯龙</li>
    <li id="second">炎妃龙</li>
</ul>
```

```js
var first = document.querySelector('#first')
first.parentElement // => <ul id="list">...</ul>
```

### createElement()

创建元素对象，但是创建后的元素需要使用`Node`中的相关方法插入到文档中才有效果。

| 参数 | 描述 |
| --- | --- |
| 字符串 | HTML 标签名 |

| 返回值 | 描述 |
| --- | --- |
| 元素对象 | 创建的元素对象 |

```js
var newDiv = document.createElement('div')
```

## 操作节点

节点相关的属性和方法大部分位于`Node`中，由于元素对象`Element`也继承了`Node`，因此有些方法看起来依然是通过元素对象调用的。

### nodeType / nodeName

获取节点的类型和名称。

```js
document.nodeType // => 9
document.nodeName // => #document
```

### firstChild / lastChild / childNodes

获取该节点的第一个 / 最后一个 / 所有子节点。

| 返回值 | 描述 |
| --- | --- |
| 节点对象 / `NodeList`集合 | 符合条件的节点 / 包含符合条件节点的伪数组 |

```html
<ul id="list">
    <li id="first">冥灯龙</li>
    <li id="second">炎妃龙</li>
</ul>
```

```js
var ul = document.querySelector('#list')
ul.childNodes.length // => 5
ul.firstChild.nodeName // => #text，因为是换行，而不是 <li>
```

### previousSibling / nextSibling

获取该节点的前一个 / 后一个兄弟节点。

| 返回值 | 描述 |
| --- | --- |
| 节点对象 | 符合条件的节点 |

```html
<ul id="list">
    <li id="first">冥灯龙</li>
    <li id="second">炎妃龙</li>
</ul>
```

```js
var first = document.querySelector('#first')
first.nextSibling.nodeName // => #text，是一个换行，而不是 <li>
```

### parentNode

获取该节点的父节点。

| 返回值 | 描述 |
| --- | --- |
| 节点对象 | 符合条件的节点 |

```html
<ul id="list">
    <li id="first">冥灯龙</li>
    <li id="second">炎妃龙</li>
</ul>
```

```js
var first = document.querySelector('#first')
first.parentNode // => <ul id="list">...</ul>
```

### cloneNode()

复制节点。与`createElement()`一样，复制后的节点需要使用`Node`中的相关方法插入到文档中才有效果。

| 参数 | 描述 |
| --- | --- |
| 布尔值 | 可选。默认值`false`为浅拷贝，表示仅复制该节点本身，不包括后代节点；`true`为深拷贝，表示连同后代节点一同复制 |

| 返回值 | 描述 |
| --- | --- |
| 节点对象 | 复制的节点 |

```html
<ul id="list">
    <li id="first">冥灯龙</li>
</ul>
```

```js
var list = document.querySelector('#list')
var newList = list.cloneNode(true) // 如果为 false，则不会拷贝 <li id="first">冥灯龙</li> 这个子节点
```

### appendChild()

将一个节点插入到父节点的最后，作为其最后一个子节点。如果要插入的节点是页面上已经存在的，那么该方法会**移动**该节点，而不是复制。

| 参数 | 描述 |
| --- | --- |
| 节点对象 | 要插入的节点 |

```html
<ul id="list">
    <li id="first">冥灯龙</li>
</ul>
```

```js
var list = document.querySelector('#list')
var first = document.querySelector('#first')

var newItem = first.cloneNode(true) // 必须设置为 true，否则无法克隆 冥灯龙 这个文本节点

list.appendChild(newItem)

// <ul id="list">
//     <li id="first">冥灯龙</li>
//     <li id="first">冥灯龙</li>
// </ul>
```

### insertBefore()

将一个节点插入到父节点的内部，作为子节点。

| 参数 | 描述 |
| --- | --- |
| 节点对象 | 要插入的节点 |
| 节点对象 | 父节点的一个内部节点，新节点将插入到该内部节点之前 |

```html
<ul id="list">
    <li id="first">冥灯龙</li>
    <li id="second">炎妃龙</li>
</ul>
```

```js
var list = document.querySelector('#list')
var newItem = document.createElement('li') // 创建新元素
var second = document.querySelector('#second')

list.insertBefore(newItem, second) // 将新元素插入到 second 之前

// <ul id="list">
//     <li id="first">冥灯龙</li>
//     <li></li>
//     <li id="second">炎妃龙</li>
// </ul>
```

### removeChild()

移除当前节点中的一个子节点。

| 参数 | 描述 |
| --- | --- |
| 节点对象 | 要移除的节点 |

| 返回值 | 描述 |
| --- | --- |
| 节点对象 | 已移除的节点 |

```html
<ul id="list">
    <li id="first">冥灯龙</li>
    <li id="second">炎妃龙</li>
</ul>
```

```js
var list = document.querySelector('#list')
var second = document.querySelector('#second')

list.removeChild(second)

// <ul id="list">
//     <li id="first">冥灯龙</li>
// </ul>
```

## 集合

为了保存多个元素 / 节点对象，DOM 提供了两个伪数组对象作为集合，它们与`Node`平级，是两个独立于`Node`的特殊对象。

### HTMLCollection

保存多个元素对象。

```js
p.children.length // HTMLCollection 的长度
```

### NodeList

保存多个节点对象。

```js
p.childNodes.length // NodeList 的长度
```


## 操作文本

文本对象`Text`本身也是节点之一，但是由于直接使用它的可能性不大，因此通常都是用元素对象`Element`的相关属性获取文本内容即可。

### textContent / innerText

获取元素内部的所有文本内容，也可以用来修改元素内容。它们会忽略内容中的 HTML 标签，返回只包含文字部分的内容，将 HTML 输出到页面也只会显示代码，不会被解析。

```html
<span id="msg">这里是<strong>文本内容</strong>啦</span>
```

```js
var msg = document.querySelector('msg')

msg.textContent // => 这里是文本内容啦
msg.innerText // => 这里是文本内容啦
```

### innerHTML

获取元素内部的所有 HTML 代码，也可以用来修改元素内容。它不会忽略内容中的 HTML 标签，将 HTML 输出到页面会将其解析。

```html
<span id="msg">这里是<strong>文本内容</strong>啦</span>
```

```js
var msg = document.querySelector('msg')

msg.innerHTML // => 这里是<strong>文本内容</strong>啦
```

## 操作属性

DOM 会自动为每个元素添加其标签上的属性（自定义属性除外），通过它们可以直接获取元素的属性值。

```html
<a id="test"></a>
```

```js
a.id // => test
a.href = 'http://www.example.com' // 修改属性值
```

对于布尔型的属性，也应该使用布尔型的值：

```js
input.disable = true
radio.checked = true
```

### className

获取元素的完整类名称。

```html
<div class="one two three"></div>
```

```js
div.className // => 'one two three' 
```

### classList

不过完整的类属性字符串很难操作，因此 DOM 提供了`classList`可以获取一个类属性对象，它包含下列属性和方法：

| 名称  | 描述 |
| --- | --- |
| `length` | 获取类的数量，只读 |
| `add()` | 增加类 |
| `remove()` | 移除类 |
| `contains()` | 检查当前对象是否包含某个类 |
| `toggle()` | 如果某个类存在，则移除该类，否则添加该类 |
| `item()` | 返回指定索引位置的类，注意**没有方括号**形式 |

```js
div.classList // => { 0: "one", 1: "two", 2: "three", length: 3 }
div.classList.add('btn')
div.classList.add('btn', 'danger')
div.classList.remove('btn')
div.classList.toggle('btn')
div.classList.contains('btn')
div.classList.item(0) // 没有 div.classList[0] 这样的格式
```

### 自定义属性

使用 HTML 标准提供的`data-`前缀形式可以添加自定义属性：

```js
<div id="person" data-score="30"></div>
```

然后，通过元素对象的`dataset`属性，可以**读写**标签的所有`data-`属性：

```js
person.dataset.score // => 30
```

注意，`data-`后面的属性名不要使用大写字母，因为 HTML 不区分大小写。比如`data-helloWorld`应该写成`data-hello-world`。当它转成`dataset`的属性名时，会自动将短横线后面的字母转为大写，并移除短横线，反之也是一样。

```html
<div id="person" data-max-score="30"></div>
```

```js
person.dataset.maxScore // => 30
```

## 操作样式

元素样式相关的属性和方法均位于`Element`元素对象中。

### style

设置元素的**行内样式**，但不能操作定义在**样式表中的规则**。对于包含连字符的属性名称，需要变成驼峰式写法。

```js
div.style.width = '100px';
div.style.backgroundColor = 'orange';
```

### getComputedStyle()

获取元素计算后的最终样式。但是该对象获取的属性值是**只读**的，因此它只能获取样式，要设置样式只能使用`style`属性。

```js
getComputedStyle(div).width
```

### 元素大小

使用下列属性可以获取元素大小相关的信息，它们均**不包含单位**。

| 属性名 | 描述 |
| --- | --- |
| `scrollWidth` | **只读**，获取元素的内容宽度，包括溢出容器的部分。如果内容没有占满容器，那么与`clientWidth`一致 |
| `scrollHeight` | **只读**，获取元素的内容高度，包括溢出容器的部分。如果内容没有占满容器，那么与`clientHeight`一致 |
| `offsetWidth` | **只读**，获取元素以`border`为界的宽度 |
| `offsetHeight` | **只读**，获取元素以`border`为界的高度 |
| `clientWidth` | 只适用于**块级元素**，获取元素以`padding`为界的宽度 |
| `clientHeight` | 只适用于**块级元素**，获取元素以`padding`为界的高度 |
| `clientLeft` | 只适用于**块级元素**，获取元素`border-left`的大小 |
| `clientTop` | 只适用于**块级元素**，获取元素`border-top`的大小 |

```js
div.offsetWidth // => 300
```

### 滚动距离

使用下列属性可以获取元素滚动距离相关的信息，它们均**不包含单位**。

| 属性名 | 描述 |
| --- | --- |
| `scrollLeft` | **可读写**，获取元素内容水平方向滚动出去的距离，如果元素没有滚动条，那么该值为`0` |
| `scrollTop` | **可读写**，获取元素内容垂直方向滚动出去的距离，如果元素没有滚动条，那么该值为`0` |
| `pageXOffset` | **只读**，获取页面的水平滚动距离 |
| `pageYOffset` | **只读**，获取页面的垂直滚动距离 |

![](https://ae01.alicdn.com/kf/Hee8a50876f8941ed89036973f32d9f5fH.jpg)

> 如果使用`scrollTop`获取整个页面滚动的话，在 Chrome 和 IE 中，必须使用`document.documentElement.scrollTop`才能正确获取，其它方式该值均为`0`。

```js
document.addEventListener('scroll', function() {
    window.pageYoffset
    document.documentElement.scrollTop
})
```

### 位置

使用下列属性可以获取元素位置相关的信息，它们均**不包含单位**。

| 属性名 | 描述 |
| --- | --- |
| `offsetParent` | **只读**，获取最靠近当前元素的，且 CSS 的`position`属性不等于`static`的父元素，直到`<body>`元素 |
| `offsetLeft` | **只读**，获取元素相对于`offsetParent`元素左侧的偏移距离 |
| `offsetTop` | **只读**，获取元素相对于`offsetParent`元素上方的偏移距离 |

> 注意，如果元素中包含未设置宽高的图片，那么由于代码执行时图片可能还没加载，从而导致无法正确获取元素距离顶部的高度

## 其它

除了上述通用属性和方法以外，有些特定元素还定义了独有的属性和方法。

### submit()

使用`HTMLFormElement`的`submit()`方法可以直接提交表单。

```js
form.submit()
```

### focus()

使用`HTMLElement`的`focus()`方法可以使元素获得焦点（通常用在表单控件元素上）。

```js
input.focus()
```