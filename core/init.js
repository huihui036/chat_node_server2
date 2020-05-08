const Router = require('koa-router')

// 使用 requireDirectory 遍历路由模块
var requireDirectory = require('require-directory');

class InitManager {
  static initCore (app) {
    InitManager.app = app
    InitManager.initLoadRouter()
    InitManager.Loadconfig()
  }
  static initLoadRouter () {

    let pathapi = `${process.cwd()}/app/router`  // 使用绝对路径

    requireDirectory(module, pathapi, { visit: visitor });
    function visitor (obj) {
      const Routers = obj.router
      if (Routers instanceof Router) {
        InitManager.app.use(Routers.routes())
      }
    }
  }


  static Loadconfig (path = '') {
    const confipath = path || `${process.cwd()}/config/config.js`  // 使用绝对路径
    const config = require(confipath)
    global.config = config
  }


}
module.exports = InitManager