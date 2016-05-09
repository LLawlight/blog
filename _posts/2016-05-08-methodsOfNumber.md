---
layout: post
title:  "JavaScript中“数字”拥有的方法"
author: 天道总司
date:   2016-05-08
categories: JavaScript
permalink: /archivers/methodsOfNumber
---

## number.toExponential(fractionDigits)  
这个方法把number转换成一个指数形式的字符串。可选参数fractionDigits控制其小数点后的数字位数，它的值必须在0~20。**（注：经本人测试，fractionDigits的值大于15时，得到的结果会变得不精确（不按照常规的四舍五入））**   

    var num = 1.23456789101112164;
    num.toExponential(4);    //1.2346e+0
    num.toExponential(15);   //1.234567891011122e+0
    num.toExponential();     //1.2345678910111217e+0 小数点后超过16位默认最多显示16位且结果不精确
    var num1 = 1.23456789101112136;
    num1.toExponential(16);  //1.2345678910111213e+0
    var num2 = 1.23456789101112162;
    num2.toExponential(16);  //1.2345678910111215e+0

----------

## number.toFixed(fractionDigits)
这个方法把number转换成为一个十进制数形式的字符串。可选参数fractionDigits控制其小数点后的数字位数，它的值必须在0~20，默认为0。**（注：经本人测试，fractionDigits的值大于15时，得到的结果会变得不精确（不按照常规的四舍五入））**   

    var num = 1.23456;
    num.toFixed(0);   //1
    num.toFixed(4);   //1.2346
    num.toFixed();    //1
    var num1 = 1.23456789101112163;
    num1.toFixed(16); //1.2345678910111217
    num1.toFixed();   //1
    var num2 = 1.23456789101112162;
    num2.toFixed(16); //1.2345678910111215

----------

## number.toPrecision(precision)
这个方法把这个number转换成为一个十进制数形式的字符串。可选参数precision控制数字的精度(**注：虽然英文单词和翻译都是精度，但是我认为是有效数字**)。它的值必须在0~21。**（注：经本人测试，precision的值大于18时，得到的结果会变得不精确（不按照常规的四舍五入））**   

    var num = 0.005;
    num.toPrecision(1); //0.005
    num.toPrecision(4); //0.005000
    num.toPrecision();  //0.005
    var num1 = 0.01234567890123456755;
    num1.toPrecision(); //0.012345678901234567 小数点后超过18位默认最多显示18位且结果不精确
    var num2 = 0.01234567890123456765;
    num2.toPrecision(); //0.012345678901234568

----------

## number.toString(radix)
这个方法把这个number转换成为一个字符串。可选参数radix控制基数。它的值必须在2~36。默认的radix是以10为基数的。radix最常用的是整数，但是它可以用任意的数字。   
在最普通的情况下，number.toString()可以更简单地写为String(number)；   

    var num = 0.123;
    num.toString(2);  //0.0001111101111100111011011001000101101000011100101011
    num.toString(8);  //0.076763554426416254
    num.toString(16); //0.1f7ced916872b
    num.toString();   //0.123
    String(num);      //0.123

---
参考资料：《JavaScript语言精粹》