import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import tailwind from '@tailwindcss/postcss';
import {fileURLToPath} from 'node:url';
export default defineConfig({base:'./',plugins:[react()],resolve:{alias:{'@':fileURLToPath(new URL('.',import.meta.url))}},css:{postcss:{plugins:[tailwind()]}},server:{host:'127.0.0.1',port:4173,strictPort:true,watch:{useFsEvents:false,usePolling:true}},build:{outDir:'dist',emptyOutDir:true,rollupOptions:{input:{main:fileURLToPath(new URL('./index.html',import.meta.url)),editor:fileURLToPath(new URL('./editor.html',import.meta.url)),article:fileURLToPath(new URL('./article.html',import.meta.url))}}}});
