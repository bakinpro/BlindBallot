# Vercel 部署指南

## 快速部署步骤

### 1. 准备工作
确保你有 Vercel 账号，如果没有请先注册：https://vercel.com

### 2. 安装 Vercel CLI（可选）
```bash
npm install -g vercel
```

### 3. 部署方式一：通过 Vercel Dashboard
1. 登录 Vercel Dashboard
2. 点击 "New Project"
3. 导入你的 GitHub 仓库（需要先推送到 GitHub）
4. 选择 `frontend` 目录作为根目录
5. 设置构建命令：`npm run build`
6. 设置输出目录：`dist`
7. 添加环境变量：
   - `VITE_CONTRACT_ADDRESS` = `0x0992a8c1EAe55332545f229fcc19177Fee04CC32`
   - `VITE_NETWORK` = `sepolia`

### 4. 部署方式二：通过 CLI
```bash
cd frontend
vercel --prod
```

### 5. 配置说明

#### vercel.json 配置
- 已配置 SPA 路由重定向
- 静态资源缓存优化
- 环境变量预设

#### 环境变量
生产环境变量已设置在 `.env.production` 中：
- 合约地址：`0x0992a8c1EAe55332545f229fcc19177Fee04CC32`
- 网络：Sepolia 测试网

### 6. 构建测试
在部署前可以本地测试构建：
```bash
cd frontend
npm run build
npm run preview
```

### 7. 自动部署
连接 GitHub 后，每次推送到主分支会自动触发部署。

## 注意事项
- 确保 Web3 钱包连接正常
- Sepolia 网络配置正确
- 合约地址与网络匹配

## 问题排查
如果部署失败，检查：
1. 构建日志中的错误信息
2. 环境变量是否正确设置
3. 依赖是否完整安装
