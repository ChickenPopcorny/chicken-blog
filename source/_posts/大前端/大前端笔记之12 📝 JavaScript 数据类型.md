---
title: 大前端笔记之12 📝 JavaScript 数据类型
date: 2020-01-30 10:59:41
abbrlink: p4xy9gkd
tags: JavaScript
categories: 大前端
excerpt: JavaScript 中的值分为六种数据类型，其中除了<code>Object</code>之外均为基本类型，而<code>Object</code>又包含三种类型，狭义的对象、数组和函数。
---

# 大前端笔记之12 📝 JavaScript 数据类型

JavaScript 中的值分为六种数据类型，其中除了`Object`之外均为基本类型，而`Object`又包含三种类型，狭义的对象、数组和函数。

## 基本数据类型

基本数据类型包括`Undefined`、`Null`、`Boolean`、`String`和`Number`。

> 虽然`Boolean`、`String`和`Number`是基本数据类型，但是它们均有对应的**包装类**对象。当它们调用方法时，这些值会被临时转换为包装类对象，调用结束后就会被立刻销毁。

### Undefined 和 Null

JavaScript 中这两个类型均表示「空」，它们都只有一个值，即小写的`undefined`和`null`。

对于`undefined`来说，它不能手动定义，只会在下列情况下出现：
- 声明了变量，但没有赋值，该变量为`undefined`
- 数组中的空元素（修改数组长度、跨索引添加元素等）为`undefined`
- 调用函数时，没有传入实参，那么形参为`undefined`
- 访问**对象**中未声明的属性，该属性为`undefined`。如果访问一个未声明的变量，那么会报错
- 函数没有返回值，则返回`undefined`

对于`null`来说，如果一个对象类型的变量没有指向任何一个实际对象，那么该变量的值就是`null`。

### Boolean

布尔类型`Boolean`只有`true`和`false`两个值。

### String

字符串类型`String`使用单引号`''`或双引号`""`均可创建。不过由于 JSON 格式内部只能使用双引号，因此建议使用单引号创建字符串，否则就要使用转义字符`\`。

```js
var str = 'helloworld'
```

使用`length`属性可以获取字符串长度。

```js
'helloworld'.length // => 10
```

### Number

数值类型`Number`采用[IEEE 754](/posts/xp50sskp.html)标准，不区分整数值和小数值，所有数值都是以 64 位浮点数存储，即便是整数也是如此。

全局属性`NaN`表示非数字（Not a Number），当某些计算失败时（如负数开偶次方），返回的结果可能为`NaN`。它并不是独立的数据类型，而是`Number`类型的一个特殊值。

此外，`NaN`不等于任何值，包括**它本身**。由于这个特性，JavaScript 提供了全局方法`isNaN()`用来判断一个值是否为`NaN`。

```js
isNaN(NaN) // => true
```

## 数组

数组以`Array`内置对象表示。它可以同时存放不同类型的数据，但通常没有必要，因为这样无法对数据进行统一的处理。数组的本质其实是有序的键值对，但是它的特殊之处在于，它的键是有序的数字，而非具体的名称。

### 创建数组

要创建数组，主要通过字面量方括号`[]`语法。

```js
var arr = ['a', 'b', 'c']
```

> 通过`Array`对象的构造函数`Array()`也可以创建数组，但是根据传入的参数不同，其行为并不一致，因此并不推荐。

### 访问数组

使用`数组名[索引]`的方式可以获取数组中对应索引的元素，因此通过`for`循环可以遍历数组。

```js
var arr = ['a', 'b', 'c']
arr[1] // => b

