---
title: 大前端笔记之21 🍀 Vue.js
date: 2020-02-15 21:15:10
abbrlink: ovrgsm0u
tags: Vue.js
categories: 大前端
excerpt: Vue.js 是目前国内最流行的前端渐进式框架，所谓渐进式指的是，你不需要一开始就学会 Vue 的全部功能特性，就可以将项目一点点引入 Vue。也就是说，它可以作为一个普通的 JavaScript 库用来提交表单、管理 DOM；也可以在大型项目中用来管理路由、实现组件化开发。随着项目的不断发展，以及对于 Vue 了解的不断加深，每个人所使用的侧重点也是不同的。
---

# 大前端笔记之 21 🍀 Vue.js

[Vue.js](https://cn.vuejs.org/v2/guide/installation.html)是目前国内最流行的前端渐进式框架，所谓渐进式指的是，你不需要一开始就学会 Vue 的全部功能特性，就可以将项目一点点引入 Vue。也就是说，它可以作为一个普通的 JavaScript 库用来提交表单、管理 DOM；也可以在大型项目中用来管理路由、实现组件化开发。随着项目的不断发展，以及对于 Vue 了解的不断加深，每个人所使用的侧重点也是不同的。

如果只是在浏览器端简单使用，则可通过 CDN 的方式在页面直接引入，后期则会采用其它的使用方式。

```html
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
```

## 基本语法

引入 Vue.js 之后，首先通过`Vue()`实例化一个对象，它的参数也是一个对象，其中的属性值有很多，会在接下来逐一了解到：

```js
const vue = new Vue({
    el: '#app', // 挂载数据的元素选择器，表示只有在这个元素下才能使用 Vue 的语法
    data: {
        // 数据对象，通常从服务器接口获取，这里临时模拟
        msg: '你好呀~'
    }
})
```

然后在页面上要准备一个对应的`#app`元素。其中可以使用双大括号（插值表达式）语法，将要渲染的数据名称写在里面，Vue 就会自动在实例中寻找相应的数据，将其替换成数据的值。当然，也可以在其中进行一些简单的表达式运算。

```html
<div id="app">
    <span>{{ msg }}</span>
    <span>{{ 'Hello，' + msg }}</span>
    <!-- 拼接了字符串 -->
</div>
```

如果此时通过`vue.msg = '好个毛'`修改`msg`的值，那么会发现页面中的值也发生了变化，这是因为 Vue 默认会一直监听渲染后的数据，只要数据发生改变，那么相应的 DOM 也会被改变。

> 注意，所有的`data`数据可以直接使用实例本身调用，不需要`vue.data.msg`。

### 方法

方法`methods`可以像`data`一样保存数据，区别在于`data`存储的是值，而`methods`存储的是方法。

在下面的代码中，为元素[绑定了事件](#绑定事件)，当触发事件时，会调用相应的`show()`方法。

```html
<button @click="show">点我</button>
```

```js
var vue = new Vue({
    methods: {
        show() {
            console.log('hello')
        }
    }
})
```

如果需要在方法中访问`data`中的值，则需要使用`this`。这里的`this`指代的是实例化的`Vue`对象，可以通过`this.msg`获取到值，因为 Vue 自动在该对象下添加了属性，不需要调用`this.data.msg`。

```js
var vue = new Vue({
    data: { msg: '你好呀~' },
    methods: {
        show() {
            console.log(this.msg)
        }
    }
})
```

### 计算属性

计算属性用来抽取一些复杂的插值表达式计算，可以将这些计算定义 Vue 实例中统一管理，而不是直接写在模板上。

在下面的代码中，需要对书的总价进行计算，并显示在页面上，这时就可以使用计算属性。

```html
<div id="app">
    <h1>{{ total }}</h1>
</div>
```

```js
var vue = new Vue({
    el: '#app',
    data: {
        books: [
            { id: 1000, name: '哈利波特', price: 300 },
            { id: 1001, name: '北欧众神', price: 50 },
            { id: 1002, name: 'JOJO的奇妙冒险', price: 450 }
        ]
    },
    computed: {
        total() {
            return this.books.reduce(function(sum, book) {
                return sum + book.price
            }, 0)
        }
    }
})
```

可以看到，在使用计算属性时，不需要使用圆括号`()`，直接**当作属性使用**即可。原因是，其实计算属性的值本身也是一个对象，而其中包含两个函数属性，分别为该属性的`get()`和`set()`，因此计算属性的完整写法是：

```js
var vue = new Vue({
    computed: {
        total: {
            get() {}
            set() {} // 如果修改了 app.total，就会调用 set() 方法
        }
    }
})
```

由于`set()`方法实际使用很少，因此 Vue 才提供了这种简写方式，如果传入的不是对象，而是一个函数，那么就相当于调用它的`get()`方法。

### 方法与计算属性的区别

计算属性与`methods`非常相似，但是两者有一定的区别。其中最重要的一点是，计算属性是具有缓存机制的，而方法并没有。

在下面的代码中，分别使用计算属性和方法输出了内容，并对数据做了相同的处理，可以看到，计算属性只调用了一次，而方法调用了两次。其原因是，**只要数据没有发生改变**，那么计算属性就会直接读取缓存中计算好的值，不会多次进行计算；而方法是只要被调用，那么就会重新计算一次，因此如果只是希望获取一个计算后的值，那么应该使用计算属性，可以提高性能。

```html
<p>{{ getSumComputed }}</p>
<p>{{ getSumComputed }}</p>
<p>{{ getSumMethod() }}</p>
<p>{{ getSumMethod() }}</p>
```

```js
var vue = new Vue({
    data: { num1: 233 },
    computed: {
        getSumComputed() {
            console.log('计算属性执行了')
            return this.num1 + 2
        }
    },
    methods: {
        getSumMethod() {
            console.log('方法执行了')
            return this.num1 + 2
        }
    }
})
```

### 指令

指令是 Vue 的一种特殊语法，有很多功能都需要指令来实现。它的本质是类似于`data-`的自定义属性，通常以`v-`开头，定义在元素标签上。当指令的值发生改变时，Vue 会自动操作相应的 DOM 元素，而不需要手动处理，即**以数据驱动 DOM**，这是 Vue 的重要理念。

指令的值与插值表达式一样，如果只写名称，没有引号，那么均会当作 Vue 数据处理。同样，也可以对于这些数据进行表达式运算。

### 过滤器

过滤器用于文本格式化显示，它只能使用在**双花括号的插值表达式**和`v-bind`指令中，分为全局和局部两种。

使用`Vue.filter()`方法可以定义一个全局过滤器，注意，全局过滤器只能定义在实例化`Vue()`之前。

| 参数     | 描述                                                                       |
| -------- | -------------------------------------------------------------------------- |
| 字符串   | 过滤器名称                                                                 |
| 处理函数 | 它的参数为要过滤的数据，即显示数据时，管道符前面的值；返回值为过滤后的数据 |

```js
// 将所有的 Fuck 替换成 F**k
Vue.filter('msgFilter', function(msg) {
    return msg.replace(/Fuck/, 'F**k')
})

var vue = new Vue({}) // 然后才能实例化 Vue 对象
```

在`Vue()`实例对象内部也可以定义私有过滤器，表示只有该实例内部才能使用。如果与全局过滤器重名，那么优先调用私有过滤器。

```js
var vue = new Vue({
    el: '#app', // 只有在 #app 下的元素才能调用该过滤器
    filters: {
        // 注意这里的属性名包含 s
        msgFilter(msg) {
            return msg.replace(/Fuck/, words)
        }
    }
})
```

在显示数据时，可以在原本数据最后添加一个管道符`|`，然后跟过滤器的名称：

```html
<p>{{ msg | msgFilter }}</p>
```

过滤器也可以传递参数，比如将要替换的固定值`F**k`改成通过参数传入：

```html
<p>{{ msg | msgFilter('F**k') }}</p>
```

```js
Vue.filter('msgFilter', function(msg, words) {
    return msg.replace(/Fuck/, words)
})
```

过滤器也可以调用多次，Vue 将从左到右依次将前面的结果交给后面的过滤器。

```html
<p>{{ msg | msgFilter | otherFilter }}</p>
```

### 侦听器

使用`Vue()`实例中的`watch`属性可以定义侦听器，用于监听数据变化。一旦数据发生变化，则立刻触发对应的监听函数。监听函数中还可以传入两个参数，分别表示变化之后和变化之前的值。

```html
<input type="text" v-model="msg" />
```

```js
var vue = new Vue({
    data: {
        msg: ''
    },
    watch: {
        msg(newVal, oldVal) {
            // 当 msg 被修改时，会调用 msg() 侦听器
            console.log('msg 发生了变化！')
        }
    }
})
```

### Vue 实例的生命周期

当使用`new Vue()`创建 Vue 实例的时候，这一条简单的语句会使得 Vue 内部作出非常复杂的操作。这些操作可以分为多个阶段，从而构成了它的生命周期。Vue 为这些阶段提供了对应的生命周期函数（或生命周期钩子），当执行到相应的阶段时，Vue 会自动的试图调用这些函数。

下图主要取自官网，它描述了 Vue 实例的整个生命周期。

![](http://cdn.yesuanzao.cn/superbed/2020/02/23/5e5242b6bb8bdc23dea4146a.png)

这些生命周期函数均定义在实例对象的参数中，与`el`、`data`等属性并列。

```js
var vue = new Vue({
    el: '#app',
    data: {
        msg: '你好呀~'
    },
    created() {
        console.log(this.msg + 'Vue 被创建啦！数据可以使用了！')
    }
})
```

## 显示数据

除了使用插值表达式以外，也可以使用一些特定的指令来显示数据。但是相比于插值表达式，指令方式并没有那么灵活，因此除非是特定的需求，否则尽量还是使用插值表达式。

### v-text

将指令的值作为数据名称，以纯文本形式，直接渲染到元素中。它的作用与插值表达式基本一致，但是如果需要元素中的部分内容，则必须使用插值表达式语法。

```html
<div v-text="msg"></div>
<!-- 等价于 -->
<div>{{ msg }}</div>
```

```js
var vue = new Vue({
    data: {
        msg: '你好呀~'
    }
})
```

### v-html

将指令的值作为数据名称，以 HTML 形式，渲染到元素中。也就是说，如果数据内容包含 HTML，则会被正确解析。注意，如果数据是外部传入的，则可能会导致遭受恶意攻击。

```html
<div v-html="msg"></div>
```

```js
var vue = new Vue({
    data: {
        msg: '<h1>你好呀~</h1>' // 页面会出现一个 <h1> 标题
    }
})
```

### v-once

如果不希望 Vue 监听数据的变化，从而改变 DOM，则可以使用`v-once`指令。使用该指令的元素只会被渲染一次，之后就会变成静态，从而提升页面性能。

```html
<div v-once>{{ msg }}</div>
```

```js
vue.msg = '好个毛' // 不会改变页面显示
```

### v-cloak

当页面使用插值表达式时，由于渲染需要时间，此时页面的双大括号可能会直接显示出来，然后才会被替换成真正的内容，从而导致数据出现闪烁。

如果为页面元素添加`v-cloak`指令，并使用 CSS 将其设置为隐藏，那么在内容渲染完成之前，该元素就不会显示。当 Vue 渲染完成后，会自动删除元素上的`v-cloak`样式，从而避免闪烁。

```html
<span v-cloak>{{ msg }}</span>
```

```css
[v-cloak] {
    display: none;
}
```

## 绑定属性

使用`v-bind`指令可以绑定元素属性。

```html
<a v-bind:href="url">点我跳转~</a> <img v-bind:src="src + '.png'" />
```

```js
var vue = new Vue({
    data: {
        url: 'https://www.baidu.com',
        src: 'test'
    }
})
```

该指令提供了语法糖形式，可以将前面的`v-bind`省略，保留一个冒号`:`即可。

```html
<a :href="url">点我跳转~</a>
```

### class 样式属性

样式属性是一种比较特殊的元素属性，Vue 提供了专门的语法格式来绑定。如果元素同时拥有本身的类与绑定的类，那么 Vue 会将两者合并，而非简单覆盖。

如果传入一个字符串数组，那么表示该元素使用这些样式。其中的样式名必须以引号包裹，否则会被解析为数据名。

```css
.tianyi {
    color: #66ccff;
}
.italic {
    font-style: italic;
}
.thin {
    font-weight: 200;
}
```

```html
<h1 :class="className">注意我要变形了！</h1>
```

```js
var vue = new Vue({
    data: {
        className: ['tianyi', 'thin', 'italic']
    }
})
```

如果数组中的某些元素为对象，那么它表示该类是否起作用。其中对象的属性名为样式名，属性值为布尔值。

```js
var vue = new Vue({
    data: {
        // 对象的属性名可以省略引号哒！这是 JS 语法！和 Vue 没关系！
        className: ['tianyi', 'thin', { italic: true }]
    }
})
```

如果直接传入一个对象，则可以对其中的每个属性进行可用性判断。其中对象的属性名为样式名，属性值为布尔值。

```js
var vue = new Vue({
    data: {
        className: {
            tianyi: true,
            thin: true,
            italic: false
        }
    }
})
```

### style 样式属性

除了类样式以外，也可以为元素绑定内联样式。注意，对于带有连字符`-`的属性，需要转换成驼峰形式，否则必须使用引号包裹（因为连字符不符合标识符规则）。

如果绑定的值为对象，那么每个键值对表示一条样式规则。其中属性名为样式名称，属性值为样式值。

```html
<h1 :style="s1">注意我要变形了！</h1>
```

```js
var vue = new Vue({
    data: {
        s1: { fontWeight: '200', color: '#66ccff' }
    }
})
```

如果绑定的值为数组，那么可以同时绑定多个样式对象。

```html
<h1 :style="[s1, s2]">注意我要变形了！</h1>
```

```js
var vue = new Vue({
    data: {
        s1: { fontWeight: '200', color: '#66ccff' },
        s2: { fontStyle: 'italic' }
    }
})
```

## 绑定事件

使用`v-on`指令可以为元素绑定事件。注意，传入方法时加不加圆括号效果是一样的：

```html
<button v-on:click="show">点我</button>
<!-- 或者 -->
<button v-on:click="show()">点我</button>
```

```js
var vue = new Vue({
    methods: {
        show() {
            alert('hello')
        }
    }
})
```

该指令同样提供了语法糖，可以将前面的`v-on:`替换成一个`@`。

```html
<button @click="show">点我</button>
```

绑定事件时也可以同时传入参数和事件对象。如果调用时**省略了圆括号**，那么 Vue 会默认传入一个事件对象参数：

```html
<a href="https://www.bilibili.com" @click="show">点我</a>
```

```js
var app = new Vue({
    methods: {
        // 可以使用原生的事件对象，这里只做演示，使用下面的事件修饰符实现更合理
        show(e) {
            e.preventDefault()
        }
    }
})
```

但是，**如果手动添加了圆括号，则必须显式传入一个`$event`对象才能获取到事件对象**，此时也可以传入其它参数作为方法本身的参数：

```html
<button @click="test1(10, $event)">点我</button>
<button @click="test2()">点我</button>
```

```js
var app = new Vue({
    methods: {
        test1(num, e) {
            e // => 原生事件对象
            num // => 10
        },
        test2(e) {
            e // => undefined
        }
    }
})
```

### 事件修饰符

事件修饰符用来简化类似于阻止默认事件、事件冒泡等常见需求，它们均定义在事件名称后，由一个点`.`和修饰符名称组成。注意，事件修饰符是可以串联的，根据串联顺序不同结果也可能会有所不同。

| 事件修饰符 | 描述                   |
| ---------- | ---------------------- |
| `.stop`    | 阻止元素冒泡           |
| `.prevent` | 阻止元素的默认事件     |
| `.once`    | 使绑定的事件仅触发一次 |

```html
<div @click="outer">
    <div @click.stop="inner"></div>
</div>

<a @click.prevent="showMsg" href="https://www.baidu.com">点我跳转</a>

<button @click.once="showMsg">点我</button>
```

```js
var vue = new Vue({
    methods: {
        outer() {
            console.log('外部元素事件被触发啦')
        }, // => 不会被触发
        inner() {
            console.log('内部元素事件被触发啦')
        }
    }
})
```

### 按键修饰符

使用按键修饰符可以监听具体的按键。Vue 将[常用的按键](https://cn.vuejs.org/v2/guide/events.html#按键码)进行了封装，如果需要的按键不在列表中，可以使用`keyCode`码作为按键修饰符名称。

```html
<input type="text" @keypress.enter="show" />
<input type="text" @keypress.65="show" /><!-- 按下 a 触发 -->
```

```js
var vue = new Vue({
    methods: {
        show() {
            alert('hello')
        }
    }
})
```

使用`Vue.config.keyCodes`属性可以为`keyCode`自定义一个名称。

```js
Vue.config.keyCodes.a = 65
```

```html
<input type="text" @keypress.a="show" />
```

## 条件渲染

使用`v-if`和`v-show`指令可以根据条件来判断某个元素是否被渲染。

两者的区别在于，`v-if`是通过创建或删除 DOM 元素来实现，而`v-show`则是通过`display`属性来实现。因此，如果是需要频繁切换显示隐藏的场景，应该使用`v-show`；如果一个元素经过判断之后自始至终就不需要显示，那么使用`v-if`即可，因为元素根本就不会创建，而不是先创建再隐藏。并且，`v-show`不能用在`<template>`中，也没有多分支判断。

### v-if

控制元素的显示或隐藏。如果指令的值为`true`，则元素正常显示，否则会被隐藏。

```html
<h1 v-if="flag">看不见我！</h1>
```

```js
var vue = new Vue({
    data: {
        flag: false // 如果为 true，则元素正常显示
    }
})
```

与普通的流程控制一样，它也具有多分支的判断功能：

```html
<h1 v-if="age < 18">回家玩去！</h1>
<h1 v-else-if="age >= 18 && age <= 65">可以上网吧了！</h1>
<h1 v-else>退休以后还来网吧？？</h1>
```

```js
var app = new Vue({
    data: {
        age: 18 // => 显示第二个 <h1>可以上网吧了！</h1>
    }
})
```

> 对于本例来说，最好还是使用计算属性。但是如果要控制多个元素是否显示，可以将它们放到一个`<template>`模板中，然后为模板添加`v-if`指令，这样其中的元素就会根据条件判断隐藏或显示，但是`<template>`本身不会被渲染。`<template>`模板在后面的[组件](#组件)一节中会讨论到。

#### key 属性

如果将文本框用于判断时，可能会出现一个令人迷惑的现象：虽然文本框组件被切换了，但是用户输入的值却保留着：

```html
<input v-if="login == 'username'" type="text" placeholder="账户名" />
<input v-else-if="login == 'email'" type="text" placeholder="邮箱" />
```

```js
var vue = new Vue({
    data: {
        login: 'username' // 修改它会导致文本框发生改变，但是输入值却保留了
    }
})
```

这是因为 Vue 为了最大化性能采用了虚拟 DOM，在替换元素时 Vue 会对比两个元素之间的差异，由于它们都是文本框元素，因此并不会真正的将前者删除，重新渲染 DOM，而是将它们的属性进行替换，就好像看起来是创建了一个新元素一样，所以之前的输入值才被保留了。

如果希望 Vue 将它们重新创建，可以添加一个`key`属性，如果两个元素的`key`属性不同，则 Vue 会认为它们是两个完全不同的元素。

```html
<input
    v-if="login == 'username'"
    type="text"
    placeholder="账户名"
    key="username"
/>
<input
    v-else-if="login == 'email'"
    type="text"
    placeholder="邮箱"
    key="email"
/>
```

### v-show

控制元素的显示或隐藏。如果指令的值为`true`，则元素正常显示，否则会被隐藏。

```html
<h1 v-show="flag">隐藏啦！</h1>
```

```js
var vue = new Vue({
    data: {
        flag: false
    }
})
```

## 列表渲染

使用`v-for`可以遍历数组和对象，将其渲染到页面上。

### 遍历数组

在下面的代码中，每次从数组中取出一个数字，并渲染到页面上。

```html
<p v-for="num in nums">{{ num }}</p>
```

```js
const vue = new Vue({
    data: {
        nums: [3, 8, 12, 22, 28, 31]
    }
})
```

除了数组元素本身外，也可以同时获取索引：

```html
<p v-for="(num, index) in nums">当前数字是{{ num }}，这是第{{ index }}个数字</p>
```

> 注意，只有使用会修改原数组的方法操作数组时，才会导致数据被同步修改。

### 遍历对象

在下面的代码中，使用`v-for`遍历了`person`对象的每个属性值：

```html
<p v-for="val in person">{{ val }}</p>
```

```js
var vue = new Vue({
    data: {
        person: { name: '御坂美琴', age: 16 }
    }
})
```

当然也可以同时获取对象的属性名，注意其中第一个参数为属性值，第二个参数为属性名：

```html
<p v-for="(val, key) in person">{{ key }} --- {{ val }}</p>
```

### 遍历整数

该指令还可以用来迭代整数。

```html
<p v-for="n in 10">{{ n }}</p>
```

### key 属性

与`v-if`中绑定的`key`属性的原因一样，`v-for`也必须使用`key`属性来标识自己的唯一性，否则当中间插入其它数据时，原本的输入值就会保留下来。

在下面的代码中，使用了`v-for`遍历输出了`persons`数组，并且每条数据前都有一个复选框。

```html
<div v-for="person in persons">
    <input type="checkbox" />{{ person.id }} : {{ person.name }}
</div>
```

```js
var vue = new Vue({
    data: {
        persons: [
            { id: 1, name: '御坂美琴' },
            { id: 2, name: '温蒂' },
            { id: 3, name: 'JOJO' }
        ]
    }
})
```

但是假如先勾选任意一条数据，再添加一条新数据到开头，就会发现复选框选中的数据发生了改变。这是因为 Vue 在虚拟 DOM 中比对两个元素时，发现都是相同的元素，因此为了提高性能，会在末尾创建一个新元素，而之前的元素就仅做属性覆盖。

![](http://cdn.yesuanzao.cn/superbed/2020/02/27/5e57aad56127cc071301b491.jpg)

要解决这个问题，需要为`v-for`绑定一个唯一的`key`属性，就可以使虚拟 DOM 找到对应的元素了。

```html
<div v-for="person in persons" :key="person.id"></div>
```

### 数据同步

由于 JavaScript 的限制，通过索引直接修改数组项、通过对象属性名直接修改值，或者修改数组长度均不会导致数据内容同步显示。

```html
<p v-for="num in nums">{{ num }}</p>
```

```js
var vue = new Vue({
    data: {
        nums: [10, 20, 30, 40]
    }
})
// 输入 this.nums[0] = 233，可以看到数据被修改了，但是页面不会同步
```

为了解决这个问题，Vue 提供了一个内置的方法`Vue.set()`，用来修改数组内容。

| 参数          | 描述                         |
| ------------- | ---------------------------- |
| 数组 / 对象   | 要修改的数组或对象名称       |
| 数值 / 字符串 | 要修改的索引位置或对象属性名 |
| 对象          | 修改后的值                   |

```js
Vue.set(this.nums, 0, 233)
Vue.set(this.person, 'age', 16)
```

## 绑定表单元素

使用`v-model`指令可以将实例中的数据与视图中的数据进行**双向绑定**，它只能用于表单元素。之前所有的指令，只能实现由数据（Model，即`data`数据）到视图（View，即页面元素）的单向绑定，如果修改了数据，那么视图会随之变化，但是如果修改了页面元素内容，数据是不会发生改变的。而数据双向绑定，则是将两者关联起来，只要一方发生了变化，那么另一方也随之改变。

### 文本框 / 文本域

将文本框或文本域绑定为字符串数据，表示文本框的值与该字符串数据进行双向绑定。注意，**绑定之后会导致控件本身的`value`属性失效**。

```html
<input type="text" v-model="msg" /> <span>{{ msg }}</span>
```

```js
var vue = new Vue({
    data: { msg: '你好呀' }
})
```

### 单选框

将单选框绑定为字符串数据，当它的`value`属性值等于该字符串时，那么该单选框会被选中，与此同时，其它绑定相同字符串的单选框则会被取消选中。

```html
<input type="radio" v-model="sex" value="male" />男
<input type="radio" v-model="sex" value="female" />女
```

```js
var vue = new Vue({
    data: {
        sex: 'male' // 与单选框的值同步改变，如果单选框选中了 女，那么该值也会改成 female
    }
})
```

> 如果使用 Ajax 方式提交表单，那么`name`属性其实可以省略，因为`v-model`本身就可以实现互斥功能。当然原生提交还是必须写明`name`属性的，否则无法获取到属性名称。

### 复选框

复选框分为两种情况，首先，如果绑定一个布尔值，那么表示该复选框是否被选中（用于同意协议等场景）：

```html
<input type="checkbox" v-model="isAgree" />我已阅读并同意以上扯淡条款
```

```js
var vue = new Vue({
    data: {
        isAgree: false
    }
})
```

如果绑定一个数组，那么表示当数组中包含它们的`value`属性值时，这些复选框会被选中：

```html
<input type="checkbox" v-model="hobbies" value="sing" />唱
<input type="checkbox" v-model="hobbies" value="jump" />跳
<input type="checkbox" v-model="hobbies" value="rap" />Rap
<input type="checkbox" v-model="hobbies" value="basketball" />篮球
```

```js
var vue = new Vue({
    data: {
        hobbies: ['sing', 'jump']
    }
})
```

### 下拉列表

如果绑定的是单个字符串数据，那么当`<option>`的`value`属性值等于该字符串时，该选项被选中。如果`value`属性不存在，则会以`<option>`中的内容作为备选项。

```html
<select v-model="province">
    <option value="bj">北京</option>
    <option value="sh">上海</option>
    <option value="sd">山东</option>
</select>
```

```js
var vue = new Vue({
    data: {
        province: 'sd'
    }
})
```

如果下拉列表允许多选，那么需要绑定一个数组。

```html
<select v-model="province" multiple>
    <option value="bj">北京</option>
    <option value="sh">上海</option>
    <option value="sd">山东</option>
</select>
```

```js
var vue = new Vue({
    data: {
        province: ['sd', 'bj']
    }
})
```

### 表单修饰符

表单修饰符可以对表单数据进行简单处理。

| 表单修饰符 | 描述                                                                                                                                                     |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.number`  | 将数据转换成数值类型                                                                                                                                     |
| `.trim`    | 过滤输入数据的首尾空格                                                                                                                                   |
| `.lazy`    | 默认情况下，`v-model`绑定的元素只要发生`input`事件就会进行数据同步，使用该修饰符可以将其更改为`change`事件，也就是只有当表单元素失去焦点时，数据才会同步 |

```html
<input type="text" v-model.number="num" />
```

```js
var vue = new Vue({
    data: { num: 0 }, // => 输入 30
    computed: {
        sum() {
            return this.num + 10
        } // => 如果不加修饰符，则结果是 3010，转换成数字后，则结果为 40
    }
})
```

## 组件

Vue 可以将页面上的不同部分划分成一个个组件，每个组件实现一个单独的功能块，以方便维护和复用。

### 注册组件

使用`Vue.component()`方法可以注册一个全局组件，与[过滤器](#过滤器)一样，它依然要位于`Vue()`实例化之前。

| 参数   | 描述           |
| ------ | -------------- |
| 字符串 | 组件名称       |
| 对象   | 组件的配置参数 |

在组件对象中使用`template`属性可以为组件定义一个模板，也就是组件的内容。将组件名称作为 HTML 元素定义在页面上，那么 Vue 会使用组件的模板替换掉这个组件元素。

```html
<div id="app">
    <my-com></my-com
    ><!-- <h1>这是一个标题组件啦</h1> -->
</div>
```

```js
Vue.component('my-com', {
    template: '<h1>这是一个标题组件啦</h1>'
})
```

> 组件的名称如果包含多个单词，应该以**短横线**的方式命名和引用，因为 HTML 标签是忽略大小写的。如果标签名写作`<myCom>`，那么解析后的名称其实为`mycom`，而 JavaScript 又是一门大小写敏感的语言，它定义的组件名如果是`myCom`，那么很明显是不能对应`mycom`这个名称的。

组件也可以使用`components`属性定义在实例对象内部，作为**局部组件**使用。

```js
var vue = new Vue({
    components: {
        'my-com': {
            // 组件名称，带有短横线的属性名必须加引号包裹
            template: '<h1>这是一个标题组件啦</h1>'
        }
    }
})
```

注意，组件模板**只能有一个根元素**，因此下面的写法是错误的：

```js
Vue.component('my-com', {
    template: '<h1>这是一个标题组件啦</h1> <h2>只能有一个根元素！</h2>'
})
```

将 HTML 写在 JavaScript 中会使得代码混乱不堪，因此可以使用`<template>`元素预先定义好模板，然后将`id`（必须是以`#`开头才会被识别为选择器，与`el`属性不同）传入`template`属性中：

```html
<div class="app">
    <my-com></my-com>
</div>

<template id="tpl">
    <h1>这是一个组件啦</h1>
</template>
```

```js
var vue = new Vue({
    components: {
        'my-com': {
            template: '#tpl'
        }
    }
})
```

### 组件数据

组件与`Vue()`实例一样，也可以定义属于该组件的`data`数据。但是区别在于，**组件中的数据`data`不是一个对象，而是一个函数**，该函数的返回值才是数据对象。

```js
Vue.component('my-com', {
    data() {
        return { msg: '这是组件的数据啦' }
    }
})
```

之所以这样设计，是为了保证组件在复用时，彼此之间的数据独立。如果`data`是一个对象，那么这些组件会通过引用传递，共享同一个对象。

在下面的代码中模拟了这种情况，组件的`data()`并不是直接返回一个对象，而是返回了一个外部的全局对象。此时所有的组件获得的都是该对象的**引用**，也就是说，它们指向同一块内存空间。因此一旦通过任何一个组件修改了数据，那么所有的组件数据都会被修改。

```html
<div id="app">
    <my-com></my-com>
    <my-com></my-com>
    <my-com></my-com>
</div>

<template id="tpl">
    <h1>{{ msg }}</h1>
</template>
```

```js
const obj = { msg: '这是组件的数据啦' }

Vue.component('my-com', {
    template: '#tpl',
    data() {
        return obj
    }
})
```

### 组件通信

组件是可以嵌套的，只需要将一个组件（如`child`）放到另一个组件（如`parent`）的`components`属性中，那么`parent`就是`child`的父组件。

> 可以看出，组件与之前一直使用`Vue()`实例非常相似，其实`Vue()`实例也可以看作一个组件，并且是根组件。

```js
var vue = new Vue({
    components: {
        // Vue 实例的 components 属性
        parent: {
            // 注册在 Vue 实例中的父组件
            template: '<h1>这是父组件啦，里面包含<child></child></h1>',

            components: {
                // 父组件的 components 属性
                child: {
                    // 注册在 parent 父组件中的子组件
                    template: '<h3>这是子组件啦</h3>'
                }
            }
        }
    }
})
```

注意，**子组件是不能直接使用父组件中的`data`数据的**，但是在开发中，通常都是由父组件统一请求数据（如果由子组件发送，那么发送次数也太频繁了），因此父子组件必须通过一定的方式来交换数据，这称为父子组件之间的通信。

#### 父组件向子组件传递数据

如果父组件需要向子组件传递数据，那么子组件首先要使用`props`属性定义用来保存父组件数据的变量名，该属性默认是一个字符串数组，每个元素为变量名。子组件中也只能使用`props`属性中的变量名，用来显示父组件数据。

```js
var vue = new Vue({
    data: {
        parentMsg: '父组件的数据'
    },
    components: {
        child: {
            template: '<h1>这是子组件啦{{ childMsgProp }}</h1>', // 只能使用 props 中定义的变量名
            props: ['childMsgProp'] // 用来保存接收的父组件数据
        }
    }
})
```

然后，子组件需要绑定一个属性，其中属性名是`props`中用来接收数据的变量名，属性值是父组件的数据名，为要传递的数据。注意，**如果实例中`props`的变量名为驼峰形式，那么绑定元素的属性名必须要转换成连字符形式。**

```html
<div id="app">
    <!-- 如果 props 名称是驼峰式，这里的属性名要转换成连字符形式 -->
    <child :child-msg-prop="parentMsg"></child>
</div>
```

此外，`props`也可以是一个对象，它的属性名依然是接收数据的变量名称，但是它的值可以是数据类型（`String`、`Number`、`Boolean`、`Array`、`Object`、`Date`、`Function`、`Symbol`）或者另一个对象。如果是单独的数据类型，那么表示该变量必须接收该类型的数据，否则会报错；如果是另一个对象，那么还可以实现更复杂的验证操作：

```js
var vue = new Vue({
    components: {
        child: {
            props: Array, // 类型限制

            props: {
                // 传入更复杂的验证对象
                type: [Number, String], // 类型限制，满足其中之一即可
                default: 233, // 默认值
                required: true, // 必须通过元素属性传值
                validator(value) {
                    //自定义验证函数
                    // 这个值必须匹配下列字符串中的一个
                    return (
                        ['success', 'warning', 'danger'].indexOf(value) !== -1
                    )
                }
            }
        }
    }
})
```

对于对象和数组类型的默认值，其类型也必须是一个工厂函数，将默认值作为对象返回，原因与组件中的`data`必须是函数一样。

```js
var vue = new Vue({
    components: {
        child: {
            props: {
                default() {
                    // 默认是空数组，必须通过函数返回
                    return []
                }
            }
        }
    }
})
```

注意，虽然可以直接使用`props`中的数据，但是与`data`数据不同的是，**`props`的数据是不能修改的**。因此，在下面的代码中，虽然将`props`数据进行了双向绑定，但是程序会报出`Avoid mutating a prop directly...`的错误。

```html
<div id="app" class="container">
    <child :child-msg="parentMsg"></child>
</div>
```

```js
const vue = new Vue({
    data: { parentMsg: '父组件数据' },

    components: {
        child: {
            // 绑定了 props 数据，程序会报错
            template:
                '<h1>这是子组件啦 -- {{ childMsg }} <input type="text" v-model="childMsg"></h1>',
            props: ['childMsg']
        }
    }
})
```

根据错误信息提示，为了避免这个错误，应该将`props`数据保存到自己的`data`等属性中，然后绑定`data`中的数据就可以了。

```js
const vue = new Vue({
    data: { parentMsg: '父组件数据' },

    components: {
        child: {
            // 绑定了自己的 data 数据
            template:
                '<h1>这是子组件啦 -- {{ childOwnMsg }} <input type="text" v-model="childOwnMsg"></h1>',
            props: ['childMsg'],
            data() {
                // 将 props 的数据传递给 data
                return { childOwnMsg: this.childMsg }
            }
        }
    }
})
```

#### 子组件向父组件传递数据

如果子组件需要向父组件传递数据，那么过程会比较麻烦，因为它们需要通过**子组件的事件绑定父组件的方法作为监听函数**来传递。具体来说，子组件需要设置一个自定义事件，将父组件的方法作为监听函数传入，然后子组件自己触发自定义事件，就相当于调用了父组件的方法。如果父组件方法中设置了参数，那么子组件在调用时就可以通过参数将数据传递过去了。

首先，为子组件绑定一个自定义事件`@child-event`，将父组件的方法`parentMethod()`传入。

> 由于 HTML 不区分大小写，因此自定义事件名称的多个单词建议以**连字符**分隔，切记不能使用驼峰命名法。

```html
<div id="app" class="container">
    <child @child-event="parentMethod"></child>
</div>
```

```js
var vue = new Vue({
    methods: {
        // 父组件方法，用于传递给子组件调用
        parentMethod() {
            console.log('调用了父组件方法')
        }
    },

    components: {
        child: {
            data() {
                return { childMsg: '子组件的数据' } // 要传递的子组件数据
            }
        }
    }
})
```

然后，需要在子组件中使用`$emit()`方法触发自己绑定的事件，该方法的第一个参数为事件名称，之后若干参数为监听函数中的参数。当然，为了调用`$emit()`，在子组件中再定义一个自己的方法。

```js
var vue = new Vue({
    methods: {
        parentMethod() {
            console.log('调用了父组件方法')
        }
    },

    components: {
        child: {
            template: '<h1>这是子组件啦{{ childMethod() }}</h1>', // 调用自己的 childMethod() 方法
            data() {
                return { childMsg: '子组件的数据' }
            },
            methods: {
                childMethod() {
                    // 触发自己绑定的自定义 @child-event 事件，从而调用了监听函数，也就是父组件的方法 parentMethod()
                    this.$emit('child-event')
                }
            }
        }
    }
})
```

此时可以发现父组件方法`parentMethod()`已经被调用了，因此为了传递数据，只需要在`parentMethod()`中设置参数，在子组件调用时传递就可以了。

```js
var vue = new Vue({
    data: {
        parentMsg : ''
    }
    methods: {
        parentMethod(msg) {
            console.log('调用了父组件方法')
            this.parentMsg = msg // 接收子组件调用时传递过来的数据
        }
    },

    components: {
        child: {
            template: '<h1>这是子组件啦{{ childMethod() }}</h1>',
            data() {
                return { childMsg: '子组件的数据' }
            },
            methods: {
                childMethod() {
                    // 调用父组件的方法 parentMethod() 时同时传递子组件数据
                    this.$emit('child-event', this.childMsg)
                }
            },
        }
    }
})
```

#### 父组件访问子组件

有些时候我们不需要组件的数据进行传递，而只是希望从父（子）组件中获取到子（父）组件中数据或方法直接使用。Vue 为此提供了专门的方式用来获取父子组件。

如果希望在父组件中访问子组件，总共有两种方式。第一种是直接在父组件中使用`$children`数组，该数组保存了它所有的子组件，使用索引取出后即可直接访问子组件中的数据。

> 注意，无论是`$children`，还是接下来的`$refs`和`$parent`，它们必须要等到模板渲染完成，也就是生命周期函数`mounted()`之后才能被正确获取，因为这些组件元素是通过 DOM 获取的。否则的话，这些属性的值会为空。

```html
<div id="app">
    <child></child>
</div>
```

```js
const vue = new Vue({
    el: '#app',
    mounted() {
        this.$children[0].childMethod() // => 子组件方法被调用了！
    },

    components: {
        child: {
            template: '<div></div>',
            methods: {
                childMethod() {
                    console.log('子组件方法被调用了！')
                }
            }
        }
    }
})
```

但是由于该方式通过索引来获取组件，如果组件顺序发生改变就会影响代码执行，因此通常都会使用下面的第二种方式。

第二种方式需要首先在子组件元素上添加`ref`属性，然后父组件就可以通过`$refs`对象获取到子组件了，该对象保存了所有定义了`ref`属性的元素。

```html
<div id="app">
    <child ref="childRef"></child>
</div>
```

```js
const vue = new Vue({
    el: '#app',
    mounted() {
        this.$refs.childRef.childMethod() // => 子组件方法被调用了！
    },

    components: {
        child: {
            template: '<div></div>',
            methods: {
                childMethod() {
                    console.log('子组件方法被调用了！')
                }
            }
        }
    }
})
```

### 插槽

虽然同一个组件可以多次复用，但是这些组件可能会有细小的差别，如果因为这些差别再去定义几乎一致的不同组件，那么就太浪费了。为了解决这一问题，Vue 提供了插槽的概念，可以将组件中有差别的部分定义成一个插槽`<slot>`，然后在调用组件时提供这些差异内容就可以了。

在下面的代码中，我们希望每个组件的最后一个元素有所不同，因此在注册组件时，将最后一个元素的位置设置为插槽。然后在调用组件时，传入想要的元素即可。

```html
<div id="app">
    <com><button>将插槽替换成按钮元素</button></com>
    <com><strong>将插槽替换成加粗元素</strong></com>
    <com><span>将插槽替换成 span 元素</span></com>
</div>

<template id="comTpl">
    <div>
        <h2>这是一个组件啦</h2>
        <slot></slot>
    </div>
</template>
```

```js
const vue = new Vue({
    components: {
        com: {
            template: '#comTpl'
        }
    }
})
```

在插槽中定义元素，可以为插槽设置一个默认值，如果调用组件时没有传入元素，那么会渲染为默认元素。

```html
<div id="app">
    <com></com>
    <!-- 最后一个元素为 <button>默认的按钮元素</button> -->
</div>

<template id="childTpl">
    <div>
        <h2>这是一个组件啦</h2>
        <slot><button>默认的按钮元素</button></slot>
    </div>
</template>
```

#### 具名插槽

一个组件中也可以定义多个插槽，在调用组件时为不同的插槽传入不同的元素。但是要实现这样的功能，需要为插槽起个名字，这样 Vue 才能知道哪些元素对应哪个插槽。这些拥有名字的插槽被称为具名插槽。

在下面的代码中，为导航栏组件定义了三个插槽，并且分别在`<slot>`上使用`name`属性为插槽定义名称：

```html
<template id="comTpl">
    <div class="navbar">
        <slot name="left"></slot>
        <slot name="center"></slot>
        <slot name="right"></slot>
    </div>
</template>
```

当调用插槽时，需要在元素上使用`v-slot`指令冒号后面的值（该指令的属性值稍后再用）设置其对应的插槽。注意，该指令只能用于组件或`<template>`上。

```html
<div id="app">
    <com>
        <template v-slot:left><span>左侧内容</span></template>
        <template v-slot:center><span>中间内容</span></template>
        <template v-slot:right><span>右侧内容</span></template>
    </com>
</div>
```

没有`name`名称的插槽，称为匿名插槽。如果调用组件时定义了没有`v-slot`指令的内容，那么就会将其对应为匿名插槽，如同本节开始时一样。

具名插槽同样有语法糖形式，只需将`v-slot:`替换成一个`#`即可：

```html
<div id="app">
    <com>
        <template #left><span>左侧内容</span></template>
    </com>
</div>
```

#### 作用域插槽

在讨论作用域插槽之前，需要先明确一下 Vue 中作用域的问题。首先，在父组件中调用子组件时，子组件是没法获得自己数据的，即便是传入插槽的元素也不行。因为这整个位置都是父组件的作用域，而只有在子组件模板中才是子组件的作用域。

```html
<div id="app">
    <com>
        <!-- 这里只能获取到父组件的数据，因此 childMsg 为空 -->
        <button>{{ childMsg }}</button>
    </com>
</div>

<template id="comTpl">
    <div>
        <slot></slot>
        <!-- 这里可以正常获取 childMsg -->
        {{ childMsg }}
    </div>
</template>
```

```js
const vue = new Vue({
    components: {
        com: {
            template: '#comTpl',
            data() {
                return { childMsg: '子组件的数据' }
            }
        }
    }
})
```

要解决这个问题，需要先在子组件模板中为插槽`<slot>`绑定一个属性，属性名可以自定义，属性值则是要传递的数据。由于这里是子组件的作用域，因此可以访问到`childMsg`数据。

```html
<template id="comTpl">
    <div>
        <!-- 子组件模板中可以访问子组件数据，属性名可以自定义 -->
        <slot :msg="childMsg"></slot>
    </div>
</template>
```

然后，在调用组件时为组件添加`v-slot`指令，它的属性值为一个对象（同样可以自定义名称），包含了所有插槽传递数据的名称（如上文中的`msg`）。通过该对象访问这些名称，就可以获取到子组件中的数据。

```html
<div id="app">
    <com v-slot="slotProps">
        <button>{{ slotProps.msg }}</button>
        <!-- <button>子组件的数据</button> -->
    </com>
</div>
```

如果匿名插槽与作用域插槽同时使用，还希望使用语法糖形式，那么必须要添加匿名插槽的名称`default`，不能直接省略。

```html
<div id="app">
    <com #default="slotProps">
        <button>{{ slotProps.msg }}</button>
    </com>

    <!-- 错误的写法 -->
    <com #="slotProps">
        <button>{{ slotProps.msg }}</button>
    </com>
</div>
```

> 注意，`v-slot`指令为 2.6.0 版本新增，之前具名插槽`slot`和作用域插槽的`slot-scope`语法已经被废弃。

### 动态组件

如果组件名称是动态的，那么就不能使用组件名称作为标签了。为此，需要使用`<component>`定义一个动态组件，通过它的`is`属性可以使其变成对应名称的组件。这样只需将`is`属性绑定为一个变量数据，就可以切换不同的组件。

```html
<component :is="comName"></component>
```

```js
const vue = new Vue({
    data: {
        comName: 'login' // 修改 comName 就可以切换渲染的组件了
    },
    components: {
        reg: { template: '<h1>注册组件</h1>' },
        login: { template: '<h1>登录组件</h1>' }
    }
})
```

不过注意，如果此时为组件添加生命周期函数`created()`和`destroy()`的话，会发现切换组件时它们会一直被创建和销毁。这无疑是比较影响性能的。如果希望它们可以被缓存下来，可以在组件外侧包裹一层`<keep-alive>`。

```html
<keep-alive>
    <component :is="comName"></component>
</keep-alive>
```

### 单文件组件

之前我们均是使用`Vue.component()`定义全局组件，或者使用`components`属性定义局部组件，然后将组件相关的数据、模板写到对象属性中。但是随着项目变得复杂，这种方式定义的组件阅读起来会非常的麻烦。

因此，Vue 提供了一种单文件组件的方式来管理组件，可以将一个组件所有的模板、脚本和样式抽离到一个单独的`.vue`文件中管理。不过，此时必须要将组件作为一个模块导入才可以使用，为此，则必须使用[webpack](/posts/1zcig0yl.html)来提供模块化支持。

```html
<!-- app.vue -->
<template>
    <div>{{ msg }}</div>
</template>

<script>
    export default {
        data() {
            return { msg: '你好呀' }
        }
    }
</script>

<style>
    div {
        background-color: #66ccff;
    }
</style>
```

虽然通常情况下我们都是使用[Vue-CLI](#Vue-CLI)来直接搭建带有 webpack 的 Vue 项目，但是也可以安装[Vue Loader](https://vue-loader.vuejs.org/zh/)来手动配置。

```powershell
npm install vue # 安装 vue
npm install webpack webpack-cli --save-dev # 安装 webpack
npm install -D vue-loader vue-template-compiler # 安装 vue-loader
```

> 如果希望组件的`<style>`生效，还必须安装[渲染样式](/posts/1zcig0yl.html#样式文件)的 loader。

```js
/* webpack.config.js */
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin() // 请确保引入这个插件！
    ]
}
```

这样就可以将`.vue`文件直接作为模块导入，并作为组件来使用了：

```js
import Vue from 'vue'
import app from './vue/app.vue' // 导入根组件模块
// CommonJS 导入方式，注意 Vue 对象保存在 default 属性中
// const Vue = require('vue').default

new Vue({
    el: '#app',
    template: '<app></app>', // 会覆盖 index.html 中的 <div id="app"></div> 作为根组件模板
    components: { app } // 根组件
})
```

```html
<body>
    <div id="app"></div>
    <script src="./dist/main.js"></script>
</body>
```

与之前将根组件数据直接写在`Vue()`实例中不同的是，这里把根组件也作为一个子组件抽离到了外部。此时`index.html`页面上只有一个`#app`元素，而没有其它组件或数据。当 Vue 渲染页面时，会使用`template`属性中的`<app></app>`替换掉页面上的`#app`元素，又因为`<app>`本身是一个组件，因此会找到`app.vue`中的模板内容`<div>{ msg }</div>`来替换掉`<app></app>`。

注意，此时浏览器可能会报`You are using the runtime-only build of Vue...`这样的错误，这是因为 Vue 包含多个不同的版本，而默认的版本是不包含编译器的。因此如果`Vue()`实例中使用了模板，那么 Vue 就无法在运行时将其编译。要修改成完整版，需要在 webpack 中添加一项配置：

```js
module.exports = {
    mode: 'development', // 否则 webpack 会隐藏错误信息
    resolve: {
        alias: {
            vue$: 'vue/dist/vue.esm.js'
        }
    }
}
```

> 如果没有报错信息，但是也没有出现效果，则需要在`webpack.config.js`中配置`mode: 'development'`，否则 webpack 会将错误信息隐藏。

之所以出现这样的情况，是因为 Vue 将版本分为了两种：仅运行时版本（runtime-only）与运行时 + 编译器版本（runtime-only + compiler）。

要了解它们的区别，首先要简单了解 Vue 运行时的工作原理，注意接下来的步骤均是工作在**运行时**，也就是浏览器运行代码时，而非 webpack 编译时。当创建`Vue()`实例时，Vue 首先会将实例中`template`属性的值（也就是模板）进行编译成 AST（Abstract Syntax Tree，抽象语法树），这是一个编译原理的概念，不作展开讨论，有兴趣可以看看[这篇文章](https://segmentfault.com/a/1190000016231512)。

然后 Vue 会将 AST 传入一个渲染函数，通过渲染函数来创建虚拟 DOM。该函数可以通过实例中的`render()`的参数来手动调用，它接收诸如元素名称、元素属性、元素内容等参数，从而根据这些参数创建出虚拟 DOM。最后，Vue 才会将虚拟 DOM 转换成真实 DOM，并根据`el`属性找到页面上对应的元素，然后使用 DOM 的内容将其替换，从而呈现到页面上。

而这两个版本的区别，就在于运行时将模板编译为 AST 这一步，也就是说，runtime-only 版本没有这一步，而是直接从渲染函数开始的。这样做的原因是为了减少打包后的代码体积，但是缺少了编译模板的功能。

既然不使用模板，那么必须另寻他法来解决编译的问题。好在，渲染函数可以直接**传入一个组件**，Vue 可以通过组件生成虚拟 DOM，从而完成剩下的工作。因此，我们可以将之前创建实例的代码稍作修改（这也基本上是脚手架中自动生成的代码了）：

```js
new Vue({
    el: '#app', // 设置要替换的元素，脚手架中使用了 $mount('#app')，效果相同
    // 直接将组件传入，渲染函数可以通过组件生成虚拟 DOM
    render: function(h) {
        // h 为渲染函数，也可以称为 createElement()
        return h(app) // 返回值为虚拟 DOM
    }
})
```

这时你可能有一个疑问，组件中不是也有`<template>`模板，那么 Vue 是怎么处理的呢？原因是，这些模板**早在 webpack 编译时就已经被处理成渲染函数了**，也就是说，它们**没有发生在运行时**。在刚才安装 vue-loader 时，我们还安装了另外一个 vue-template-compiler，它的作用就是在编译时将模板处理成渲染函数，这样就不需要运行时再次处理了。并且，可以看到参数中使用了`-D`即开发时依赖，也就证明了它们是没有工作在运行时的。

```powershell
npm install -D vue-loader vue-template-compiler # 安装 vue-loader
```

## Vue-CLI

[Vue-CLI](https://cli.vuejs.org/zh/guide/)（Vue Command-Line Interface，即 Vue 命令行工具，俗称脚手架）是一个用于快速搭建 Vue 项目开发环境的工具，使用它可以运行 Vue 的命令行指令，从而帮助我们快速生成目录结构、配置 webpack 等。

```powershell
npm install -g @vue/cli
```

然后，使用`vue create`命令可以创建一个项目：

```powershell
vue create hello-world
```

此时终端会提示`Please pick a preset`，即要求选择一个预设，选择`Manually select features`即手动配置后，按照顺序可以进行以下配置：

-   选择项目支持的特性，如 Babel、路由、vuex 等
-   对于一些特性是否生成独立的配置文件，还是保存到`package.json`中
-   是否将配置保存为一个预设，这样在创建项目时就会多出一个选项

选择完成后，便会生成一个如下的项目目录：

```powershell
hello-world
├─ .gitignore
├─ README.md
├─ babel.config.js              # bebel 的配置文件
├─ node_modules
├─ package-lock.json
├─ package.json
├─ public                       # 静态资源目录，所有的内容会被原封不动打包到 dist 目录中
│    ├─ favicon.ico
│    └─ index.html              # htmlWebpackPlugin 载入的模板，以此创建 index.html 文件
└─ src                          # 源代码目录
       ├─ App.vue               # 根组件，可以自行修改
       ├─ assets                # 资源文件，如图片、样式文件等
       │    └─ logo.png
       ├─ components            # 子组件目录
       │    └─ HelloWorld.vue
       └─ main.js               # 项目入口
```

使用`vue ui`命令可以创建一个图形化界面的项目管理工具，如果希望修改配置、管理依赖等，也可以在这里更改。

## 前端路由

路由（route）在网站开发中指的是 URL 和页面之间的对应关系。在早期的网站开发中，服务器通常需要使用诸如 JSP、PHP 等技术，使用这些技术的页面除了 HTML 代码以外，还需要内嵌一些 Java 或 PHP 等后端代码。当用户请求一个 URL 之后，服务器会根据 URL 找到对应的页面，并通过后端代码查询数据库，然后将拼接好数据的页面返回给用户。可以看到，此时 URL 和页面之间的对应关系是由后端处理的，而这样的方式被称为**后端路由**。并且，由于返回给用户的是渲染之后的静态页面，因此对于 SEO 是比较友好的。但是，这种方式的缺点也很明显，因为页面中 HTML 和后端代码耦合在一起，使得页面维护变得非常麻烦，修改一个页面需要前端和后端人员一起配合才能完成。

![](https://pic.downk.cc/item/5e66588e98271cb2b83caa14.jpg)

后来，随着 Ajax 技术的普及，我们将之前的页面拆分成了两个部分：静态资源（不包含数据的 HTML、CSS、JS）和数据接口。当用户请求一个 URL 之后，依然是从服务器找到对应的 HTML 页面，但是此时的 HTML 页面只是一个骨架，并没有任何实际数据。但是，HTML 中会包含 JS 代码，用来向数据接口发送请求，然后再通过操作 DOM 的方式，将数据拼接到页面上，从而完成页面渲染。当然，为了方便操作 DOM，HTML 通常会包含模板引擎代码，这样页面只需要加载模板引擎，就可以快速地将模板引擎代码替换成获取的数据了。此时前后端责任更加清晰，开发、部署互不影响，而这样的开发模式称为「前后端分离」。

![](https://pic.downk.cc/item/5e66598d98271cb2b83d3e56.jpg)

随之而来的下一个阶段则是**单页面应用**（SPA，Single Page Application），与之前的区别在于，它将多个 URL 对应的多套静态资源合并成了一个，也就是说，用户发送任何一个 URL 请求，返回的都只有一套 HTML + CSS + JS。然后，浏览器会监听 URL 变化，由 JavaScript 根据用户请求的 URL 不同，从这些资源中找到对应的部分（组件）进行渲染，但是不需要再向服务器请求静态资源了（接口数据还是得正常请求）。可见，此时的 URL 与页面（组件）的映射关系是由前端 JavaScript 维护的，因此这样的方式被称为**前端路由**。单页面应用的优点在于，它仅在用户首次访问时需要稍长的加载时间，但是之后切换页面不需要再次发送请求，这样增加了用户体验，也减轻了服务器压力。

![](https://pic.downk.cc/item/5e665cb198271cb2b83ffbf1.jpg)

此时，URL 只是一个页面的标识，并不需要真正发送请求。因此，我们必须通过一些方式使得 URL 发生改变，但是又不发送请求。

第一种方式是修改 URL 中的 hash 部分（`#`之后），然后通过监听`hashchange`事件来重新渲染页面。

第二种方式是通过 HTML5 新增的[History](/posts/gjqbkyw3.html#History)对象中的方法来修改 URL，这些方法也不会导致重新发送请求。但如果用户刷新了页面，那么浏览器还是会将其当作正常的 URL 向服务端发送请求。

而 Vue 通过[Vue-Router](https://router.vuejs.org/zh/installation.html)扩展提供了对前端路由的支持，它的实现原理也是上述两种方式。

### 安装与配置

安装 Vue-Router 可以使用浏览器端和模块两种方式：

```html
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<script src="https://unpkg.com/vue-router/dist/vue-router.js"></script>
```

```powershell
npm install vue-router
```

为了目录更加清晰，我们通常会在`src`目录中新建一个`router`文件夹，再创建一个`index.js`文件（导入`router`文件夹时会自动寻找该文件），将创建路由对象的部分放到里面，而入口文件只需要导入该模块即可。

接下来，需要实例化一个路由对象，并通过`Vue()`实例挂载。如果使用了模块引用，则还需要导入路由模块，并通过`Vue.use()`加载。

```js
/* index.js */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home'
import About from '../components/About'

Vue.use(VueRouter) // 模块导入 VueRouter 的话必须加载插件

export default new VueRouter({
    // 将模块对象导出，供 main.js 调用
    routes: [
        // 配置路由，即 URL 和组件的对应关系
    ]
})

/* main.js */
import router from './router' // 会自动寻找目录下的 index.js 文件

new Vue({
    render: h => h(App),
    router: router // 挂载路由模块
}).$mount('#app')
```

当引入路由模块后，会发现 URL 自动变成了`http://localhost/#/`的形式，最后一个`/`的后面也就是接下来要自己定义的 Hash 值。

### 配置路由规则

接下来，需要在`VueRouter()`实例中的`routes`属性中配置具体的路由规则。该属性是一个对象数组，每个对象表示一条匹配规则。对象的第一个属性`path`表示匹配的路径，第二个属性`component`对应的组件，它必须为一个**组件对象**。

```js
import VueRouter from 'vue-router'
import Home from '../components/Home'
import About from '../components/About'

export default new VueRouter({
    routes: [
        { path: '/home', component: Home },
        { path: '/about', component: About }
    ]
})
```

最后在页面上使用`<router-view>`作为占位符，一旦找到匹配的路由，就会将该元素替换为对应的组件。这时将 URL 修改成`http://localhost/#/home`就可以跳转到首页组件了。当然让用户修改 URL 肯定是不现实的，为此 Vue 提供了`<router-link>`元素，将要跳转的路由添加到`to`属性中，Vue 会自动将该元素渲染为仅改变 Hash 值的`<a>`标签。

> 注意，`<router-view>`和`<router-link>`本身也是两个全局组件。

```html
<!-- App.vue -->
<template>
    <div id="app">
        <router-link to="home">首页</router-link>
        <router-link to="about">关于</router-link>
        <router-view></router-view>
    </div>
</template>
```

如果希望`<router-link>`渲染为其它的元素，而非`<a>`元素，那么为其添加一个`tag`属性即可。注意，无论渲染为任何元素，它都是可以点击跳转的。

```html
<!-- 会渲染为一个 <button> 元素 -->
<router-link to="home" tag="button">首页</router-link>
```

### 重定向

将路由规则对象中的`component`替换为`redirect`，可以使该路由重定向到另外的路由：

```js
var myRouter = new VueRouter({
    routes: [
        // 当访问根路径时，重定向到首页
        { path: '/', redirect: '/home' },
        { path: '/home', component: Home },
        { path: '/about', component: About }
    ]
})
```

### History 模式

如果要使用 HTML5 中`History`方式来实现前端路由，以去掉 URL 中的`#`，只需设置一个`mode`属性即可：

```js
var myRouter = new VueRouter({
    mode: 'history', // 设置为 History 实现前端路由
    routes: []
})
```

### 取消历史记录

默认情况下，点击浏览器的后退按钮是可以返回上一条历史记录的，如果希望直接将当前记录替换，而非压入一条新记录，则可以为`<router-link>`添加一个`replace`属性。

```html
<router-link to="home" replace>首页</router-link>
<router-link to="about" replace>关于</router-link>
```

### 当前链接样式

对于当前选中的链接，Vue 会自动默认添加一个`.router-link-active`类，通过它可以设置当前选中链接的样式。如果要修改这个类名，在路由实例中设置`linkActiveClass`属性即可：

```js
var myRouter = new VueRouter({
    routes: [],
    linkActiveClass: 'active' // 修改默认的选中类
})
```

### 编程式导航

除了使用`<router-link>`创建标签来定义导航链接，也可以借助`Vue`实例内部提供的`$router`调用实例方法，通过编写代码来实现跳转。

在下面的代码中，通过两个按钮的点击事件来实现跳转。

```html
<button @click="goIndex">首页</button> <button @click="goAbout">关于</button>
```

```js
export default {
    name: 'App',
    methods: {
        goIndex() {
            this.$router.push('/home').catch(err => {}) // 跳转到 /home
            this.$router.replace('/home').catch(err => {}) // 不添加新的历史记录，而是直接替换
            this.$router.go(-1) // 跳转到某个历史记录，如果不存在则无效
        },
        goAbout() {
            this.$router.push('/about').catch(err => {})
        }
    }
}
```

注意对于`push()`和`replace()`两个方法来说，如果当前已经是该组件，那么重复跳转会导致`NavigationDuplicated`错误。好在它们均返回`Promise`对象，使用`catch()`可以捕获异常（它们的第二个和第三个参数其实是跳转成功和失败的回调函数，可以使用`then()`和`catch()`替代）。

### 路由懒加载

随着业务代码越来越多，如果当用户第一次打开时就将所有页面对应的组件全部载入，可能速度会非常慢，影响用户体验。为此 Vue 提供了路由懒加载，它可以将原本打包成一个文件的业务代码分成多个文件，每个路由对应其中一个，当用户真正跳转到这个页面时，对应的组件文件才会被下载。

要实现路由懒加载，只需将原本组件对象的位置，替换成一个箭头函数即可：

```js
/* router/index.js */
const Home = () => import('../components/Home')
const About = () => import('../components/About')

export default new VueRouter({
    routes: [
        { path: '/home', component: Home },
        { path: '/about', component: About }
    ]
})
```

### 嵌套路由

Vue 支持在路由下继续定义子路由。首先，需要在路由规则对象中添加`children`属性，以配置二级路由规则。注意子路由的`path`不要添加`/`，否则表示根路由，会导致路由拼接错误。

```js
/* router/index.js */
const Home = () => import('../components/Home')
const HomeNews = () => import('../components/HomeNews')
const HomeMessage = () => import('../components/HomeMessage')
// 注意两个子路由模块不要忘记定义，这里就不写了

export default new VueRouter({
    routes: [
        {
            path: '/home',
            component: Home,
            children: [
                // 子路由规则，为首页添加了两个路由，新闻和消息
                { path: '', redirect: 'news' }, // 设置重定向，默认显示新闻
                { path: 'news', component: HomeNews }, // path 不要加 /
                { path: 'message', component: HomeMessage }
            ]
        }
    ]
})
```

然后，在父级路由的模板中设置`<router-link>`和`<router-view>`。注意`<router-link>`里的`to`属性要定义完整的路径，因为它无法识别当前是跟路由还是子路由。

```html
<!-- Home.vue -->
<template>
    <div>
        <h1>这里是 home 组件啦</h1>
        <router-link to="/home/news">新闻</router-link>
        <router-link to="/home/message">消息</router-link>
        <router-view></router-view>
    </div>
</template>
```

### 传递参数

前端路由在跳转到其它页面时也可以传递参数，主要有下面两种方式。

#### 路由参数

第一种方式称为路由参数，将路由规则中的`path`最后添加一个以冒号开头的自定义参数名，那么 Vue 会将这个部分识别为参数。

```js
/* router/index.js */
import User from '../components/User'

export default new VueRouter({
    routes: [
        // 冒号后面为自定义参数名
        { path: '/user/:userID', component: User }
    ]
})
```

此时任何以`/user/`开头的路由（如`/user/Leon`、`/user/Claire`）都会被渲染为`User`组件。

```html
<!-- App.vue -->
<router-link to="/user/zhangsan">用户</router-link>
```

如果参数为动态设置，那么需要将`to`绑定一个对象，其中`name`参数为**路径规则的名称**，`params`参数为一个对象，表示要传递的参数。

```html
<!-- App.vue -->
<router-link :to="{ name: 'User', params: { id: 666 }}">用户</router-link>
```

```js
/* /router/index.js */
export default new VueRouter({
    routes: [
        { path: '/', redirect: '/home' },
        { path: '/home', component: Home },
        { path: '/about', component: About },
        { path: '/user/:id', component: User, name: 'User' } // 与 router-link 中的 name 对应
    ]
})
```

然后在组件中使用`$route.params.自定义参数名`来获取路由参数的值：

```html
<!-- User.vue -->
<template>
    <div>
        <h1>这里是用户组件啦</h1>
        <!-- 与 path 中的 id 对应 -->
        <h2>用户 ID 为：{{ $route.params.id }}</h2>
    </div>
</template>
```

注意，`$route`是**当前活跃的路由对象**，也就是`routes`数组中的路由对象。根据调用它的组件不同，取得的当前路由对象自然也是不同的。

#### 地址栏传参

第二种方式是通过传统的地址栏传参，不过这里不需要手动在路由中拼接`?`部分，而是同样将`to`绑定为一个对象，其中`path`参数依然为之前的路径，`query`参数为一个对象，表示要传递的参数。

```html
<router-link :to="{ path: '/user', query: { id: 233 }}">用户</router-link>
```

然后在组件中使用`$route.query`对象来获取这些参数：

```html
<!-- User.vue -->
<template>
    <div>
        <h1>这里是用户组件啦</h1>
        <h2>用户 ID 为：{{ $route.query.id }}</h2>
    </div>
</template>
```

### 导航守卫

导航守卫可以监听并拦截页面跳转，以触发对应的回调函数，类似于中间件。使用`VueRouter()`实例对象的`beforeEach()`方法可以创建一个全局导航守卫，它接收一个函数参数，拥有三个参数分别表示目的路由对象、源路由对象以及用来放行的`next()`函数。

```js
/* /router/index.js */
const vueRouter = new VueRouter({
    routes: [
        { path: '/home', component: Home },
        { path: '/about', component: About }
    ]
})

vueRouter.beforeEach((to, from, next) => {
    next() // 拦截之后，必须手动调用 next() 以放行，否则无法正常跳转
})
```

在下面的代码中，通过在路由对象中定义元信息，可以实现跳转后修改当前页面的标题。

```js
const vueRouter = new VueRouter({
    routes: [
        { path: '/home', component: Home, meta: { title: '首页' } },
        { path: '/about', component: About, meta: { title: '关于' } }
    ]
})

vueRouter.beforeEach((to, from, next) => {
    document.title = to.meta.title // 修改页面标题
    next()
})
```

但是，如果路由对象中包含子路由，那么需要使用`matched`属性获取到所有匹配的路由对象，通过索引`0`取出其中第一个，才能使父路由正确得到`meta`属性。

```js
vueRouter.beforeEach((to, from, next) => {
    document.title = to.matched[0].meta.title
    next()
})
```

## Vuex

[Vuex](https://vuex.vuejs.org/zh/)是 Vue 提供的一个集中管理组件状态（变量）的工具，通俗来讲，就是将所有组件都需要用到的数据放置到一起统一管理，比如用户登录状态、地理位置等等。

Vuex 可以使用 CDN 直接引入，也可以使用 npm 的方式导入模块。

```powershell
npm install vuex
```

如果采用模块方式，那么与 vue-router 一样，也需要使用`Vue.use()`加载。然后，创建一个`Vuex.Store()`实例对象，并在`Vue()`实例中挂载：

```js
/* 新建 store 文件夹用来保存 Vuex 相关文件，/store/index.js */
import Vuex from 'vuex'

Vue.use(Vuex) // 加载插件
export default new Vuex.Store({
    // 相关数据和操作
})
```

```js
/* main.js */
import store from './store'

new Vue({
    store,
    render: h => h(App)
}).$mount('#app')
```

然后将公共数据放到`Vuex.Store()`的`state`属性中，就可以在任何一个组件通过`$store.state`对象获取了：

```js
/* /store/index.js */
export default new Vuex.Store({
    state: {
        msg: '这是公共状态啦'
    }
})
```

```html
<!-- Home.vue -->
<h2>这是首页组件啦{{ $store.state.msg }}</h2>
```

### mutations

要修改`state`中保存的状态，不能在组件中直接使用`$store.state`来修改。虽然这样做确实可以修改成功，但是会导致 Vue 无法跟踪状态变化。

因此，官方建议在`Vuex.Store()`中的另一个属性`mutations`中定义修改的方法，使用它来修改`state`，而组件中只需要调用`mutations`中的方法即可。这些方法默认会传入一个`state`参数，通过它可以直接获取`state`中的属性。

```js
/* /store/index.js */
export default new Vuex.Store({
    state: {
        msg: '这是公共状态啦'
    },
    mutations: {
        // 定义方法，供组件调用，并传入参数
        change(state, param) {
            state.msg = param // 通过 state 直接获取 msg，并进行修改
        }
    }
})
```

在组件中，则需要通过`$store.commit()`方法调用，其中第一个参数为`mutations`中定义的方法名，第二个参数为本身需要传递的参数，**如果需要传递多个参数，则可以通过对象来传递**，因此它也被称为载荷（Payload）。

```html
<!-- Home.vue -->
<h2>这是首页组件啦{{ $store.state.msg }}</h2>
<button @click="$store.commit('change', '状态被修改了！')">改变状态</button>
```

#### 类型常量

对于`mutations`中的方法名称，官方也称为「类型」。实际开发中，建议类型统一定义为常量，并保存到一个配置文件中，以方便管理。

```js
/* /store/mutations-types.js */
export const CHANGE = 'change'
```

```js
/* /store/index.js */
import { CHANGE } from './mutations-types.js' // 导入常量配置文件

export default new Vuex.Store({
    state: { msg: '这是公共状态啦' },
    mutations: {
        // 以方括号的特殊语法来使用常量
        [CHANGE](state, payload) {
            state.msg = payload
        }
    }
})
```

```js
/* Home.vue */
import { CHANGE } from '../store/mutations-types.js'

export default {
    methods: {
        change() {
            // 调用时同样使用常量
            this.$store.commit(CHANGE, '新状态')
        }
    }
}
```

### getters

`getters`类似于之前的计算属性，通过函数的返回值对状态作出进一步处理。与`mutations`一样，它的第一个参数同样为`state`，而它的第二个参数为`getters`本身，可以用来获取其它`getters`。

在下面的代码中，使用`getters`过滤了价格较贵的书籍，并获取了这些书籍的数量，然后在组件中直接调用`getters`获取过滤后的结果：

```js
/* /store/index.js */
export default new Vuex.Store({
    state: {
        books: [
            { id: 1000, name: '北欧神话', price: 21 },
            { id: 1001, name: 'JOJO的奇妙冒险', price: 199 },
            { id: 1002, name: '从零开始的异世界生活', price: 233 }
        ]
    },
    getters: {
        expensiveBooks(state) {
            // 过滤较贵的书籍
            return state.books.filter(el => el.price > 100)
        },
        expensiveBooksLength(state, getters) {
            // 调用过滤后的 expensiveBooks 再获取数量
            return getters.expensiveBooks.length
        }
    }
})
```

```html
<!-- Home.vue -->
<h2>{{ $store.getters.expensiveBooks }}</h2>
<h2>{{ $store.getters.expensiveBooksLength }}</h2>
```

但是与`mutations`不同的一点是，它不能接收参数。因此，如果希望数据是在调用时传入的，则需要将`getters`返回一个函数。

```js
/* /store/index.js */
export default new Vuex.Store({
    getters: {
        expensiveBooks(state) {
            return function(price) {
                return state.books.filter(el => el.price > price)
            }
        }
    }
})
```

```html
<!-- Home.vue -->
<h2>{{ $store.getters.expensiveBooks(200) }}</h2>
```
