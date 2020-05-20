const ws = require("nodejs-websocket");
var fs = require('fs');
// 图片压缩
var webp = require('webp-converter');
let users = [];
let conns = {};
let dourls = 'http://172.30.92.220:3001'
var express = require('express');
var app = express();

// Judgment--文件类型判断   Setflie--文件上传, ReturnJosn---返回到前端的数据
const { Judgment,Setflie, ReturnJosn} = require('./files/Judgment')
//设置允许跨域访问该服务.
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});


const path = require('path')
const { Chat } = require('./module/chat')
let usernamepath
let firdensname
let fiesmds
let Mydata
const server = ws.createServer(function (conn) {
    console.log("启动服务器连接")
    //Judgment.Judgment()
    conn.on("text", async function (str) {
        //  console.log("接收前端发送过来的数据：" + str)
        data = JSON.parse(str)
        fiesmds = data.filesmd5
        console.log("fiesmds.length1", data.filesmd5)
        //   console.log(data)
        conns['' + data.uid + ''] = conn;

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

    // let BoardDate = retunjson(data)
        let BoardDate = ReturnJosn.retunjson(data)
        switch (data.type) {
            // 用户名
            case 'setname':
                Mydata = data
                conn.nicname = data.nickname
                usernamepath = conn.nicname
                            
                firdensname = data.fridensname
                console.log(data.files)
                BoardDate.type = "setname"
                boardcast(BoardDate)
                break
            // 聊天文字信息
            case 'textsay':
                Chat.create({ username: conn.nicname, saytext:data.text, friend:data.fridensname })
                //广播出去
                BoardDate.type = "textsay"
                BoardDate.statacode = data.statacode
                boardcast(BoardDate)
                break
            case 'withdrawtex':
                BoardDate.type = "withdrawtex"
                BoardDate.statacode = data.statacode
                boardcast(BoardDate)
                break
        }

    })

    // conn.on("close", function () {
    //     boardcast({
    //         'nickname': data.nickname,
    //         'msg': '退出了聊天'
    //     })
    // })
    conn.on("error", function (err) {
        console.log(err)
    })

})


// 录音文件
app.post('/uploads', async function (req, res, next) {
        // 上传的
    let form =  await Setflie.fliespath('../public/mp3')
   
   // let BoardDate = retunjson(Mydata)
    let BoardDate = ReturnJosn.retunjson(Mydata)
    form.parse(req, (err, fields, files) => {
        if (err) {
            throw err;
        }
        //  console.log(fields, files)
        console.log(files)
        let path = files.file.path.split('public')[1]
        fs.readFile(files.file.path, (err, datas) => {
            console.log(datas.duration)
        })
        let names = path.split('mp3')[1]
        console.log(names)
        console.log("usernamepath", usernamepath)
        Chat.create({ username: usernamepath, saytext: dourls + path, friend: firdensname })
        BoardDate.urls = dourls + path
        BoardDate.type = 'mp3'
        boardcast(BoardDate)

    })
})






// 单图/文件上传
app.post('/upload', async function (req, res, next) {
    // console.log("usernamepath", firdensname)
    let form =  await Setflie.fliespath('../public')
    // console.log("fiesmds.length", fiesmds.length)
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
                Chat.create({ username: usernamepath, saytext: dourls + '/' + urls, fielsmd5: fiesmds, friend: firdensname })
                // 压缩图片格式为webbp
                let BoardDate = ReturnJosn.retunjson(Mydata)
                BoardDate.type = types
                BoardDate.fielst = fielst
                BoardDate.userselfname = usernamepath
                BoardDate.saytext = naes
                if (fielst == 0) {
                    //console.log("md5",md5)
                    webp.cwebp('../public/' + urls, '../public' + '/smale/' + urls + ".webp", "-q 80", function (status, error) {
                        BoardDate.imgurls = dourls + urls,
                            BoardDate.urls = dourls + '/smale/' + urls + '.webp',
                            boardcast(BoardDate)
                    });
                } else {
                    BoardDate.urls = dourls + '/' + urls
                    boardcast(BoardDate)
                }

            })

        } else {
            console.log(md5[0].dataValues.saytext)
            let a = md5[0].dataValues.saytext.split('.')
            console.log(a[a.length - 1])
            fiestype = a[a.length - 1]
            //文件类型判断
            let fielsts = await Judgment.judgment(fiestype)
            //返回的数据
            let BoardDate = ReturnJosn.retunjson(Mydata)
            // userselfname: usernamepath,
            BoardDate.urls = md5[0].dataValues.saytext
            BoardDate.saytext = a[a.length - 2] + '.' + fiestype
            BoardDate.type = fiestype
            BoardDate.fielst = fielsts
            boardcast(BoardDate)
        }
    } else {
        let BoardDate = retunjson(Mydata)
        BoardDate.saytext = "文件发送失败"
        BoardDate.type = "textsay"
        boardcast(BoardDate)
    }
});
// console.log(fies)
function boardcast(obj) {
    if (obj.bridge && obj.bridge.length == 2) {
        //  console.log("obj.bridge",obj.bridge)
        obj.bridge.forEach(item => {
            try {
                conns[item.toString()].sendText(JSON.stringify(obj));
            } catch (error) {
                console.log("对方不在线")
            }
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