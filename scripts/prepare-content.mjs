import fs from 'node:fs';
import crypto from 'node:crypto';
const path='docs/site-content.json';
const raw=fs.readFileSync(path,'utf8');
if(Buffer.byteLength(raw)>20*1024*1024)throw Error('网站内容文件超过 20 MB');
const content=JSON.parse(raw);
function extract(value){
 if(Array.isArray(value))return value.map(extract);
 if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,extract(v)]));
 if(typeof value==='string'){
  const match=value.match(/^data:image\/(png|jpeg|webp|gif|avif);base64,([A-Za-z0-9+/=]+)$/);
  if(match){const bytes=Buffer.from(match[2],'base64');const filename='upload-'+crypto.createHash('sha256').update(bytes).digest('hex').slice(0,20)+'.'+match[1];fs.mkdirSync('docs/images',{recursive:true});fs.writeFileSync('docs/images/'+filename,bytes);return './images/'+filename;}
 }
 return value;
}
fs.writeFileSync(path,JSON.stringify(extract(content),null,2)+'\n');
