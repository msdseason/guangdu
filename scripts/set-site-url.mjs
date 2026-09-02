import fs from 'node:fs';
const value=process.argv[2]||process.env.SITE_URL||'https://msdseason.github.io/guangdu/';
const u=new URL(value);if(u.protocol!=='https:')throw Error('部署 URL 必须是 HTTPS');
const base=u.href.endsWith('/')?u.href:u.href+'/';
const c=JSON.parse(fs.readFileSync('docs/site-content.json','utf8'));
const words={品牌:c.品牌.名称,简称:c.品牌.简称,咨询师:c.品牌.咨询师,年份:c.品牌.年份,价格:c.服务.价格,时长:c.服务.时长,币种:c.服务.币种};
const format=s=>s.replace(/\{([^{}]+)\}/g,(m,k)=>words[k]??m);
const escape=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
let html=fs.readFileSync('docs/index.html','utf8');
html=html.replace(/<title>.*?<\/title>/s,`<title>${escape(format(c.品牌.网站标题))}</title>`)
 .replace(/<meta[^>]+(?:name="(?:description|theme-color|twitter:image)"|property="og:(?:title|description|image|url)")[^>]*>/g,'')
 .replace(/<link[^>]+rel="icon"[^>]*>/g,'');
const social=new URL(c.品牌.分享图片,base);if(!['http:','https:'].includes(social.protocol))throw Error('分享图片需要是图片文件或 HTTPS 图片网址');
const favicon=new URL(c.品牌.网站图标||'./favicon.svg',base);if(!['http:','https:'].includes(favicon.protocol))throw Error('网站图标地址无效');
const meta=`<meta name="description" content="${escape(format(c.品牌.网站描述))}"/><meta name="theme-color" content="${escape(c.外观.主要颜色.页面背景)}"/><meta property="og:title" content="${escape(format(c.品牌.网站标题))}"/><meta property="og:description" content="${escape(format(c.品牌.网站描述))}"/><meta property="og:image" content="${escape(social.href)}"/><meta name="twitter:image" content="${escape(social.href)}"/><meta property="og:url" content="${escape(base)}"/><link rel="icon" href="${escape(favicon.href)}"/>`;
fs.writeFileSync('docs/index.html',html.replace('</head>',meta+'</head>'));
