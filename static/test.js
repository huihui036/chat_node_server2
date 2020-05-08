const ws = require("nodejs-websocket");

const server = ws.createServer(function(conn){
    console.log("启动服务器连接")

    conn.on("text",function(str){
        console.log("接收前端发送过来的数据："+str)
        data = JSON.parse(str)
       // let info = str
       switch(data.type){
           case 'setname':
               conn.nicname = data.name
               broadcast(data.name+"加入了")
               break
           case 'textsay':
               broadcast(conn.nicname + `:${data.text}`)
               break
           
       }
        console.log(str)
        // 推送回前端
        // broadcast(str)

    })

    conn.on("close",function(){
        broadcast(conn.nicname+"离开了房间")
    })

    conn.on("error",function(err){
        console.log(err)

    })
 

})

const broadcast = (str) => {
    console.log('broadcast',str)
    server.connections.forEach(function(conn) {
      conn.sendText(str)
    })
  }

// server.listen(3002)
