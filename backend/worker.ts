import {availableSlots} from '../lib/slots';
interface Env { DB:D1Database; ALLOWED_ORIGINS?:string }
export default {async fetch(request:Request,env:Env):Promise<Response>{
 const origin=request.headers.get('origin');
 const allowed=(env.ALLOWED_ORIGINS||'').split(',').map(v=>v.trim()).filter(Boolean);
 const headers:Record<string,string>={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','Vary':'Origin'};
 if(origin&&allowed.includes(origin))headers['Access-Control-Allow-Origin']=origin;
 const response=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers});
 if(origin&&!allowed.includes(origin))return response({error:'请求来源无效'},403);
 if(new URL(request.url).pathname!=='/api/bookings')return response({error:'未找到页面'},404);
 if(request.method==='OPTIONS')return new Response(null,{status:204,headers:{...headers,'Access-Control-Allow-Methods':'GET, POST, DELETE, OPTIONS','Access-Control-Allow-Headers':'Content-Type'}});
 if(!env.DB)return response({error:'预约服务尚未配置。'},503);
 try {
  if(request.method==='GET'){
   const slots=availableSlots();const result=await env.DB.prepare('SELECT slot FROM bookings WHERE slot >= ?').bind(slots[0]).all<{slot:string}>();
   const taken=new Set(result.results.map(r=>r.slot));
   return response({slots:slots.map(slot=>({slot,available:!taken.has(slot)}))});
  }
  if(!['POST','DELETE'].includes(request.method))return response({error:'不支持此操作'},405);
  if(Number(request.headers.get('content-length')||0)>4096)return response({error:'请求内容过长'},413);
  const raw=await request.text();if(raw.length>4096)return response({error:'请求内容过长'},413);
  let data:any;try{data=JSON.parse(raw);}catch{return response({error:'请求格式无效'},400);}
  if(!data||typeof data!=='object')return response({error:'请求格式无效'},400);
  if(request.method==='POST'){
   if(typeof data.name!=='string'||!data.name.trim()||data.name.length>30||!availableSlots().includes(data.slot)||!['video','inperson'].includes(data.mode)||data.consent!==true)return response({error:'请填写称呼、选择有效档期，并同意演示预约说明。'},400);
   const id=crypto.randomUUID();const result=await env.DB.prepare('INSERT INTO bookings (id,slot,name,mode,created_at) VALUES (?,?,?,?,?) ON CONFLICT(slot) DO NOTHING').bind(id,data.slot,data.name.trim(),data.mode,new Date().toISOString()).run();
   if(!result.meta.changes)return response({error:'这个时段刚刚被预约，请选择其他时间。'},409);
   return response({id,slot:data.slot,status:'demo_reserved'},201);
  }
  if(typeof data.id!=='string'||!/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/.test(data.id))return response({error:'预约凭证无效'},400);
  await env.DB.prepare('DELETE FROM bookings WHERE id = ?').bind(data.id).run();return response({cancelled:true});
 }catch{return response({error:'预约服务暂不可用，请稍后重试。'},503);}
}};
