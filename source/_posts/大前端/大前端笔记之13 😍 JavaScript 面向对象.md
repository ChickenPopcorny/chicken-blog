---
title: 大前端笔记之13 😍 JavaScript 面向对象
date: 2020-02-01 9:23:53
abbrlink: vmir6875
tags: JavaScript
categories: 大前端
excerpt: 虽然 JavaScript 对于面向对象的实现与其它语言有所不同，但是它同样是一门面向对象的语言。
---

# 大前端笔记之13 😍 JavaScript 面向对象

虽然 JavaScript 对于面向对象的实现与其它语言有所不同，但是它同样是一门面向对象的语言。

## 构造函数

JavaScript 在 ES6 之前没有类的概念，只能通过构造函数作为对象的「模板」。构造函数本质也只是一个普通函数，但是使用`new`调用后，就可以实例化一个对象。

```js
function Person(name, age) { // 习惯上构造函数首字母大写
    this.name = name
    this.age = age
    this.eat = function() { console.log('吃呀吃') }
}

var person = new Person('Claire', 19)
person.name // => Claire
```

构造函数中使用了`this`关键字，这里的`this`指代的是该构造函数创建的**实例对象**。也就是说，构造函数创建的对象是`person`，因此`this.name`指的是实例对象`person`的属性，第二个`name`则是传递的参数，只用来接收值。

## this 关键字

`this`在不同场合所指向的对象会有所不同，但是无论如何，它总是会指向一个对象。

### 构造函数中的 this

正如上文所说，构造函数中的`this`指向其创建的实例对象。

```js
function Person(name) { 
    this.name = name 
}

var person = new Person('Claire')
person.name // => Claire
```

### 全局作用域中的 this

全局作用域中的`this`指代全局对象`Window`（仅限于浏览器作为宿主环境时）。

```js
console.log(this) // Window
```

### 普通函数中的 this

普通函数中的`this`指代**当前调用函数的对象**，与函数的定义位置、调用位置都没有关系，只与函数的**调用者**有关。如果函数没有调用者，则`this`同样指代全局对象`Window`。

在下面的代码中，由于`foo()`前没有具体的调用对象，因此函数中的`this`指代的是`Window`，从而找到全局作用域中`num`的值为`666`。

```js
function foo() {
    var num = 233
    console.log(this.num) 
}

var num = 666
foo() // => 666
```

即便是嵌套的函数也是一样：

```js
function outer() {
    var num = 233

    function inner() { console.log(this.num) }
    inner() // 没有调用者，依然是全局对象
}

var a = 666
outer() // => 666
```

如果函数是通过对象调用的，那么在该函数中，`this`指代的就是调用函数的对象。例如：

```js
function foo() { console.log(this.num) }

var obj = { num: 233, fn: foo }
var num = 666

obj.fn() // => 233
```

即便函数发生了传递，那么依然也要看**最终调用**时前面是否有对象。因为 ECMAScript 中的函数传递，本质上传递的只是函数的代码。

```js
function foo() { console.log(this.num) }

var obj = { num: 233, fn: foo }
var num = 666

var newFn = obj.fn
newFn() // => 666，因为最终调用时前面没有对象
```

### 定时器函数中的 this

定时器中的`this`指代的是全局对象`Window`。（见[BOM](/posts/ybdcxino.html#定时器)一节）

```js
setInterval(function () {
    this // => window
}, 1000)
```

### 事件监听函数中的 this

事件监听函数中的`this`指代的是触发事件的对象。（见[事件](/posts/uxfasi54.html)一节）

```js
btn.addEventListener('click', function () {
    this // => <button id="btn">触发事件</button>
})
```

### 改变 this 指向

正如上文所说，随着场景不同`this`的指向也会不同，但是通过一些方式可以修改特定场景下`this`的指向。

#### call()

使用函数调用`call()`，并传入一个对象作为参数，会导致函数中的`this`指向该对象参数：

```js
var obj = { age: 18 }
function say() { console.log(this.age) }

say() // => undefined，this 指向 Window，但是 Window 中没有 age 属性
say.call(obj) // => 18，this 指向 obj
```

如果没有传参数或者传入`null`，那么相当于直接调用函数，不会改变`this`的指向。

```js
function say() { console.log(this) }

say() // => Window
say.call() // => Window
```

如果传入两个以上的参数，则后面的参数表示函数本身的参数。

```js
function getSum(num1, num2) {
    return num1 + num2
}

getSum.call(null, 10, 20) // => 30
```

#### apply()

它的用法与`call()`几乎一致，区别在于`apply()`的函数参数，需要以数组的方式传入。

```js
getSum.apply(obj, [10]) // => 参数必须是数组
```

利用这一特性，可以借助`Math.max()`方法获取数组中的最大值，因为它的参数是若干数值，而使用`apply()`可以将一个数组作为一系列数值参数传入：

```js
Math.max.apply(null, [10, 20, 30]) // 不需要改变 this 指向，传入 null 即可
```

#### bind()

该方法会改变`this`的指向，但是不会调用函数，而是返回一个改变了`this`指向的新函数。

```js
function fn() { console.log(this) }

var obj = {}
var newFn = fn.bind(obj)

newFn() // => obj
```

## 原型

虽然 JavaScript 提供的构造函数可以作为模板，用来创建多个实例对象。但是，由同一个构造函数创建的多个实例，即使它们的方法是相同的，也会各自开辟空间，这样会造成系统资源的浪费。

在下面的代码中，虽然`cat`和`dog`的`run()`方法内容完全相同，但是指向的对象却不相同。

```js
function Animal() {
    this.run = function () { console.log('各种跑~') }
}

var cat = new Animal()
var dog = new Animal()

cat.run == dog.run // => false
```

因此，JavaScript 引入了原型（prototype）的概念。原型的**本质是一个对象**，通过构造函数的属性`prototype`，或者实例对象中的`__proto__`属性（该属性为浏览器使用，不推荐程序员调用）可以获取。当实例对象在本身找不到要调用的方法时，会通过`__proto__`属性获取原型对象，再从原型对象中继续寻找。于是，将相同的方法定义到原型对象中，就可以达到**共享资源，节省空间**的目的。

![](http://cdn.yesuanzao.cn/superbed/2020/02/01/5e34ec812fb38b8c3c329d1a.jpg)

因此上面的示例可修改为：

```js
function Animal() {}

// 将 run() 方法添加到原型对象中
Animal.prototype.run = function () { console.log('各种跑~') }

var cat = new Animal()
var dog = new Animal()

cat.run == dog.run // => true
```

### 原型链

其实原型对象中也有`__proto__`属性，该属性同样指向另一个原型对象，它们形成了一个链条，称为原型链。

当调用对象的某个属性时，会先从实例对象本身寻找，如果不存在则去它的原型对象中找，如果依然不存在则去它的原型对象的原型对象中找。链条的顶端是`Object`构造函数的原型对象`Object.prototype`，该对象不再有原型，其`__proto__`属性的值为`null`。

![](http://cdn.yesuanzao.cn/superbed/2020/02/01/5e34ed192fb38b8c3c32aa92.jpg)