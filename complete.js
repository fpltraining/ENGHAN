/* Lớp tích hợp MVP: lịch ôn, dữ liệu, từ điển, thống kê và cài đặt của Inklish. */
let reviewBusy=false,practiceMode=false,reviewTimer=null,reviewStarted=Date.now();
let vocabQuery='',vocabFilter='all',vocabPage=0,editingWord=null,pendingContext=null;
let progressTab='analytics',storageError='',appInstallPrompt=null;
const DEFAULT_MIND={timezone:Intl.DateTimeFormat().resolvedOptions().timeZone||'Asia/Bangkok',goal:20,newLimit:10,accent:'en-US',rate:.9,fontSize:20,readerMode:'sentences',reduceMotion:false};

function normalWord(w){return String(w||'').trim().toLowerCase();}
function mindToday(){return MindScheduler.studyDate(Date.now(),S?.mind?.timezone||DEFAULT_MIND.timezone);}
function detailFor(c){return {...(VOCAB_DETAILS[normalWord(c.en)]||{}),...(S.details[normalWord(c.en)]||{})};}
function applyPreferences(){window.mindTimezone=S.mind.timezone;document.documentElement.style.setProperty('--reader-size',S.mind.fontSize+'px');document.documentElement.dataset.motion=S.mind.reduceMotion?'reduce':'auto';}
function ensureMind(){
  S.mind={...DEFAULT_MIND,...S.mind,readerMode:'sentences'};S.details=S.details||{};S.reviewLog=Array.isArray(S.reviewLog)?S.reviewLog:[];
  S.completedDays=Array.isArray(S.completedDays)?S.completedDays:[];
  S.cards.forEach(c=>{
    if(!c.schedule){
      c.legacySchedule={st:c.st,dif:c.dif,reps:c.reps,lapses:c.lapses,due:c.due,seen:c.seen};
      const due=c.due?new Date(c.due+'T00:00:00').getTime():Date.now();
      c.schedule={...MindScheduler.initial(),state:c.seen?'review':'new',dueAt:Number.isFinite(due)?due:Date.now()};
      // Giữ hạn ôn cũ; không coi st của công thức cũ là Ease Factor.
    }
  });applyPreferences();
}
async function startMind(){
  load();
  try{const saved=await MindStore.read();if(saved && (saved._savedAt||0)>(S._savedAt||0))S=saved;}
  catch(e){storageError='Không mở được bộ nhớ IndexedDB. App đang dùng bản lưu dự phòng trong trình duyệt.';}
  ensureMind();
  if(S.showVi==null)S.showVi=true;if(S.readBook==null)S.readBook='extra';
  if(!S.seeded.first){['book','seed','coffee','happy','remember','quiet'].forEach(w=>addWord(w,VOCAB_DETAILS[w].meaning,'bộ khởi đầu'));S.seeded.first=true;}
  // Bổ sung một lần bộ thẻ hình động. Người dùng cũ cũng nhận được mà không mất tiến độ.
  if(!S.seeded.animatedCards){['cat','dog','bird','fish','car','flower'].forEach(w=>addWord(w,VOCAB_DETAILS[w].meaning,'thẻ hình động'));S.seeded.animatedCards=true;}
  if(S.theme && S.theme!=='auto')document.documentElement.dataset.theme=S.theme;
  resolveColors();render();save(true);
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change',()=>{resolveColors();render();});
  document.addEventListener('pointerdown',unlock,{once:true});
  if(location.hash==='#review')go('srs');
  if(location.hash==='#word')go('vocab');
}

save=function(now){
  S._savedAt=Date.now();
  try{localStorage.setItem(LS,JSON.stringify(S));}catch(e){storageError='Bản lưu dự phòng đã đầy; dữ liệu chính vẫn lưu trong IndexedDB nếu trạng thái bên dưới báo thành công.';}
  clearTimeout(saveTimer);
  const write=()=>MindStore.write(S).then(()=>{const badge=$('#storage-status');if(badge)badge.textContent=MindStore.status;}).catch(()=>{storageError='Chưa lưu được dữ liệu chính. Hãy xuất sao lưu trước khi đóng app.';const badge=$('#storage-status');if(badge)badge.textContent=storageError;});
  if(now)return write();saveTimer=setTimeout(write,180);
};
window.addEventListener('pagehide',()=>{if(S){clearTimeout(saveTimer);try{localStorage.setItem(LS,JSON.stringify(S));}catch(e){}MindStore.write(S).catch(()=>{});}});

const oldMkCard=mkCard;
mkCard=function(en,vi,mode,src){return {...oldMkCard(en,vi,mode,src),schedule:MindScheduler.initial(),suspended:false};};
/* Một đường học thống nhất: đúng 45 phút, tối đa 5 bước mỗi buổi. */
const originalBlocksFor45=blocksFor;
blocksFor=function(n){
  if(S.stage===0)return [['Luyện âm',5,'sound'],['Từ lõi',10,'core'],['Ngữ pháp dùng ngay',8,'gram'],['Nói thành tiếng',12,'speak'],['Ôn thẻ',10,'review']].map(([label,min,key])=>({label,min,key}));
  if(S.stage===1)return [['Đọc truyện',12,'story'],['Từ và cụm mới',8,'vocab'],['Mẫu câu',8,'book'],['Nghe và nói lại',9,'speak'],['Ôn thẻ',8,'review']].map(([label,min,key])=>({label,min,key}));
  if(S.stage===2)return [['Cụm tự nhiên',9,'coll'],['Ngữ pháp B2',8,'gram2'],['Nghe và nhại',10,'shadow'],['Nói lại',10,'retell'],['Ôn thẻ',8,'review']].map(([label,min,key])=>({label,min,key}));
  if(S.stage===3)return [['Cụm diễn đạt',8,'coll'],['Ngữ pháp nâng cao',8,'gram3'],['Viết có mục tiêu',11,'write3'],['Nói lại',10,'retell'],['Ôn thẻ',8,'review']].map(([label,min,key])=>({label,min,key}));
  return [['Sắc thái và thành ngữ',9,'gram3'],['Cụm tự nhiên',8,'coll'],['Nghe và nhại',10,'shadow'],['Viết hoặc trình bày',10,'write3'],['Ôn thẻ',8,'review']].map(([label,min,key])=>({label,min,key}));
};
// Sổ tay ngữ pháp vẫn được mở đúng lúc trong bài học, không chiếm một mục riêng gây phân tâm.
const bookNavIndex=NAV.findIndex(([key])=>key==='book');if(bookNavIndex>=0)NAV.splice(bookNavIndex,1);
const oldAddWord=addWord;
addWord=function(en,vi,src){
  const result=oldAddWord(en,vi,src);
  if(result&&src==='bài đọc'&&pendingContext){S.details[normalWord(en)]={...S.details[normalWord(en)],example:pendingContext.en,translation:pendingContext.vi,source:pendingContext.title};pendingContext=null;save(true);}
  return result;
};
const oldWordPop=wordPop;
wordPop=function(span){
  const pair=span.closest('.bilingual-pair'),reader=span.closest('.reader-section');
  pendingContext={en:pair?.querySelector('[lang="en"]')?.textContent||span.closest('p')?.textContent||'',vi:pair?.querySelector('[lang="vi"]')?.textContent||'',title:reader?.querySelector('h2')?.textContent||'Bài đọc'};
  oldWordPop(span);
};

