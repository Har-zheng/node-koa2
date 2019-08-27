# 用koa实现一个电影网站
## 记录使用的一些技术
<h4> 项目开发环境下考虑每次更改代码都要 在命令行node 重启脚本  故使用 nodemon  实时更新重启项目脚本</h4>
<h4>安装</h4>

* npm install nodemon --save  项目依赖安装
* 使用  在package.json

```JavaScript
  "scripts": {
        // ...
        "watch-js": "...",
        "watch-css": "...",
        "watch-node": "...",
        // ...
    },
```
###  使用puppteer 爬虫工具  爬取豆瓣的电影资源
> 注: 我们大家在学习中一定有基本法律常识, 爬虫资源 一般仅供学习和参考,切勿进行商业使用