# NodeGet Minecraft Theme

一个带有 Minecraft 像素方块风格的 NodeGet 公开探针主题。

本仓库面向 NodeGet 主题分发服务使用：构建后的静态文件会同步到 `docs/`，可以直接用 jsDelivr、GitHub Pages 或任意支持 CORS 的静态服务器分发。

## 开发

```bash
npm install
npm run dev
```

## 构建静态分发版

```bash
npm run build:distribution
```

构建完成后会生成：

- `dist/`：本次构建产物。
- `dist/NodeGet-Theme-MC.zip`：本地可下载的主题压缩包。
- `docs/`：可提交到仓库并用于静态分发的目录，不包含 zip。

`docs/` 内包含 NodeGet 规范主题需要的关键文件：

- `nodeget-theme.json`
- `nodeget-theme-files.json`
- `config.json`
- `custom.css`
- `custom.js`
- `assets/` 和其他静态资源

## 推荐导入方式

推送仓库后，直接使用 jsDelivr 分发 `docs/` 目录，不需要 Cloudflare Pages，也不需要 GitHub Pages：

```text
https://dash.nodeget.com/#/dashboard/theme-management?add=https://cdn.jsdelivr.net/gh/3257085208/NodeGet-Theme-MC@main/docs
```

不要把 GitHub 仓库页面地址填进面板，例如不要使用 `https://github.com/3257085208/NodeGet-Theme-MC`。仓库页面返回的是 HTML，面板按 JSON 解析时会报 `Unexpected token '<'`。

也可以先在浏览器打开下面两个地址确认返回 JSON：

```text
https://cdn.jsdelivr.net/gh/3257085208/NodeGet-Theme-MC@main/docs/nodeget-theme.json
https://cdn.jsdelivr.net/gh/3257085208/NodeGet-Theme-MC@main/docs/nodeget-theme-files.json
```

## GitHub Pages 分发

1. 运行 `npm run build:distribution`。
2. 提交并推送 `docs/`。
3. 在 GitHub 仓库 `Settings -> Pages` 中选择 `Deploy from a branch`。
4. Branch 选择 `main`，目录选择 `/docs`。
5. 分发地址为 `https://3257085208.github.io/NodeGet-Theme-MC/`。

控制面板快捷导入地址：

```text
https://dash.nodeget.com/#/dashboard/theme-management?add=https://3257085208.github.io/NodeGet-Theme-MC/
```

## 其他静态服务器

也可以把 `docs/` 上传到 nginx、对象存储、VPS 静态目录或其他静态托管服务。

需要满足 NodeGet 分发要求：

- 可以公开访问 `nodeget-theme.json` 和 `nodeget-theme-files.json`。
- 静态服务器开启 CORS 跨域访问。
- 建议支持 IPv4/IPv6 双栈访问。

nginx 可参考：

```nginx
location / {
  add_header Access-Control-Allow-Origin * always;
  add_header Access-Control-Allow-Methods "GET, OPTIONS" always;
  add_header Access-Control-Allow-Headers "*" always;
  try_files $uri $uri/ /index.html;
}
```

## 配置说明

`config.json` 由构建脚本生成。分发给用户后，NodeGet 控制面板会按主题规范读取文件列表并生成对应配置。

如果手动部署静态文件，可以修改 `config.json` 里的 `site_tokens` 和 `user_preferences` 后再上传。