for (var i = 0; i < arr.length; i++) {
    arr[i]
}
```

> 除了使用`for`循环以外，也可以使用数组的[相关方法]((/posts/i82icjg7.html#Array))或者[`for of`循环](/posts/j5h1kgw7.html#for-of-循环)遍历。

### 数组长度

使用`length`属性获取数组的长度。JavaScript 中的数组长度是**动态**和**可写**的，因此将数组长度设置为`0`可以清空数组。

```js
var arr = ['a', 'b', 'c']
arr.length // => 3
arr.length = 2 // 数组 arr 会变为 ['a', 'b']
```

## 函数

JavaScript 中的函数以`Function`内置对象表示。

### 创建函数

第一种方式称为**函数声明**：

```js
function sendMsg() { console.log('S.H.E.I.L.D') }
```

第二种方式称为**函数表达式**，函数表达式大多是没有函数名称的，这样的函数也被称为**匿名函数**：

```js
var print = function() { console.log('S.H.E.I.L.D') }
```

JavaScript 会根据代码本行的开头是否为`function`来区分函数声明和函数表达式。

> 由于函数也是对象，其实也可以通过`new Function()`构造函数的方式来创建，但这种方式并不直观，因此没有人使用。

### 调用函数

在函数声明的名称，或者保存函数表达式的变量后面添加一对圆括号`()`表示调用该函数。

```js
function sendMsg() { console.log('S.H.E.I.L.D') }
sendMsg() // 调用函数
```

### 参数

调用函数的同时也可以传入参数。在 JavaScript 中即使在创建函数时定义了形参，但调用时并**不要求**提供所有的参数，省略的参数的值为`undefined`，多余的参数会被忽略。

```js
function print(a, b){
    a // => 10
    b // => undefined
}
print(10) // 只传入了一个参数
```

由于参数的数量不确定，因此`Function`对象中提供了`arguments`伪数组，用来在函数体内部读取所有参数。

```js
function foo() {
    arguments[0] // => 10
    arguments[1] // => 20
    arguments.length // => 2
}
foo(10, 20)
```

### 返回值

使用`return`语句设置函数的返回值，函数在执行时遇到`return`语句会立刻终止。如果没有返回值，或者`return`后面没有内容，那么返回`undefined`。

```js
function getSum(a, b) { return a + b }
```

### 函数是一等公民

如果一个函数可以存储在变量或数据结构中，并且可以进行引用传递，那么称这样的函数为**一等公民**，表示它和其它类型享有同样的待遇。因此，JavaScript 中的函数可以直接赋值给一个变量，也可以作为函数的结果返回。也就是说，函数声明的名称本质就是一个**保存了函数代码的变量**。

在下面的代码中，将函数的代码传递给了其它变量，通过该变量依然可以调用函数：

```js
function print() { console.log('我是一等公民啦!') }
var other = print
other() // => 我是一等公民啦! 
```

### 立即执行函数

如果希望函数声明后立刻调用，而不是单独写一条调用语句，或许会尝试下面的写法：

```js
function sendMsg() { console.log('S.H.E.I.L.D') }() // => SyntaxError: Unexpected token (
```

但是这样是错误的，因为代码的首行开头是`function`，编译器会认为这是一个函数声明，不能以圆括号结尾。那么解决的办法就是不要让`function`出现在行首，让引擎将其理解成一个表达式。下面是两种比较常见的写法：

```js
(function() { // 由于已经成为了表达式，函数名称可以省略
    console.log('S.H.E.I.L.D')
})();

// 或者
(function() {
    console.log('S.H.E.I.L.D')
}());
```

这样引擎就会将其作为一个表达式来执行，它的最大作用是**创建一个独自的作用域，避免命名发生冲突**。

> 如果采用了无分号的代码风格，那么立即执行函数的前面应当添加一个分号`;(function(){})()`，防止解析出错。

### 作用域

作用域指的是变量所在的范围，它会把自己范围内的变量收集起来并统一管理。作用域分为两种（ES6 中还新增了块级作用域）：

- 全局作用域：在整个运行过程中一直存在的作用域。JavaScript 会将一个页面中的全部`<script>`标签和单独的`.js`文件都合并成一个整体，因此即便是**多个文件也是共享一个全局作用域**。在全局作用域中声明的变量称为**全局变量**，在程序任何位置都可以访问。
- 局部作用域（函数作用域）：每声明一个函数，就会在**函数内部**创建一个新的局部作用域。在局部作用域中声明的变量称为**局部变量**，只能在该函数内部访问。此外，JavaScript 采用的为**词法作用域**，也就是说**作用域由函数声明**时的位置决定，与调用的位置无关。

```js
/* 全局作用域 */
var num = 10
console.log(num) // => 10

