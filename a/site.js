/* Progressive: content works without JS. Motion libs load after first paint. */
(()=>{const hv=document.querySelector('.hbg');if(hv&&!matchMedia('(prefers-reduced-motion: reduce)').matches){const pp=hv.play();pp&&pp.catch(()=>{})}})();
(()=>{const RM=matchMedia('(prefers-reduced-motion: reduce)').matches,$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
/* split kinetic headings into words */
$$('.kt').forEach(h=>{h.innerHTML=h.innerHTML.split(/(<br>)/).map(seg=>seg==='<br>'?seg:seg.replace(/(<em[^>]*>)?([^<\s]+)(<\/em>)?/g,(m,a,w,b)=>`<span class="wd">${a||''}<span>${w}</span>${b||''}</span>`)).join('');h.querySelectorAll('.wd>span').forEach((x,i)=>x.style.setProperty('--i',i))});
/* story: active step → swap screen, rotate phone, wash */
const st=$$('.st'),im=$$('#stScr img'),ph=$('#stPhone'),wash=$('#wash'),lbl=$('#stLbl');let cur=0;
function act(i){if(i===cur&&im[i].classList.contains('on'))return;cur=i;im.forEach((x,k)=>x.classList.toggle('on',k===i));const s=st[i];wash.style.setProperty('--wash',s.dataset.wash);if(lbl)lbl.textContent=String(i+1).padStart(2,'0')+' / '+String(st.length).padStart(2,'0');
 if(window.gsap&&!RM)gsap.to(ph,{rotateY:+s.dataset.ry,rotateX:+s.dataset.rx,duration:1,ease:'power3.out'});else ph.style.transform=`rotateY(${s.dataset.ry}deg) rotateX(${s.dataset.rx}deg)`}
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)act(+e.target.dataset.i)}),{rootMargin:'-45% 0px -45% 0px'});st.forEach(s=>io.observe(s));
const rv=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');rv.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px'});$$('.rv:not(.in),.kt:not(#h1)').forEach(x=>rv.observe(x));
if(RM)return;
const load=s=>new Promise((ok,no)=>{const e=document.createElement('script');e.src=s;e.onload=ok;e.onerror=no;document.head.appendChild(e)});
const go=()=>Promise.all([load('a/gsap.min.js'),load('a/lenis.min.js')]).then(()=>load('a/ScrollTrigger.min.js')).then(()=>{
 gsap.registerPlugin(ScrollTrigger);
 const lenis=window.lenis=new Lenis({lerp:.1,smoothWheel:true});lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0);
 $$('a[href^="./#"],a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const id=a.getAttribute('href').replace('./','');const t=$(id);if(t){e.preventDefault();lenis.scrollTo(t,{offset:-64})}}));
 /* hero: dark → vivid, words rise, phone settles in 3D */
 const hp=$('#heroPhone');gsap.set(hp,{rotateY:-28,rotateX:10,y:40,opacity:0});
 const tl=gsap.timeline({defaults:{ease:'power3.out'}});
 tl.from('#h1 .wd>span',{yPercent:110,rotateX:-50,duration:.9,stagger:.07}).to(hp,{rotateY:-14,rotateX:6,y:0,opacity:1,duration:1.4},.15).from('.hero',{'--glow':0,duration:1.6},0);
 gsap.to(hp,{rotateY:8,rotateX:-4,y:-30,scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:.6}});

 if(matchMedia('(pointer:fine)').matches){const q=$('#heroTilt');addEventListener('pointermove',e=>{const x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;gsap.to(q,{rotateY:x*16,rotateX:-y*12,duration:.8,ease:'power2.out'})})}
 /* story phone drifts with progress */
 gsap.fromTo('#stPhone',{scale:.92},{scale:1.04,ease:'none',scrollTrigger:{trigger:'.story',start:'top bottom',end:'bottom top',scrub:true}});

 const rf=()=>ScrollTrigger.refresh();document.fonts&&document.fonts.ready.then(rf);addEventListener('load',rf);let lh=document.body.scrollHeight;new ResizeObserver(()=>{const h=document.body.scrollHeight;if(Math.abs(h-lh)>50){lh=h;rf()}}).observe(document.body);
}).catch(()=>{});
('requestIdleCallback' in window)?requestIdleCallback(go,{timeout:1200}):setTimeout(go,300);
})();
