const { HttpException } = require('../core/http-exception')

const Middlewares = async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    //
    // if (global.config.environment == 'dev' && !error instanceof HttpException ) {
    //   throw error
    // }
    // if (global.config.environment == 'dev') {
    //   throw error
    // }

    if (error instanceof HttpException) {
      ctx.body = {
        msg: error.msg,
        error_codes: error.errorCode,
        request_rul: `${ctx.method}:${ctx.path}`
      }
      ctx.status = error.Status
    } else {
      ctx.body = {
        msg: '服务器发生未知错误',
        error_codes: 999,
        request_rul: `${ctx.method}:${ctx.path}`
      }
      ctx.status = 500
    }

  }
}
module.exports = Middlewares