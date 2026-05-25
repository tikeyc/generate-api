# 生成api文件

## 配置

`config.js`

```js
/**
 * 配置文件
 * apifile和url：swagger文档json， 二选一（apifile优先级最高）
 * name: 输出文件名称， 默认为 index. 生成文件为 <name>.d.ts, <name>.ts
 * middleware: 中间件文件路径， 用于修改生成代码的模块名称和函数名称
 */
export default {
  apifile: 'test-api-docs.json', // 本地文件test-api-docs.json
  // url: 'http://192.168.1.81:9080/gate/swagger/login/swagger/api-docs', // 远程文档json链接
  name: '',
  middleware: './middleware.example.js'
}
```

`middleware.example.js`

```js
// TODO: 这个是中间件范式， 默认模块名取值path第二个值， 方法名取值operationId. 接口文档不满足业务时可以在此重新处理
// TODO: openapi-typescript-cli -m ./middleware.js
/**
 * @param {
 * operationId: 通常是 controller 的方法名
 * description: 接口描述
 * path: 接口文档的原生 path， 可以通过正则表达式处理取值
 * method: http method
 * tag: 文档标签， 这个作为模块名是比较严谨的， 但国内很多后端会把这块写成中文， 可以替换成英文使用
 * }  
 * @returns  {
 * moduleName: 生成的接口模块名
 * functionName: 生成接口的调用方法名， 默认取值 operationId
 * }
 */
const isChinese = str => {
  // 正则判断是否包含中文字符（包括基本汉字和扩展区）
  return /[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/.test(str)
}

// eslint-disable-next-line no-unused-vars
export default function({ operationId, description, path, method, tag }) {
  // path: "/system/roleManage/deleteRole" # /业务名/模块名/函数名称
  let moduleName = tag
  if (isChinese(tag)) {
    let [path1, path2] = path.replace('/', '').split('/')
    // 首字母大写
    path1 = path1.replace(/^./, path1[0].toUpperCase())
    path2 = path2.replace(/^./, path2[0].toUpperCase())
    moduleName = `${path1}${path2}`
  }
  return {
    moduleName,
    functionName: ''
  }
}
```

## 执行脚本会在当前目录生成api文件，默认index.ts和index.d.ts，可配置

```js
进入项目目录
cd ./script/generate-api
执行
node ./generate-api.js
```

或在任意目录下执行

```js
pnpm generate:api
```

## 覆盖config配置执行脚本示例

```js
node ./generate-api.js -u [文档json连接] -n [生成文件名] -m [中间件(配置生成的代码的模块名和函数名)]
比如：
node ./generate-api.js -u http://192.168.1.81:9080/test/msg/swagger/api-docs -n index -m ./middleware.example.js
```
