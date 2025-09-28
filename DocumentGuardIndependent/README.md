# 文稿卫士独立项目

这是文稿卫士(Document Guard)的独立项目版本，可以与原项目完全分离运行。

## 目录结构
- `backend/`: 后端服务代码
  - `server.js`: Express服务器实现
  - `package.json`: 项目依赖和脚本
  - `Dockerfile`: Docker容器配置
- `frontend/`: 前端界面代码
  - `document_guard.html`: 主界面文件
  - `loadToolConfig.js`: 配置加载脚本
  - `toolConfig.txt`: 用户可编辑的配置文件

## 运行方法

### 前端运行
1. 进入frontend目录
2. 使用任何静态文件服务器运行前端，例如：
   ```
   npx http-server . -p 8080 --cors
   ```
3. 浏览器访问 http://localhost:8080/document_guard.html

### 后端运行
方式一：直接运行
1. 进入backend目录
2. 安装依赖：`npm install`
3. 启动服务：`npm start`

方式二：Docker运行
1. 进入backend目录
2. 构建镜像：`docker build -t document-guard .`
3. 运行容器：`docker run -p 3000:3000 document-guard`

## 配置说明
- 前端配置文件：`frontend/toolConfig.txt`
- 可配置后端服务地址、前端URL等参数