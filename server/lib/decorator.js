
const Router = require('koa-router')
const SymbolPrefix = Symbol('prefix') // 是函数 符号标识 返回Smble 值  有自己的静态属性和值 唯一的标识 不可修改  
const _ = require('lodash')
const routerMap = new Map()
const {
  resolve
} = require('path')

const glob = require('glob')
const isArray = c => _.isArray(c)? c: [c]

export class Route {
  //app=>  koa当前的实例 apiPath =>  路由文件的所在目录
  constructor(app, apiPath) {
    this.app = app
    this.apiPath = apiPath
    this.router = new Router() // koa 静态实力
  }
  init() {
    // 加载每个路由文件  同时初始化路由控制器 每个控制器都有 controller
    glob.sync(resolve(this.apiPath, './**/*.js')).forEach(require)

    for(let [conf, controller] of routerMap){
      const controllers = isArray(controller)
      const prefixPath = conf.target[SymbolPrefix]
      if(prefixPath) prefixPath = normalizePath(prefixPath)
      const routerPath = prefixPath + conf.path
      this.router[conf.method](routerPath, ...controllers)
    }

    this.app.use(this.router.routes())
    this.app.use(this.router.allowedMethods())

  }
}
const normalizePath = path => path.startsWith('/') ? path : `/${path}`

const router = conf => (target, key, descriptor) => {
  conf.path = normalizePath(conf.path)

  routerMap.set({
    target:target,
    ...conf
  }, target[key])

}

// es7 装饰器类的使用  传入path 参数 > target是类函数  => 利用 箭头函数的特性 返回一个函数内容 
export const controller = path => target => (target.prototype[SymbolPrefix] = path)

export const get = path => router({
  method: 'get',
  path: path
})
export const post = path => router({
  method: 'post',
  path: path
})
export const put = path => router({
  method: 'put',
  path: path
})
export const del = path => router({
  method: 'del',
  path: path
})
export const use = path => router({
  method: 'use',
  path: path
})
export const all = path => router({
  method: 'all',
  path: path
})