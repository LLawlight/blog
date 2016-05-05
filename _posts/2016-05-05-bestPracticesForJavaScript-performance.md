---
layout: post
title:  "JavaScript最佳实践：性能"
author: 天道总司
date:   2016-05-05
categories: JavaScript
permalink: /archivers/bestPracticesForJavaScript-performance
---

## 注意作用域
避免全局查找   

一个例子：

    function updateUI(){
    	var imgs = document.getElementByTagName("img");
    	for(var i=0, len=imgs.length; i<len; i++){
    		imgs[i].title = document.title + " image " + i;
    	}
    	var msg = document.getElementById("msg");
    	msg.innnerHTML = "Update complete.";
    }

该函数可能看上去完全正常，但是它包含了三个对于全局document对象的引用。如果在页面上有多个图片，那么for循环中的document引用就会被执行多次甚至上百次，每次都会要进行作用域链查找。通过创建一个指向document对象的局部变量，就可以通过限制一次全局查找来改进这个函数的性能：

    function updateUI(){
		var doc = document;
    	var imgs = doc.getElementByTagName("img");
    	for(var i=0, len=imgs.length; i<len; i++){
    		imgs[i].title = doc.title + " image " + i;
    	}
    	var msg = doc.getElementById("msg");
    	msg.innnerHTML = "Update complete.";
    }

这里，首先将document对象存在本地的doc变量中；然后在余下的代码中替换原来的document。与原来的版本相比，现在的函数只有一次全局查找，肯定更快。

## 选择正确方法

**1.避免不必要的属性查找**   

获取常量值是非常高效的过程

    var value = 5;
    var sum = 10 + value;
    alert(sum);

该代码进行了四次常量值查找：数字5，变量value，数字10和变量sum。   
在JavaScript中访问数组元素和简单的变量查找效率一样。所以以下代码和前面的例子效率一样：

    var value = [5,10];
    var sum = value[0] + value[1];
    alert(sum);

对象上的任何属性查找都比访问变量或者数组花费更长时间，因为必须在原型链中对拥有该名称的属性进行一次搜素。**属性查找越多，执行时间就越长。**

    var values = {first: 5, second: 10};
    var sum = values.first + values.second;
    alert(sum);

这段代码使用两次属性查找来计算sum的值。进行一两次属性查找并不会导致显著的性能问题，但是进行成百上千次则肯定会减慢执行速度。   
注意获取单个值的多重属性查找。例如：

    var query = window.location.href.substring(window.location.href.indexOf("?"));

在这段代码中，有6次属性查找：window.location.href.substring()有3次，window.location.href.indexOf()又有3次。**只要数一数代码中的点的数量，就可以确定查找的次数了。**这段代码由于两次用到了window.location.href，同样的查找进行了两次，因此效率特别不好。   
一旦多次用到对象属性，应该将其存储在局部变量中。之前的代码可以如下重写：

    var url = window.locaiton.href;
    var query = url.substring(url.indexOf("?"));

这个版本的代码只有4次属性查找，相对于原始版本节省了33%。   
一般来讲，只要能减少算法的复杂度，就要尽可能减少。尽可能多地使用局部变量将属性查找替换为值查找，进一步奖，如果即可以用数字化的数组位置进行访问，也可以使用命名属性（诸如NodeList对象），那么使用数字位置。   

**2.优化循环**   

