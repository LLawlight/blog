---
layout: post
title:  "原生JS之addLoadEvent：共享onload事件"
author: 天道总司
date:   2016-03-09
categories: JavaScript
permalink: /archivers/addLoadEvent
---
  
　　当我们需要让一个函数在网页加载完毕之后立即执行，通常会让网页在加载完毕时触发一个onload事件：   
    
    window.onload=Function;

　　假设现在有两个函数Function1和Function2，如果我们通过以下代码绑定到onload事件上：   

    window.onload=Function1;
    window.onload=Function2;

　　那么它们当中只有最后那个才会被执行。   
   
　　如果我们要让两个事件处理函数都得到执行，我们可以创建一个匿名函数来容纳这两个函数，然后把匿名函数绑定到onload事件上：     
   
	window.onload=function(){
	  Function1();
	  Function2();
	}

　　<br />
　　[Simon Willison](http://simon.incutio.com)编写了一个函数addLoadEvent，它将完成以下操作：

*  把现有的window.onload事件处理函数的值存入变量oldonload。   
*  如果在这个函数上还没有绑定任何函数，就像平时那样把新函数添加给它。
*  如果在这个处理函数上已经绑定了一些函数，就把新函数追加到现有指令的末尾。
   
　　具体代码如下：
	
	function addLoadEvent(func){
	  var oldonload=window.onload;
	  if(typeof window.onload!='function'){
	    window.onload=func;
	  } else{
	    window.onload=function(){
	     oldonload();
	     func();
	    }
	  }
	}

　　在添加了addLoadEvent这个函数之后，如果我们想让刚才那两个函数都在页面加载完毕时得到执行，只需要写出以下代码就能完成上文匿名函数的功能了：

	addLoadEvent(Function1);
	addLoadEvent(Function2);
