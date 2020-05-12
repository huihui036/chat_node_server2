const ws = require("nodejs-websocket");
var fs = require('fs');
// 图片压缩
var webp = require('webp-converter');

let users = [];
let conns = {};

var express = require('express');

var formidable = require('formidable');

var app = express();

//格式化时间
var moment = require('moment');

const path = require('path')
const { Chat } = require('./module/chat')
let usernamepath
let firdensname 
let fiesmds = []
const server = ws.createServer(function (conn) {
    console.log("启动服务器连接")
    conn.on("text", async function (str) {
        //  console.log("接收前端发送过来的数据：" + str)
        data = JSON.parse(str)
        fiesmds = data.filesmd5
        console.log("fiesmds.length1",fiesmds.length)
        //   console.log(data)
        conns['' + data.uid + ''] = conn;

        // let info = str
        if (data.privatechat == 2) {
            let isuser = users.some(item => {
                return item.uid === data.uid
            })

            if (!isuser) {
                users.push({
                    nickname: data.nickname,
                    uid: data.uid,
                    saytext: data.text
                });
            }

            switch (data.type) {
                // 用户名
                case 'setname':
                    conn.nicname = data.nickname
                    usernamepath = conn.nicname,
                    firdensname = data.firdensname,
                    console.log(data.files)
                    boardcast({
                        privatechat: 2, //2  ==私聊
                        date: moment().format('YYYY-MM-DD HH:mm:ss'),
                        uid: data.uid,
                        nickname: data.nickname,
                        type: 'setname',
                        bridge: data.bridge,
                        firdensname: data.firdensname

                    })
                    break
                // 聊天文字信息
                case 'textsay':
                    Chat.create({ username: conn.nicname, saytext: data.text, friend: data.firdensname })
                    //广播出去
                    boardcast({
                        privatechat: 2,
                        uid: data.uid,
                        nickname: data.nickname,
                        saytext: data.text,
                        type: "textsay",
                        firdensname: data.firdensname 

                    })
                    break
            }
        }


    })

    conn.on("close", function () {
        boardcast({
            'nickname': data.nickname,
            'msg': '退出了聊天'
        })
    })

    conn.on("error", function (err) {
        console.log(err)
    })

})


app.post('/uploads', async function (req, res, next) {
    var form = new formidable.IncomingForm();   //创建上传表单
    form.encoding = 'utf-8';        //设置编辑
    form.uploadDir = '../public/mp3';     //设置上传目录
    form.keepExtensions = true;     //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小
    console.log()
    form.parse(req, (err, fields, files) => {
        if (err) {
            throw err;
        }
        //  console.log(fields, files)
        console.log(files.file.path)
        let path = files.file.path.split('public')[1]
        boardcast({
            nickname: usernamepath,
            urls: 'http://127.0.0.1:3001' +  path,
            type: 'mp3',

        })

    })
})


// 单图/文件上传

app.post('/upload', async function (req, res, next) {
    console.log("usernamepath",firdensname)
    var form = new formidable.IncomingForm();   //创建上传表单
    form.encoding = 'utf-8';        //设置编辑
    form.uploadDir = '../public';     //设置上传目录
    form.keepExtensions = true;     //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小
   // console.log(form)
  //  console.log(fiesmds[0])
  console.log("fiesmds.length",fiesmds.length)
    if (fiesmds.length >= 1) {
        let md5 = await Chat.Findlistuser(fiesmds[0])
        console.log(fiesmds)
        console.log(md5.length)

        if (md5.length <= 0) {
            form.parse(req, async function (err, fields, files) {
                // console.log(fields);
                if (err) {
                    return;
                }
                // 判断文件类型为图片
                let types = files.file.type.split('/')[1]
                let fielst
                if (types == 'png' || types == 'jpeg') {
                    fielst = 0
                } else {
                    fielst = 1
                }
                //     console.log(fiesmds[0])
                let naes = files.file.name

                let urls = files.file.path.split('\\')[files.file.path.split('\\').length - 1]
                // 保存到数据库
                Chat.create({ username: usernamepath, saytext: 'http://127.0.0.1:3001/' + urls, fielsmd5: fiesmds[0] ,friend: firdensname})
                // console.log(fiesmds[0])
                if (fielst == 0) {
                    //console.log("md5",md5)
                    webp.cwebp('../public/' + urls, '../public' + '/smale/' + urls + ".webp", "-q 80", function (status, error) {
                        console.log(status, error);
                        boardcast({
                            
                            nickname: usernamepath,
                            saytext: naes,
                            imgurls: 'http://127.0.0.1:3001/' + urls,
                            urls: 'http://127.0.0.1:3001/' + 'smale/' + urls + '.webp',
                            type: types,
                            fielst: fielst,
                            firdensname:firdensname ,
                        })
                    });
                } else {

                    boardcast({
                        nickname: usernamepath,
                        saytext: naes,
                        urls: 'http://127.0.0.1:3001/' + urls,
                        type: types,
                        fielst: fielst
                    })
                }

            })

        } else {
            boardcast({
                nickname: usernamepath,
                saytext: "文件已经存在",
                type: "textsay"
            })
        }
    }

});

// console.log(fies)
function boardcast(obj) {
    // bridge用来实现一对一的主要参数
    //console.log(obj)
    if (obj.bridge && obj.bridge.length == 2) {
        //   console.log(obj.bridge)
        obj.bridge.forEach(item => {
            console.log("intm:", item)

            conns[item].sendText(JSON.stringify(obj));

        })
        return;
    } else {
        server.connections.forEach((conn, index) => {
            conn.sendText(JSON.stringify(obj));
        })
    }
}

//require("./module/chat")

server.listen(3002)
app.listen(3006);