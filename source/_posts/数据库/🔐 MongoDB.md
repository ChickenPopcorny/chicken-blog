---
title: 🔐 MongoDB
date: 2020-02-09 13:57:38
abbrlink: e6q2910w
tags: MongoDB
categories: 数据库
excerpt: 施工中...
---

# 🔐 MongoDB

> 施工中... 修改时间

MongoDB 与传统的关系型数据库区别在于，它不需要设计表结构，存取数据更加灵活。它保存的不是表，而是一种称为 BSON 的数据结构，它与 JSON 非常相似，但是比 JSON 强大的一点在于，它可以保存二进制数据，其它与 JSON 区别不大。正是由于这一点，MongoDB 的一些概念与关系型数据库有所不同：

| SQL | MongoDB | 描述 |
| --- | --- | --- |
| database | database | 数据库 |
| table | collection | 表 / 集合 |
| row | document | 行 / 文档 |

## 安装与配置

在[官网](https://www.mongodb.com/download-center/community)可以下载社区版（非企业级商用）的 MongoDB，安装比较简单，在自定义安装下可以修改路径，除此之外没有其它配置。安装的过程中会提示安装 MongoDB Compass 图形化界面，但是这个并不好用，建议直接使用 Navicat（最新版本支持 MongoDB）。

安装完成后，将安装路径下的`bin`路径配置到环境变量中（如`C:\MongoDB\Server\bin`），以便命令行调用。

系统服务下的`MongoDB Server`为 MongoDB 的服务，在使用 MongoDB 之前记得先启动它。

开启 CMD 输入`mongo`即可进入 MongoDB 的命令行工具。在命令行工具中输入`show databases`查看所有的数据库，如果能正常显示，则说明连接成功。

安装目录下的`data`文件夹保存了数据库文件，如果要修改保存位置，需要打开`bin\mongod.cfg`，修改其中的`dbPath`一项。该文件是数据库的配置文件，很多选项都可以在这里修改。

## 操作数据库和集合

使用`use 数据库名`可以切换当前使用的数据库。注意，即使这个数据库不存在，也是可以直接切换的。因为 MongoDB 中的**数据库和集合不需要手动创建**，在第一次向集合中插入文档时，对应的数据库和集合会自动创建。

```js
use test
```

使用`show collections`可以查看当前数据库中的所有集合。由于数据库都还没有创建，因此此时的数据库肯定也是空的。

## CRUD

使用`db.集合名`可以调用下列方法，进行数据库的 CRUD 操作。其中`db`指向当前数据库名，类似于`this`；而集合名类似于表名，可以自定义。注意，这些方法仅适用于控制台，而不是供后端语言调用。

### 查询操作符

[官方文档](https://docs.mongodb.com/manual/reference/operator/query/)

```js
// 查询 name 为 'Enter the Gungeon' 的文档
Game.find({ name: 'Enter the Gungeon' })
// 查询 name 为 'Resident Evil' ，且 type 为 'AVG' 的文档
Game.find({ name: 'Resident Evil', type: 'AVG' })
// 查询 age 大于 15 小于 30 的文档
User.find({ age: { $gt: 15, $lt: 30 }})
// 查询 age 不等于 20 的文档
User.find({ age: { $ne: 20 }})
// 查询 age 为 10 或 14 或 20 的文档 
User.find({ age: { $in: [10, 14, 20] }})
// 查询全部文档
Game.find()
```

### insert()

向集合中插入若干条文档。

* 参数①：对象或数组，表示插入的数据

```js
// 插入一条文档
db.students.insert({ name:'御坂美琴', age: 16 })
// 插入多条文档
db.students.insert([
	{ name: 'JOJO', age: 17 },
	{ name: 'Wendy', age: 14 }
])
```

此时使用`show databases`和`show collections`就可以看到自动创建的数据库和集合了。

注意，可以看到每一条文档前自动添加了一个`_id`字段。它用来作为文档的唯一标识，但是其类型为比较特殊的`ObjectId`，该类型并不是普通的字符串，而是一个自定义对象，因此在其它语言查询数据库时，需要额外的处理。

### find() / findOne()

查询集合中的一条 / 多条文档。

* 参数①：对象，表示查询条件
* 返回值：以数组 / 对象形式返回符合条件的文档

```js
// 查询所有文档
db.students.find()
// 查询符合单个条件的文档，注意这里根据 id 查询数据的方式
db.students.find({ _id: ObjectId('5de238bbb52000002c000d74') })
// 查询同时符合多个条件的文档
db.students.find({ name:'JOJO', age: 17 })
// 查询第一条符合条件的文档
db.students.findOne({ age: 17 })
```

如果使用返回的结果继续调用`count()`，可以获取查询的结果数。

```js
db.students.find().count() // => 5
```

### updateOne() / updateMany()

更新文档需要使用**更新操作符**，它用来对本次更新操作进行一些配置，例如可以更新字段名、可以更新字段值或者移除一个字段等。

修改集合中的一条 / 多条文档。

> * 参数①：对象，表示查询条件
> * 参数②：包含更新操作符的对象

```js
// 将第一条 age 为 14 的数据的 age 属性值更新为 23
db.students.updateOne({ age: 14 }, {
	$set: { age: 23 } // $set 操作符用来更新属性值
})
```

### deleteOne() / deleteMany()

删除集合中的一条 / 多条文档。

> * 参数①：对象，表示查询条件

```js
// 将 _id 为 5de238bbb52000002c000d74 的文档删除
db.students.deleteOne({ _id: ObjectId('5de238bbb52000002c000d74') })
```