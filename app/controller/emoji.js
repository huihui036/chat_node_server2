const fs = require('fs')

// 只执行一次

/*
// 读取表情包文件方法
async function getdatas(){
    var file = 'static/format.json'
    let jsonData = {}
  await new Promise((resolve, reject) => {
    fs.readFile(file, 'utf-8', (err, data) => {
      if (err) {
        ctx.throw(err)
      } else {
        jsonData = data
        resolve()
      }

    });
  })
  //let jsonDatas = JSON.parse(jsonData)
  return jsonData
}
// 表情包保存到数据
router.get('/emo',async (ctx,next)=>{
    const data= await getdatas()
   let a= JSON.parse(data)
    ctx.body=a.data
    a.data.forEach(element => {
    element.index = element.id;
     delete element.id
     Emoji.create(element)
    });
})

*/

