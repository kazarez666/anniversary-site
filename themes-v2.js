const steps=[...document.querySelectorAll('.step')];
const nextButtons=[...document.querySelectorAll('.next-button')];
const dots=[...document.querySelectorAll('.dot')];
const restartButton=document.querySelector('.restart-button');
const currentNumber=document.querySelector('#current-number');
const heartField=document.querySelector('#heart-field');
const picker=document.querySelector('.theme-picker');
const toggle=document.querySelector('.theme-toggle');
const options=[...document.querySelectorAll('.theme-option')];
let currentStep=0;
let locked=false;

function showStep(index){
  if(locked||index<0||index>=steps.length||index===currentStep)return;
  locked=true;
  steps.forEach((step,i)=>{
    const active=i===index;
    step.classList.toggle('is-active',active);
    step.setAttribute('aria-hidden',String(!active));
    if(active)step.scrollTop=0;
  });
  dots.forEach((dot,i)=>dot.classList.toggle('is-active',i===index));
  currentStep=index;
  if(currentNumber)currentNumber.textContent=String(index+1).padStart(2,'0');
  window.setTimeout(()=>locked=false,720);
}

nextButtons.forEach(button=>button.addEventListener('click',()=>showStep(Math.min(currentStep+1,steps.length-1))));
dots.forEach(dot=>dot.addEventListener('click',()=>showStep(Number(dot.dataset.go))));
restartButton?.addEventListener('click',()=>showStep(0));

document.addEventListener('keydown',event=>{
  if(document.activeElement?.tagName==='IFRAME')return;
  if(event.key==='ArrowRight')showStep(Math.min(currentStep+1,steps.length-1));
  if(event.key==='ArrowLeft')showStep(Math.max(currentStep-1,0));
});

let touchStartX=0,touchStartY=0;
document.addEventListener('touchstart',event=>{
  touchStartX=event.changedTouches[0].clientX;
  touchStartY=event.changedTouches[0].clientY;
},{passive:true});
document.addEventListener('touchend',event=>{
  const dx=event.changedTouches[0].clientX-touchStartX;
  const dy=event.changedTouches[0].clientY-touchStartY;
  if(Math.abs(dx)<55||Math.abs(dx)<Math.abs(dy))return;
  if(dx<0)showStep(Math.min(currentStep+1,steps.length-1));
  if(dx>0)showStep(Math.max(currentStep-1,0));
},{passive:true});

window.addEventListener('mousemove',event=>{
  document.documentElement.style.setProperty('--mx',`${event.clientX/window.innerWidth*100}%`);
  document.documentElement.style.setProperty('--my',`${event.clientY/window.innerHeight*100}%`);
});

if(heartField){
  const symbols=['♡','♥','♡','♥','♡'];
  const sizes=[11,14,18,22,28,34];
  for(let i=0;i<34;i++){
    const heart=document.createElement('span');
    heart.className='floating-heart';
    heart.textContent=symbols[i%symbols.length];
    heart.style.left=`${Math.random()*100}%`;
    heart.style.bottom=`${-8-Math.random()*100}vh`;
    heart.style.fontSize=`${sizes[Math.floor(Math.random()*sizes.length)]}px`;
    heart.style.animationDuration=`${13+Math.random()*22}s`;
    heart.style.animationDelay=`${-Math.random()*30}s`;
    heart.style.setProperty('--drift',`${-120+Math.random()*240}px`);
    heart.style.opacity=String(.18+Math.random()*.45);
    heartField.appendChild(heart);
  }
}

function applyTheme(name){
  document.body.dataset.theme=name;
  options.forEach(option=>option.classList.toggle('is-active',option.dataset.themeChoice===name));
  localStorage.setItem('anniversary-theme',name);
}

const allowedThemes=['cocoa-paper','forest-noir','bright-moss','olive-editorial','modern-grid'];
const saved=localStorage.getItem('anniversary-theme');
applyTheme(allowedThemes.includes(saved)?saved:'cocoa-paper');

toggle?.addEventListener('click',()=>{
  const open=!picker.classList.contains('is-open');
  picker.classList.toggle('is-open',open);
  toggle.setAttribute('aria-expanded',String(open));
});

options.forEach(option=>option.addEventListener('click',()=>{
  applyTheme(option.dataset.themeChoice);
  picker.classList.remove('is-open');
  toggle?.setAttribute('aria-expanded','false');
}));

document.addEventListener('click',event=>{
  if(picker&&!picker.contains(event.target)){
    picker.classList.remove('is-open');
    toggle?.setAttribute('aria-expanded','false');
  }
});

[...document.querySelectorAll('.magnetic')].forEach(button=>{
  button.addEventListener('mousemove',event=>{
    if(window.innerWidth<900)return;
    const rect=button.getBoundingClientRect();
    const x=(event.clientX-rect.left-rect.width/2)*.07;
    const y=(event.clientY-rect.top-rect.height/2)*.07;
    button.style.transform=`translate(${x}px,${y}px)`;
  });
  button.addEventListener('mouseleave',()=>button.style.transform='');
});