(() => {
  const staticMode=new URLSearchParams(location.search).has('all');
  document.documentElement.classList.toggle('static',staticMode);
  const slides=[...document.querySelectorAll('.slide')], names=['01 · DIAGNÓSTICO','02 · ARQUITETURA','03 · OPERAÇÃO','04 · VALIDAÇÃO'];
  const speakers=[['PEDRO HANG','SLIDES 1–3'],['EDUARDO LORGA','SLIDES 4–6'],['RAYHAN MISLEH','SLIDES 7–9'],['RAFAEL KRAUT','SLIDES 10–12']];
  const $=s=>document.querySelector(s), progress=$('#progress'), current=$('#current'), stageName=$('#stageName'), presenter=$('#presenter'), range=$('#range'), hint=$('#buildHint'), transition=$('#transition'), overview=$('#overview'), thumbs=$('#thumbs');
  let index=Math.max(0,Math.min(11,(+location.hash.slice(1)||1)-1)), busy=false;
  function fit(){document.documentElement.style.setProperty('--scale',Math.min(innerWidth/1600,innerHeight/900))}
  function builds(i=index){return [...slides[i].querySelectorAll('.build')]}
  function revealSlide(){
    const list=builds();
    list.forEach((el,i)=>{el.classList.remove('shown');el.style.transitionDelay=`${i*140}ms`});
    requestAnimationFrame(()=>requestAnimationFrame(()=>list.forEach(el=>el.classList.add('shown'))));
    hint.classList.remove('on');
  }
  function sync(){
    const stage=+slides[index].dataset.stage, speaker=Math.floor(index/3);
    slides.forEach((s,i)=>s.classList.toggle('active',i===index));current.textContent=String(index+1).padStart(2,'0');progress.style.width=`${(index+1)/12*100}%`;stageName.textContent=names[stage];presenter.textContent=speakers[speaker][0];range.textContent=speakers[speaker][1];
    [...thumbs.children].forEach((t,i)=>t.classList.toggle('current',i===index));history.replaceState(null,'',`#${index+1}`);revealSlide();
  }
  function next(){if(!busy)go(index+1)}
  function prev(){if(!busy)go(index-1)}
  function go(nextIndex){if(nextIndex<0||nextIndex>=slides.length||nextIndex===index)return;busy=true;transition.classList.remove('run');void transition.offsetWidth;transition.classList.add('run');setTimeout(()=>{index=nextIndex;sync()},500);setTimeout(()=>{transition.classList.remove('run');busy=false},1000)}
  slides.forEach((s,i)=>{const b=document.createElement('button');b.className='thumb';b.innerHTML=`<small>${names[+s.dataset.stage]}</small><b>${s.dataset.title}</b><span>${String(i+1).padStart(2,'0')} / 12</span>`;b.onclick=()=>{overview.classList.remove('open');go(i)};thumbs.appendChild(b)});
  $('#next').onclick=next;$('#prev').onclick=prev;$('#overviewBtn').onclick=()=>overview.classList.add('open');$('#closeOverview').onclick=()=>overview.classList.remove('open');$('#fullscreen').onclick=()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen?.();
  addEventListener('keydown',e=>{if(['ArrowRight','PageDown',' ','Enter'].includes(e.key)){e.preventDefault();next()}if(['ArrowLeft','PageUp','Backspace'].includes(e.key)){e.preventDefault();prev()}if(e.key.toLowerCase()==='o')overview.classList.toggle('open');if(e.key.toLowerCase()==='f')$('#fullscreen').click();if(e.key==='Escape')overview.classList.remove('open')});
  addEventListener('click',e=>{if(e.target.closest('button,.overview,.controls'))return;e.clientX<innerWidth*.25?prev():next()});addEventListener('resize',fit);fit();sync();
  if(staticMode){builds().forEach(el=>{el.style.transitionDelay='0ms';el.classList.add('shown')})}
})();
