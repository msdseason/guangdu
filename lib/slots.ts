import defaults from '../public/site-content.json';
export function availableSlots(schedule=defaults.档期){
 const result:string[]=[];
 const today=new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Shanghai'});
 const base=new Date(today+'T12:00:00+08:00');
 const days=['周日','周一','周二','周三','周四','周五','周六'];
 for(let i=1;i<=Math.min(90,Math.max(1,schedule.天数));i++){
  const d=new Date(base.getTime()+i*86400000);
  if(!schedule.开放星期.includes(days[d.getUTCDay()]))continue;
  const day=d.toLocaleDateString('en-CA',{timeZone:'Asia/Shanghai'});
  for(const time of [...new Set(schedule.开放时间)].sort()){
   if(/^([01]\d|2[0-3]):[0-5]\d$/.test(time))result.push(day+'T'+time);
  }
 }
 return result;
}
