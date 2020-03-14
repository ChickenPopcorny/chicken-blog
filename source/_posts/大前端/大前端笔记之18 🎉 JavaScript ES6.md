---
title: 大前端笔记之18 🎉 JavaScript ES6
date: 2020-02-06 10:24:12
abbrlink: j5h1kgw7
tags: JavaScript
categories: 大前端
excerpt: ECMAScript 6（简称 ES6）是 2015 年发布的最新版本，其中添加了大量的新特性。虽然之后 ECMAScript 版本依然在不断更新，但是新特性并不是很多，因此将 ES6 及之后的版本统称为 ES6。
---

# 大前端笔记之18 🎉 JavaScript ES6

ECMAScript 6（简称 ES6）是 2015 年发布的最新版本，其中添加了大量的新特性。虽然之后 ECMAScript 版本依然在不断更新，但是新特性并不是很多，因此将 ES6 及之后的版本统称为 ES6。

## 变量

新增了用于定义变量的`let`关键字。

```js
let num = 10
```

与之前的`var`相比，它主要有以下几个特点。首先，使用`let`关键字声明的变量具有**块级作用域**。也就是说，使用`let`在花括号内部声明的变量不能在花括号外部访问了，因为花括号拥有了自己的作用域。

```js
if (true) {
    var a = 10
    let b = 10
}

console.log(a) // => 10
console.log(b) // => b is not defined
```

第二，使用`let`定义的变量声明**不会被提升**。

```js
console.log(a) // => undefined
var a = 2

console.log(b) // => Cannot access 'b' before initialization
let b = 2
```

第三，虽然使用`let`定义的变量没有提升的特性，但是它会与作用域绑定，产生**暂时性死区**。

在下面的代码中，虽然在块级作用域内先调用后定义了`num`，但是在调用时不会去访问全局作用域下的`num`，而是直接报错。这是因为虽然 JavaScript 不会把`let`变量提升，但是依然知道该作用域内有同名变量，而且将其与当前作用域进行了绑定，如果提前调用，就会直接报错。在`let`声明之前无法调用该变量的这段运行过程，称为暂时性死区。

```js
var num = 10

if (true) {
    console.log(num) // Cannot access 'num' before initialization
    let num = 20
}
```

最后，使用`let`定义的全局变量不能使用`window`访问，因为它被存放到了单独的作用域中。

```js
let a = 10
window.a // => undefined
a // => 10
```

### let 与 for 循环

使用`let`声明`for`循环的迭代变量是非常合适的，因为循环结束后迭代变量就会被销毁，从而释放空间。

```js
for (var i = 0; i < 10; i++) {}
console.log(i) // => 10

for (let i = 0; i < 10; i++) {}
console.log(i) // => i is not defined
```

但是，如果`for`循环中包含异步任务，那么可能会产生令人迷惑的现象。在下面的代码中，分别使用`let`和`var`声明的`for`循环为 3 个按钮绑定了事件，当点击时输出绑定时的`i`，而结果是不同的：

```js
for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener('click', function () {
        console.log(i)
    })
} // => 3 3 3

for (let i = 0; i < btns.length; i++) { // 3 个按钮
    btns[i].addEventListener('click', function () {
        console.log(i)
    })
} // => 0 1 2
```

