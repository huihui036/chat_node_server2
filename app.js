const Koa = require('koa')
var cors = require('koa-cors');
const app = new Koa()



app.use(cors({
    origin:"*"
}));

app.use(async (ctx, next) => {
	console.log(`Process ${ ctx.request.method } , ${ ctx.request.url }...`);
	await next();
});

//静态资源
const staticFiles = require('koa-static')
const path = require('path')

const paraser = require('koa-bodyparser')
const InitManager = require('./core/init')

app.use(paraser())
 require('./app/module/emoji')
InitManager.initCore(app)

// 指定 public目录为静态资源目录，存放 images
app.use(staticFiles(path.resolve(__dirname, "./public")))

app.listen(3001)