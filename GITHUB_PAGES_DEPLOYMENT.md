# GitHub Pages 部署指南

本文档详细说明如何将 AnonVote 项目部署到 GitHub Pages。

## 自动部署 (推荐)

### 1. 启用 GitHub Pages

1. 在 GitHub 仓库中，进入 **Settings** → **Pages**
2. 在 **Source** 部分选择 **GitHub Actions**
3. 保存设置

### 2. 自动构建和部署

项目已配置了 GitHub Actions 工作流 (`.github/workflows/deploy-github-pages.yml`)，它会：

- **自动检测仓库类型**：
  - 如果仓库名为 `username.github.io`：设置 basePath 为空
  - 如果是项目仓库：设置 basePath 为 `/仓库名`
- **自动构建**：安装依赖并构建前端应用
- **自动部署**：将构建结果部署到 GitHub Pages

### 3. 触发部署

推送代码到 `main` 或 `master` 分支即可自动触发部署：

```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

## 手动部署

如果需要手动部署，可以使用以下命令：

### 本地构建

```bash
# 安装依赖
npm run install:all

# 构建前端 (自动检测 basePath)
npm run frontend:build:github-pages

# 构建结果在 frontend/dist/ 目录
```

### 自定义 basePath

如果需要自定义 basePath：

```bash
# 设置自定义 basePath 并构建
cd frontend
npm run build:github-pages --base-path=/your-custom-path
```

## 部署后访问

部署完成后，可以通过以下 URL 访问：

- **用户/组织站点**: `https://username.github.io`
- **项目站点**: `https://username.github.io/repository-name`

## 配置说明

### GitHub Actions 工作流特性

1. **智能 basePath 检测**：
   ```yaml
   # 自动判断仓库类型并设置正确的 basePath
   if [[ "$REPO_ONLY" == "$REPO_OWNER.github.io" ]]; then
     echo "base-path=" >> $GITHUB_OUTPUT
   else
     echo "base-path=/$REPO_ONLY" >> $GITHUB_OUTPUT
   fi
   ```

2. **优化的构建配置**：
   - 代码分割优化
   - 静态资源处理
   - 禁用 Jekyll 处理

3. **安全的权限设置**：
   - 只在主分支部署
   - 使用官方 GitHub Actions
   - 最小权限原则

### Vite 配置

- **动态 base 路径**：通过环境变量 `VITE_BASE_PATH` 设置
- **构建优化**：代码分割、资源优化
- **兼容性**：支持现代浏览器和旧版本

## 故障排除

### 1. 部署失败

检查 GitHub Actions 日志：
1. 进入仓库的 **Actions** 标签
2. 查看失败的工作流
3. 检查具体的错误信息

### 2. 页面显示 404

- 确认 GitHub Pages 已启用
- 检查 basePath 设置是否正确
- 确认构建产物在正确的目录

### 3. 静态资源加载失败

- 检查 `.nojekyll` 文件是否存在
- 确认 Vite 的 base 配置正确
- 检查相对路径是否正确

### 4. 路由问题

对于单页应用 (SPA)，可能需要配置重定向：

1. 在 `frontend/public/` 目录创建 `_redirects` 文件：
   ```
   /*    /index.html   200
   ```

2. 或者创建 `404.html` 文件重定向到主页

## 自定义域名

如需使用自定义域名：

1. 在 `frontend/public/` 目录创建 `CNAME` 文件
2. 文件内容为你的域名，如：`vote.yourdomain.com`
3. 在域名服务商处设置 DNS 记录

## 环境变量

如需在 GitHub Pages 中使用环境变量，可以在 GitHub Actions 中设置：

```yaml
env:
  VITE_API_URL: ${{ secrets.VITE_API_URL }}
  VITE_CONTRACT_ADDRESS: ${{ secrets.VITE_CONTRACT_ADDRESS }}
```

然后在 GitHub 仓库设置中添加相应的 Secrets。
