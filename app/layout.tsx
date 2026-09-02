import {ArrowUpRight,Sprout} from 'lucide-react';
import {useSite,safeLink} from '@/lib/site';
import {homeHref,previewMode} from '@/lib/content-upgrade';

export function Brand(){
  const {site}=useSite();
  return <a className="brand" href={homeHref('',previewMode())}>{site.品牌.标志图片?<img className="brand-logo" src={safeLink(site.品牌.标志图片,true)} alt=""/>:<Sprout/>}{site.品牌.名称}</a>;
}
export function SiteHeader({article=false}:{article?:boolean}){
  const {site,t}=useSite();
  const href=(value:string)=>safeLink(article&&value.startsWith('#')?homeHref(value,previewMode()):value);
  return site.导航.显示?<header className="nav"><Brand/><nav>{site.导航.链接.map((link,i)=><a key={i} href={href(link.地址)}>{t(link.文字)}</a>)}</nav><a className="nav-cta" href={href(site.导航.按钮地址)}>{t(site.导航.按钮文字)}<ArrowUpRight size={16}/></a></header>:null;
}
export function SiteFooter(){
  const {site,t}=useSite();
  return site.页脚.显示?<footer><Brand/><span>{t(site.页脚.寄语)}</span><small>{t(site.页脚.版权)}</small></footer>:null;
}
