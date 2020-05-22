class HttpException extends Error {

    constructor(msg = '错误信息', errorCode = 100001, Status = 400) {
      super()
      this.msg = msg
      this.errorCode = errorCode
      this.Status = Status
    }
  }
  class ParameterException extends HttpException {
    constructor(msg, errorCode) {
  
      super()
      this.Status = 400
      this.msg = msg || '参数错误'
      this.errorCode = errorCode || 10000
  
    }
  }
  
  class NotFuntem extends HttpException {
    constructor(msg, errorCode) {
  
      super()
      this.Status = 401
      this.msg = msg || '没有此用户'
      this.errorCode = errorCode || 10002
  
    }
  }
 
  // 请求成功
  class Success extends HttpException {
    constructor(msg, errorCode) {
      super()
      this.Status = 200
      this.msg = mgs || 'ok'
      this.errorCode = errorCode || 0
  
    }
  }
  
  module.exports = { HttpException, ParameterException, Success, NotFuntem } 