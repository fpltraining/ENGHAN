/* Nâng cấp trải nghiệm; giữ nguyên dữ liệu, thuật toán và các hoạt động Inklish. */
const ART_SYMBOLS = {train:'🚂',plant:'🌱',rain:'☂️',bread:'🥐',lamp:'💡',letter:'✉️'};
function sculpture(kind='book') {
  return `<div class="sculpture" aria-hidden="true">${ART_SYMBOLS[kind] ? `<span class="sculpture-symbol">${ART_SYMBOLS[kind]}</span>` : '<div class="mini-book">Aa</div>'}<span class="sculpture-spark">✦</span></div>`;
}

const originalViewToday=viewToday;
viewToday=function(){
  const n=viewSession(),steps=blocksFor(n),record=sess()[n]||{blocks:{}},next=Math.max(0,steps.findIndex((_,i)=>!record.blocks[i]));
  const finished=steps.every((_,i)=>record.blocks[i]);
  return `<section class="library-hero home-intro guided-hero"><div><div class="eyebrow">${esc(STAGES[S.stage].name)} · buổi ${n}/${total()} · 45 phút</div><h2>${finished?'Hoàn thành buổi hôm nay.':'Chỉ cần làm bước tiếp theo.'}</h2><p class="lede">${finished?'Ngày mai app tự đưa anh sang buổi kế tiếp.':`Bước ${next+1}/5 · ${esc(steps[next].label)} · ${steps[next].min} phút`}</p><div class="row" style="margin-top:16px">${finished?'<button class="btn pri" data-nav="prog">Xem tiến độ ↗</button>':`<button class="btn pri" data-blk="${next}">Tiếp tục bài hôm nay ↗</button>`}<button class="btn ghost" data-route-info>Xem đường học</button></div></div>${sculpture()}</section>
  <section class="sheet route-strip"><div class="eyebrow">Hôm nay · học theo thứ tự</div><div class="route-steps">${steps.map((s,i)=>`<button data-blk="${i}" class="route-step ${record.blocks[i]?'done':i===next?'current':''}"><span>${record.blocks[i]?'✓':i+1}</span><b>${esc(s.label)}</b><small>${s.min}′</small></button>`).join('')}</div></section>
  <details class="sheet learning-route" id="learning-route"><summary>Lộ trình từ mất gốc đến giao tiếp độc lập</summary><ol><li><b>Chặng 0 · 30 buổi:</b> âm, 600 từ lõi, câu căn bản.</li><li><b>Chặng 1 · 90 buổi:</b> giao tiếp A1–B1 qua truyện và hội thoại.</li><li><b>Chặng 2 · 120 buổi:</b> nghe nói tự nhiên, B1–B2.</li><li><b>Chặng 3 · 90 buổi:</b> viết, trình bày và tranh luận B2.</li><li><b>Chặng 4 · 240 buổi:</b> nội dung nguyên bản, hướng tới C1.</li></ol><p class="lede">Tổng 570 buổi × 45 phút. App mở đúng một buổi hiện tại; hoàn tất đủ 5 bước mới chuyển tiếp.</p></details>${finished&&curSession()>=total()&&S.stage<4?`<button class="btn pri" data-stage="${S.stage+1}">Mở chặng tiếp theo ↗</button>`:''}`;
};

