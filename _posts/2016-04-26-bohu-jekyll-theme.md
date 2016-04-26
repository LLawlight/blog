---
layout: post
title:  "十分钟搭建个人网站：Jekyll主题BoHu"
author: 天道总司
date:   2016-04-26
categories: Jekyll
permalink: /archivers/bohu-jekyll-theme
---

最近花了三天时间制作了我的第一个jekyll theme——BoHu。一款知乎风格的模板，使用jekyll模板引擎，十分钟就能搭建属于你自己的静态博客网站。   

----------

![](http://7xrva3.com1.z0.glb.clouddn.com/BoHu1.png)

本主题的特征为：
<ol>
	<li>知乎风格</li>
	<li><b>分页</b>导航使用的是具体页码而不是单纯的上一页下一页</li>
	<li>支持博文<b>搜索</b>功能</li>
	<li>支持文章<b>分类</b>和显示<b>近期文章</b></li>
	<li>首页能<b>统计</b>博文数量</li>
	<li>内置中文和英文的<b>艺术字</b>体</li>
	<li>内置<b>音乐</b>播放器</li>
	<li>支持<b>多说</b>和<b>disqus</b>评论系统</li>
	<li><b>移动</b>设备浏览效果良好</li>
	<li>使用MIT许可</li>
</ol>

----------

具体步骤如下：   

1. 首先，你需要有GitHub帐号。   
2. 到我的[GitHub](https://github.com/Clark-Zhao)上的[bohu-jekyll-theme](https://github.com/Clark-Zhao/bohu-jekyll-theme)仓库中**fork**本主题。  
3. 在bohu-jekyll-theme目录下找到\_config.yml配置文件并打开。修改个人配置信息。   
4. 将修改完成的网站目录上传至自己的GitHub仓库生成自己的博客网站。   
5. 以后只要把你的博文放在_post文件夹下并上传至GitHub，网站就会自动更新内容啦。

**必填信息**：   
title： 博客的名字   
author： 博主的名字    
baseurl： 博客的根地址==你的文件夹名称（默认为buhu-jekyll-theme），如果你更改了文件夹名称，请把此处也修改掉。  
description： head中的网页描述信息。简要描述你的网站，让搜索引擎能更好的收录你的网站。   

**选填信息**：   
email： 你的邮箱地址  
twitter\_username: 你的推特用户名   
weibo\_username:  你的微博用户名   
github\_username:  你的github用户名   
以上四项信息你填写了之后博主信息栏里会自动出现相应的链接图标，不填就不会出现。   

disqus_shortname: 你的disqus帐号   
duoshuo——shortname： 你的多说帐号   
以上两项可以不填，选填任意一项会自动加载相应的评论插件。   

url： 如果你有自己的个人网站就填写你自己的网站地址，如果没有，就填写http://你的github名字.github.io/主题文件夹根目录名字/home，将会指向一个内置的个人主页。   
使用内置的个人主页之后你需要配置一下个人信息： place，domain，company，position，school，major，resume   
性别图标修改方法：打开home文件夹下的index.html,搜索类名fa-mars，将其改成fa-venus即可。   

![](http://7xrva3.com1.z0.glb.clouddn.com/BoHu2.png)   

paginate： 填写一个数值，决定分页导航每一页显示的博文数量，达到这个数值会自动分页。   

profile: 你的座右铭  

**其他修改项目**：   
<ul>
<li>网站图标和自定义头像在assets文件夹下，你也可以把路径设置为任何站外图片链接。</li>
<li>使用SCSS预编译，要修改样式优先修改SCSS文件。</li>
<li>搜索插件需要手动配置路径，找到search文件夹，将其中JS文件夹里的cb-search.js中第66行bohu-jekyll-theme改成博客网站根目录的名字。</li>
</ul>

----------
本主题的后续维护和更新内容请关注GitHub项目主页[bohu-jekyll-theme](https://github.com/Clark-Zhao/bohu-jekyll-theme)。