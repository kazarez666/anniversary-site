const steps=[...document.querySelectorAll('.step')];
const nextButtons=[...document.querySelectorAll('.next-button')];
const dots=[...document.querySelectorAll('.dot')];
const restartButton=document.querySelector('.restart-button');
const currentNumber=document.querySelector('#current-number');
const heartField=document.querySelector('#heart-field');
const themePicker=document.querySelector('.theme-picker');
const themeToggle=document.querySelector('.theme-toggle');
const themeOptions=[...document.querySelectorAll('[data-theme-choice]')];
let currentStep=0,locked=false;

function showStep(index){
  if(locked||index<0||index>=steps.length||index===currentStep)return;
  locked=true;
  steps.forEach((step,i)=>{const active=i===index;step.classList.toggle('is-active',active);step.setAttribute('aria-hidden',String(!active));if(active)step.scrollTop=0;});
  dots.forEach((dot,i)=>dot.classList.toggle('is-active',i===index));
  currentStep=index;
  if(currentNumber)currentNumber.textContent=String(index+1).padStart(2,'0');
  setTimeout(()=>locked=false,760);
}
nextButtons.forEach(b=>b.addEventListener('click',()=>showStep(currentStep+1)));
dots.forEach(d=>d.addEventListener('click',()=>showStep(Number(d.dataset.go))));
restartButton?.addEventListener('click',()=>showStep(0));
document.addEventListener('keydown',e=>{if(document.activeElement?.tagName==='IFRAME')return;if(e.key==='ArrowRight'||e.key==='Enter')showStep(Math.min(currentStep+1,steps.length-1));if(e.key==='ArrowLeft')showStep(Math.max(currentStep-1,0));});
let sx=0,sy=0;document.addEventListener('touchstart',e=>{sx=e.changedTouches[0].clientX;sy=e.changedTouches[0].clientY},{passive:true});document.addEventListener('touchend',e=>{if(e.target.closest('.theme-picker'))return;const dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;if(Math.abs(dx)<55||Math.abs(dx)<Math.abs(dy))return;dx<0?showStep(Math.min(currentStep+1,steps.length-1)):showStep(Math.max(currentStep-1,0));},{passive:true});
window.addEventListener('mousemove',e=>{document.documentElement.style.setProperty('--mx',`${e.clientX/window.innerWidth*100}%`);document.documentElement.style.setProperty('--my',`${e.clientY/window.innerHeight*100}%`);});

if(heartField){const sizes=[11,14,18,22,28,36];for(let i=0;i<34;i++){const h=document.createElement('span');h.className='floating-heart';h.textContent=i%3===0?'♡':'♥';h.style.left=`${Math.random()*100}%`;h.style.bottom=`${-15-Math.random()*100}vh`;h.style.fontSize=`${sizes[Math.floor(Math.random()*sizes.length)]}px`;h.style.animationDuration=`${13+Math.random()*20}s`;h.style.animationDelay=`${-Math.random()*28}s`;h.style.setProperty('--drift',`${-120+Math.random()*240}px`);h.style.setProperty('--heart-opacity',String(.18+Math.random()*.42));heartField.appendChild(h);}}

function setTheme(name){document.body.dataset.theme=name;themeOptions.forEach(b=>b.classList.toggle('is-active',b.dataset.themeChoice===name));localStorage.setItem('anniversary-theme',name);}
const saved=localStorage.getItem('anniversary-theme');if(saved&&themeOptions.some(b=>b.dataset.themeChoice===saved))setTheme(saved);
themeOptions.forEach(b=>b.addEventListener('click',()=>{setTheme(b.dataset.themeChoice);themePicker?.classList.remove('is-open');themeToggle?.setAttribute('aria-expanded','false');}));
themeToggle?.addEventListener('click',()=>{const open=themePicker.classList.toggle('is-open');themeToggle.setAttribute('aria-expanded',String(open));});

[...document.querySelectorAll('.magnetic')].forEach(button=>{button.addEventListener('mousemove',e=>{if(window.innerWidth<800)return;const r=button.getBoundingClientRect();button.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.07}px,${(e.clientY-r.top-r.height/2)*.07}px)`;});button.addEventListener('mouseleave',()=>button.style.transform='');});