dueCards=()=>S.cards.filter(c=>!c.suspended&&c.schedule&&c.schedule.dueAt<=Date.now());
buildQueue=function(){
  const now=Date.now(),mode=S.flashMode==='recognition'?'recall':S.flashMode==='spelling'?'spell':null;
  const cards=S.cards.filter(c=>!c.suspended&&(!mode||c.mode===mode));
  if(practiceMode)return cards.slice().sort((a,b)=>a.schedule.dueAt-b.schedule.dueAt).slice(0,40).map(c=>c.id);
  const learnedToday=S.reviewLog.filter(e=>e.studyDate===mindToday()&&e.before.state==='new'&&e.kind!=='practice').length;
  const old=cards.filter(c=>c.schedule.state!=='new'&&c.schedule.dueAt<=now).sort((a,b)=>a.schedule.dueAt-b.schedule.dueAt);
  const fresh=cards.filter(c=>c.schedule.state==='new'&&c.schedule.dueAt<=now).slice(0,Math.max(0,S.mind.newLimit-learnedToday));
  return [...old,...fresh].map(c=>c.id);
};
function renewReview(){AV={key:'review',standalone:true,queue:buildQueue(),step:0,res:{},shown:false};reviewStarted=Date.now();render();}
gradeBar=function(){
  const c=S.cards.find(c=>c.id===AV?.queue?.[0]);if(!c)return '';
  return `<div class="rating-grid">${['Quên','Khó','Tốt','Dễ'].map((name,r)=>`<button class="btn ${r===0?'red':r===2?'pri':''}" data-grade="${r}"><b>${name}</b><small>${practiceMode?'Không đổi lịch':MindScheduler.label(MindScheduler.schedule(c.schedule,r).dueAt-Date.now())}</small></button>`).join('')}</div>`;
};
async function submitRating(rating){
  if(reviewBusy||!AV?.shown)return;
  const c=S.cards.find(c=>c.id===AV.queue[0]);if(!c)return;
  reviewBusy=true;const pane=$('#pane');pane.setAttribute('aria-busy','true');$$('[data-grade]',pane).forEach(b=>b.disabled=true);
  const now=Date.now(),before={...c.schedule};
  const after=practiceMode?before:MindScheduler.schedule(before,rating,now);
  const event={id:crypto.randomUUID?crypto.randomUUID():uid()+now,cardId:c.id,word:c.en,rating,at:now,studyDate:mindToday(),timezone:S.mind.timezone,kind:practiceMode?'practice':before.state,before,after,responseMs:Math.min(300000,Math.max(0,now-reviewStarted))};
  const candidate=structuredClone(S),next=candidate.cards.find(x=>x.id===c.id);
  next.schedule=after;next.st=after.intervalDays;next.reps=after.reviews;next.lapses=after.lapses;
  next.due=MindScheduler.studyDate(after.dueAt,S.mind.timezone);next.seen=mindToday();
  candidate.reviewLog.push(event);candidate._savedAt=now;
  try{
    clearTimeout(saveTimer);await MindStore.write(candidate);
    S=candidate;try{localStorage.setItem(LS,JSON.stringify(S));}catch(e){}
    AV.queue=AV.queue.slice(1);AV.shown=false;AV.res={};
    // Thẻ học lại sẽ được lấy từ hạn đã lưu, không chỉ tồn tại trong hàng đợi RAM.
    if(!practiceMode){const due=buildQueue();AV.queue=[...new Set([...AV.queue,...due])];}
    reviewStarted=Date.now();render();
  }catch(e){toast('Chưa lưu được lượt ôn. Hãy xuất sao lưu; thẻ chưa bị đổi lịch.','bad');$$('[data-grade]',pane).forEach(b=>b.disabled=false);}
  finally{reviewBusy=false;pane.removeAttribute('aria-busy');}
}

