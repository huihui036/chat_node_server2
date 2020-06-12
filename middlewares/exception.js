const { HttpException } = require('../core/http-exception')

const Middlewares = async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    if (error instanceof HttpException) {
      ctx.body = {
        msg: error.msg,
        errcode: error.code,
        errorstatus: error.errorCrcode,
        errpath: `${ctx.method}: ${ctx.path}`
      }
    } else{
      ctx.body = {
        msg: "发生异常错误",
       
      }
    }
  }
}
module.exports = Middlewares