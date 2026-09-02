import {availableSlots} from './slots';
import type {SiteContent} from './site';
import defaults from '../public/site-content.json';
declare global { interface Window {XINYU_CONFIG?:{apiBase?:string};GUANGDU_CONFIG?:{apiBase?:string}} }
export async function bookingFetch(init?:RequestInit,config:SiteContent=defaults):Promise<Response>{
 const configured=config.预约服务.接口地址.trim()||window.GUANGDU_CONFIG?.apiBase?.trim()||window.XINYU_CONFIG?.apiBase?.trim();
 if(!configured){
  if(!init?.method||init.method==='GET')return Response.json({preview:true,slots:availableSlots(config.档期).map(slot=>({slot,available:true}))});
  return Response.json({error:config.预约.未连接提示},{status:503});
 }
 let base:URL;try{base=new URL(configured.endsWith('/')?configured:configured+'/',window.location.href);}catch{return Response.json({error:config.预约.地址错误},{status:503});}
 if(base.protocol!=='https:'&&!['localhost','127.0.0.1'].includes(base.hostname))return Response.json({error:config.预约.连接错误},{status:503});
 return fetch(new URL('api/bookings',base),{...init,signal:AbortSignal.timeout(12000)});
}
