import {availableSlots} from './slots';
declare global { interface Window {XINYU_CONFIG?:{apiBase?:string}} }
export async function bookingFetch(init?:RequestInit):Promise<Response>{
 const configured=window.XINYU_CONFIG?.apiBase?.trim();
 if(!configured){
  if(!init?.method||init.method==='GET')return Response.json({preview:true,slots:availableSlots().map(slot=>({slot,available:true}))});
  return Response.json({error:'当前为展示版，预约服务尚未连接，未保存任何预约。'},{status:503});
 }
 let base:URL;try{base=new URL(configured.endsWith('/')?configured:configured+'/',window.location.href);}catch{return Response.json({error:'预约服务地址配置有误。'},{status:503});}
 if(base.protocol!=='https:'&&!['localhost','127.0.0.1'].includes(base.hostname))return Response.json({error:'预约服务需要安全连接。'},{status:503});
 return fetch(new URL('api/bookings',base),{...init,signal:AbortSignal.timeout(12000)});
}
