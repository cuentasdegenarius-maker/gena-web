(function () {
  'use strict';
  var canvas = document.getElementById('gameCanvas'), ctx = canvas.getContext('2d');
  var scoreEl = document.getElementById('score'), levelEl = document.getElementById('level'), livesEl = document.getElementById('lives'), highEl = document.getElementById('highScore');
  var startScreen = document.getElementById('startScreen'), overScreen = document.getElementById('gameOverScreen'), finalScore = document.getElementById('finalScore');
  var W = canvas.width, H = canvas.height, keys = {}, raf, last = 0, running = false, soundOn = true, score = 0, lives = 3, level = 1, high = Number(localStorage.getItem('neonCourierHigh') || 0);
  var player, parcels, meteors, particles, stars, spawnClock, parcelClock;
  highEl.textContent = pad(high);
  function pad(n){ return String(Math.floor(n)).padStart(6,'0'); }
  function reset(){ player={x:W/2,y:H-70,r:16,invincible:0}; parcels=[]; meteors=[]; particles=[]; stars=Array.from({length:70},function(){return{x:Math.random()*W,y:Math.random()*H,s:Math.random()*1.8+.4,a:Math.random()*.7+.2};}); score=0;lives=3;level=1;spawnClock=0;parcelClock=1;updateHud(); }
  function updateHud(){scoreEl.textContent=pad(score);levelEl.textContent=String(level).padStart(2,'0');livesEl.textContent='●'.repeat(lives)+'○'.repeat(3-lives);livesEl.setAttribute('aria-label',lives+' vidas');}
  function start(){cancelAnimationFrame(raf);reset();running=true;startScreen.classList.add('hidden');overScreen.classList.add('hidden');last=performance.now();raf=requestAnimationFrame(loop);}
  function end(){running=false;finalScore.textContent=pad(score);overScreen.classList.remove('hidden');if(score>high){high=score;localStorage.setItem('neonCourierHigh',high);highEl.textContent=pad(high);}beep(130,.18,'sawtooth');}
  function beep(freq,duration,type){if(!soundOn)return;try{var ac=window.__audio||(window.__audio=new AudioContext()),o=ac.createOscillator(),g=ac.createGain();o.type=type||'sine';o.frequency.value=freq;g.gain.setValueAtTime(.035,ac.currentTime);g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+duration);o.connect(g);g.connect(ac.destination);o.start();o.stop(ac.currentTime+duration);}catch(e){}}
  function spawnMeteor(){var r=10+Math.random()*18;meteors.push({x:r+Math.random()*(W-r*2),y:-r,r:r,v:85+Math.random()*70+level*12,rot:Math.random()*7});}
  function spawnParcel(){parcels.push({x:28+Math.random()*(W-56),y:-18,r:13,v:80+level*7,pulse:Math.random()*7});}
  function burst(x,y,color,count){for(var i=0;i<count;i++)particles.push({x:x,y:y,vx:(Math.random()-.5)*150,vy:(Math.random()-.5)*150,life:.45+Math.random()*.35,color:color});}
  function distance(a,b){return Math.hypot(a.x-b.x,a.y-b.y);}
  function loop(now){if(!running)return;var dt=Math.min((now-last)/1000,.035);last=now;update(dt);draw();raf=requestAnimationFrame(loop);}
  function update(dt){var dx=(keys.ArrowRight||keys.d?1:0)-(keys.ArrowLeft||keys.a?1:0),dy=(keys.ArrowDown||keys.s?1:0)-(keys.ArrowUp||keys.w?1:0),len=Math.hypot(dx,dy)||1;player.x=Math.max(22,Math.min(W-22,player.x+dx/len*270*dt));player.y=Math.max(22,Math.min(H-22,player.y+dy/len*270*dt));player.invincible=Math.max(0,player.invincible-dt);spawnClock-=dt;parcelClock-=dt;if(spawnClock<=0){spawnMeteor();spawnClock=Math.max(.23, .75-level*.045)*(0.7+Math.random()*.6);}if(parcelClock<=0){spawnParcel();parcelClock=1.15+Math.random()*.8;}
    meteors.forEach(function(m){m.y+=m.v*dt;m.rot+=dt;});parcels.forEach(function(p){p.y+=p.v*dt;p.pulse+=dt*5;});
    meteors=meteors.filter(function(m){if(m.y>H+40)return false;if(player.invincible<=0&&distance(player,m)<m.r+player.r-3){lives--;player.invincible=1.2;burst(player.x,player.y,'#ff5fd2',18);beep(100,.16,'square');updateHud();if(lives<=0)end();return false;}return true;});
    parcels=parcels.filter(function(p){if(p.y>H+30)return false;if(distance(player,p)<p.r+player.r){score+=100;level=1+Math.floor(score/600);burst(p.x,p.y,'#c8ff65',12);beep(620,.08,'sine');updateHud();return false;}return true;});
    particles=particles.filter(function(p){p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;return p.life>0;});
  }
  function draw(){ctx.clearRect(0,0,W,H);ctx.fillStyle='#080b19';ctx.fillRect(0,0,W,H);stars.forEach(function(s){ctx.globalAlpha=s.a;ctx.fillStyle='#b7c9ff';ctx.fillRect(s.x,s.y,s.s,s.s);s.y+=s.s*.35;if(s.y>H)s.y=0;});ctx.globalAlpha=1;ctx.strokeStyle='rgba(92,236,255,.055)';ctx.lineWidth=1;for(var x=0;x<W;x+=60){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}for(var y=0;y<H;y+=60){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    parcels.forEach(function(p){ctx.save();ctx.translate(p.x,p.y);ctx.shadowBlur=18;ctx.shadowColor='#c8ff65';ctx.fillStyle='#c8ff65';ctx.rotate(Math.PI/4);ctx.fillRect(-9,-9,18,18);ctx.rotate(-Math.PI/4);ctx.fillStyle='#152329';ctx.fillRect(-7,-2,14,4);ctx.restore();});
    meteors.forEach(function(m){ctx.save();ctx.translate(m.x,m.y);ctx.rotate(m.rot);ctx.shadowBlur=15;ctx.shadowColor='#ff5fd2';ctx.fillStyle='#ff5fd2';ctx.beginPath();ctx.moveTo(0,-m.r);ctx.lineTo(m.r*.8,-m.r*.35);ctx.lineTo(m.r*.65,m.r*.8);ctx.lineTo(-m.r*.5,m.r);ctx.lineTo(-m.r*.9,0);ctx.closePath();ctx.fill();ctx.restore();});
    particles.forEach(function(p){ctx.globalAlpha=Math.max(0,p.life*2);ctx.fillStyle=p.color;ctx.fillRect(p.x,p.y,3,3);});ctx.globalAlpha=1;drawPlayer();}
  function drawPlayer(){if(player.invincible>0&&Math.floor(player.invincible*12)%2===0)return;ctx.save();ctx.translate(player.x,player.y);ctx.shadowBlur=20;ctx.shadowColor='#5cecff';ctx.fillStyle='#5cecff';ctx.beginPath();ctx.moveTo(0,-21);ctx.lineTo(14,15);ctx.lineTo(0,9);ctx.lineTo(-14,15);ctx.closePath();ctx.fill();ctx.fillStyle='#0b1831';ctx.beginPath();ctx.arc(0,-5,5,0,Math.PI*2);ctx.fill();ctx.fillStyle='#ff5fd2';ctx.shadowColor='#ff5fd2';ctx.fillRect(-3,13,6,7);ctx.restore();}
  document.addEventListener('keydown',function(e){if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].indexOf(e.key)>-1)e.preventDefault();keys[e.key]=true;if(e.key==='Enter'&&!running)start();});document.addEventListener('keyup',function(e){keys[e.key]=false;});
  document.getElementById('startButton').addEventListener('click',start);document.getElementById('restartButton').addEventListener('click',start);document.getElementById('soundButton').addEventListener('click',function(){soundOn=!soundOn;this.textContent='♫ SONIDO: '+(soundOn?'ON':'OFF');});
  reset();draw();
}());