[异步任务](#异步编程)是当整段代码执行完成后，才会根据情况（计时器、触发事件）触发的，这里得到的`i`应该是`for`循环执行完毕之后的。可以看到，`var`声明的`for`循环符合预期，当循环结束后，`i`的值会自增为`3`，因此点击任何一个按钮都是输出`3`。

但是，`let`循环的输出结果就有些令人迷惑了，虽然它可以使自己拥有作用域，但是`i`也依然只有一个，为何最后会输出不同的值呢？

原因是，`let`循环在执行过程中，不但生成了自己的作用域，而且会记录本次循环的值。因为`let`可以识别块级作用域（花括号），因此不同块里的同名变量不会发生冲突。也就是说，上面`let`循环的代码可以表示为：

```js
{
    let i = 0 // 初始化循环变量，即圆括号中的 i
    {   
        let t = i // 将 i 的值保存下来
        btns[t].addEventListener('click', function () { // 实际使用的不是最后的 i，而是本作用域内保存的值
            console.log(t)
        })
    }
    i++ // 循环变量自增

    // 第二遍循环
    {   
        let t = i
        btns[t].addEventListener('click', function () {
            console.log(t)
        })
    }
    i++

    // 第三遍循环
    {   
        let t = i
        btns[t].addEventListener('click', function () {
            console.log(t)
        })
    }
    i++
}
```

可以看到，此时执行事件处理函数时，寻找的其实是本作用域中保存的变量，而非外层迭代完毕的`i`。此外，还可以看到，**圆括号与循环体其实分属于两个不同的作用域**，而且，**圆括号作用域是包裹着循环体作用域的**。

而对于`var`循环就简单的多了，因为无论是哪一次循环，最后只能访问全局下共同的`i`：

```js
var i = 0 // 初始化循环变量，即圆括号中的 i
btns[i].addEventListener('click', function () { // 使用的依然是全局作用域下的 i
    console.log(i)
})
i++ // 循环变量自增

// 第二遍循环
btns[i].addEventListener('click', function () {
    console.log(i)
})
i++

// 第三遍循环
btns[i].addEventListener('click', function () {
    console.log(i)
})
i++
```

在下面的代码中，分别在圆括号和循环体中声明了重名的变量`i`，可见它们并不冲突：

```js
for (let i = 0; i < 3; console.log(i++)) {
    let i = 'abcd'
    console.log(i)
} // => abcd 0 abcd 1 abcd 2
```

其中`abcd`是循环体内的`i`，数字值是圆括号内的`i`，根据上述理解，这段代码可以表示为：

```js
{
    let i = 0 // 初始化循环变量，即圆括号中的 i
    {   
        let i = 'abcd' // 循环体内的 i，由于 let 变量可以识别花括号，因此不会与外部冲突
        btns[i].addEventListener('click', function () { // 实际使用的是最近的，也就是说本作用域内的 i
            console.log(i) // => 'abcd'
        })
    }
    console.log(i++) // 输出外层作用域下的 i，也就是 0，然后自增为 1

    // 第二遍循环
    {   
        let i = 'abcd'
        btns[i].addEventListener('click', function () {
            console.log(i) // => 'abcd'
        })
    }
    console.log(i++) // => 1

    // 第三遍循环
    {   
        let i = 'abcd'
        btns[i].addEventListener('click', function () {
            console.log(i) // => 'abcd'
        })
    }
    console.log(i++) // => 2
}
```

## 常量

新增了用于定义常量的`const`关键字。

```js
const PI = 3.14
```

除了以上`let`关键字的**所有特性之外**，它还具有下面单独的特点。首先，常量在声明的同时**必须赋初始值**，否则会报错。

```js
const PI // Missing initializer in const declaration，声明常量没有初始化
```

然后，常量的最明显特性就是值一旦确定就**不可更改**。注意，对于复杂数据类型来说，这里的值指的是**地址**而非具体的内容。

```js
const PI = 3.14
PI = 100 // Assignment to constant variable，基本数据类型不能修改值

const ARR = [10, 20]
ARR[0] = 5 // => [5, 20]，可以修改具体内容
ARR = [5, 20] // Assignment to constant variable，不能直接修改指向的地址
```

## 对象的简洁表示法

如果对象中的属性名和属性值名称相同，那么可以合并成一个。

```js
let age = 18
let person = { age: age } // 第一个 age 是属性名，第二个 age 是变量 18

/* ===== 等同于 =====*/
let age = 18
let person = { age }
```

对象中的函数也可以简写，如：

```js
let person = {
    eat: function() { console.log('吃呀吃呀吃~') }
}
/* ===== 等同于 =====*/
let person = {
    eat() { console.log('吃呀吃呀吃~') }
}
```

## for of 循环

使用`for of`循环可以更方便地遍历数组。

```js
const nums = [10, 20, 30]
for (let num of nums) {
    num
} // => 10 20 30
```

> 注意与`for in`循环区分开，`for in`循环的迭代变量为键，且属于 ES5 规范；而`for of`循环的迭代变量为值，属于 ES6 规范。因此前者主要由于遍历对象，后者主要用于遍历数组。

## 解构赋值

解构赋值是一种为变量赋值的新方式，可以将数组或对象中的元素直接提取出来，放到对应的变量中。

### 数组解构

将变量名称使用方括号`[]`包裹起来，表示数组解构赋值，它的值必须为一个数组。

```js
let [a, b] = [1, 2]
a // => 1
b // => 2
```

如果两侧的值不完全对应，则未赋值的变量为`undefined`，多余的值被忽略。

```js
let [a, b, c] = [1, 2]
c // => undefined

let [a] = [1, 2]
a // => 1
```

### 对象解构

将变量名称使用花括号`{}`包裹起来，表示对象解构赋值，它的值必须为一个对象。如果在对象中找到了与解构语法中的变量名称一致的属性，则将属性的值赋值给该变量。因此，**解构语法中的变量顺序与对象中的属性顺序无关**。

```js
let {name, age} = {name: 'Wendy', age: 13}

name // => Wendy
age // => 13
```

如果需要修改变量名称，则可以使用下面的解构语法：

```js
let {name: myName, age: myAge} = {name: 'Wendy', age: 13}

myName // => Wendy
```

## 箭头函数

箭头函数是函数表达式的一种简化写法，但是由于它的一些特性（主要是下文中箭头函数的`this`），并不是可以无脑的将所有函数表达式替换成箭头函数。

箭头函数的格式为`() => {}`，其中圆括号为形参列表，花括号为函数体。由于箭头函数没有名称，因此可以将它放到一个变量中调用：

```js
let fn = function() {
    console.log('hello')
}

// 相当于
let fn = () => { console.log('hello') }
fn() // => 输出 hello
```

前面的圆括号中可以传入形参：

```js
let fn = (num1, num2) => { return num1 + num2 }
fn(10, 20) // => 30
```

如果参数只有一个，那么可以省略圆括号：

```js
let fn = num1 => { return num1 }
fn(10) // => 10
```

如果函数体中**只有一条语句**，那么可以省略花括号和`return`关键字。此时函数会**自动将这一行代码的执行结果作为返回值，无论这行代码是否有返回结果**。因此如果省略了花括号，那么就不能再添加`return`关键字了。

```js
let fn = (num1, num2) => { return num1 + num2 }

// 相当于
let fn = (num1, num2) => num1 + num2
fn(10, 20) // => 30

// 即使这条语句没有返回值，也会自动返回
let fn = () => console.log('hello')
fn() // => 输出 hello，但是返回值为 undefined
```

### 箭头函数中的 this

箭头函数与其它函数最大的一个区别在于，它并没有自己的`this`，而是直接使用外层作用域下的`this`，也就是说箭头函数中的`this`仅与定义位置有关，与何时调用无关。

在下面的代码中，由于`addEventListener()`定义在全局作用域中，因此其中箭头函数的`this`指代的是`window`，而不是按钮元素：

```js
button.addEventListener('click', function() {
    console.log(this) // => <button>...</button>
})

button.addEventListener('click', () => {
    console.log(this) // => window
})
this // => 与外层作用域中的该 this 相同
```

由于`this`的指向问题，因此如果函数体中包含`this`的话，切记依然要使用普通函数。另外，如果函数包含多条语句，而不是单纯的通过计算返回一个值，也建议使用普通函数，因为这样代码会更加清晰易读。

## 剩余参数

由于箭头函数中并不能使用`arguments`属性，因此 ES6 提供了剩余参数来解决不定参数的问题（函数声明和表达式也可以使用）。在参数列表中定义一个`...参数名`表示剩余参数，为包含所有剩余参数的数组。

在下面的代码中，将所有传入的参数作为剩余参数：

```js
function fn(...args) {
    console.log(args)
}

fn(10, 20) // => [10, 20]
fn(10, 20, 30) // => [10, 20, 30]
```

之所以称之为剩余参数，是因为它除了可以接收所有参数外，也可以接收部分参数：

```js
function fn(p1, p2, ...args) {
    console.log(args)
}

fn(10, 20, 30) // => [30]
fn(10, 20, 30, 40) // => [30, 40]
```

## 扩展运算符

扩展运算符`...`可以将数组（或者任何实现了**遍历器**的伪数组）拆分成以逗号分隔的**参数序列**。

在下面的代码中，`log()`的输出结果是`1 2 3`，而不是`1,2,3`。这是因为传入`log()`方法的其实是三个参数，相当于`console.log(1, 2, 3)`。由于`log()`方法可以传入多个参数，并以空格分隔后输出，才出现了这样的结果。

```js
let arr = [1, 2, 3]
console.log(...arr) // => 1 2 3
```

因此，可以用它将数组直接拆分为若干参数传递：

```js
let arr = [10, 20]
let fn = (x, y) => x + y

fn(...arr) // => 30
```

或者用来合并数组：

```js
let arr1 = [10, 20]
let arr2 = [30, 40]

// ...arr1 相当于 10, 20     ...arr2 相当于 30, 40
// 将它们放到括号中再加上中间的逗号，就实现了合并
let result = [...arr1, ...arr2] // => [10, 20, 30, 40]
```

由于 DOM 集合中的`HTMLCollection`也实现了遍历器，因此可以使用扩展运算符将其转换成真正的数组：

```js
let divs = document.querySelectorAll('div')
let result = [...divs] // => [div, div, div]，真正的 div 元素数组
```

> 转换真正数组也可以使用`Array`对象的`from()`方法。

## 模板字符串

模板字符串是新增的字符串定义方式，允许在字符串中直接使用变量，这些变量会自动替换成相应的值，而不需要通过`+`拼接字符串。模板字符串使用反引号包裹，里面的变量使用`${}`包裹。

```js
let age = 18
let str = `今年 ${age} 岁` // => 今年 18 岁
```

模板字符串中的变量可以使用表达式，也可以直接调用函数。

```js
let age = 18
let str = `今年 ${age / 2} 岁`

function getSum(num1, num2) {
    return num1 + num2
}

let str = `数字的和是 ${getAge(10, 20)}`
```

模板字符串会保留所有的空格和换行。

```js
let str = `
<div>
    <span></span>
</div>
` // 显示的结果会保留缩进格式
```

## Set 集合

ES6 中新增了类似于数组的结构 Set，但是它的元素值都是唯一的，不会重复。使用构造函数`Set()`可以创建一个 Set 结构，它可以接收任何数组（伪数组）参数，将其转换为`Set`，并自动去除重复元素。

```js
var arr = [10, 10, 30, 50]
new Set(arr) // => Set {10, 30, 50}
```

它包含下列的常用属性和方法：

| 属性或方法 | 描述 |
| --- | --- |
| `size` | 获取集合的长度 |
| `add()` | 向集合中添加一个值 |
| `delete()` | 删除集合中的一个值，如果删除成功则返回`true`，否则返回`false` |
| `has()` | 判断集合中是否包含某个值，如果包含则返回`true`，否则返回`false` |
| `clear()` | 清空一个集合 |

```js
const arr = [10, 20, 30]
new Set(arr).size // => 3
new Set(arr).add(40).add(50) // => Set {10, 20, 30, 40, 50}
new Set(arr).delete(20) // => Set {10, 30}
new Set(arr).has(30) // => true
new Set(arr).clear() // => Set {}
```

## 类

ES6 中提供了类的概念，用于简化之前~~反人类~~的原型写法，属于**原型的语法糖**。

使用`class`关键字可以定义一个类，其中可以包含`constructor()`构造方法、普通方法，最后通过`new`实例化即可：

```js
class Animal {
    constructor (age) { this.age = age }
    eat() { console.log('吃呀吃呀吃') }
}

var cat = new Animal(3)
cat.age // => 3
cat.eat() // => 吃呀吃呀吃
```

### 类的继承

使用`extends`关键字可以使子类继承父类所有的属性和方法。

```js
class Animal {
    eat() { console.log('吃呀吃呀吃') }
}

class Cat extends Animal {
    run() { console.log('猫在跑') }
}

let cat = new Cat()
cat.eat() // => 吃呀吃呀吃
```

如果子类有自定义的构造函数，那么必须在其中先使用`super()`调用父类的构造函数，否则会出现语法错误。这是因为 ES6 的继承需要首先创建父类实例，然后再将子类的属性和方法添加到父类实例上，再返回子类实例，因此子类的实例化必须依赖于父类实例。如果子类没有自定义构造函数，那么引擎也会自动添加上。

```js
class Animal {}

class Cat extends Animal {
    constructor () {
        super() // 必须先手动调用父类构造函数
    }
}
```

如果子类中定义了与父类相同的方法，那么会将父类的覆盖。

```js
class Animal {
    eat() { console.log('动物在各种吃') }
}

class Cat extends Animal {
    eat() { console.log('猫在各种吃') }
}

var cat = new Cat()
cat.eat() // => 猫在各种吃
```

子类中的`super`关键字指向父类本身，也就是子类的原型对象，因此可以直接调用父类的方法：

```js
class Animal {
    eat() { console.log('动物在各种吃') }
}

class Cat extends Animal {
    eat() { super.eat() } // 使用 super 指向父类
}

var cat = new Cat()
cat.eat() // => 动物在各种吃
```

但是，`super`指向的不是父类的实例对象，因此不能获取父类实例中的属性：

```js
class Animal {
    constructor() { this.age = 3 } // this 指向的是实例对象，因此 age 是实例对象中的属性
}

class Cat extends Animal {
    print() { console.log(super.age) }
}

var cat = new Cat()
cat.print() // => undefined
```

## 异步编程

JavaScript 是一门**单线程**的语言，也就是说，同一时间只能做一件事情。这意味着，如果程序执行中遇到了耗时很长的任务，那么后面的代码都要等待。于是 JavaScript 使用了一套专门的机制，将任务分成了同步和异步。

其中大部分的代码都是同步任务，它们位于**主线程**依次执行，只有上一个任务执行完毕后才能执行下一个任务。而一些不能立即获得结果的任务（比如定时器函数、网络请求、事件响应、IO 操作等），会被放到**任务队列**（也称消息队列）中。当主线程任务执行完毕后，会从任务队列中读取一条任务继续执行，完成后再次读取任务队列，这样产生的循环称为**事件循环**。

由于异步任务的执行时间未知，没法立即返回结果，因此在 ES5 及之前，实现异步编程的主要方式为回调函数。

在下面的代码中，主线程会先执行第一条语句，当执行到第二条语句时，引擎发现这是一个定时器异步任务，会将其加入任务队列并跳过（即便延迟时间为`0`），然后继续执行第三条语句。之后，主线程任务均执行完毕后，查看任务队列，然后取出定时器函数中的语句执行。

```js
console.log('张三')
setTimeout(() => console.log('王五'), 1000)
console.log('李四')
// => 张三 李四 王五
```

但回调函数带来了新的问题。

在下面的代码中，先延迟`1s`输出`first`，然后再延迟`1s`输出`second`，为了确保这一点，只能将第二次输出的代码放在第一次的回调函数中，以此类推。

```js
setTimeout(function () {
    console.log('first')
    setTimeout(function () {
        console.log('second')
        setTimeout(function () {
            console.log('third')
        }, 1000)
    }, 1000)
}, 1000)
```

可想而知，如果要依次输出的内容更多，那么代码就会层层嵌套，完全失去可维护性，这样的情况被称为**回调地狱**。

![](https://ae01.alicdn.com/kf/Hcc186dddd6994505a5ad1c0beb381f23q.jpg)

### Promise

为了解决这一问题，ES6 新增了一个`Promise`对象，该对象类似于一个容器，用来封装异步任务。

异步任务有很多，但是它们都有一个共性：要么执行成功要么失败。因此，要实例化`Promise`对象需要传入一个函数参数，它的两个参数`resolve`和`reject`又是两个函数，分别表示成功和失败这两种状态。异步任务在执行完成后，不再通过回调函数执行具体的功能，而是通过这两个函数将执行完毕后的结果传递到外部，由外部对结果进行处理。

```js
const first = new Promise(function (resolve, reject) {
    setTimeout(function () {
        resolve('这是第一个定时器啦') // 1 秒过后，通过回调函数执行 resolve() 将结果传递出去，而不是直接输出
    }, 1000) // 由于定时器任务没有失败的回调函数，因此不需要调用 reject()
})
```

接下来，`Promise`对象提供了一个`then()`方法，它接收一个函数参数表示成功状态时的处理函数，该函数的形参为`resolve()`传递出来的结果，这样就实现了将异步任务结果分离到回调函数之外来处理。

```js
first.then(function (result) {
    console.log(result) // 这是第一个定时器啦
})
```

除此之外，`then()`还可以接收第二个参数作为失败状态时`reject()`的处理函数，用法与`resolve()`一样。捕获错误也可以使用单独的`catch()`方法，由于`then()`会**默认自动**返回调用它的`Promise`对象，因此可以链式编程。

```js
first.then(function (result) {
    console.log(result) // 这是第一个定时器啦
}, function (err) {
    console.log(err) // 捕获错误，相当于 reject()
})

// 相当于
first.then(function (result) {
    console.log(result) // 这是第一个定时器啦
}).catch(function (err) {
    console.log(err) // 捕获错误，相当于 reject()
})
```

接下来继续回到之前的问题，发现问题依然没有完全解决。因为一旦调用了`new Promise()`，它内部的异步任务就会立刻被执行，这样的效果就相当于同时定义了三个定时器并执行，没有先后顺序。

因此为了防止它们自动执行，要先将它们放到一个函数中，等需要时手动调用，将实例化的`Promise`对象返回：

```js
function first() {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve('这是第一个定时器啦')
        }, 1000)
    })
}

first().then(function (result) {
    console.log(result) // 这是第一个定时器啦
})
```

之前提到，默认情况下`then()`会返回调用它的`Promise`对象，但是也可以手动设置它的返回值。因为第二个定时器依赖于第一个定时器执行完毕，所以在第一个定时器中返回第二个定时器的`Promise`对象，就可以实现依次调用的效果了。

```js
function first() {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve('这是第一个定时器啦')
        }, 1000)
    })
}

function second() {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve('这是第二个定时器啦')
        }, 1000)
    })
}

function third() {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve('这是第三个定时器啦')
        }, 1000)
    })
}

first().then(function (result) {
    console.log(result) // 这是第一个定时器啦
    return second() // 返回第二个 Promise，通过它再去调用第二个 then()，从而执行第二个定时器
}).then(function (result) {
    console.log(result) // 这是第二个定时器啦
    return third()
}).then(function (result) {
    console.log(result) // 这是第三个定时器啦
})
```

由此可见，虽然可以继续将返回`Promise`对象的函数合并封装，但是这个过程还是非常繁琐的。建议直接使用类似于[bluebird.js](/posts/0wuyppfk.html)的第三方库。

### 异步函数

虽然通过`Promise`解决了回调地狱的问题，但是连续的`then()`方法使得代码看起来依然不是很直观。于是 ES7 中又加入了**异步函数**的概念，它可以使异步的代码看起来与同步代码一样，更加直观易读。

普通的函数一旦开始执行，中间是不能暂停的，而异步函数可以中途停止，等待某个任务执行完毕返回结果，再继续执行。

在`function`前添加`async`关键字，可以定义一个异步函数。

```js
async function fn() {}
```

在其中的异步任务前添加`await`关键字，可以告知函数在此处暂停，直到异步任务返回结果。注意，**异步任务必须返回`Promise`对象才能被正确处理**，否则就相当于没有添加`await`。使用了`await`之后，就可以直接通过返回值来获取`Promise`对象中`resolve()`的结果，与同步代码几乎一样。

```js
function first() {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve('这是第一个定时器啦')
        }, 1000)
    })
}

function second() {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve('这是第二个定时器啦')
        }, 1000)
    })
}

function third() {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve('这是第三个定时器啦')
        }, 1000)
    })
}

async function fn() {
    let r1 = await first()
    console.log(r1)
    let r2 = await second()
    console.log(r2)
    let r3 = await third()
    console.log(r3)
}

fn()
```

如果使用了[bluebird.js](/posts/0wuyppfk.md)，那么`delay()`函数本身返回的便是`Promise`对象，因此代码可以进一步简化。

```js
Promise.delay(1000).then(function () {
    console.log('这是第一个定时器啦')
}).delay(1000).then(function () {
    console.log('这是第二个定时器啦')
}).delay(1000).then(function () {
    console.log('这是第三个定时器啦')
})

// 等同于
async function fn() {
    await Promise.delay(1000)
    console.log('这是第一个定时器啦')
    await Promise.delay(1000)
    console.log('这是第二个定时器啦')
    await Promise.delay(1000)
    console.log('这是第三个定时器啦')
}
fn()
```

## 模块化

JavaScript 自从诞生以来，一直没有类似于模块（Module）的体系，它无法将大型程序拆分成多个小文件，再拼装起来。比如在浏览器端，虽然一个页面可以引入多个 JavaScript 文件，但是它们其实会被浏览器合并成一个大文件，因此会出现命名冲突的问题。

而所谓模块化，就是将每个`.js`文件视为一个**模块**，每个模块会形成一个独立的模块作用域，它们彼此之间不能访问，因此不会出现命名冲突等问题。如果模块之间需要互相访问，则只需在一个模块中导入另一个模块即可；如果要访问其它模块中的具体数据，则要在被访问的模块中先导出数据，再从另一个模块中导入。

为了实现模块化，JavaScript 社区提供了一些解决方案，如浏览器端的 AMD（require.js）和 CMD（Sea.js）等，而服务端的 Node.js 也提出了 CommonJS，并沿用至今。

之后，JavaScript 官方在 ES6 中实现了模块化的功能，但是由于历史原因，Node.js 目前还无法支持。而浏览器端的大部分现代浏览器虽然已经实现了该特性，但是考虑到兼容性问题，也无法使用。因此，要使用原生的 ES6 模块化语法，只能通过 babel 等兼容性工具转换后才可以。

首先，在`<script>`中使用`import`关键字可以导入一个模块，并**自动执行其中的代码**。注意，此时的`<script>`标签必须添加`type="module"`属性，否则无法使用`import`语句。

```html
<script type="module">
    import './test.js'
</script>
```

或者也可以写在单独的`.js`文件中：

```html
<script type="module" src="index.js"></script>
```

```js
/* index.js */
import './test.js'
```

### 按需导入与导出

模块可以使用`export`关键字根据需要导出指定的数据，数据需要使用花括号包裹，多个数据以逗号分隔：

```js
/* test.js */
let str = 'hello'
let num = 233

export { str, num }
```

导入模块时，要获取这些数据，也需要通过花括号包裹，并且导出和导入时的**数据名称要保持一致**：

```html
<script type="module">
    import { str, num } from './test.js'
    str // => hello
    num // => 233
</script>
```

### 默认导入与导出

但有时在加载第三方模块时，去逐一地了解需要导入哪些数据实在有些困难，因此在导出模块时，可以使用`default`关键字指定**默认导出**的数据。这样在导入模块时，就不需要确切地声明要导入的数据了，只要任意起名即可。并且，此时导入语句中的数据名**不能加大括号**：

```js
/* test.js */
let num = 233
export default num
```

```html
<script type="module">
    import something from './test.js' // something 不需要加大括号
    something // => 233
</script>
```

默认导出本质上是将`default`后面的值赋值给`default`变量，而导入时`import`后面的内容就是这个`default`变量。因此`export default`后可以跟任意数据类型，但是不能跟一条语句。

也可以同时使用默认和按需两种导入导出方式：

```js
/* test.js */
let num = 233
let str = 'hello'

export { str }
export default { num }
```

```html
<script type="module">
    import something, { str } from './test.js' // 使用逗号隔开按需和默认导入导出
    something // => { num: 233 }
    str // => hello
</script>
```

此外，默认导出的语句在模块中**只能出现一次，不允许多次使用**。