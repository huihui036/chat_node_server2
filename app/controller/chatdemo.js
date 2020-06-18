const { Chat } = require('../module/chat')


class Chatunread {
    //查询未读
  async getmessage(ctx) {
    const userdata = ctx.params
    console.log(userdata);
      let unreadmessage = await Chat.unreaddata(userdata)
      console.log(unreadmessage)
      ctx.body = unreadmessage
    }

    async deletread(ctx) {
        const userdata = ctx.params
        console.log(userdata);
          let unreadmessage = await Chat.deletemassage(userdata)
          console.log(unreadmessage)
          ctx.body = unreadmessage
        }

}
module.exports = { Chatunread }