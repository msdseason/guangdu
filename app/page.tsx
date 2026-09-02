import {ArrowUpRight,Sprout,HeartHandshake,ShieldCheck,Video} from 'lucide-react';
import Booking from './booking';
import {Journal,Process,Faq,Closing} from './content';
import {useSite,safeLink} from '@/lib/site';

function Brand(){const {site}=useSite();return <a className="brand" href="#">{site.品牌.标志图片?<img className="brand-logo" src={safeLink(site.品牌.标志图片,true)} alt=""/>:<Sprout/>}{site.品牌.名称}</a>}
function Hero(){const {site,t}=useSite(),c=site.首屏;const icons=[ShieldCheck,Video,HeartHandshake];return <section className="hero"><div className="hero-copy"><div className="eyebrow">{t(c.英文标题)}</div><h1 className="site-lines">{t(c.标题)}</h1><p className="site-lines">{t(c.正文)}</p><a className="primary-link" href={safeLink(c.按钮地址)}>{t(c.按钮文字)}<ArrowUpRight size={18}/></a><div className="hero-notes">{c.特点.map((text,i)=>{const Icon=icons[i%icons.length];return <span key={i}><Icon/>{t(text)}</span>})}</div></div><div className="hero-photo"><img src={safeLink(c.图片,true)||undefined} alt={t(c.图片说明)}/><div className="photo-note">{t(c.图片寄语)}<span>{t(c.图片英文)}</span></div><div className="vertical-note">{t(c.竖排寄语)}</div></div></section>}
function Intro(){const {site,t}=useSite();return <div className="intro-strip"><span>{t(site.引言.标题)}</span><p>{t(site.引言.正文)}</p><Sprout/></div>}
function About(){const {site,t}=useSite(),c=site.咨询师简介;return <section id="about" className="section about"><div><div className="eyebrow">{t(c.英文标题)}</div><h2>{t(c.标题)}</h2><p className="muted">{t(c.副标题)}</p>{c.段落.map((text,i)=><p className="site-lines" key={i}>{t(text)}</p>)}<div className="tags">{c.标签.map((text,i)=><span key={i}>{t(text)}</span>)}</div><small>{t(c.说明)}</small></div><aside className="quote">“<h3 className="site-lines">{t(c.引语)}</h3><span>{t(c.引语署名)}</span></aside></section>}
export default function Home(){
  const {site,t}=useSite();
  const sections:Record<string,React.ReactNode>={首屏:<Hero/>,引言:<Intro/>,咨询师简介:<About/>,预约:<Booking/>,心理学分享:<Journal/>,流程与收费:<Process/>,常见问题:<Faq/>,结尾:<Closing/>};
  return <>{site.导航.显示&&<header className="nav"><Brand/><nav>{site.导航.链接.map((link,i)=><a key={i} href={safeLink(link.地址)}>{t(link.文字)}</a>)}</nav><a className="nav-cta" href={safeLink(site.导航.按钮地址)}>{t(site.导航.按钮文字)}<ArrowUpRight size={16}/></a></header>}<main>{site.版块顺序.map(name=>{const section=site[name as keyof typeof site];return section&&typeof section==='object'&&'显示' in section&&section.显示?<div className="site-section" key={name}>{sections[name]}</div>:null})}</main>{site.页脚.显示&&<footer><Brand/><span>{t(site.页脚.寄语)}</span><small>{t(site.页脚.版权)}</small></footer>}</>
}
