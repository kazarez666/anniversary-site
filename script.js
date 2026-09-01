const steps=[...document.querySelectorAll('.step')];
const nextButtons=[...document.querySelectorAll('.next-button')];
const dots=[...document.querySelectorAll('.dot')];
const restartButton=document.querySelector('.restart-button');
const counter=document.querySelector('#current-number');
const heartField=document.querySelector('#heart-field');
const magneticButtons=[...document.querySelectorAll('.magnetic')];
let currentStep=0;
let locked=false;

function showStep(index){
  if(locked||index===currentStep||index<0||index>=steps.length)return;
  locked=true;
  steps.forEach((step,i)=>{
    const active=i===index;
    step.classList.toggle('is-active',active);
    step.setAttribute('aria-hidden',String(!active));
    if(active)step.scrollTop=0;
  });
  dots.forEach((dot,i)=>{
    dot.classList.toggle('is-active',i===index);
    dot.setAttribute('aria-current',i===index?'step':'false');
  });
  currentStep=index;
  if(counter)counter.textContent=String(index+1).padStart(2,'0');
  document.body.dataset.step=String(index);
  window.setTimeout(()=>{locked=false},820);
}

nextButtons.forEach(button=>button.addEventListener('click',()=>showStep(currentStep+1)));
dots.forEach(dot=>dot.addEventListener('click',()=>showStep(Number(dot.dataset.go))));
restartButton?.addEventListener('click',()=>showStep(0));

document.addEventListener('keydown',event=>{
  if(document.activeElement?.tagName==='IFRAME')return;
  if(event.key==='ArrowRight'||event.key==='Enter')showStep(Math.min(currentStep+1,steps.length-1));
  if(event.key==='ArrowLeft')showStep(Math.max(currentStep-1,0));
});

let touchStartX=0;
let touchStartY=0;
document.addEventListener('touchstart',event=>{
  touchStartX=event.changedTouches[0].clientX;
  touchStartY=event.changedTouches[0].clientY;
},{passive:true});
document.addEventListener('touchend',event=>{
  if(event.target.closest('iframe'))return;
  const dx=event.changedTouches[0].clientX-touchStartX;
  const dy=event.changedTouches[0].clientY-touchStartY;
  if(Math.abs(dx)<55||Math.abs(dx)<Math.abs(dy))return;
  showStep(dx<0?Math.min(currentStep+1,steps.length-1):Math.max(currentStep-1,0));
},{passive:true});

window.addEventListener('mousemove',event=>{
  document.documentElement.style.setProperty('--mx',`${event.clientX/window.innerWidth*100}%`);
  document.documentElement.style.setProperty('--my',`${event.clientY/window.innerHeight*100}%`);
});

const hearts=['♡','♥','♡','♡','♥'];
function createHeart(i){
  const el=document.createElement('span');
  el.className='floating-heart';
  el.textContent=hearts[i%hearts.length];
  const size=10+Math.random()*24;
  el.style.left=`${Math.random()*100}%`;
  el.style.bottom=`${-10-Math.random()*30}%`;
  el.style.fontSize=`${size}px`;
  el.style.animationDuration=`${16+Math.random()*18}s`;
  el.style.animationDelay=`${-Math.random()*28}s`;
  el.style.setProperty('--drift',`${-80+Math.random()*160}px`);
  el.style.opacity=(.1+Math.random()*.25).toFixed(2);
  heartField?.appendChild(el);
}
if(heartField){
  const amount=window.innerWidth<720?18:34;
  for(let i=0;i<amount;i++)createHeart(i);
}

magneticButtons.forEach(button=>{
  button.addEventListener('mousemove',event=>{
    if(window.innerWidth<800)return;
    const rect=button.getBoundingClientRect();
    const x=event.clientX-(rect.left+rect.width/2);
    const y=event.clientY-(rect.top+rect.height/2);
    button.style.transform=`translate(${x*.08}px,${y*.08}px)`;
  });
  button.addEventListener('mouseleave',()=>{button.style.transform=''});
});

document.body.dataset.step='0';