function wordArt(kind,word=''){
  const shapes={book:'<div class="shape-book"><span>Aa</span></div>',plant:'<div class="shape-plant"><i></i><b></b><em></em></div>',sun:'<div class="shape-sun"></div>',moon:'<div class="shape-moon"></div>',cup:'<div class="shape-cup"><i></i></div>',clock:'<div class="shape-clock"><i></i><b></b></div>',house:'<div class="shape-house"><i></i></div>',letter:'<div class="shape-letter"></div>',lamp:'<div class="shape-lamp"><i></i></div>',water:'<div class="shape-water"></div>',rain:'<div class="shape-rain"><i></i><b></b><em></em></div>',person:'<div class="shape-person"><i></i><b></b></div>',people:'<div class="shape-person people"><i></i><b></b></div>',brain:'<div class="shape-brain">✦</div>'};
  Object.assign(shapes,{
    cat:'<div class="shape-cat"><i class="ear one"></i><i class="ear two"></i><b class="eye one"></b><b class="eye two"></b><em class="nose"></em><span class="tail"></span></div>',
    dog:'<div class="shape-dog"><i class="ear one"></i><i class="ear two"></i><b class="eye one"></b><b class="eye two"></b><em class="muzzle"></em><span class="tail"></span></div>',
    bird:'<div class="shape-bird"><i class="wing"></i><b class="eye"></b><em class="beak"></em><span class="feet"></span></div>',
    fish:'<div class="shape-fish"><i class="tail"></i><b class="eye"></b><em class="fin"></em><span class="bubble one"></span><span class="bubble two"></span></div>',
    car:'<div class="shape-car"><i class="window"></i><b class="wheel one"></b><b class="wheel two"></b><em class="light"></em></div>',
    flower:'<div class="shape-flower"><i class="petals"></i><b class="center"></b><em class="stem"></em><span class="leaf"></span></div>'
  });
  // Mọi thẻ đều có hình động; từ chưa có mô hình riêng dùng khối chữ 3D chuyển động.
  return `<div class="word-art art-${esc(kind||'abstract')} is-animated" role="img" aria-label="Minh họa động gợi nhớ ${esc(word)}">${shapes[kind]||`<div class="shape-abstract">${esc(word.slice(0,2).toUpperCase())}</div>`}<span class="motion-label">Ảnh động</span><div class="art-pedestal"></div></div>`;
}
reviewBody=function(head,inSession){
  const q=AV.queue||[],c=S.cards.find(x=>x.id===q[0]);
  const modes=`<div class="row">${[['all','Tất cả'],['recognition','Nhớ nghĩa'],['spelling','Viết từ']].map(([v,l])=>`<button class="btn sm ${(S.flashMode||'all')===v?'pri':'ghost'}" data-flash-mode="${v}">${l}</button>`).join('')}<span class="pill">${practiceMode?'Luyện thêm · giữ nguyên lịch':'Đúng lịch ôn'}</span></div>`;
  if(q.length&&!c){AV.queue=q.slice(1);return reviewBody(head,inSession);}
  if(!c){
    const future=S.cards.filter(c=>!c.suspended&&['learning','relearning'].includes(c.schedule.state)&&c.schedule.dueAt>Date.now()).sort((a,b)=>a.schedule.dueAt-b.schedule.dueAt)[0];
    return head+modes+`<section class="sheet empty-review">${wordArt('plant','tiến bộ')}<h3>Đã xong lượt ôn này</h3><p class="lede">${future?`Thẻ học lại tiếp theo sau <b id="next-review-time">${MindScheduler.label(future.schedule.dueAt-Date.now())}</b>. Lịch đã lưu, anh có thể đóng app.`:'Hãy đọc một truyện hoặc thêm vài từ mới. App không tự kéo thẻ chưa đến hạn vào lượt ôn.'}</p><div class="row"><button class="btn pri" data-refresh-review>Kiểm tra thẻ đến hạn</button><button class="btn ghost" data-practice>${practiceMode?'Về ôn đúng lịch':'Luyện thêm'}</button><button class="btn ghost" data-nav="read">Đọc truyện</button></div></section>${inSession?doneBar():''}`;
  }
  const d=detailFor(c),spell=c.mode==='spell',shown=!!AV.shown;
  const image=d.image?`<img class="custom-card-image" src="${safeImage(d.image)}" alt="Minh họa ${esc(c.en)}">`:wordArt(d.art,c.en);
  return head+modes+`<div class="flash-scene"><div class="flash-tilt"><div class="flash-card ${shown?'flipped':''}" id="flashcard">
  <section class="flash-face flash-front" ${shown?'inert aria-hidden="true"':''}><div class="flash-meta"><span class="pill">${q.length} thẻ trong lượt</span><span class="pill">${spell?'Viết từ':'Nhớ nghĩa'}</span></div>
  ${spell?wordArt('brain','tự nhớ'):image}<p class="eyebrow">${spell?'Viết từ tiếng Anh có nghĩa là':'Tự nhớ nghĩa trước khi lật'}</p><h3 class="${spell?'flash-meaning':'flash-word'}">${esc(spell?c.vi:c.en)}</h3>
  ${!spell?`<p class="ipa">${d[S.mind.accent==='en-GB'?'uk':'us']?'/'+esc(d[S.mind.accent==='en-GB'?'uk':'us'])+'/':''} ${d.pos?`<span class="pill">${esc(d.pos)}</span>`:''}</p>`:''}
  ${sayBtn(c.en,'Nghe '+(S.mind.accent==='en-GB'?'Anh–Anh':'Anh–Mỹ'))}
  ${spell?`<label class="flash-caption" for="srsin">Viết bằng bút hoặc nhập bằng bàn phím</label><input class="scribble" id="srsin" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Viết từ tiếng Anh…" value="${esc(AV.res.cur?.got||'')}"><button class="btn pri" id="srscheck">Kiểm tra & lật thẻ ↗</button><button class="btn ghost sm" data-cannot-recall>Chưa nhớ · xem đáp án</button>`:'<button class="btn pri" id="srsflip">Lật thẻ xem nghĩa ↗</button>'}
  <span class="flash-caption">${spell?'Thử tự nhớ trước khi xem đáp án':'Vuốt ngang hoặc chạm để lật thẻ'}</span></section>
  <section class="flash-face flash-back" ${shown?'':'inert aria-hidden="true"'}>${image}<h3 class="flash-word">${esc(c.en)}</h3><p class="ipa">${d[S.mind.accent==='en-GB'?'uk':'us']?'/'+esc(d[S.mind.accent==='en-GB'?'uk':'us'])+'/':''} ${esc(d.pos||'')}</p><p class="flash-meaning">${esc(c.vi)}</p>
  ${d.example?`<div class="context-example"><p lang="en">${esc(d.example)}</p>${d.translation?`<p lang="vi">${esc(d.translation)}</p>`:''}${d.source?`<small>Từ truyện: ${esc(d.source)}</small>`:''}</div>`:`<p class="flash-caption">Thêm câu ví dụ cho từ này trong Từ vựng → Sửa.</p>`}
  ${(d.synonyms?.length||d.antonyms?.length)?`<div class="relations">${d.synonyms?.length?`<p><b>Gần nghĩa:</b> ${esc(d.synonyms.join(', '))}</p>`:''}${d.antonyms?.length?`<p><b>Trái nghĩa:</b> ${esc(d.antonyms.join(', '))}</p>`:''}</div>`:''}
  <div id="flash-result" aria-live="polite"></div><div class="row">${sayBtn(c.en,'Nghe lại')}<button class="btn ghost sm" id="flash-return">↶ Mặt trước</button></div><p class="flash-caption">Vuốt trái: Quên · Vuốt phải: Tốt · Hoặc chọn bên dưới</p></section>
  </div></div></div><div class="flash-actions" id="flash-actions" ${shown?'':'hidden'}>${gradeBar()}</div>`;
};
function safeImage(value){return /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(value||'')?value:'';}

const oldPickVoice=pickVoice;
pickVoice=function(){
  if(!VOICES.length)refreshVoices();
  const allowed=VOICES.filter(v=>navigator.onLine||v.localService);
  const explicit=allowed.find(v=>v.voiceURI===S.voice && v.lang.replace('_','-')===S.mind.accent);
  return explicit||allowed.find(v=>v.lang.replace('_','-')===S.mind.accent)||null;
};
say=function(text,rate){
  if(!window.speechSynthesis){toast('Trình duyệt này chưa hỗ trợ đọc giọng nói.');return;}
  const v=pickVoice();
  if(!v){toast('Chưa có giọng '+S.mind.accent+(navigator.onLine?' trên thiết bị. Chọn giọng khác trong Cài đặt.':' dùng offline. Tải giọng trên thiết bị khi có mạng.'));return;}
  speechSynthesis.cancel();const parts=String(text).match(/[^.!?]+[.!?]*/g)||[text];
  parts.forEach(p=>{const u=new SpeechSynthesisUtterance(p);u.voice=v;u.lang=v.lang;u.rate=rate===.68?.68:S.mind.rate;u.onerror=e=>{if(!['canceled','interrupted'].includes(e.error))toast('Không phát được giọng đọc. Kiểm tra giọng đã tải trong Cài đặt.');};speechSynthesis.speak(u);});
};

function wordList(){
  const map=new Map(Object.entries(DICT).map(([en,vi])=>[en,{en,vi}]));
  Object.entries(VOCAB_DETAILS).forEach(([en,d])=>map.set(en,{en,vi:d.meaning}));
  S.cards.forEach(c=>map.set(normalWord(c.en),{en:c.en,vi:c.vi}));
  Object.entries(S.mydict||{}).forEach(([en,vi])=>{if(!map.has(en))map.set(en,{en,vi});});
  return [...map.values()];
}
function vocabResults(){
  const query=vocabQuery.toLocaleLowerCase('vi');
  const items=wordList().filter(c=>(c.en+' '+c.vi).toLocaleLowerCase('vi').includes(query)).filter(c=>{
    const cards=S.cards.filter(x=>normalWord(x.en)===normalWord(c.en));
    return vocabFilter==='all'||vocabFilter==='mine'&&cards.length||vocabFilter==='due'&&cards.some(x=>!x.suspended&&x.schedule.dueAt<=Date.now());
  }).sort((a,b)=>a.en.localeCompare(b.en));
  const page=items.slice(vocabPage*40,vocabPage*40+40);
  return `<p class="lede" role="status">${items.length} từ · Trang ${vocabPage+1}/${Math.max(1,Math.ceil(items.length/40))}</p><div class="vocab-list">${page.map(c=>{
    const d=detailFor(c),cards=S.cards.filter(x=>normalWord(x.en)===normalWord(c.en));
    return `<article class="vocab-row"><div><b lang="en">${esc(c.en)}</b><p>${esc(c.vi)}</p><small>${d.uk?'/'+esc(d.uk)+'/ · ':''}${esc(d.pos||'Chưa bổ sung từ loại')} ${cards.length?'· Đã thêm vào ôn':''}</small></div><div class="row">${sayBtn(c.en,'Nghe')}<button class="btn sm" data-edit-word="${esc(c.en)}">${cards.length?'Sửa':'Xem / thêm'}</button></div></article>`;
  }).join('')||'<p class="empty">Chưa tìm thấy. Anh có thể thêm từ mới bằng nút phía trên.</p>'}</div><div class="row"><button class="btn ghost" data-vpage="-1" ${vocabPage===0?'disabled':''}>← Trước</button><button class="btn ghost" data-vpage="1" ${(vocabPage+1)*40>=items.length?'disabled':''}>Tiếp →</button></div>`;
}
function editorBody(word){
  const c=wordList().find(c=>normalWord(c.en)===normalWord(word))||{en:'',vi:''},d=detailFor(c),owned=S.cards.some(x=>normalWord(x.en)===normalWord(c.en));
  const field=(name,label,value='',required=false)=>`<label>${label}<input name="${name}" value="${esc(value)}" ${required?'required':''} ${name==='en'&&owned?'readonly':''}></label>`;
  return `<section class="sheet"><button class="btn ghost sm" data-editor-back>← Danh sách từ</button><h2 style="margin:16px 0">${owned?'Chỉnh sửa từ':'Thêm vào bộ thẻ'}</h2><form id="word-form" class="settings-form"><div class="form-grid">${field('en','Từ tiếng Anh',c.en,true)}${field('vi','Nghĩa tiếng Việt',c.vi,true)}${field('uk','IPA Anh–Anh',d.uk)}${field('us','IPA Anh–Mỹ',d.us)}${field('pos','Từ loại',d.pos)}<label>Hình gợi nhớ<select name="art">${['abstract','cat','dog','bird','fish','car','flower','book','plant','sun','moon','cup','clock','house','letter','lamp','water','rain','person','people','brain'].map(k=>`<option value="${k}" ${k===(d.art||'abstract')?'selected':''}>${({abstract:'Thẻ chữ',cat:'Mèo · động',dog:'Chó · động',bird:'Chim · động',fish:'Cá · động',car:'Ô tô · động',flower:'Hoa · động',book:'Sách',plant:'Cây',sun:'Mặt trời',moon:'Mặt trăng',cup:'Tách',clock:'Đồng hồ',house:'Nhà',letter:'Thư',lamp:'Đèn',water:'Nước',rain:'Mưa',person:'Một người',people:'Nhiều người',brain:'Ghi nhớ'})[k]}</option>`).join('')}</select></label></div>
  ${field('example','Câu ví dụ tiếng Anh',d.example)}${field('translation','Bản dịch ví dụ',d.translation)}${field('synonyms','Từ gần nghĩa (cách nhau bằng dấu phẩy)',d.synonyms?.join(', '))}${field('antonyms','Từ trái nghĩa (cách nhau bằng dấu phẩy)',d.antonyms?.join(', '))}
  <label>Ảnh của anh (PNG/JPG/WebP, tối đa 1 MB)<input type="file" id="word-image" accept="image/png,image/jpeg,image/webp"></label>${d.image?'<label class="checkline"><input type="checkbox" name="removeImage"> Bỏ ảnh riêng, dùng hình gợi nhớ</label>':''}
  <div class="row"><button class="btn pri" type="submit">${owned?'Lưu thay đổi':'Lưu & tạo 2 thẻ học'}</button>${owned?`<button type="button" class="btn ghost" data-suspend-word="${esc(c.en)}">${S.cards.filter(x=>normalWord(x.en)===normalWord(c.en)).every(x=>x.suspended)?'Tiếp tục ôn từ này':'Tạm ngưng ôn từ này'}</button>`:''}</div><p class="lede" id="word-form-status" role="status"></p></form></section>`;
}
function viewVocabulary(){return `<div class="col wide"><div class="eyebrow">Từ vựng của anh</div>${editingWord!==null?editorBody(editingWord):`<h2 class="big">Tìm, hiểu, rồi ghi nhớ.</h2><div class="row"><input id="vocab-search" class="search-input" placeholder="Tìm từ tiếng Anh hoặc nghĩa tiếng Việt…" aria-label="Tìm từ" value="${esc(vocabQuery)}"><button class="btn pri" data-add-word>+ Thêm từ</button></div><div class="row">${[['all','Tất cả'],['mine','Đang học'],['due','Đến hạn']].map(([k,l])=>`<button class="btn sm ${vocabFilter===k?'pri':'ghost'}" data-vfilter="${k}">${l}</button>`).join('')}</div><div id="vocab-results">${vocabResults()}</div>`}</div>`;}

function learningStats(){
  const logs=S.reviewLog.filter(e=>e.kind!=='practice'),days=logs.map(e=>e.studyDate),today=mindToday();
  const counts={new:0,learning:0,mature:0};
  const groups=new Map();S.cards.forEach(c=>{const k=normalWord(c.en);groups.set(k,[...(groups.get(k)||[]),c]);});
  groups.forEach(cards=>{if(cards.every(c=>c.schedule.state==='new'))counts.new++;else if(cards.every(c=>c.schedule.state==='review'&&c.schedule.intervalDays>=21))counts.mature++;else counts.learning++;});
  const todayLogs=logs.filter(e=>e.studyDate===today);
  return {logs,days,today,counts,words:groups.size,streak:MindScheduler.streak(days,today),todayCount:todayLogs.length,todayWords:new Set(todayLogs.map(e=>normalWord(e.word))).size};
}
function analyticsBody(){
  const st=learningStats(),total=st.words||1;
  const seven=Array.from({length:7},(_,i)=>{const d=new Date(st.today+'T12:00:00Z');d.setUTCDate(d.getUTCDate()-6+i);const key=d.toISOString().slice(0,10);return {key,n:st.logs.filter(e=>e.studyDate===key).length};});
  const max=Math.max(1,...seven.map(d=>d.n));
  return `<div class="grid g3"><div class="stat"><b>${st.streak}</b><span>ngày học liên tiếp</span></div><div class="stat"><b>${st.todayCount}/${S.mind.goal}</b><span>lượt ôn hôm nay · ${st.todayWords} từ</span></div><div class="stat"><b>${st.words}</b><span>từ trong bộ thẻ · ${S.cards.length} thẻ</span></div></div>
  <section class="sheet"><h3>Trí nhớ đang lớn lên</h3><p class="lede">Theo từ, gộp cả thẻ nhớ nghĩa và viết. “Ôn dài hạn” là khoảng ôn từ 21 ngày, không có nghĩa là nhớ vĩnh viễn.</p><div class="memory-bar" role="img" aria-label="${st.counts.new} từ mới, ${st.counts.learning} đang học, ${st.counts.mature} ôn dài hạn">${['new','learning','mature'].map(k=>`<span class="memory-${k}" style="width:${st.counts[k]/total*100}%"></span>`).join('')}</div><div class="row">${[['new','Mới'],['learning','Đang học'],['mature','Ôn dài hạn']].map(([k,l])=>`<span class="pill">${l}: ${st.counts[k]}</span>`).join('')}</div></section>
  <section class="sheet"><h3>7 ngày gần đây</h3><div class="week-chart" role="img" aria-label="${seven.map(d=>d.key+': '+d.n+' lượt').join('; ')}">${seven.map(d=>`<div><b>${d.n}</b><span style="height:${Math.max(3,d.n/max*100)}px"></span><small>${d.key.slice(8)}/${d.key.slice(5,7)}</small></div>`).join('')}</div></section>
  <section class="sheet"><h3>Chia sẻ một bước tiến</h3><p class="lede">Tạo ảnh học tập để anh tự đăng. Không tự gửi hoặc đăng lên mạng xã hội.</p><button class="btn pri" id="share-progress">Tạo ảnh thành tích</button><div id="share-output"></div></section>
  <section class="sheet"><h3>Lượt ôn gần nhất</h3>${S.reviewLog.slice(-10).reverse().map(e=>`<div class="kv"><span>${esc(e.word)} · ${['Quên','Khó','Tốt','Dễ'][e.rating]} ${e.kind==='practice'?'· luyện thêm':''}</span><small>${new Date(e.at).toLocaleString('vi-VN',{timeZone:S.mind.timezone})}</small></div>`).join('')||'<p class="lede">Lịch sử chi tiết bắt đầu từ bản nâng cấp này. Tiến độ cũ được giữ nhưng không được dựng thành lượt ôn giả.</p>'}</section>`;
}
function settingsBody(){
  refreshVoices();
  return `<form id="mind-settings" class="sheet settings-form"><h3>Nhịp học của anh</h3><div class="form-grid"><label>Mục tiêu lượt ôn/ngày<input name="goal" type="number" min="1" max="500" value="${S.mind.goal}" required></label><label>Thẻ mới tối đa/ngày<input name="newLimit" type="number" min="0" max="100" value="${S.mind.newLimit}" required></label><label>Múi giờ ngày học<select name="timezone">${[...new Set([S.mind.timezone,'Asia/Ho_Chi_Minh','Asia/Bangkok','Asia/Tokyo','Europe/London','America/New_York'])].map(z=>`<option ${z===S.mind.timezone?'selected':''}>${esc(z)}</option>`).join('')}</select></label><label>Giao diện<select name="theme">${[['auto','Theo thiết bị'],['light','Sáng'],['dark','Tối']].map(([k,l])=>`<option value="${k}" ${S.theme===k?'selected':''}>${l}</option>`).join('')}</select></label><label>Giọng phát âm<select name="accent"><option value="en-US" ${S.mind.accent==='en-US'?'selected':''}>Anh–Mỹ</option><option value="en-GB" ${S.mind.accent==='en-GB'?'selected':''}>Anh–Anh</option></select></label><label>Tốc độ đọc<input name="rate" type="number" min="0.5" max="1.4" step="0.05" value="${S.mind.rate}" required></label><label>Cỡ chữ truyện<input name="fontSize" type="number" min="16" max="30" value="${S.mind.fontSize}" required></label><label>Cách xen kẽ bản dịch<select name="readerMode"><option value="chunks" ${S.mind.readerMode==='chunks'?'selected':''}>Cụm ngắn Anh–Việt</option><option value="sentences" ${S.mind.readerMode==='sentences'?'selected':''}>Theo câu đầy đủ</option></select></label></div><label class="checkline"><input type="checkbox" name="reduceMotion" ${S.mind.reduceMotion?'checked':''}> Giảm chuyển động / tắt nghiêng 3D</label><button class="btn pri" type="submit">Lưu cài đặt</button><p id="settings-result" role="status"></p></form>
  <section class="sheet"><h3>Giọng đọc trên thiết bị</h3><p class="lede">${VOICES.filter(v=>v.lang.replace('_','-')===S.mind.accent).map(v=>esc(v.name)+' · '+(v.localService?'trên thiết bị':'cần mạng')).join('<br>')||'Chưa có giọng '+esc(S.mind.accent)+'. Hãy tải giọng trong cài đặt hệ điều hành hoặc chọn giọng khác.'}</p><div class="row" style="margin-top:12px">${sayBtn('A little practice every day makes a difference.','Nghe thử')}<button class="btn ghost" id="refresh-voices">Kiểm tra lại giọng</button></div></section>
  <section class="sheet"><h3>Dữ liệu & offline</h3><p class="lede" id="storage-status">${esc(storageError||MindStore.status)}</p><p class="lede">Từ vựng, lịch ôn, lịch sử và cài đặt lưu trên máy bằng IndexedDB. Nét bút giữ trong kho Inklish cũ. Offline khả dụng sau khi tài nguyên đã tải xong.</p><p id="offline-status" role="status">Đang kiểm tra bộ nhớ offline…</p><div class="row"><button class="btn" id="backup-full">Xuất sao lưu đầy đủ</button><label class="btn ghost">Nhập bản sao lưu<input id="restore-full" type="file" accept="application/json" hidden></label><button class="btn ghost" id="persist-storage">Giữ dữ liệu trên thiết bị</button></div><div id="restore-preview"></div></section>
  <section class="sheet"><h3>Màn hình chính & widget</h3><p class="lede">Bản này cài được như web app. Widget màn hình khóa / màn hình chính của iPad và Android chưa có trong bản web; cần ứng dụng native và phần mở rộng riêng. Thẻ bên dưới là xem nhanh trong app, không phải widget hệ điều hành.</p><button class="btn ghost" id="install-app">Thêm app vào màn hình chính</button><p id="install-help" class="lede"></p>${quickCard()}</section>`;
}
function quickCard(){const c=dueCards()[0]||S.cards.find(c=>!c.suspended);return c?`<div class="quick-card"><span class="eyebrow">Xem nhanh trong app</span><b>${esc(c.en)}</b><span>${esc(c.vi)}</span><button class="btn sm" data-nav="srs">Mở lượt ôn</button></div>`:'';}
const originalSettingsBody=settingsBody;
settingsBody=function(){
  return originalSettingsBody().replace(/<label>Cách xen kẽ bản dịch[\s\S]*?<\/label>/,'<div class="note">Bản dịch luôn theo nguyên câu: một câu tiếng Anh, ngay dưới là nguyên câu tiếng Việt. Câu dài tự xuống dòng theo chiều rộng iPad.</div>');
};
viewProg=function(){return `<div class="col wide"><div class="eyebrow">Tiến trình thật, nhịp học nhẹ nhàng</div><h2 class="big">${progressTab==='analytics'?'Mỗi ngày một chút.':'Cài đặt của anh.'}</h2><div class="row"><button class="btn ${progressTab==='analytics'?'pri':'ghost'}" data-progress-tab="analytics">Thống kê</button><button class="btn ${progressTab==='settings'?'pri':'ghost'}" data-progress-tab="settings">Cài đặt & sao lưu</button></div>${progressTab==='analytics'?analyticsBody():settingsBody()}</div>`;};

const oldTodayComplete=viewToday;
viewToday=function(){const st=learningStats();return oldTodayComplete().replace('</section>',`<div class="home-progress"><span>${st.streak} ngày liên tiếp</span><span>${st.todayCount}/${S.mind.goal} lượt hôm nay</span><span>${dueCards().length} thẻ đến hạn</span></div></section>`);};
NAV.splice(3,0,['vocab','Từ vựng','book']);
const beforeCompleteRender=render;
render=function(){
  clearTimeout(reviewTimer);closePop();
  if(VIEW==='vocab'&&!AV){renderNav();renderRail();const pane=$('#pane');pane.scrollTop=0;pane.innerHTML=viewVocabulary();mount();}
  else beforeCompleteRender();
  if((VIEW==='srs'||AV?.key==='review')&&!AV?.queue?.length){const next=S.cards.filter(c=>!c.suspended&&c.schedule.state!=='new'&&c.schedule.dueAt>Date.now()).sort((a,b)=>a.schedule.dueAt-b.schedule.dueAt)[0];if(next)reviewTimer=setTimeout(()=>{if(document.hidden)return;if(VIEW==='srs')renewReview();else if(AV?.key==='review'){AV.queue=buildQueue();render();}},Math.max(1000,Math.min(next.schedule.dueAt-Date.now(),2147483647)));}
};
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&VIEW==='srs'&&!AV?.queue?.length)renewReview();});
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();appInstallPrompt=e;});

function bindVocabResults(){
  $$('[data-edit-word]').forEach(b=>b.onclick=()=>{editingWord=b.dataset.editWord;render();});
  $$('[data-vpage]').forEach(b=>b.onclick=()=>{vocabPage=Math.max(0,vocabPage+Number(b.dataset.vpage));$('#vocab-results').innerHTML=vocabResults();bindVocabResults();$('#pane').scrollTop=0;});
}
const beforeCompleteMount=mount;
mount=function(){
  beforeCompleteMount();const pane=$('#pane');
  $$('[data-grade]',pane).forEach(b=>b.onclick=()=>submitRating(+b.dataset.grade));
  const noRecall=$('[data-cannot-recall]',pane);if(noRecall)noRecall.onclick=()=>{AV.shown=true;const card=$('#flashcard');card.classList.add('flipped');$('.flash-front',card).inert=true;$('.flash-front',card).setAttribute('aria-hidden','true');$('.flash-back',card).inert=false;$('.flash-back',card).setAttribute('aria-hidden','false');$('#flash-actions').hidden=false;$('#flash-return').focus({preventScroll:true});};
  const scene=$('.flash-scene',pane);if(scene){let start=null;scene.onpointerdown=e=>{if(e.pointerType==='pen'||e.target.closest('button,input'))return;start={x:e.clientX,y:e.clientY};};scene.onpointercancel=()=>start=null;scene.onpointerup=e=>{if(!start)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;start=null;if(Math.abs(dx)<80||Math.abs(dy)>45)return;if(AV.shown)submitRating(dx>0?2:0);else ($('#srsflip')||$('[data-cannot-recall]'))?.click();};if(S.mind.reduceMotion)scene.onpointermove=null;}
  const refresh=$('[data-refresh-review]',pane);if(refresh)refresh.onclick=()=>{if(AV.standalone)renewReview();else{AV.queue=buildQueue();render();}};
  const practice=$('[data-practice]',pane);if(practice)practice.onclick=()=>{practiceMode=!practiceMode;renewReview();};
  $$('[data-flash-mode]',pane).forEach(b=>b.onclick=()=>{S.flashMode=b.dataset.flashMode;AV.queue=buildQueue();AV.shown=false;AV.res={};save();render();});
  const search=$('#vocab-search',pane);if(search)search.oninput=()=>{vocabQuery=search.value;vocabPage=0;$('#vocab-results').innerHTML=vocabResults();bindVocabResults();};
  $$('[data-vfilter]',pane).forEach(b=>b.onclick=()=>{vocabFilter=b.dataset.vfilter;vocabPage=0;render();});
  const add=$('[data-add-word]',pane);if(add)add.onclick=()=>{editingWord='';render();};
  const back=$('[data-editor-back]',pane);if(back)back.onclick=()=>{editingWord=null;render();};
  bindVocabResults();
  const form=$('#word-form',pane);if(form)form.onsubmit=async e=>{
    e.preventDefault();const data=new FormData(form),en=data.get('en').trim(),vi=data.get('vi').trim();if(!en||!vi)return;
    const status=$('#word-form-status'),key=normalWord(en);status.textContent='Đang lưu…';
    let image=S.details[key]?.image||'';const file=$('#word-image').files[0];
    if(file){if(file.size>1024*1024||!['image/png','image/jpeg','image/webp'].includes(file.type)){status.textContent='Chọn PNG/JPG/WebP không quá 1 MB.';return;}try{image=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file);});}catch(e){status.textContent='Không đọc được ảnh.';return;}}
    if(data.has('removeImage'))image='';
    S.details[key]={uk:data.get('uk').trim(),us:data.get('us').trim(),pos:data.get('pos').trim(),art:data.get('art'),example:data.get('example').trim(),translation:data.get('translation').trim(),synonyms:data.get('synonyms').split(',').map(x=>x.trim()).filter(Boolean),antonyms:data.get('antonyms').split(',').map(x=>x.trim()).filter(Boolean),image};
    S.mydict[key]=vi;if(!S.cards.some(c=>normalWord(c.en)===key))addWord(en,vi,'từ điển');
    S.cards.filter(c=>normalWord(c.en)===key).forEach(c=>c.vi=vi);await save(true);status.textContent=storageError||'Đã lưu. Từ này có hai thẻ: nhớ nghĩa và viết từ.';
  };
  const suspend=$('[data-suspend-word]',pane);if(suspend)suspend.onclick=()=>{const cards=S.cards.filter(c=>normalWord(c.en)===normalWord(suspend.dataset.suspendWord));const paused=cards.every(c=>c.suspended);cards.forEach(c=>c.suspended=!paused);save(true);render();};
  $$('[data-progress-tab]',pane).forEach(b=>b.onclick=()=>{progressTab=b.dataset.progressTab;render();});
  const settings=$('#mind-settings',pane);if(settings)settings.onsubmit=async e=>{e.preventDefault();const d=new FormData(settings);S.mind={...S.mind,goal:+d.get('goal'),newLimit:+d.get('newLimit'),timezone:d.get('timezone'),accent:d.get('accent'),rate:+d.get('rate'),fontSize:+d.get('fontSize'),readerMode:d.get('readerMode'),reduceMotion:d.has('reduceMotion')};S.theme=d.get('theme');S.voice=null;if(S.theme==='auto')delete document.documentElement.dataset.theme;else document.documentElement.dataset.theme=S.theme;applyPreferences();await save(true);render();$('#settings-result').textContent='Đã lưu cài đặt.';};
  const voices=$('#refresh-voices',pane);if(voices)voices.onclick=()=>{refreshVoices();render();};
  const persist=$('#persist-storage',pane);if(persist)persist.onclick=async()=>{const granted=await navigator.storage?.persist?.();toast(granted?'Trình duyệt đã cấp lưu trữ bền vững.':'Trình duyệt chưa cấp lưu trữ bền vững. Anh vẫn có thể xuất sao lưu.');};
  const install=$('#install-app',pane);if(install)install.onclick=async()=>{if(appInstallPrompt){await appInstallPrompt.prompt();appInstallPrompt=null;}else $('#install-help').textContent=/iPad|iPhone|Macintosh/.test(navigator.userAgent)?'Trên Safari iPad: Chia sẻ → Thêm vào Màn hình chính. Cần mở app bằng địa chỉ HTTPS.':'Mở menu trình duyệt → Cài đặt ứng dụng / Thêm vào màn hình chính khi dùng địa chỉ HTTPS.';};
  const backup=$('#backup-full',pane);if(backup)backup.onclick=exportFull;
  const restore=$('#restore-full',pane);if(restore)restore.onchange=()=>previewRestore(restore.files[0]);
  const share=$('#share-progress',pane);if(share)share.onclick=shareProgress;
  if($('#offline-status'))offlineStatus();
};

async function offlineStatus(){
  const node=$('#offline-status');if(!node)return;
  try{const keys=await caches.keys(),key=keys.find(k=>k.startsWith('inklish-complete-'));if(!key){node.textContent='Chưa có gói offline hoàn chỉnh. Mở app qua HTTPS hoặc localhost và tải lại sau lần đầu.';return;}const cache=await caches.open(key),paths=['index.html','complete.js','scheduler.js','vocabulary.js','stories.js','experience.js','complete.css'];const ready=(await Promise.all(paths.map(p=>cache.match(new URL(p,location.href).href)))).every(Boolean);node.textContent=ready?'Đã lưu gói học offline. Giọng đọc cần có sẵn trên thiết bị.':'Gói offline đang tải; hãy giữ mạng và tải lại app.';}catch(e){node.textContent='Trình duyệt này chưa cho phép kiểm tra bộ nhớ offline.';}
}
function downloadBlob(blob,name){const a=document.createElement('a'),url=URL.createObjectURL(blob);a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);}
async function exportFull(){
  const button=$('#backup-full');if(button)button.disabled=true;
  try{await save(true);const ink={};for(const k of await idb.keys()||[])ink[k]=await idb.get(k);downloadBlob(new Blob([JSON.stringify({app:'inklish',schema:3,at:new Date().toISOString(),S,ink})],{type:'application/json'}),'inklish-full-'+mindToday()+'.json');toast('Đã tạo file sao lưu gồm tiến độ, nét viết và lịch sử ôn.');}catch(e){toast('Không xuất được sao lưu. Hãy thử lại.','bad');}finally{if(button)button.disabled=false;}
}
function validBackup(data){
  if(!data||!data.S||!Array.isArray(data.S.cards))throw new Error('Không phải bản sao lưu Inklish');
  const ids=new Set();for(const c of data.S.cards){if(typeof c.id!=='string'||ids.has(c.id)||typeof c.en!=='string'||typeof c.vi!=='string')throw new Error('Thẻ sai cấu trúc hoặc trùng ID');ids.add(c.id);if(c.schedule&&(!Number.isFinite(c.schedule.dueAt)||!Number.isFinite(c.schedule.ease)||c.schedule.ease<1.3||!['new','learning','review','relearning'].includes(c.schedule.state)))throw new Error('Lịch ôn không hợp lệ');}
  if(data.S.reviewLog&&(!Array.isArray(data.S.reviewLog)||data.S.reviewLog.some(e=>!e.before||!Number.isFinite(e.at)||!Number.isInteger(e.rating)||e.rating<0||e.rating>3)))throw new Error('Lịch sử ôn không hợp lệ');
  return data;
}
async function previewRestore(file){
  if(!file)return;const box=$('#restore-preview');
  try{if(file.size>40*1024*1024)throw new Error('File lớn hơn 40 MB');const data=validBackup(JSON.parse(await file.text()));box.innerHTML=`<p class="note">Bản sao lưu có ${data.S.cards.length} thẻ, ${(data.S.reviewLog||[]).length} lượt ôn và ${Object.keys(data.ink||{}).length} mục nét viết. Áp dụng sẽ thay tiến độ hiện tại; bản hiện tại được giữ để hoàn tác trong phiên này.</p><button class="btn pri" id="apply-restore">Áp dụng bản sao lưu</button>`;
    $('#apply-restore').onclick=async()=>{const previous=structuredClone(S),oldInk={};const btn=$('#apply-restore');btn.disabled=true;try{for(const k of Object.keys(data.ink||{}))oldInk[k]=await idb.get(k);S={...BLANK,...data.S};S.metrics={wpm:[],speak:[],write:[],...S.metrics};S.seeded=S.seeded||{};S.sess=S.sess||{};S.read=S.read||{};S.words=S.words||{};S.mydict=S.mydict||{};S.texts=S.texts||[];S.writes=S.writes||[];ensureMind();for(const [k,v] of Object.entries(data.ink||{}))await idb.set(k,v);S._savedAt=Date.now();await MindStore.write(S);try{localStorage.setItem(LS,JSON.stringify(S));}catch(e){}box.innerHTML='<p class="note">Đã nhập. Lượt ôn đang mở sẽ được tạo lại.</p><button class="btn ghost" id="undo-restore">Hoàn tác lần nhập này</button>';AV=null;$('#undo-restore').onclick=async()=>{S=previous;for(const [k,v] of Object.entries(oldInk)){if(v==null)await idb.del(k);else await idb.set(k,v);}applyPreferences();await save(true);render();toast('Đã hoàn tác nhập dữ liệu.');};}catch(e){S=previous;for(const [k,v] of Object.entries(oldInk)){if(v==null)await idb.del(k);else await idb.set(k,v);}box.textContent='Không nhập được: '+e.message;}};
  }catch(e){box.textContent='Không đọc được bản sao lưu: '+e.message;}
}
async function shareProgress(){
  const st=learningStats(),canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1350;const ctx=canvas.getContext('2d');
  const g=ctx.createLinearGradient(0,0,1080,1350);g.addColorStop(0,'#e5f3ec');g.addColorStop(1,'#e8e7f7');ctx.fillStyle=g;ctx.fillRect(0,0,1080,1350);ctx.fillStyle='#153c38';ctx.font='bold 45px sans-serif';ctx.fillText('INKLISH · MỖI NGÀY MỘT CHÚT',80,130);ctx.font='bold 240px sans-serif';ctx.fillText(String(st.streak),80,470);ctx.font='50px sans-serif';ctx.fillText('ngày học liên tiếp',80,565);ctx.fillStyle='#fff';ctx.fillRect(80,680,920,300);ctx.fillStyle='#153c38';ctx.font='bold 60px sans-serif';ctx.fillText(st.todayCount+' lượt ôn hôm nay',120,790);ctx.font='40px sans-serif';ctx.fillText(st.words+' từ trong bộ thẻ của mình',120,885);ctx.font='36px sans-serif';ctx.fillText('Nhớ từng từ. Mở từng thế giới.',80,1150);ctx.font='30px sans-serif';ctx.fillText(st.today+' · Không cần học vội.',80,1230);
  const image=document.createElement('img');image.src=canvas.toDataURL('image/png');image.alt='Ảnh thành tích học tập để chia sẻ';image.style.maxWidth='280px';const box=$('#share-output');box.replaceChildren(image);const button=document.createElement('button');button.className='btn';button.textContent='Tải ảnh PNG';button.onclick=()=>canvas.toBlob(blob=>downloadBlob(blob,'inklish-progress-'+st.today+'.png'));box.append(button);
}
