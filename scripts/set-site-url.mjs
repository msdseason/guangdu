import fs from 'node:fs';
const value=process.argv[2]||process.env.SITE_URL;
if(!value)throw Error('请提供实际部署 URL');
const u=new URL(value);if(u.protocol!=='https:')throw Error('部署 URL 必须是 HTTPS');
const base=u.href.endsWith('/')?u.href:u.href+'/';
const escape=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
const html=fs.readFileSync('docs/index.html','utf8');
const clean=html.replace(/<meta[^>]+(?:property="og:image"|name="twitter:image"|property="og:url")[^>]*>/g,'');
fs.writeFileSync('docs/index.html',clean.replace('</head>',`<meta property="og:image" content="${escape(new URL('og.png',base).href)}"/><meta name="twitter:image" content="${escape(new URL('og.png',base).href)}"/><meta property="og:url" content="${escape(base)}"/></head>`));
