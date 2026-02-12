document.addEventListener('DOMContentLoaded',()=>{
  const noBtn = document.getElementById('noBtn');
  const yesBtn = document.getElementById('yesBtn');
  const result = document.getElementById('result');

  function moveNoButton() {
    const margin = 16;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const btnRect = noBtn.getBoundingClientRect();
    const maxX = Math.max(margin, w - btnRect.width - margin);
    const maxY = Math.max(margin, h - btnRect.height - margin);
    const x = Math.floor(Math.random() * (maxX - margin)) + margin;
    const y = Math.floor(Math.random() * (maxY - margin)) + margin;
    noBtn.style.position = 'fixed';
    noBtn.style.left = x + 'px';
    noBtn.style.top = y + 'px';
  }

  noBtn.addEventListener('mouseenter', moveNoButton);
  noBtn.addEventListener('touchstart', (e)=>{ e.preventDefault(); moveNoButton(); });
  noBtn.addEventListener('mousedown', (e)=>{ e.preventDefault(); moveNoButton(); });

  yesBtn.addEventListener('click', async ()=>{
    result.classList.remove('hidden');
    result.style.transform = 'translate(-50%,-50%) scale(0.98)';
    setTimeout(()=> result.style.transform = 'translate(-50%,-50%) scale(1)', 80);

    for(let i=0;i<8;i++){
      const h = document.createElement('div');
      h.className='heart';
      h.style.left = (50 + (Math.random()-0.5)*60) + '%';
      h.style.top = (50 + (Math.random()-0.5)*60) + '%';
      h.style.width = h.style.height = (10 + Math.random()*26) + 'px';
      document.body.appendChild(h);
      (function(el){
        const dx = (Math.random()-0.5)*200;
        const dy = -80 - Math.random()*180;
        el.animate([
          {transform:`translate(0,0) rotate(45deg)`, opacity:1},
          {transform:`translate(${dx}px,${dy}px) rotate(45deg)`, opacity:0}
        ],{duration:1200+Math.random()*800, easing:'cubic-bezier(.2,.8,.2,1)'}).onfinish = ()=> el.remove();
      })(h);
    }

    // Try to play an external file named shaky.mp3 if present; otherwise play bundled synth
    try{
      const audio = new Audio('shaky.mp3');
      audio.preload = 'auto';
      await audio.play();
    }catch(e){
      try{ playBundledSong(); }catch(err){ console.warn('unable to play bundled song',err); }
    }
  });

  function playBundledSong(){
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.value = 0.14;
    master.connect(ctx.destination);

    const melody = [
      {f:659,d:0.22},{f:659,d:0.22},{f:0,d:0.22},{f:659,d:0.22},{f:0,d:0.22},{f:523,d:0.22},{f:659,d:0.44},{f:0,d:0.22},
      {f:784,d:0.44},{f:0,d:0.22}
    ];

    let t = now + 0.02;
    melody.forEach((n,i)=>{
      if(n.f===0){ t += n.d; return; }
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = n.f;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(1, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + n.d);
      o.connect(g); g.connect(master);
      o.start(t);
      o.stop(t + n.d + 0.02);
      t += n.d;
    });
  }

  window.addEventListener('resize', ()=>{ noBtn.style.position='static'; setTimeout(()=>noBtn.style.position='static',50); });
});
