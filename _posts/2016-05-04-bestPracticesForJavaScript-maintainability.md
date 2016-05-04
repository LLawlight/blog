---
layout: post
title:  "JavaScript最佳实践：可维护性"
author: 天道总司
date:   2016-05-04
categories: JavaScript
permalink: /archivers/bestPracticesForJavaScript-maintainability
---

# 代码约定 #

## 一、可读性    

- 代码缩进   
- 包含注释      

## 二、变量和函数命名

- 变量名应为名词如car或person   
- 函数名应该以动词开始，如getName()。返回布尔类型值的函数一般以is开头，如isEnable()。   

## 三、变量类型透明   

1.通过初始化指定变量类型   

    var fonund = false; //布尔型   
    var count = -1;     //数字   
    var name = "";      //字符串   
    var person = null;  //对象

2.使用匈牙利标记法来指定变量类型   
“o”代表对象，“s”代表字符串，“i”代表整数，“f”代表浮点数，“b”代表布尔型。   

    var bFound;  //布尔型
    var iConunt; //整数
    var sName;   //字符串
    var oPerson; //对象

----------

# 松散耦合 #

## 一、解耦HTML/JavaScript

- 避免使用包含内联代码的<script\>元素或者是使用HTML属性来分配事件处理程序。
- 避免在JavaScript中创建大量HTML。   

## 二、解耦CSS/JavaScript   

    //CSS对JavaScript的紧密耦合
    element.style.color = "red";
    element.style.background = "blue";

尽量通过修改类名来改变样式，让大部分样式信息严格保留在CSS中。

    //CSS对JavaScript的松散耦合
    element.className = "edit";

## 三、解耦应用逻辑/事件处理程序   
一个例子：

    function handleKeyPress(event){
    	event = EventUtil.getEvent(event);
    	if(event.keyCode == 13){
    		var target = EventUtil.getTarget(event);
    		var value = 5 * parseInt(target.value);
    		if(value > 10){
    			document.getElementById("error-msg").style.display = "block";
    		}
    	}
    }

当按下Enter键，取得事件的目标并传递value属性，这是一个应用逻辑。得到属性之后通过判断值来改变样式则为事件处理。  
可以重写为：

    function handleKeyPress(event){
    	event = EventUtil.getEvent(event);
    	if(event.keyCode == 13){
    		var target = EventUtil.getTarget(event);
    		validateValue(target.value);
    	}
    }
	function validateValue(value){
		var value = 5 * parseInt(target.value);
    	if(value > 10){
    		document.getElementById("error-msg").style.display = "block";
    	}
	}

从事件处理程序中分离应用逻辑的好处：

- 可以更容易更改触发特定过程的事件。如果最开始由鼠标点击事件触发过程，但现在按键也要进行同样处理，这种更改就很容易。
- 可以在不附加到事件的情况下测试代码，使其更易创建单元测试或者是自动化应用流程。

----------

# 编程实践

## 一、尊重对象所有权   
在企业环境中最重要的编程实践就是尊重对象所有权，它的意思是你不能修改不属于你的对象。如果你不负责创建或维护某个对象、它的对象或者它的方法，那么你就不能对它们进行修改。

- 不要为实例或原型添加属性；
- 不要为实例或原型添加方法；
- 不要重定义已存在的方法；   

## 二、避免全局变量

    //两个全局变量——避免！
    var URL = "zhaoyuxiang.cn";
    function sayURL(){
    	alert(URL);
    }

这段代码包含了两个全局变量：变量URL和函数sayURL()。其实可以创建一个包含两者的对象。

    //一个全局变量——推荐
    var MyApplication = {
    	URL: "zhaoyuxiang.cn",
    	sayURL: function(){
    		alert(this.URL);
    	}
    };

## 三、使用常量   
一个例子：

    function validate(value){
    	if(!value){
    		alert("Invalid value!");
    		location.href = "zhaoyuxiang.cn";
    	}
    }

如果日后需要对URL进行修改，都要找到函数并在其中修改代码。而每次修改应用逻辑的代码，都可能会引入错误。可以通过将数据抽取出来变成单独定义的常量的方式，将应用逻辑与数据修改隔离开来。

    var Constants = {
    	INVALID_VALUE_MSG: "Invalid value!",
    	INVALID_VALUE_URL: "zhaoyuxiang.cn"
    };
    function validate(value){
    	if(!value){
    		alert(Constants.INVALID_VALUE_MSG);
    		location.href = Constants.INVALID_VALUE_URL;
    	}
    }

消息和URL都被定义于Constants对象中，然后函数引用这些值。这些设置允许数据在无须接触使用它的函数的情况下进行变更。Constants对象甚至可以完全在单独的文件进行定义，同时该文件可以由包含正确值的其他过程根据国际化设置来生成。   

需要注意的值的类型如下：

- 重复值——任何在多处用到的值都应抽取为一个常量。
- 用户界面字符串——任何用于显示给用户的字符串，都应被抽取出来以方便国际化。
- URLs——资源位置很容易变更，所以推荐用一个公共地方存放所有的URL。
- 任意可能会更改的值——每当你在用到字面量值的时候，你都要问一下自己这个值在未来是不是会变化。如果“是”，那么这个值就应该被提取出来作为一个常量。   

----------

（总结自《JavaScript高级程序设计》（第三版））