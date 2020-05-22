const Koa = require('koa'); 
const app = new Koa();
var cors = require('koa-cors');


// 导入聊天服务模块--路由
const {router} = require('./router/index')

// //设置允许跨域访问该服务.
app.use(cors({
    origin:"*"
}));


//聊天服务模块
const {server} = require('./websoket')

// 路由模块
app.use(router.routes())


server.listen(3002)
app.listen(3006); 