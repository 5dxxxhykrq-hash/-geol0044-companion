# GEOL0044 Companion：GitHub Pages 部署说明

这个文件夹已经是可直接发布的纯静态网站，不需要安装 Node.js，也不需要执行构建命令。

## 第一次发布

1. 登录 GitHub，创建一个 **Public** repository，建议命名为 `geol0044-companion`。
2. 不要勾选自动生成 README、`.gitignore` 或 License。
3. 把本压缩包中的所有文件上传到仓库根目录；不要把外层文件夹本身套进去。
4. 打开仓库的 **Settings → Pages**。
5. 在 **Build and deployment** 下选择：
   - Source：`Deploy from a branch`
   - Branch：`main`
   - Folder：`/(root)`
6. 点击 **Save**。通常数分钟后，网站地址会显示在 Pages 页面顶部。

默认地址通常是：

`https://你的GitHub用户名.github.io/geol0044-companion/`

## 绑定独立域名（可选）

1. 在 GitHub Pages 的 **Custom domain** 中填写你的域名，例如 `geol0044.example.com`。
2. 如果使用子域名，在 Cloudflare DNS 新建 CNAME：
   - Name：`geol0044`
   - Target：`你的GitHub用户名.github.io`
3. 初次验证时建议先将 Cloudflare 的 Proxy status 设为 **DNS only**（灰云）。
4. 等 GitHub 验证成功并签发证书后，勾选 **Enforce HTTPS**。
5. 稳定访问后再决定是否启用 Cloudflare 代理；如果再次触发安全拦截，可继续保持 DNS only。

注意：只给原来的 `chatgpt.site` 地址套一层自定义域名并不能可靠解决问题。网站文件必须实际部署到 GitHub Pages、Cloudflare Pages 或其他独立主机。

## 文件说明

- `index.html`：网站正文与结构
- `styles.css`：排版和响应式样式
- `app.js`：搜索、目录与交互功能
- `guide.md`：可下载的 Markdown 完整指南
- `.nojekyll`：让 GitHub Pages 原样发布静态文件

