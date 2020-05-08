const squelize = require('sequelize')
const {
  daname,
  user,
  host,
  port,
  passdord,
} = require("../../config/config").dbdata
console.log( user,host,)
var sequelize = new squelize(daname, user, passdord, {
  'dialect': 'mysql',  // 数据库使用mysql 
  'host': host, // 数据库服务器ip  
  'port': port,        // 数据库服务器端口  
  loggin: true,
  charset: "utf8mb4",
  timezone: '+08:00',
  define: {
    timestamps: true,
    tableName: 'user',
    // 如果需要sequelize帮你维护createdAt,updatedAt和deletedAt必须先启用timestamps功能
    timestamps: true,
    // 将createdAt对应到数据库的created_at字段
    createdAt: 'created_at',
    // 将updatedAt对应到数据库的updated_at字段
    updatedAt: 'updated_at',
    underscored: true
  },


})
sequelize.sync({
  // force: true  // 启动清空数据库
})

module.exports = { sequelize }