const originalViewRead = viewRead;
viewRead = function () {
  if (S.readBook !== 'extra') {
    if(S.readBook==='m')return originalViewRead().replace('<div class="row" style="margin-bottom:2px">', `<div class="row" style="margin-bottom:2px"><button class="btn sm" data-rbook="extra">✦ ${EXTRA_STORIES.length} truyện mới</button>`);
    const stageA=S.readBook==='a',list=stageA?D.sa.chapters:D.sb.chapters,book=stageA?D.sa:D.sb;
    const sel=S.readSel==null?0:clamp(S.readSel,0,list.length-1),ch=list[sel],vi=stageA?ch.vi_:D.svi[ch.n];
    return `<div class="col wide"><div class="row"><button class="btn sm" data-rbook="extra">✦ ${EXTRA_STORIES.length} truyện mới</button><button class="btn sm ${stageA?'pri':'ghost'}" data-rbook="a">Truyện A1 gốc</button><button class="btn sm ${stageA?'ghost':'pri'}" data-rbook="b">Truyện B1 gốc</button></div>
      <section class="sheet lift"><div class="eyebrow">${stageA?'A1 · câu ngắn':'B1 · từng câu Anh–Việt'}</div><h2 class="big">${esc(book.title)}</h2><p class="lede">${esc(book.blurb||book.vi||'')}</p><div class="tabs" style="margin-top:14px">${list.map((c,i)=>`<button data-ch="${i}" aria-selected="${i===sel}">${c.n}. ${esc(c.title)}</button>`).join('')}</div></section>
      ${storyBody(ch,vi,(stageA?'a':'w')+ch.n)}</div>`;
  }
  const chosen = EXTRA_STORIES.find(s => s.id === S.extraStory);
  const visible = EXTRA_STORIES.filter(s => !S.storyLevel || S.storyLevel === 'all' || s.level === S.storyLevel);
  return `<div class="col wide">
    <div class="row"><button class="btn pri sm" data-rbook="extra">✦ Truyện mới</button><button class="btn sm" data-rbook="a">Truyện A1 gốc</button><button class="btn sm" data-rbook="b">Truyện B1 gốc</button></div>
    ${chosen ? `<button class="btn ghost sm" data-library style="align-self:flex-start">← Kho truyện</button>${storyBody({n:EXTRA_STORIES.indexOf(chosen)+1,title:chosen.title,vi:chosen.vi,text:chosen.pairs.map(p=>p[0]),pairs:chosen.pairs},chosen.pairs.map(p=>p[1]),'extra:'+chosen.id)}` : `
    <div class="library-hero"><div><div class="eyebrow">Mỗi ngày, một câu chuyện</div><h2>Đọc một chút.<br>Nhớ nhiều hơn.</h2><p class="lede">${EXTRA_STORIES.length} truyện · A1–B1 · từng câu Anh–Việt</p></div>${sculpture()}</div>
    <div class="row" aria-label="Trình độ truyện">${['all','A1','A2','B1'].map(v=>`<button class="btn sm ${((S.storyLevel||'all')===v)?'pri':'ghost'}" data-level="${v}">${v==='all'?'Tất cả':v}</button>`).join('')}</div>
    <div class="story-grid">${visible.map(s=>`<button class="story-tile" data-story="${s.id}">${sculpture(s.icon)}<span class="pill">${s.level} · ${s.pairs.length} cặp câu</span><b>${esc(s.title)}</b><small>${esc(s.vi)}</small><span class="flash-caption">${S.read['extra:'+s.id]?'✓ Đã đọc':'Đọc truyện →'}</span></button>`).join('')}</div>`}
  </div>`;
};