function foo() {
    /* 局部作用域 */
    var num = 20
    console.log(num) // => 20
}
```

#### 作用域链

当函数发生嵌套时，其对应的局部作用域也会嵌套。因此作用域除了保存范围内的变量之外，还会**保存外部的作用域**。因此，在当前的作用域中无法找到某个变量时，就会在嵌套的上一级作用域中继续查找该变量，直到全局作用域为止。这一连串的作用域被称为**作用域链**。

```js
/* 全局作用域 */
var num = 10

function outer() {
    /* outer 的局部作用域 */
    var num = 20

    function inner() {
        /* inner 的局部作用域 */
        console.log(num) // => 20，inner 作用域内没有 num 变量，因此去上一级 outer的作用域中找
    }
}
```

#### 提升

JavaScript 在所有代码执行前会首先收集所有**变量声明**和**函数声明**（不包括函数表达式），然后将它们提升到**所在作用域**的开头。例如：

```js
console.log(a) // => undefined
var a = 2

// 等价于
var a
console.log(a)
a = 2
```

函数声明也会被提升：

```js
fun() // => 我被提升啦
function fun() { console.log('我被提升啦') }
```

### 闭包

当内部函数通过作用域链访问了外部函数的变量，则称外部函数为一个闭包，通过 Chrome 设置断点可以查看：

```js
function father() {
    var num = 1
    function son() { console.log(num) } // 访问了外部函数的 num 变量
    son()
}

father()
```

![](https://pic3.superbed.cn/item/5dfc573776085c32890afa0b.jpg)

不过这样的闭包并没有意义，它的最主要作用在于**延长变量的生命周期**。在下面的代码中，每次调用`father()`函数，`num`的值都是`1`，因为当调用结束后，`father()`的作用域就被销毁了。

```js
function father() {
    var num = 1
    function son() { console.log(num++) }
    son()
}

father() // => 1
father() // => 1
```

但是，如果将内部函数作为返回值，传递到外部，再由外部调用，结果就不一样了：

```js
function father() {
    var num = 1
    function son() { console.log(num++) }
    return son
}

var fn = father()
fn() // => 1
fn() // => 2
```

这是因为，虽然`father()`调用结束了，但是它其中的函数被传递到了外部，由于内部函数依然在使用，所以`father()`的作用域也被保存了下来。

> 可以这么理解：我叫独孤求败（内部函数），我在一个山洞（闭包）里，里面有世界上最好的剑法和武器（内部变量）。我学习了里面的剑法，拿走了最好的剑，离开了这里（闭包返回了函数）。我来到这个江湖，快意恩仇，但是从来没有人知道我这把剑，和我这一身的武功的来历（外部无法访问闭包内部的变量，只有内部函数才可以）。

## 对象

这里的对象指的是狭义的对象，它的本质是无序的键值对。

### 创建对象

使用字面量花括号`{}`语法创建一个对象。对象的属性名称可以加引号，也可以不加，通常建议**不加引号**。但是，如果属性名称不符合标识符规则（如包含短横线`-`或空格、以数字开头等），那么必须加引号。

```js
var person = { 
    name : 'Claire',
    age : 19,
    eat: function() { console.log('吃呀吃') }
}
```

> 通过`Object`对象的构造函数`Object()`也可以创建对象，但是在这种方式下只能通过单独的赋值语句为对象添加属性，因此不推荐使用。

### 访问属性

使用`.`运算符获取对象的属性：

```js
var person = { age: 18 }
person.age // => 18
```

除此之外，也可以使用方括号`[]`语法，这种方式可以使用变量作为属性名：

```js
var person = { age: 18 }
var attr = 'age'

