# 光渡心理 · 咨询师时隐

保留原网站的米白与鼠尾草绿配色、拱形图片、排版和手机布局，提供完整源文件与中文编辑器。

## 在哪里修改

网站发布成功后：

- 网站：https://msdseason.github.io/guangdu/
- 中文编辑页：https://msdseason.github.io/guangdu/editor.html
- 内容文件：`docs/site-content.json`

编辑页可以修改品牌、姓名、简介、全部文章正文、流程、价格、时长、常见问题、按钮、图片、示例档期、页脚、颜色、字体和布局参数。文章、FAQ、导航和流程可以增删排序；页面版块可以隐藏和排序。进一步的布局调整可以写入“外观 → 自定义样式”，全部 React 和 CSS 源文件也可编辑。

品牌名称改为“光渡心理”，咨询师改为“时隐”。网站中的资质、服务与收费说明仍为示例，未填入未经确认的个人经历。

## 修改并免费发布

1. 打开编辑页，用中文表单修改内容，右侧可切换电脑和手机预览。
2. 点击“导出修改”，保存 `site-content.json`。
3. 登录 GitHub，打开 https://github.com/msdseason/guangdu/upload/main/docs ，上传导出的文件并提交更改。
4. Pages 已开启时，工作流会自动发布。完成后刷新网站即可。

编辑页是公开的本地预览工具：任何人可以尝试编辑自己的预览，但只有拥有 GitHub 仓库写入权限的人能够发布。编辑页不索要密码、令牌，不会从浏览器直接写入 GitHub。导出后仍需上传；它不代表网站已经保存或发布。离开前请导出需要保留的修改。

图片可以填写相对路径、HTTPS 图片网址，或点击“选择图片”。本地图片会包含在导出的内容文件中；发布流程会将它们转换为图片文件，分享卡片也能使用。单图上限 3 MB，内容文件上限 20 MB。SVG 图标请通过仓库上传后填写路径。

`{品牌}`、`{简称}`、`{咨询师}`、`{价格}`、`{时长}`、`{币种}`、`{年份}` 会自动引用设置。例如只修改“服务 → 价格”，预约侧栏和收费区会一起更新。分享图片中的文字是图片本身，更换品牌时也需更换分享图片。

## 首次开启 GitHub Pages

仓库 Settings → Pages → Build and deployment → Source 选择 GitHub Actions。
然后在 Actions 中运行 `Publish Guangdu website`，或提交一次更改。只有部署成功后，上方网址才可访问。

## 预约后台

GitHub Pages 只托管网页。未配置后台时，只展示示例档期，提交按钮禁用，不会假装保存预约。品牌改名或编辑页面不会自动开通真实咨询。

`backend/` 是独立的 Cloudflare Workers + D1 预约服务，支持持久保存、时段唯一约束和取消。接通步骤：

1. 创建 D1 数据库，复制 `backend/wrangler.example.jsonc` 为 `backend/wrangler.jsonc`，填写数据库 ID 和允许的源 `https://msdseason.github.io`。
2. 将最新 `docs/site-content.json` 同步到 `public/site-content.json`。后台使用其中的档期配置；线上已有后台时，修改正式档期需要重新部署后台。
3. 登录自己的 Cloudflare 账号，应用数据库迁移并部署 Worker。
4. 在中文编辑页“预约服务 → 接口地址”填入 Worker 的 HTTPS 地址，导出并发布。

后台配置范例和数据库名称中的内部标识 `xinyu` 保留兼容，不会在网页显示。后台尚未部署，也没有开通付费服务。正式收费咨询需选择符合平台用途条款的托管方案，并补充真实服务资料和规则。

## 源文件与本地开发

- `docs/site-content.json`：日常内容的主要编辑文件。
- `public/site-content.json`：构建与后台使用的内容副本。
- `app/`：页面、编辑器与样式。
- `lib/`：配置读取、验证、预览和预约逻辑。
- `docs/`：可直接部署的完整网页。
- `backend/`：独立预约后台与数据库迁移。

使用 Node 22.13+、pnpm 11.19。安装依赖后 `pnpm dev`，打开 `/editor.html`。`pnpm build` 会先同步日常内容，构建网站和编辑器，更新 `docs/` 并准备分享信息。修改源码后，应一并提交更新后的 `docs/`；Pages 工作流发布的是 `docs/`，不在线安装构建依赖。

只编辑内容时，可直接更新 `docs/site-content.json`，不需要重新编译。切勿只修改 `public/site-content.json` 后直接发布，因为日常内容以 `docs/` 中的版本为准。

## 官方资料

- GitHub Pages：https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
- Pages 使用限制：https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
- Workers 免费额度：https://developers.cloudflare.com/workers/platform/pricing/
- D1 免费额度：https://developers.cloudflare.com/d1/platform/pricing/
