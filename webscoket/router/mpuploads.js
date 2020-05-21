var fs = require('fs');
const { Chat } = require('../module/chat')
let dourls = 'http://172.30.92.220:3001'
// 图片压缩
var webp = require('webp-converter');
// Judgment--文件类型判断   Setflie--文件上传, ReturnJosn---返回到前端的数据
const { Judgment, Setflie, ReturnJosn } = require('../files/Judgment')
class Mpuploads {
    constructor(req, Mydata) {
        req = this.req
        Mydata = this.Mydata
    }
    // 语音上传
    static async mp3upada(req, Mydata) {
        let form = await Setflie.fliespath('../public/mp3')
        let BoardDate = ReturnJosn.retunjson(Mydata)
        return new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) {
                    throw err;
                }
                let path = files.file.path.split('public')[1]
                fs.readFile(files.file.path, (err, datas) => {
                    console.log(datas.duration)
                })
                let names = path.split('mp3')[1]
                // console.log(names)
                Chat.create({ username: Mydata.nickname, saytext: dourls + path, friend: Mydata.fridensname })
                BoardDate.urls = dourls + path
                BoardDate.saytext =names
                BoardDate.type = 'mp3'
                resolve(BoardDate)
            })
        })

    }

    // 图片文件
    static async filesupload(req, Mydata) {
        let fiesmds = Mydata.filesmd5
        let form = await Setflie.fliespath('../public');
        let BoardDate = ReturnJosn.retunjson(Mydata);
         return new Promise(async (resolve, reject) => {
            if (fiesmds.length >= 1) {
                // let amd5 = (fiesmds[0]).toString()
                //  fiesmds = ''
                let md5 = await Chat.Findlistuser(fiesmds)
                // console.log(fiesmds)
                if (md5.length == 0) {
                    form.parse(req, async function (err, fields, files) {
                        // console.log(fields);
                        if (err) {
                            return;
                        }
                        // 判断文件类型为图片
                        let types = files.file.type.split('/')[1]
                        let fielst = await Judgment.judgment(types)
                        //     console.log(fiesmds[0])
                        let naes = files.file.name
                        let urls = files.file.path.split('\\')[files.file.path.split('\\').length - 1]
                        // 保存到数据库
                        Chat.create({ username: Mydata.nickname, saytext: dourls + '/' + urls, fielsmd5: fiesmds, friend: Mydata.fridensname })
                        // 压缩图片格式为webbp
                        let BoardDate = ReturnJosn.retunjson(Mydata)
                        BoardDate.type = types
                        BoardDate.fielst = fielst
                       // BoardDate.userselfname = Mydata.usernamepath
                        BoardDate.saytext = naes
                        if (fielst == 0) {
                            //console.log("md5",md5)
                            webp.cwebp('../public/' + urls, '../public' + '/smale/' + urls + ".webp", "-q 80", function (status, error) {
                                BoardDate.imgurls = dourls + urls
                                BoardDate.urls = dourls + '/smale/' + urls + '.webp'
                                resolve(BoardDate)
                            });
    
                        } else {
                            BoardDate.urls = dourls + '/' + urls
                            resolve(BoardDate)
                        }
                    })
                   
                } else {
                    console.log(md5[0].dataValues.saytext)
                    let a = md5[0].dataValues.saytext.split('.')
                    console.log(a[a.length - 1])
                    let fiestype = a[a.length - 1]
                    //文件类型判断
                    let fielsts = await Judgment.judgment(fiestype)
                    //返回的数据
                    let BoardDate = ReturnJosn.retunjson(Mydata)
                    // userselfname: usernamepath,
                    BoardDate.urls = md5[0].dataValues.saytext
                    BoardDate.saytext = a[a.length - 2] + '.' + fiestype
                    BoardDate.type = fiestype
                    BoardDate.fielst = fielsts
                    resolve(BoardDate)
                }
            } else {
              //  let BoardDate = retunjson(Mydata)
                BoardDate.saytext = "文件发送失败"
                BoardDate.type = "textsay"
                resolve(BoardDate)
            }

         })
    }

}

module.exports = { Mpuploads }

