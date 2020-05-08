var qr = require('qr-image');
 
const Router = require('koa-router')

var router = new Router({
 
});

// 生成二维码
router.get('/getqr/:username', async (ctx,next) => {
    const path = ctx.params
    try {
        var img = qr.image(`http:127.0.0.1/getaddu/${path.username}`,{size :10});
        ctx.type= 'image/png';
        ctx.body = img;

    } catch (e) {
        ctx.type='text/html;charset=utf-8';
        ctx.body='<h1>414 Request-URI Too Large</h1>';
    }

  
  })


  router.post('/getuser/:username', async (ctx,next) => {
   
    ctx.body= {name:"adduser"}
  

  
  })
  
module.exports = { router }