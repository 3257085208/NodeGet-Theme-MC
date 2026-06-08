# NodeGet Minecraft Theme

一个带有 Minecraft 像素方块风格的 NodeGet 公开探针主题。

本仓库用于上传到 GitHub 后，由 Cloudflare Pages 自动构建并作为 NodeGet 主题分发站点使用。NodeGet 后台导入时填写的是 Cloudflare Pages 的页面地址，不是 GitHub 仓库地址。

## 本地开发

```bash
npm install
npm run dev
```

## 本地构建

```bash
npm run build
```

构建后会生成 `dist/`，其中包含 NodeGet 规范主题需要的文件：

- `nodeget-theme.json`
- `nodeget-theme-files.json`
- `config.json`
- `custom.css`
- `custom.js`
- `assets/` 和其他静态资源
- `NodeGet-Theme-MC.zip`

## Cloudflare Pages 部署

1. 把本仓库推送到 GitHub。
2. 在 Cloudflare Pages 创建项目，连接这个 GitHub 仓库。
3. 构建命令填写：`npm run build`
4. 输出目录填写：`dist`
5. Node.js 版本建议设置为 `22`，至少需要 `20.19+`。
6. 部署完成后得到类似 `https://nodeget-theme-mc.pages.dev` 的 Pages 域名。

如果 Cloudflare Pages 项目名不是 `nodeget-theme-mc`，请同步修改 `nodeget-theme.json` 里的 `dist_page`。

## NodeGet 后台导入

导入地址填写 Cloudflare Pages 站点根地址，例如：

```text
https://nodeget-theme-mc.pages.dev
```

快捷导入链接示例：

```text
https://dash.nodeget.com/#/dashboard/theme-management?add=https://nodeget-theme-mc.pages.dev
```

导入前可以先打开下面两个地址确认返回 JSON：

```text
https://nodeget-theme-mc.pages.dev/nodeget-theme.json
https://nodeget-theme-mc.pages.dev/nodeget-theme-files.json
```

如果看到 HTML，或者后台提示 `Unexpected token '<'`，说明后台请求 JSON 时拿到了页面 HTML，常见原因是：

- 填了 GitHub 仓库页面地址。
- Cloudflare Pages 还没有部署成功。
- Pages 输出目录没有设置为 `dist`。
- 访问的是 Pages 404 页面，而不是 `nodeget-theme.json`。
- Cloudflare Pages 没有重新部署最新提交，旧版本缺少 `nodeget-theme-files.json`。

## 配置说明

`config.json` 会在构建时生成。Cloudflare Pages 可设置环境变量 `NODEGET_CONFIG` 覆盖默认配置；也可以在 NodeGet 后台导入主题后按面板生成配置。
