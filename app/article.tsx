import {createRoot} from 'react-dom/client';
import {ArrowLeft,ArrowRight,Sprout} from 'lucide-react';
import {SiteProvider,useSite,safeLink} from '@/lib/site';
import {articleHref,homeHref,previewMode} from '@/lib/content-upgrade';
import {SiteHeader,SiteFooter} from './layout';
import './globals.css';
import './reading.css';

function ArticlePage(){
  const {site,t,loaded}=useSite(),c=site.心理学分享,d=c.详情页;
  const id=new URLSearchParams(window.location.search).get('id');
  const index=c.文章.findIndex(a=>a.链接标识===id),article=c.文章[index];
  const preview=previewMode(),back=homeHref('#journal',preview);
  const previous=c.文章[index-1],next=c.文章[index+1];
  return <><SiteHeader article/><main className="article-page">
    <a className="reading-back" href={back}><ArrowLeft size={16}/>{t(d.返回列表)}</a>
    {!loaded?<div className="reading-empty" role="status"><p>{t(d.加载文字)}</p></div>:!article?<div className="reading-empty"><Sprout size={32}/><h1>{t(d.未找到标题)}</h1><p>{t(d.未找到说明)}</p><a className="primary-link" href={back}>{t(d.返回列表)}<ArrowRight size={16}/></a><a className="reading-back" style={{marginTop:20}} href={homeHref('',preview)}>{t(d.返回首页)}</a></div>:<>
      <article>
        <header className="reading-header"><div className="eyebrow">{t(c.英文标题)}</div><span className="reading-category">{t(article.分类)}</span><h1 className="site-lines">{t(article.标题)}</h1><p className="reading-summary site-lines">{t(article.摘要)}</p><div className="reading-meta"><span>{t(c.署名)}</span><span aria-hidden="true">·</span><span>{t(article.阅读时长)} {t(c.阅读单位)}</span></div></header>
        {article.图片&&<figure className="reading-cover"><img src={safeLink(article.图片,true)||undefined} alt={t(article.图片说明)}/></figure>}
        <div className="reading-body">{article.段落.map((paragraph,i)=><p className="site-lines" key={i}>{t(paragraph)}</p>)}<div className="reading-end" aria-hidden="true"><span/><Sprout size={23}/><span/></div>{c.文章说明&&<p className="reading-note">{t(c.文章说明)}</p>}<a className="reading-finish" href={back}>{t(c.关闭按钮)}<ArrowLeft size={15}/></a></div>
      </article>
      {(previous||next)&&<nav className="reading-related" aria-label={t(d.阅读更多)}>{previous?<a href={articleHref(previous.链接标识,preview)}><small><ArrowLeft size={14}/>{t(d.上一页)}</small><h2>{t(previous.标题)}</h2></a>:<span/>}{next&&<a href={articleHref(next.链接标识,preview)}><small>{t(d.下一页)}<ArrowRight size={14}/></small><h2>{t(next.标题)}</h2></a>}</nav>}
    </>}
  </main><SiteFooter/></>;
}
createRoot(document.getElementById('root')!).render(<SiteProvider><ArticlePage/></SiteProvider>);
