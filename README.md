# 用koa实现一个电影网站
## 记录使用的一些技术
# 项目开发环境下考虑每次更改代码都要 在命令行node 重启脚本  故使用 nodemon  实时更新重启项目脚本
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