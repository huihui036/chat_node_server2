var formidable = require('formidable');
var moment = require('moment');
class Judgment {
    constructor(types) {
        this.types = types
    }
    // 文件判断 0:图片
    judgment(types) {
        let filetype = ['png', 'jpeg', 'gif', 'jpg']
        if (filetype.indexOf(types) > -1) {
            return 0
        } else {
            return 1
        }
    }

}
// 文件上传
class UplodaFlie {
    constructor(paht) { paht = this.paht }
    fliespath(paht) {
        var form = new formidable.IncomingForm();   //创建上传表单
        form.encoding = 'utf-8';        //设置编辑
        form.uploadDir = paht;     //设置上传目录
        form.keepExtensions = true;     //保留后缀
        form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小
        return form
    }

}
// 返回数据 
/*
{
    date: 时间
    uid: 用户id,
    nickname: 用户名,
    fridensname: 对话好友名称
    bridge: [好友id，用户id],
    saytext: 聊天内容,
    type:类型(文字，录音， 文件， 图片),
    userselfname: 用户名,
}*/
class ReturnJosn {
    constructor(datas) { datas = this.datas }
    retunjson(datas) {
        let BoardDate = {
            date: moment().format('YYYY-MM-DD HH:mm:ss'),
            uid: datas.uid,
            nickname: datas.nickname,
            fridensname: datas.fridensname,
            bridge: datas.bridge,
            saytext: datas.text,
            type: datas.type,
            userselfname: datas.nickname,
        }
        return BoardDate
    }
}


module.exports = {
    Judgment,
    UplodaFlie,
    ReturnJosn,
}