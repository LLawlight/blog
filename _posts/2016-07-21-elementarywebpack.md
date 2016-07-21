---
layout: post
title:  "webpack入门"
author: 天道总司
date:   2016-07-21
categories: webpack
permalink: /archivers/elementarywebpack
---

安装webpack：

    npm install webpack -g

新建文件夹，创建package.json，填写配置信息：

    mkdir webpack
    cd webpack
    npm init

在文件夹中创建新的文件夹与文件，目录结构如下：

    webpack
    |   |--app
    |	    |--index.js
    |	    |--sub.js
    |	|--package.json
    |	|--webpack.config.js

编写sub.js：

    function generateText() {
      var element = document.createElement('h2');
      element.innerHTML = "Hello h2 world";
      return element;
    }
    
    module.exports = generateText;

编写index.js：

    var sub = require('./sub');

    var app  = document.createElement('div');
    app.innerHTML = '<h1>Hello World</h1>';

    app.appendChild(sub());

    document.body.appendChild(app);

使用插件快速生成HTML：

    npm install html-webpack-plugin --save-dev

编写webpack.config.js：

    var path = require('path');

	//插件声明如下
    var HtmlwebpackPlugin = require('html-webpack-plugin');

    //定义了一些文件夹的路径
    var ROOT_PATH = path.resolve(__dirname);
    var APP_PATH = path.resolve(ROOT_PATH, 'app');
    var BUILD_PATH = path.resolve(ROOT_PATH, 'build');
    
    module.exports = {

      //项目的文件夹 可以直接用文件夹名称 默认会找index.js 也可以确定是哪个文件名字
      entry: APP_PATH,

      //输出的文件名 合并以后的js会命名为bundle.js
      output: {
    	path: BUILD_PATH,
    	filename: 'bundle.js'
      },

      //添加我们的插件 会自动生成一个html文件
      plugins: [
    	new HtmlwebpackPlugin({
      		title: 'Hello World app'
    	})
      ]
    };

----------

安装webpack-dev-server：

    npm install webpack-dev-server --save-dev

在webpack.config.js中添加配置：

    module.exports = {
      ....
      devServer: {
    	historyApiFallback: true,
    	hot: true,
    	inline: true,
    	progress: true,
      },
      ...
    }

在package.json中配置以下命令：

    ...
    "scripts": {
      "start": "webpack-dev-server --hot --inline"
    },
    ...

(依赖此插件此配置，在js任意修改内容然后保存，浏览器会自动刷新。默认在浏览器中打开localhost:8080就能直接访问到生成的网页了。)

----------

添加CSS样式

    npm install css-loader style-loader --save-dev

在webpack.config.js中配置：

    devServer: {
      historyApiFallback: true,
      hot: true,
      inline: true,
      progress: true,
    },
    ...
    module: {
      loaders: [
      	{
    	  test: /\.css$/,
    	  loaders: ['style', 'css'],
    	  include: APP_PATH
        }
      ]
    },
    ...
    plugins: [
      new HtmlwebpackPlugin({
        title: 'Hello World app'
      })
    ]

在app文件夹中新建main.css：

    h1 {
      color: red;
    }

在入口文件index.js中引用：

    require('./main.css');

----------

添加sass样式：

    npm install sass-loader --save-dev
(使用此loader需要安装依赖`npm install node-sass --save-dev`)

在webpack.config.js中加上loader：

    {
      test: /\.scss$/,
      loaders: ['style', 'css', 'sass'],
      include: APP_PATH
    },

添加sass文件

variables.scss:

    $red: red;

main.scss:

    @import "./variables.scss";
    
    h1 {
      color: $red;
    }

在index.js中引用：

    require('./main.scss');

----------

处理图片和其他静态文件

安装url-loader：

    npm install url-loader --save-dev

配置webpack.config.js：

    {
      test: /\.(png|jpg)$/,
      loader: 'url?limit=40000'
    }
(当图片大小小于limit后面的参数限制的时候，会自动启用base64编码图片)

在app文件夹下新建imgs文件夹，然后修改main.scss：

    h1 {
      color: $red;
      background: url('./imgs/avatar.jpg');
    }

----------

添加第三方库

    npm install jquery --save-dev

在index.js中引用：

    var $ = require('jquery');

----------

然后在项目根目录运行：

    webpack

再输入：

    npm start

在浏览器中打开localhost:8080查看生成的网页。

----------
   
添加ES6的支持

    npm install babel-loader babel-preset-es2015 --save-dev

配置webpack.config.js文件：

    ...
    {
      test: /\.jsx?$/,
      loader: 'babel',
      include: APP_PATH,
      query: {
        presets: ['es2015']
      }
    },
    ...

将sub.js改写为：

    export default function() {
      var element = document.createElement('h2');
      element.innerHTML = "Hello h2 world hahaha";
      return element;
    }

将index.js改写为：

    import './main.scss';
    import generateText from './sub';
    import $ from 'jquery';
    import moment from 'moment';
    
    let app  = document.createElement('div');
    const myPromise = Promise.resolve(42);
    myPromise.then((number) => {
      $('body').append('<p>promise result is ' + number + ' now is ' + moment().format() + '</p>');
    });
    app.innerHTML = '<h1>Hello World it</h1>';
    document.body.appendChild(app);
    app.appendChild(generateText());

----------

参考资料：https://zhuanlan.zhihu.com/p/20367175