一个循环的基本优化步骤如下所示。   
(1)减值迭代——大多数循环使用一个从0开始、增加到某个特定值的迭代器。在很多情况下，从最大值开始，在循环中不断减值的迭代器更加高效。   
(2)简化终止条件——由于每次循环过程都会计算终止条件，所以必须保证它尽可能快。也就是说避免属性查找或其他操作。   
(3)简化循环体——循环是执行最多的，所以要确保其最大限度地优化，确保其他某些可以被很容易移除循环的密集计算。   
(4使用后测试循环——最常用for循环和while循环都是前测试循环。而如do-while这种后测试循环，可以避免最初终止条件的计算，因此运行更快。   
以下是一个基本的for循环：

    for(var i=0; i < value.length; i++){
    	process(values[i]);
    }

这段代码中变量i从0递增到values数组中的元素总数。循环可以改为i减值，如下所示：

    for(var i=value.length -1; i >= 0; i--){
    	process(values[i]);
    }

终止条件从value.length简化成了0。   
循环还能改成后测试循环，如下：

    var i=values.length -1;
    if (i> -1){
    	do{
    		process(values[i])
    	}while(--i>=0) //此处有个勘误，书上终止条件为(--i>0)，经测试，(--i>=0)才是正确的
    }

此处最主要的优化是将终止条件和自减操作符组合成了单个语句，循环部分已经优化完全了。   
记住使用“后测试”循环时必须确保要处理的值至少有一个，空数组会导致多余的一次循环而“前测试”循环则可以避免。   

**3.展开循环**   

当循环的次数是确定的，消除循环并使用多次函数调用往往更快。假设values数组里面只有3个元素，直接对每个元素调用process()。这样展开循环可以消除建立循环和处理终止条件的额外开销，使代码运行更快。

    //消除循环
    process(values[0]);
    process(values[1]);
    process(values[2]);

如果循环中的迭代次数不能事先确定，那可以考虑使用一种叫做Duff装置的技术。Duff装置的基本概念是通过计算迭代的次数是否为8的倍数将一个循环展开为一系列语句。   
Andrew B.King提出了一个更快的Duff装置技术，将do-while循环分成2个单独的循环。以下是例子：

    var iterations = Math.floor(values.length / 8);
    var leftover = values.length % 8;
    var i = 0;
    
    if(leftover>0){
    	do{
    		process(values[i++]);
    	}while(--leftover > 0);
    }
    do{
    	process(values[i++]);
    	process(values[i++]);
    	process(values[i++]);
    	process(values[i++]);
    	process(values[i++]);
    	process(values[i++]);
    	process(values[i++]);
    	process(values[i++]);
    }while(--iterations > 0);

在这个实现中，剩余的计算部分不会在实际循环中处理，而是在一个初始化循环中进行除以8的操作。当处理掉了额外的元素，继续执行每次调用8次process()的主循环。   
针对大数据集使用展开循环可以节省很多时间，但对于小数据集，额外的开销则可能得不偿失。它是要花更多的代码来完成同样的任务，如果处理的不是大数据集，一般来说不值得。   

**4.避免双重解释**   

当JavaScript代码想解析KavaScript的时候就会存在双重解释惩罚。当使用eval()函数或者是Function构造函数以及使用setTimeout()传一个字符串参数时都会发生这种情况。

    //某些代码求值——避免！！
    eval("alert('Hello world!')");
    
    //创建新函数——避免！！
    var sayHi = new Function("alert('Hello world!')");
    
    //设置超时——避免！！
    setTimeout("alert('Hello world!')", 500);

在以上这些例子中，都要解析包含了JavaScript代码的字符串。这个操作是不能在初始的解析过程中完成的，因为代码是包含在字符串中的，也就是说在JavaScript代码运行的同时必须新启动一个解析器来解析新的代码。实例化一个新的解析器有不容忽视的开销，所以这种代码要比直接解析慢得多。

    //已修正
    alert('Hello world!');
    
    //创建新函数——已修正
    var sayHi = function(){
    	alert('Hello world!');
    };
    
    //设置一个超时——已修正
    setTimeout(function(){
    	alert('Hello world!');
    }, 500);

如果要提高代码性能，尽可能避免出现需要按照JavaScript解析的字符串。   

**5.性能的其他注意事项**   

(1)原生方法较快   
(2)Switch语句较快   
(3)位运算符较快

## 最小化语句数

**1.多个变量声明**

    //4个语句——很浪费
    var count = 5;
    var color = "blue";
    var values = [1,2,3];
    var now = new Date();

    //一个语句
    var count = 5，
    	color = "blue"，
    	values = [1,2,3]，
    	now = new Date();

**2.插入迭代值**   

当使用迭代值的时候，尽可能合并语句。

    var name = values[i];
    i++;

前面这2句语句各只有一个目的：第一个从values数组中获取值，然后存储在name中；第二个给变量i增加1.这两句可以通过迭代值插入第一个语句组合成一个语句。

    var name = values[i++];

**3.使用数组和对象字面量**

    //用4个语句创建和初始化数组——浪费
    var values = new Array();
    values[0] = 123;
    values[1] = 456;
    values[2] = 789;
    
    //用4个语句创建和初始化对象——浪费
    var person = new Object();
    person.name = "Nicholas";
    person.age = 29;
    person.sayName = function(){
    	alert(this.name);
    };

这段代码中，只创建和初始化了一个数组和一个对象。各用了4个语句：一个调用构造函数，其他3个分配数据。其实可以很容易地转换成使用字面量的形式。

    //只有一条语句创建和初始化数组
    var values = [13,456,789];
    
    //只有一条语句创建和初始化对象
    var person = {
    	name : "Nicholas",
    	age : 29,
    	sayName : function(){
    		alert(this.name);
    	}
    };

重写后的代码只包含两条语句，减少了75%的语句量，在包含成千上万行JavaScript的代码库中，这些优化的价值更大。   
只要有可能，尽量使用数组和对象的字面量表达方式来消除不必要的语句。

## 优化DOM交互

**1.最小化现场更新**   

一旦你需要访问的DOM部分是已经显示的页面的一部分，那么你就是在进行一个现场更新。现场更新进行得越多，代码完成执行所花的事件就越长。

    var list = document.getElementById('myList'),
    	item,
    	i;
    for (var i = 0; i < 10; i++) {
    	item = document.createElement("li");
    	list.appendChild(item);
    	item.appendChild(document.createTextNode("Item" + i));
    }

这段代码为列表添加了10个项目。添加每个项目时，都有2个现场更新：一个添加li元素，另一个给它添加文本节点。这样添加10个项目，这个操作总共要完成20个现场更新。

    var list = document.getElementById('myList'),
    	fragment = document.createDocumentFragment(),
    	item,
    	i;
    for (var i = 0; i < 10; i++) {
    	item = document.createElement("li");
    	fragment.appendChild(item);
    	item.appendChild(document.createTextNode("Item" + i));
    }
    list.appendChild(fragment);

在这个例子中只有一次现场更新，它发生在所有项目都创建好之后。文档片段用作一个临时的占位符，放置新创建的项目。当给appendChild()传入文档片段时，只有片段中的子节点被添加到目标，片段本身不会被添加的。   
一旦需要更新DOM，请考虑使用文档片段来构建DOM结构，然后再将其添加到现存的文档中。   

**2.使用innerHTML**   

有两种在页面上创建DOM节点的方法：使用诸如createElement()和appendChild()之类的DOM方法，以及使用innerHTML。对于小的DOM更改而言，两种方法效率都差不多。然而，对于大的DOM更改，使用innerHTML要比使用标准DOM方法创建同样的DOM结构快得多。   
当把innerHTML设置为某个值时，后台会创建一个HTML解析器，然后使用内部的DOM调用来创建DOM结构，而非基于JavaScript的DOM调用。由于内部方法是编译好的而非解释执行的，所以执行快得多。

    var list = document.getElementById("myList");
    	html = "";
    	i;
    
    for (i=0; i < 10; i++){
    	html += "<li>Item " + i +"</li>";
    }
    list.innerHTML = html;

使用innerHTML的关键在于（和其他的DOM操作一样）最小化调用它的次数。

    var list = document.getElementById("myList");
    	i;
    
    for (i=0; i < 10; i++){
    	list.innerHTML += "<li>Item " + i +"</li>";  //避免！！！
    }

这段代码的问题在于每次循环都要调用innerHTML，这是极其低效的。调用innerHTML实际上就是一次现场更新。构建好一个字符串然后一次性调用innerHTML要比调用innerHTML多次快得多。

**3.使用事件代理**(根据第13章的概念，我认为此处应为“事件委托”更为妥当)   
 
**4.注意HTMLCollection**

任何时候要访问HTMLCollection，不管它是一个属性还是一个方法，都是在文档上进行一个查询，这个查询开销很昂贵。

    var images = document.getElementsByTagName("img"),
    	image,
    	i,len;
    
    for (i=0, len=images.length; i < len; i++){
    	image = images[i];
    	//处理
    }

将length和当前引用的images[i]存入变量，这样就可以最小化对他们的访问。发生以下情况时会返回HTMLCollection对象：

- 进行了对getElementsByTagName()的调用；
- 获取了元素的childNodes属性；
- 获取了元素的attributes属性；
- 访问了特殊的集合，如document.forms、document.images等。


----------

（总结自《JavaScript高级程序设计》（第三版））