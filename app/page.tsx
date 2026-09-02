import {ArrowUpRight,Sprout,HeartHandshake,ShieldCheck,Video} from 'lucide-react';
import Booking from './booking';
import {Journal,Process,Faq,Closing} from './content';
import {useSite,safeLink} from '@/lib/site';
import {SiteHeader,SiteFooter} from './layout';

function Hero(){const {site,t}=useSite(),c=site.首屏;const icons=[ShieldCheck,Video,HeartHandshake];return <section className="hero"><div className="hero-copy"><div className="eyebrow">{t(c.英文标题)}</div><h1 className="site-lines">{t(c.标题)}</h1><p className="site-lines">{t(c.正文)}</p><a className="primary-link" href={safeLink(c.按钮地址)}>{t(c.按钮文字)}<ArrowUpRight size={18}/></a><div className="hero-notes">{c.特点.map((text,i)=>{const Icon=icons[i%icons.length];return <span key={i}><Icon/>{t(text)}</span>})}</div></div><div className="hero-photo"><img src={safeLink(c.图片,true)||undefined} alt={t(c.图片说明)}/><div className="photo-note">{t(c.图片寄语)}<span>{t(c.图片英文)}</span></div><div className="vertical-note">{t(c.竖排寄语)}</div></div></section>}
function Intro(){const {site,t}=useSite();return <div className="intro-strip"><span>{t(site.引言.标题)}</span><p>{t(site.引言.正文)}</p><Sprout/></div>}
function About(){const {site,t}=useSite(),c=site.咨询师简介,b=c.资质背景;return <section id="about" className="section about"><div><div className="eyebrow">{t(c.英文标题)}</div><h2>{t(c.标题)}</h2><p className="muted">{t(c.副标题)}</p>{c.段落.map((text,i)=><p className="site-lines" key={i}>{t(text)}</p>)}<div className="tags">{c.标签.map((text,i)=><span key={i}>{t(text)}</span>)}</div><p className="about-note site-lines">{t(c.说明)}</p></div><aside className="quote">“<h3 className="site-lines">{t(c.引语)}</h3><span>{t(c.引语署名)}</span></aside>{b.显示&&<section className="credentials" aria-labelledby="credentials-title"><div className="credentials-heading"><div><div className="eyebrow">{t(b.英文标题)}</div><h3 id="credentials-title">{t(b.标题)}</h3></div>{b.说明&&<p>{t(b.说明)}</p>}</div><div className="credential-grid">{b.分类.map((group,i)=><section className="credential-card" key={i}><div className="credential-label"><span aria-hidden="true">{String(i+1).padStart(2,'0')}</span><h4>{t(group.标题)}</h4></div><ul>{group.项目.map((item,j)=><li className="site-lines" key={j}>{t(item)}</li>)}</ul></section>)}</div></section>}</section>}
export default function Home(){
  const {site}=useSite();
  const sections:Record<string,React.ReactNode>={首屏:<Hero/>,引言:<Intro/>,咨询师简介:<About/>,预约:<Booking/>,心理学分享:<Journal/>,流程与收费:<Process/>,常见问题:<Faq/>,结尾:<Closing/>};
  return <><SiteHeader/><main>{site.版块顺序.map(name=>{const section=site[name as keyof typeof site];return section&&typeof section==='object'&&'显示' in section&&section.显示?<div className="site-section" key={name}>{sections[name]}</div>:null})}</main><SiteFooter/></>
}
