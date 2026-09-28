/* SM-2 điều chỉnh: hàm thuần để kiểm thử độc lập với giao diện và bộ nhớ. */
(function(root){
  'use strict';
  const MINUTE=60000,DAY=86400000;
  function initial(now=Date.now()){
    return {version:1,algorithm:'sm2-learning',state:'new',dueAt:now,ease:2.5,intervalDays:0,repetitions:0,reviews:0,lapses:0,step:0,lastAt:null};
  }
  function schedule(previous,rating,now=Date.now()){
    if(!Number.isInteger(rating)||rating<0||rating>3)throw new RangeError('Mức đánh giá phải từ 0 đến 3');
    if(!Number.isFinite(now))throw new TypeError('Thời gian không hợp lệ');
    const s={...initial(now),...previous};
    s.reviews++;s.lastAt=now;
    if(rating===0){
      if(s.state==='review')s.lapses++;
      s.state=s.state==='new'||s.state==='learning'?'learning':'relearning';
      s.step=0;s.repetitions=0;s.dueAt=now+MINUTE;s.ease=Math.max(1.3,s.ease-.2);
      return s;
    }
    if(s.state!=='review'){
      if(rating===1){s.state=s.state==='relearning'?'relearning':'learning';s.dueAt=now+6*MINUTE;return s;}
      if(rating===2 && s.step===0){s.state=s.state==='relearning'?'relearning':'learning';s.step=1;s.dueAt=now+10*MINUTE;return s;}
      s.state='review';s.step=0;s.repetitions=1;s.intervalDays=rating===3?4:1;
      if(rating===3)s.ease=Math.min(3.5,s.ease+.15);
      s.dueAt=now+s.intervalDays*DAY;return s;
    }
    const old=s.intervalDays||1;
    // Khó giữ khoảng ôn ngắn; Tốt dùng nhịp SM-2; Dễ có hệ số thưởng được ghi rõ.
    const good=s.repetitions<1?1:s.repetitions===1?6:Math.ceil(old*s.ease);
    if(rating===1){s.intervalDays=Math.max(1,Math.min(good,Math.ceil(old*1.2)));s.ease=Math.max(1.3,s.ease-.15);}
    if(rating===2){s.intervalDays=good;s.repetitions++;}
    if(rating===3){s.intervalDays=Math.max(good+1,Math.ceil(old*s.ease*1.3),4);s.repetitions++;s.ease=Math.min(3.5,s.ease+.15);}
    s.intervalDays=Math.min(3650,s.intervalDays);s.dueAt=now+s.intervalDays*DAY;
    return s;
  }
  function studyDate(now=Date.now(),timezone='Asia/Bangkok',startHour=0){
    const parts=new Intl.DateTimeFormat('en-CA',{timeZone:timezone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',hourCycle:'h23'}).formatToParts(new Date(now));
    const v=Object.fromEntries(parts.map(p=>[p.type,p.value]));
    const d=new Date(Date.UTC(+v.year,+v.month-1,+v.day));
    if(+v.hour<startHour)d.setUTCDate(d.getUTCDate()-1);
    return d.toISOString().slice(0,10);
  }
  function streak(dates,today){
    const set=new Set(dates),day=new Date(today+'T12:00:00Z');
    if(!set.has(today))day.setUTCDate(day.getUTCDate()-1);
    let n=0;while(set.has(day.toISOString().slice(0,10))){n++;day.setUTCDate(day.getUTCDate()-1);}return n;
  }
  function label(ms){if(ms<60000)return 'Ngay';if(ms<3600000)return Math.ceil(ms/60000)+' phút';if(ms<DAY)return Math.ceil(ms/3600000)+' giờ';return Math.round(ms/DAY)+' ngày';}
  const api={initial,schedule,studyDate,streak,label,DAY,MINUTE};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MindScheduler=api;
})(typeof globalThis!=='undefined'?globalThis:this);
