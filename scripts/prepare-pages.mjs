import fs from 'node:fs';
// Keep uploaded owner assets; only replace generated asset bundles.
fs.rmSync('docs/assets',{force:true,recursive:true});
fs.cpSync('dist','docs',{recursive:true});
fs.writeFileSync('docs/.nojekyll','');
await import('./prepare-content.mjs');
await import('./set-site-url.mjs');
