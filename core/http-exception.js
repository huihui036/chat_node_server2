class HttpException extends Error {
  constructor(msg = '服务器异常', errorCrcode = 101, code = 400) {
    super()
    this.msg = msg
    this.errorCrcode = errorCrcode
    this.code = code
  }
}

class AddUserError extends HttpException{
  constructor(msg = '添加失败', errorCrcode = 102, code = 400){
    super()
    this.msg = msg
    this.errorCrcode = errorCrcode
    this.code = code
  }
}


module.exports = {
  HttpException,
  AddUserError
}