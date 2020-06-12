var qr = require('qr-image');
class Qrimage {
  async  getqrimage(ctx) {
    const userdata = ctx.params

       console.log(userdata)
        try {
            var img = qr.image(`{"emali":"${userdata.email}","user":"${userdata.username}"}`, { size: 10 });
            ctx.type = 'image/png';
            ctx.body = img;

        } catch (e) {
            ctx.type = 'text/html;charset=utf-8';
            ctx.body = '<h1>414 Request-URI Too Large</h1>';
        }

    }
}
module.exports = { Qrimage }