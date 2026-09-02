// Upgrade previous exports without replacing any owner-authored content.
const record=(value:unknown):value is Record<string,any>=>!!value&&typeof value==='object'&&!Array.isArray(value);
export function legacyArticleId(title:string){
  let hash=2166136261;
  for(const char of title){hash^=char.codePointAt(0)!;hash=Math.imul(hash,16777619);}
  return 'article-'+(hash>>>0).toString(36);
}
export function upgradeContent(value:unknown,knownArticles:Array<{标题:string;链接标识:string}>=[]):unknown {
  if(!record(value))return value;
  const copy=structuredClone(value),about=copy.咨询师简介,journal=copy.心理学分享;
  if(record(about)&&!Object.hasOwn(about,'资质背景'))about.资质背景={显示:false,英文标题:'EDUCATION & PROFESSIONAL BACKGROUND',标题:'资质与专业背景',说明:'',分类:[]};
  if(record(journal)){
    if(!Object.hasOwn(journal,'详情页'))journal.详情页={返回列表:'返回心理学分享',返回首页:'返回首页',上一页:'上一篇',下一页:'下一篇',阅读更多:'继续阅读',加载文字:'正在打开文章…',未找到标题:'这篇文章暂时不在这里',未找到说明:'文章可能已移除，或链接已经改变。你可以返回列表，看看其他分享。'};
    if(Array.isArray(journal.文章)){
      const used=new Set(journal.文章.filter(record).map(a=>a.链接标识));
      for(const article of journal.文章){
        if(!record(article)||Object.hasOwn(article,'链接标识')||typeof article.标题!=='string')continue;
        const stem=knownArticles.find(a=>a.标题===article.标题)?.链接标识||legacyArticleId(article.标题);let id=stem,n=2;
        while(used.has(id))id=stem+'-'+n++;
        article.链接标识=id;used.add(id);
      }
    }
  }
  return copy;
}
export const articleHref=(id:string,preview=false)=>'./article.html?id='+encodeURIComponent(id)+(preview?'&preview=1':'');
export const homeHref=(hash='',preview=false)=>'./'+(preview?'?preview=1':'')+hash;
export const previewMode=()=>new URLSearchParams(window.location.search).get('preview')==='1'&&window.parent!==window;
