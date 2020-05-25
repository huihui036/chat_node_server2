const Middlewares = async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    if (error.code) {
      ctx.body = {
        msg: error.msg,
        errcode: error.code,
        errorstatus: error.errorCrcode,
        errpath: `${ctx.method}: ${ctx.path}`
      }
    }

  }
}
module.exports = Middlewares