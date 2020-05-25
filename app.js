const Koa = require('koa')
var cors = require('koa-cors');
const app = new Koa()

//聊天服务模块
const {server} = require('./webscoket/websocket')
const Middlewares = require('./middlewares/exception')
app.use(cors({
    origin:"*"
}));

app.use(async (ctx, next) => {
	console.log(`Process ${ ctx.request.method } , ${ ctx.request.url }...`);
	await next();
});

app.use(Middlewares)

//静态资源
const staticFiles = require('koa-static')
const path = require('path')

const paraser = require('koa-bodyparser')
const InitManager = require('./core/init')

app.use(paraser())
//require('./app/module/emoji')
InitManager.initCore(app)

// 指定 public目录为静态资源目录，存放 images
app.use(staticFiles(path.resolve(__dirname, "./public")))





server.listen(3002)
app.listen(3001)