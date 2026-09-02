import fs from 'node:fs';
// docs/site-content.json is the owner-editable source of truth.
if(fs.existsSync('docs/site-content.json'))fs.copyFileSync('docs/site-content.json','public/site-content.json');

if(fs.existsSync('docs/images'))fs.cpSync('docs/images','public/images',{recursive:true});
