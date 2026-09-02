import {createContext,useContext,useEffect,useState,type ReactNode} from 'react';
import defaults from '../public/site-content.json';
import {upgradeContent,previewMode} from './content-upgrade';

export type SiteContent=typeof defaults;
export const defaultContent:SiteContent=defaults;
export const sectionNames=['首屏','引言','咨询师简介','预约','心理学分享','流程与收费','常见问题','结尾'];

export function validateContent(value:unknown):SiteContent {
  value=upgradeContent(value,defaults.心理学分享.文章);
  function check(input:unknown,template:unknown,path:string):void {
    if(Array.isArray(template)){
      if(!Array.isArray(input)||input.length>100)throw Error(`${path}需要是列表，最多 100 项。`);
      input.forEach((item,i)=>check(item,template[0],`${path}.${i+1}`));
    }else if(template!==null&&typeof template==='object'){
      if(!input||typeof input!=='object'||Array.isArray(input))throw Error(`${path}格式不正确。`);
      for(const [key,item] of Object.entries(template))check((input as Record<string,unknown>)[key],item,`${path}.${key}`);
      for(const key of Object.keys(input))if(!Object.hasOwn(template,key))throw Error(`${path}.${key}是未知字段。`);
    }else if(typeof input!==typeof template)throw Error(`${path}需要是${typeof template==='boolean'?'开关':'文字'}。`);
  }
  check(value,defaults,'网站');
  const config=value as SiteContent;
  const ids=config.心理学分享.文章.map(a=>a.链接标识);
  if(ids.some(id=>! /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,79}$/.test(id)))throw Error('文章链接标识请填写 1–80 位英文字母、数字、短横线或下划线，并以字母或数字开头。');
  if(new Set(ids).size!==ids.length)throw Error('每篇文章的链接标识需要不同。');
  if(config.版块顺序.some(s=>!sectionNames.includes(s))||new Set(config.版块顺序).size!==config.版块顺序.length)throw Error('版块顺序包含未知或重复的版块。');
  if(!Number.isInteger(config.档期.天数)||config.档期.天数<1||config.档期.天数>90)throw Error('档期天数需要是 1 到 90 之间的整数。');
  if(config.档期.开放时间.some(time=>!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)))throw Error('开放时间请填写 24 小时格式，例如 10:00。');
  if(config.档期.开放星期.some(day=>!['周日','周一','周二','周三','周四','周五','周六'].includes(day)))throw Error('开放星期请填写周一、周二等名称。');
  for(const color of [...Object.values(config.外观.主要颜色),...Object.values(config.外观.细节颜色)])if(!/^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(color))throw Error('颜色请使用十六进制色值，例如 #566b43。');
  return config;
}

export function formatText(content:SiteContent,value:string,extra:Record<string,string>={}) {
  const words:Record<string,string>={品牌:content.品牌.名称,简称:content.品牌.简称,咨询师:content.品牌.咨询师,年份:content.品牌.年份,价格:content.服务.价格,时长:content.服务.时长,币种:content.服务.币种,...extra};
  return value.replace(/\{([^{}]+)\}/g,(match,key)=>words[key]??match);
}

export function safeLink(value:string,image=false) {
  if(image&&/^data:image\/(png|jpeg|webp|gif|avif);base64,/i.test(value))return value;
  try {
    const parsed=new URL(value,window.location.href);
    if(['http:','https:'].includes(parsed.protocol)||(!image&&['mailto:','tel:'].includes(parsed.protocol)))return value;
  }catch{/* Invalid links are not rendered as executable URLs. */}
  return image?'':'#';
}

export function themeVariables(config:SiteContent):Record<string,string> {
  const c=config.外观.主要颜色,l=config.外观.布局;
  return {
    ...Object.fromEntries(Object.entries(config.外观.细节颜色).map(([k,v])=>['--tone-'+k.slice(2),v])),
    '--background':c.页面背景,'--foreground':c.正文文字,'--primary':c.主题色,'--primary-foreground':c.按钮文字,'--secondary':c.浅色背景,
    '--site-font-body':l.正文字体,'--site-font-heading':l.标题字体,'--site-body-size':l.正文大小,
    '--site-page-width':l.页面最大宽度,'--site-content-width':l.内容最大宽度,'--site-section-space':l.内容上下留白,
    '--site-mobile-hero-size':l.手机首屏标题大小,'--site-mobile-heading-size':l.手机版块标题大小,'--site-mobile-hero-height':l.手机首屏图片高度,'--site-mobile-section-space':l.手机版块上下留白,'--site-mobile-hero-radius':l.手机图片圆角,
    '--site-hero-size':l.首屏标题大小,'--site-section-title-size':l.版块标题大小,'--site-hero-height':l.首屏图片高度,'--site-hero-radius':l.图片圆角,
  };
}

const SiteContext=createContext({site:defaults,loaded:false});
export function SiteProvider({children}:{children:ReactNode}) {
  const [content,setContent]=useState<SiteContent>(defaults);
  const [loaded,setLoaded]=useState(false);
  const preview=previewMode();
  useEffect(()=>{
    let active=true,draftReceived=false;
    function receive(event:MessageEvent){
      if(!preview||event.origin!==window.location.origin||event.source!==window.parent||event.data?.type!=='guangdu-preview')return;
      try{const value=validateContent(event.data.content);draftReceived=true;setContent(value);setLoaded(true);}catch{/* Ignore malformed preview messages. */}
    }
    window.addEventListener('message',receive);
    fetch(new URL('./site-content.json',window.location.href),{cache:'no-store'})
      .then(r=>{if(!r.ok)throw Error('内容暂时无法读取');return r.json();})
      .then(value=>{if(active&&!draftReceived)setContent(validateContent(value));})
      .catch(()=>{/* The bundled, validated defaults keep the website available. */})
      .finally(()=>{if(active)setLoaded(true)});
    if(preview)window.parent.postMessage({type:'guangdu-preview-ready'},window.location.origin);
    return()=>{active=false;window.removeEventListener('message',receive);};
  },[preview]);
  useEffect(()=>{
    for(const [key,value] of Object.entries(themeVariables(content)))document.documentElement.style.setProperty(key,value);
    let style=document.getElementById('site-custom-style');
    if(!style){style=document.createElement('style');style.id='site-custom-style';document.head.append(style);}
    style.textContent=content.外观.自定义样式;
    const isArticle=window.location.pathname.endsWith('/article.html');
    const id=new URLSearchParams(window.location.search).get('id');
    const article=isArticle?content.心理学分享.文章.find(a=>a.链接标识===id):undefined;
    document.title=article?formatText(content,article.标题)+' | '+content.品牌.名称:isArticle?formatText(content,content.心理学分享.详情页.未找到标题):formatText(content,content.品牌.网站标题);
    const description=formatText(content,article?.摘要??content.品牌.网站描述);
    function meta(selector:string,value:string){document.querySelector(selector)?.setAttribute('content',value);}
    meta('meta[name="description"]',description);
    meta('meta[property="og:title"]',document.title);
    meta('meta[property="og:description"]',description);
    meta('meta[name="theme-color"]',content.外观.主要颜色.页面背景);
    document.querySelector('link[rel="icon"]')?.setAttribute('href',safeLink(content.品牌.网站图标,true));
  },[content]);
  return <SiteContext.Provider value={{site:content,loaded}}>{children}</SiteContext.Provider>;
}
export function useSite(){
  const {site,loaded}=useContext(SiteContext);
  return {site,loaded,t:(text:string,extra?:Record<string,string>)=>formatText(site,text,extra)};
}
