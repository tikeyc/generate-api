# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个 OpenAPI/Swagger 文档代码生成工具，用于从 Swagger JSON 文档自动生成 TypeScript API 请求层代码。

## 核心架构

### 主要组件

- **generate-api.js**: 核心生成器，使用 Commander.js 处理命令行参数
- **config.js**: 配置文件，定义 Swagger 文档来源（本地文件或远程 URL）
- **middleware.example.js**: 中间件系统，用于自定义生成代码的模块名和函数名

### 代码生成流程

1. 从本地文件或远程 URL 读取 OpenAPI/Swagger JSON
2. 解析 `components.schemas` 生成 TypeScript 接口定义（.d.ts）
3. 解析 `paths` 生成 API 请求函数（.ts）
4. 通过中间件处理模块名和函数名（特别处理中文标签）

### 命名规则

- **模块名**: 默认从 path 的第二段提取，或使用 tag（中文 tag 会通过中间件转换）
- **函数名**: 默认使用 `operationId`，可通过中间件自定义
- **中文处理**: 中间件会检测中文 tag 并从 path 中提取英文模块名

## 常用命令

### 生成 API 代码

```bash
# 在 generate-api 目录下执行
cd generate-api
node generate-api.js

# 使用命令行参数覆盖配置
node generate-api.js -u http://example.com/api-docs -n index -m ./middleware.example.js

# 使用本地文件
node generate-api.js -f test-api-docs.json -n myapi
```

### 命令行选项

- `-f, --apifile`: 本地 API JSON 文件路径
- `-u, --url`: 远程 API JSON 文档 URL（通常是 `/v3/api-docs`）
- `-n, --name`: 输出文件名（默认 `index`），生成 `<name>.d.ts` 和 `<name>.ts`
- `-m, --middleware`: 中间件文件路径

## 生成的文件

- **`<name>.d.ts`**: TypeScript 接口定义，从 `components.schemas` 生成
- **`<name>.ts`**: API 请求函数，按模块分组导出
- **`middleware.example.js`**: 自动复制到执行目录（如果不存在）

## 中间件开发

中间件函数接收以下参数：

```javascript
{
  operationId,  // Controller 方法名
  description,  // 接口描述
  path,         // 原始 path，如 "/system/roleManage/deleteRole"
  method,       // HTTP 方法
  tag           // 文档标签
}
```

返回值：

```javascript
{
  moduleName,    // 生成的模块名
  functionName   // 生成的函数名（空字符串表示使用默认 operationId）
}
```

## 类型映射

OpenAPI 类型到 TypeScript 类型的映射：

- `string` → `string`
- `number` / `integer` → `number`
- `boolean` → `boolean`
- `array` → `any[]` 或 `<ItemType>[]`
- `object` → `any`
- `$ref` → 引用的接口名

## 注意事项

- 配置文件中 `apifile` 优先级高于 `url`
- 生成的代码依赖 `nitropack` 的类型定义和 `$useMyRequest` 请求函数
- 中间件会自动处理中文标签，将其转换为英文模块名
- Path 参数使用模板字符串替换：`{id}` → `${params.id}`