person['age'] // => 18
person[attr] // => 18，此时的 attr 是一个变量，而非属性名
```

由于对象为键值对，因此没法使用普通`for`循环来遍历对象，取而代之的是`for in`循环。

```js
var person = { name: 'Claire', age: 19 }

for (var key in person) { // 设置一个临时变量 key，命名随意
    key // 遍历键
    person[key] // 用方括号语法遍历值
}
```

### 判断属性存在

使用`in`可以判断对象中是否存在某个属性。

```js
var person = { name: 'Claire', age: 19 }

'name' in person // => true
```

## 自动类型转换

在某些特殊情况下，JavaScript 中的数据类型会发生自动类型转换。

### 转换为布尔型

在某些情况下（比如将值用于`if`条件判断），JavaScript 会自动调用构造函数`Boolean()`将一些值转换为`Boolean`类型。转换规则如下：

| 数据类型 | 结果 |
| --- | --- |
| `Undefined` | 转换为`false` |
| `Null` | 转换为`false` |
| `Number` | `0`或者`NaN`，转换为`false`，其它转换为`true` |
| `String` | 空字符串`''`转换为`false`，其它转换为`true` |
| `Object` | 转换为`true` |

### 转换为字符串

在某些情况下（比如使用加法运算符`+`将其它数据类型与字符串相连），JavaScript 会自动调用构造函数`String()`将一些值转换为`String`类型。而转换的规则与使用这些值手动调用[toString()](/posts/i82icjg7.html)方法是完全一样的。

### 转换为数字型

在某些情况下，JavaScript 会自动调用构造函数`Number()`将一些值转换为`Number`类型。转换规则如下：

| 数据类型 | 结果 |
| --- | --- |
| `Undefined` | 转换为`NaN` |
| `Null` | 转换为`0` |
| `Boolean` | `true`转换为`1`，`false`转换为`0` |
| `String` | 见下文 |
| `Object` | 见下文 |

使用`Number()`将`String`类型转换成`Number`，规则如下：

- 如果字符串为合法数字，那么将其转换成十进制数值，例如`'123'`转为`123`，`'023'`转为`23`、`'1.2'`转为`1.2`
- 如果字符串为空，则转换成`0`
- 除以上情况外，均转换成`NaN`

使用`Number()`将`Object`类型转换成`Number`，规则如下：

- 首先调用对象的`valueOf()`方法，然后按照上述规则进行转换
- 如果上一步结果为`NaN`，那么调用对象的`toString()`方法转换成字符串，然后再按照上述规则进行转换

可以看到这个过程比较复杂，因此通常会手动调用`Number`对象的相关方法来进行数字转换（见[标准库](/posts/i82icjg7.html#Number)一节）。

## 判断数据类型

使用下面的方式可以判断一个值的数据类型。

### typeof

使用`typeof`运算符获取一个值的数据类型。其中的函数并非数据类型，但有特殊返回值。

| 数据类型 | 返回值 |
| --- | --- |
| `Undefined` | `undefined` |
| `Null` | `object` |
| `Boolean` | `boolean` |
| `String` | `string` |
| `Number` | `number` |
| `Object` | `object` |
| 函数 | `function`  |

```js
typeof 'abc' // => string
typeof 123 // => number
```

### instanceof

虽然`typeof`可以检测基本类型，但是对于引用类型，无论什么类型的对象都会返回`object`。因此要判断一个对象是不是某个类型的实例时，可以使用`instanceof`，它根据原型链来识别该实例是否属于某个对象。

```js
var arr = [1, 2, 3]
arr instanceof Array // => true
```

### toString()

由于任何对象调用[toString()](/posts/i82icjg7.html)方法默认会返回表示该对象类型的字符串，因此可以利用这一特性判断对象的数据类型。