/* Chỉ ghép theo câu hoàn chỉnh. Không chia một câu thành các cụm dịch rời. */
function alignedPairs(en, vi) {
  const split = text => (String(text).match(/[^.!?]+(?:[.!?]+[”"’']*|$)/g)||[String(text)]).map(x=>x.trim()).filter(Boolean);
  const a=split(en), b=split(vi);
  const clean=text=>String(text).replace(/\s+/g,' ').trim();
  const intact=clean(a.join(' '))===clean(en)&&clean(b.join(' '))===clean(vi);
  return a.length===b.length&&intact ? a.map((text,i)=>[text,b[i]]) : [[en,vi]];
}
function completeSentencePairs(pairs) {
  const out=[];let en='',vi='';
  for(const pair of pairs){
    en+=(en?' ':'')+pair[0];vi+=(vi?' ':'')+pair[1];
    if(/[.!?][”"’']*$/.test(en.trim())){out.push([en,vi]);en='';vi='';}
  }
  if(en||vi)out.push([en,vi]);
  return out;
}
storyBody = function(ch, vi, key) {
  const paras=ch.text||ch.en||[];
  const showVi=S.showVi!==false;
  const pairs=completeSentencePairs(ch.pairs || paras.flatMap((p,i)=>alignedPairs(p,vi && vi[i] || '')));
  return `<section class="sheet reader-section">
    <div class="row split" style="margin-bottom:18px"><div><div class="eyebrow">Đọc song ngữ · ${pairs.length} cặp câu</div><h2 class="mid en">${esc(ch.title)}</h2>${ch.vi?`<p class="lede">${esc(ch.vi)}</p>`:''}</div><span class="row">${sayBtn(paras.join(' '),'Nghe truyện')}<button class="btn ghost sm" id="vibtn" aria-pressed="${showVi}">${showVi?'Ẩn':'Hiện'} tiếng Việt</button><button class="btn ghost sm" id="inkbtn" aria-pressed="${!!S.inkOn}">${svg('pen')}Ghi chú</button></span></div>
    ${ch.note?`<p class="note" style="margin-bottom:15px">${esc(ch.note)}</p>`:''}
    <div class="readwrap" id="readwrap" data-story-key="${esc(key)}"><div class="reader" id="reader">${pairs.map(([en,translation],i)=>`<div class="bilingual-pair ${showVi?'':'translation-off'}"><div class="story-line"><p class="story-en" lang="en" data-p="${i}">${tokenize(en)}</p><button class="line-audio" data-line-say="${esc(en)}" aria-label="Nghe câu ${i+1}">▶</button></div>${showVi && translation?`<p class="vi story-vi" lang="vi">${esc(translation)}</p>`:''}</div>`).join('')}</div>${S.inkOn?'<div id="inkoverlay"></div>':''}</div>
    <p class="lede" style="margin-top:16px">Chạm từ tiếng Anh để tra nghĩa, nghe và thêm vào thẻ ôn. Mỗi câu tiếng Anh đi với nguyên câu tiếng Việt ngay bên dưới; câu dài tự xuống nhiều dòng và không bị cắt.</p>
    <div class="row" style="margin-top:12px"><button class="btn sm" id="markread" data-chid="${esc(key)}">${svg('check')}${S.read[key]?'Đã đọc xong':'Đánh dấu đã đọc'}</button></div>
  </section>`;
};

const originalBuildQueue=buildQueue;
buildQueue=function(){
  if(!S.flashMode||S.flashMode==='all')return originalBuildQueue();
  // Lọc loại thẻ trước khi giới hạn số lượng để không bỏ sót thẻ đúng chế độ.
  const mode=S.flashMode==='recognition'?'recall':'spell', today=TODAY();
  const cards=S.cards.filter(c=>c.mode===mode);
  let pool=cards.filter(c=>(c.due||today)<=today);
  if(pool.length<8)pool=pool.concat(cards.filter(c=>(c.due||today)>today).sort((a,b)=>(a.due||'').localeCompare(b.due||'')).slice(0,8-pool.length));
  return pool.sort((a,b)=>(a.st||0)-(b.st||0)).slice(0,40).map(c=>c.id);
};

reviewBody = function(head,inSession) {
  const q=AV.queue||[], c=S.cards.find(x=>x.id===q[0]);
  if(q.length && !c){AV.queue=q.slice(1);return reviewBody(head,inSession);}
  const modes=inSession?'':`<div class="row">${[['all','Tất cả'],['recognition','Nhớ nghĩa'],['spelling','Viết từ']].map(([v,label])=>`<button class="btn sm flash-mode ${(S.flashMode||'all')===v?'pri':'ghost'}" data-flash-mode="${v}">${label}</button>`).join('')}</div>`;
  if(!c) return head+modes+`<section class="sheet"><div class="empty">Đã hết thẻ trong lượt ôn này.<br>Thêm từ từ bài đọc hoặc chọn chế độ học khác.</div></section>${inSession?doneBar():''}`;
  const spell=c.mode==='spell', shown=!!AV.shown;
  return head+modes+`<div class="flash-scene"><div class="flash-tilt"><div class="flash-card ${shown?'flipped':''}" id="flashcard">
    <section class="flash-face flash-front" ${shown?'inert aria-hidden="true"':''}>
      <div class="flash-meta"><span class="pill">${q.length} thẻ trong lượt</span><span class="pill">${spell?'Viết từ':'Nhớ nghĩa'}</span></div>
      ${sculpture()}
      <p class="eyebrow">${spell?'Từ tiếng Anh nào có nghĩa là':'Bạn nhớ nghĩa của từ này chứ?'}</p>
      <h3 class="${spell?'flash-meaning':'flash-word'}">${esc(spell?c.vi:c.en)}</h3>
      ${sayBtn(c.en,'Nghe phát âm')}
      ${spell?`<label for="srsin" class="flash-caption">Viết bằng bút hoặc nhập bằng bàn phím</label><input class="scribble" id="srsin" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Viết từ tiếng Anh…" value="${esc(AV.res.cur?.got||'')}"><button class="btn pri" id="srscheck">Kiểm tra & lật thẻ ↗</button>`:'<button class="btn pri" id="srsflip">Lật thẻ xem nghĩa ↗</button>'}
      <span class="flash-caption">${spell?'Tự nhớ trước khi xem đáp án':'Chạm nút hoặc vuốt ngang để lật thẻ'}</span>
    </section>
    <section class="flash-face flash-back" ${!shown?'inert aria-hidden="true"':''}>
      <span class="pill ok">Kết nối từ và nghĩa</span>${sculpture()}
      <h3 class="flash-word">${esc(c.en)}</h3><p class="flash-meaning">${esc(c.vi)}</p>
      <div id="flash-result" aria-live="polite">${spell && AV.res.cur?`<div class="diff">${diffHTML(AV.res.cur.d)}</div>`:''}</div>
      ${sayBtn(c.en,'Nghe lại')}<button class="btn ghost sm" id="flash-return">↶ Xem mặt trước</button>
      <p class="flash-caption">Chọn mức độ nhớ của bạn bên dưới</p>
    </section>
  </div></div></div><div class="flash-actions" id="flash-actions" ${shown?'':'hidden'}>${gradeBar(null)}</div>`;
};

const originalMount=mount;
mount=function(){
  originalMount();
  const pane=$('#pane');
  const openLibrary=$('[data-new-library]',pane);if(openLibrary)openLibrary.onclick=()=>{S.readBook='extra';S.extraStory=null;save();go('read');};
  const routeInfo=$('[data-route-info]',pane);if(routeInfo)routeInfo.onclick=()=>{const d=$('#learning-route',pane);d.open=true;d.scrollIntoView({behavior:S.mind?.reduceMotion?'auto':'smooth',block:'center'});};
  $$('[data-story]',pane).forEach(b=>b.onclick=()=>{S.extraStory=b.dataset.story;save();render();});
  $$('[data-level]',pane).forEach(b=>b.onclick=()=>{S.storyLevel=b.dataset.level;save();render();});
  const library=$('[data-library]',pane);if(library)library.onclick=()=>{S.extraStory=null;save();render();};
  $$('[data-flash-mode]',pane).forEach(b=>b.onclick=()=>{S.flashMode=b.dataset.flashMode;AV.queue=buildQueue();AV.shown=false;AV.res={};save();render();});
  const vb=$('#vibtn',pane);
  if(vb && $('#readwrap',pane)?.dataset.storyKey)vb.onclick=()=>{S.showVi=!(S.showVi!==false);save();render();};
  $$('[data-line-say]',pane).forEach(b=>b.onclick=e=>{e.stopPropagation();say(b.dataset.lineSay);});
  const card=$('#flashcard',pane);if(!card)return;
  function reveal(show){
    AV.shown=show;card.classList.toggle('flipped',show);
    $('.flash-front',card).inert=show;$('.flash-back',card).inert=!show;
    $('.flash-front',card).setAttribute('aria-hidden',String(show));$('.flash-back',card).setAttribute('aria-hidden',String(!show));
    $('#flash-actions',pane).hidden=!show;
    // Đưa tiêu điểm ra khỏi mặt thẻ bị ẩn, vẫn giữ chuyển động trong cùng DOM.
    const target=show?$('#flash-return',pane):$('#srsin',pane)||$('#srsflip',pane);target?.focus({preventScroll:true});
  }
  const flip=$('#srsflip',pane);if(flip)flip.onclick=()=>reveal(true);
  const back=$('#flash-return',pane);if(back)back.onclick=()=>reveal(false);
  const check=$('#srscheck',pane);
  if(check)check.onclick=()=>{
    const c=S.cards.find(x=>x.id===AV.queue[0]),got=$('#srsin',pane).value.trim();
    if(!got){toast('Viết thử từ trước khi xem đáp án nhé.');$('#srsin',pane).focus();return;}
    const d=letterDiff(c.en,got);AV.res.cur={got,d};$('#flash-result',pane).innerHTML=`<div class="diff">${diffHTML(d)}</div><p class="flash-caption">Độ khớp chữ: ${d.score}% · Bạn tự đánh giá mức nhớ</p>`;reveal(true);
  };
  const input=$('#srsin',pane);if(input)input.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();check.click();}};
  const tilt=$('.flash-tilt',pane),scene=$('.flash-scene',pane);
  scene.onpointermove=e=>{if(e.pointerType!=='mouse'||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const r=scene.getBoundingClientRect();tilt.style.setProperty('--ry',((e.clientX-r.left)/r.width-.5)*7+'deg');tilt.style.setProperty('--rx',(.5-(e.clientY-r.top)/r.height)*5+'deg');};
  scene.onpointerleave=()=>{tilt.style.setProperty('--ry','0deg');tilt.style.setProperty('--rx','0deg');};
  let start=null;
  scene.onpointerdown=e=>{if(e.target.closest('button,input')||e.pointerType==='pen')return;start={x:e.clientX,y:e.clientY};};
  scene.onpointercancel=()=>{start=null;};
  scene.onpointerup=e=>{if(!start)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;start=null;if(Math.abs(dx)>65&&Math.abs(dy)<45){if(check&&!AV.shown)check.click();else reveal(!AV.shown);}};
};

document.addEventListener('keydown',e=>{
  if(!$('#flashcard')||e.repeat||e.ctrlKey||e.metaKey||e.altKey||e.target.closest('input,textarea,select,[contenteditable="true"]'))return;
  if(e.code==='Space'&&!e.target.closest('button')){e.preventDefault();($('#srscheck')||$('#srsflip'))?.click();}
  if(AV.shown&&/^[1-4]$/.test(e.key)){e.preventDefault();$(`[data-grade="${Number(e.key)-1}"]`)?.click();}
});
