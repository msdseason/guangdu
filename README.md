# guangdu

光渡心理

# 心屿心理咨询 · guangdu 仓库部署版

直接复用原 Sites 网站的 React 页面、组件和 CSS，保留背景、配色、排版、字体设置、图片、桌面与手机布局、文章弹窗、FAQ 和日期选择。不是截图网站。照片已随站打包。

## 当前完成状态

展示站已构建，目标仓库为 https://github.com/msdseason/guangdu 。

GitHub Pages 启用并部署成功后的预期地址是 https://msdseason.github.io/guangdu/ ，目前尚未上线。预约后台也尚未部署。

`docs/` 是已构建、可以直接上线的网站。源码位于 `app/`、`components/`、`lib/`。`.github/workflows/pages.yml` 会将 `docs/` 发布到 GitHub Pages，无需在线安装依赖。

原网站使用操作系统字体。本版保留相同字体设置，因此同一设备上的布局保持一致，不同系统上的字形会像原站一样略有不同。

## 免费发布展示站

1. 打开已创建的公开仓库 `msdseason/guangdu`。
2. 上传本目录内容，包含 `docs/` 与 `.github/`。
3. 打开仓库 Settings → Pages → Source，选择 GitHub Actions。
4. 运行 Publish Xinyu website，等待成功后使用返回的 `github.io` 地址。

也可以只上传「静态网站部署包」中的文件到仓库根目录，在 Pages 中选择 Deploy from a branch → main → /(root)。

仓库和网站将公开，发布前请确认演示简介、收费等可对外展示。当前已保留示例标识。网站未包含令牌、预约记录、用户资料或原 Sites 账号配置。

## 预约功能

GitHub Pages 不运行后台。未配置 API 时，页面可以选择示例日期、时间、方式及填写昵称，但「预约尚未开放」按钮禁用，不会假装已保存。

`backend/` 提供与原预约流程兼容的 Cloudflare Workers + D1 后台，包括持久保存、时段唯一约束、并发冲突提示和取消。Cloudflare 免费计划有额度限制；此项目没有开通任何付费服务。

接通方法：

1. 在你自己的 Cloudflare 免费账号创建 D1 数据库 `xinyu-bookings`。
2. 复制 `backend/wrangler.example.jsonc` 为 `backend/wrangler.jsonc`，填入真实数据库 ID 与 GitHub Pages 的源（例如 `https://用户名.github.io`，不含仓库路径）。
3. 用 Wrangler 登录你的账号后，执行 `pnpm exec wrangler d1 migrations apply xinyu-bookings --remote --config backend/wrangler.jsonc`，再运行 `pnpm backend:deploy`。
4. 将部署返回的 Worker HTTPS 地址写入 `public/site-config.js` 与 `docs/site-config.js` 的 `apiBase`。
5. 重新发布即可启用原有保存、凭证下载和取消界面。

只将演示昵称写入后台，不用于正式心理咨询接待。真实服务资料、联系渠道和规则仍需完善。

## 本地修改

Node 22.13+，pnpm 11.19。安装依赖后运行 `pnpm dev`。修改后运行 `pnpm build`，将 `dist/` 的内容更新到 `docs/` 并提交。Pages 工作流发布的是已构建的 `docs/`，不会自动编译源码。

## 官方资料

- GitHub Pages：https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
- 使用限制：https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
- Workers 免费额度：https://developers.cloudflare.com/workers/platform/pricing/
- D1 免费额度：https://developers.cloudflare.com/d1/platform/pricing/

GitHub Pages 对主要用于促成商业交易的站点有限制；正式经营收费咨询预约应选择允许该用途的托管平台。
