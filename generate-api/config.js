/**
 * 配置文件
 * apifile和url：swagger文档json， 二选一（apifile优先级最高）
 * name: 输出文件名称， 默认为 index. 生成文件为 <name>.d.ts, <name>.ts
 * middleware: 中间件文件路径， 用于修改生成代码的模块名称和函数名称
 */
export default {
  // apifile: 'test-api-docs.json', // 本地文件test-api-docs.json
  url: 'http://192.168.1.81:9080/gate/swagger/msg/swagger/api-docs', // 远程文档json链接
  name: '',
  middleware: './middleware.example.js'
}