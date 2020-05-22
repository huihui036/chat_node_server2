var fs = require('fs');
const { Chat } = require('../module/chat')
let dourls = 'http://172.30.92.220:3001'
// 图片压缩
var webp = require('webp-converter');
// Judgment--文件类型判断   UplodaFlie--文件上传, ReturnJosn---返回到前端的数据
const { Judgment, UplodaFlie, ReturnJosn } = require('./globalclass')
class Filesupload {
    constructor(req, boarddate) {
        req = this.req
        boarddate = this.boarddate
    }
    // 语音上传
  async mp3upload(req, boarddate) {
        let form = await new UplodaFlie().fliespath('../public/mp3')
        let BoardDate =new ReturnJosn().retunjson(boarddate)
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
                // 保存到数据库
                Chat.create({ username: boarddate.nickname, saytext: dourls + path, friend: boarddate.fridensname })
                BoardDate.urls = dourls + path
                BoardDate.saytext = names
                BoardDate.type = 'mp3'
                resolve(BoardDate)
            })
        })

    }
    // 图片文件
    async filesupload(req, boarddate) {
        let fiesmds = boarddate.filesmd5

        let form = await new UplodaFlie().fliespath('../public');

        let BoardDate = new ReturnJosn().retunjson(boarddate);

        return new Promise(async (resolve, reject) => {
            // fiesmds ：接收前端传过来的MD5 
            if (fiesmds.length >= 1) {
                let md5 = await Chat.Findlistuser(fiesmds)
                // md5 查找数据库中是否存在： md5.length == 0：找不到该文件-->进行保存， 否则将数据库的对应的文件、图片直接放回到前端不对文件进行保存操作
                if (md5.length == 0) {
                    form.parse(req, async function (err, fields, files) {
                        // console.log(fields);
                        if (err) {
                            return;
                        }
                       
                        let filesType = files.file.type.split('/')[1]
                        
                        // 判断文件类型为图片
                        let fielst = await new Judgment().judgment(filesType)

                        //     console.log(fiesmds[0])
                        let naes = files.file.name
                        let urls = files.file.path.split('\\')[files.file.path.split('\\').length - 1]

                        // 保存到数据库
                        Chat.create({ username: boarddate.nickname, saytext: dourls + '/' + urls, fielsmd5: fiesmds, friend: boarddate.fridensname })
                        // 数据返回
                      
                        let BoardDate = await new ReturnJosn().retunjson(boarddate)
                        BoardDate.type = filesType
                        BoardDate.fielst = fielst
                        BoardDate.saytext = naes

                        //压缩图片保存- 到（smale目录 格式为.webp） fielst = 0：图片 
                        if (fielst == 0) {
                            webp.cwebp('../public/' + urls, '../public' + '/smale/' + urls + ".webp", "-q 80", function (status, error) {
                                // 原图的url
                                BoardDate.imgurls = dourls + urls
                                // 压缩后的url
                                BoardDate.urls = dourls + '/smale/' + urls + '.webp'
                                resolve(BoardDate)
                            });

                        } else {
                            BoardDate.urls = dourls + '/' + urls
                            resolve(BoardDate)
                        }

                    })

                } else {
                    // 获取后缀名
                    let gettype = md5[0].dataValues.saytext.split('.')
                    let filesTypes = gettype[gettype.length - 1]

                    //文件类型判断
                    let fielsts = await new Judgment().judgment(filesTypes)
                    //返回的数据
                    let BoardDate = new ReturnJosn().retunjson(boarddate)

                    BoardDate.urls = md5[0].dataValues.saytext
                    BoardDate.saytext = gettype[gettype.length - 2] + '.' + filesTypes
                    BoardDate.type = filesTypes
                    BoardDate.fielst = fielsts
                    resolve(BoardDate)
                }
            } else {
                //  let BoardDate = retunjson(boarddate)
                BoardDate.saytext = "文件发送失败"
                resolve(BoardDate)
            }

        })
    }

}

module.exports = { Filesupload }

