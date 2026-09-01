const steps=[...document.querySelectorAll('.step')];
const nextButtons=[...document.querySelectorAll('.next-button')];
const dots=[...document.querySelectorAll('.dot')];
const restartButton=document.querySelector('.restart-button');
const currentNumber=document.querySelector('#current-number');
const heartField=document.querySelector('#heart-field');
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
  setTimeout(()=>locked=false,780);
}
nextButtons.forEach(button=>button.addEventListener('click',()=>showStep(currentStep+1)));
dots.forEach(dot=>dot.addEventListener('click',()=>showStep(Number(dot.dataset.go))));
restartButton?.addEventListener('click',()=>showStep(0));
document.addEventListener('keydown',event=>{
  if(document.activeElement?.tagName==='IFRAME')return;
  if(event.key==='ArrowRight'||event.key==='Enter')showStep(Math.min(currentStep+1,steps.length-1));
  if(event.key==='ArrowLeft')showStep(Math.max(currentStep-1,0));
});
let touchStartX=0,touchStartY=0;
document.addEventListener('touchstart',event=>{touchStartX=event.changedTouches[0].clientX;touchStartY=event.changedTouches[0].clientY},{passive:true});
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
  const sizes=[12,16,20,24,30,38];
  for(let i=0;i<28;i++){
    const heart=document.createElement('span');
    heart.className='floating-heart';
    heart.textContent=i%4===0?'♡':'♥';
    heart.style.left=`${Math.random()*100}%`;
    heart.style.bottom=`${-10-Math.random()*85}vh`;
    heart.style.fontSize=`${sizes[Math.floor(Math.random()*sizes.length)]}px`;
    heart.style.animationDuration=`${12+Math.random()*18}s`;
    heart.style.animationDelay=`${-Math.random()*24}s`;
    heart.style.setProperty('--drift',`${-90+Math.random()*180}px`);
    heart.style.opacity=String(.2+Math.random()*.5);
    heartField.appendChild(heart);
  }
}
[...document.querySelectorAll('.magnetic')].forEach(button=>{
  button.addEventListener('mousemove',event=>{
    const rect=button.getBoundingClientRect();
    const x=(event.clientX-rect.left-rect.width/2)*.08;
    const y=(event.clientY-rect.top-rect.height/2)*.08;
    button.style.transform=`translate(${x}px,${y}px)`;
  });
  button.addEventListener('mouseleave',()=>button.style.transform='');
});
