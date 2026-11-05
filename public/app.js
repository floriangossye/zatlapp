import {animateDice} from './dice.js';
import {freshGame, resolveRoll, randomDie, playersFromCount} from './game.js';
const $ = s => document.querySelector(s);
const KEY = 'zatlapp.v1';
let players = [], game = null, history = [], screen = 'hub', manual = false, rolling = false;
try {
  const saved = JSON.parse(localStorage.getItem(KEY));
  if (saved && Array.isArray(saved.players)) {
    players = [...new Set(saved.players.filter(p => typeof p === 'string' && p.trim() && p.length <= 24))].slice(0,16);
    const g = saved.game;
    if (g && Array.isArray(g.players) && JSON.stringify(g.players) === JSON.stringify(players) && players.length >= 2 && Number.isInteger(g.turn) && g.turn >= 0 && g.turn < players.length && (g.threeMan === null || players.includes(g.threeMan)) && [1,2].includes(g.multiplier) && Number.isInteger(g.rolls) && g.rolls >= 0 && (!g.last || [g.last.a,g.last.b].every(n=>Number.isInteger(n)&&n>=1&&n<=6) && Array.isArray(g.last.events) && g.last.events.every(e=>typeof e.title==='string'&&typeof e.text==='string'))) game = g;
  }
} catch { /* Storage can be unavailable; play still works in memory. */ }
const escape = text => String(text).replace(/[&<>"']/g, ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
function save() { try {localStorage.setItem(KEY, JSON.stringify({players,game}));} catch { toast('Bewaren lukt niet in deze browser. Je kunt wel verder spelen.');} }
function toast(text) { $('#toast').textContent = text; $('#toast').classList.add('show'); clearTimeout(toast.timer); toast.timer=setTimeout(()=>$('#toast').classList.remove('show'),4000); }
function avatar(name,i) {return `<span class="avatar color-${i%6}">${escape(/^Speler (\d+)$/.exec(name)?.[1] || name.slice(0,1).toUpperCase())}</span>`;}
const scene = `<svg class="diorama" viewBox="0 0 620 510" role="img" aria-label="Een vrolijke 3-man dobbelsteen op een zwevend speeleiland"><defs><linearGradient id="base" x2="0" y2="1"><stop stop-color="#b5cc91"/><stop offset="1" stop-color="#739a7b"/></linearGradient><linearGradient id="face" x2="0" y2="1"><stop stop-color="#ffde89"/><stop offset="1" stop-color="#f7bb6f"/></linearGradient><linearGradient id="ivory" x2="0" y2="1"><stop stop-color="#fffcec"/><stop offset="1" stop-color="#e3dfc4"/></linearGradient><filter id="shadow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10"/></filter></defs>
<ellipse cx="315" cy="447" rx="160" ry="20" fill="#346a59" opacity=".13" filter="url(#shadow)"/>
<g class="island"><path d="M115 322Q115 302 138 291L295 218Q310 210 329 219L494 295Q513 303 513 322V345Q513 358 495 367L332 443Q315 451 295 442L134 366Q115 357 115 344Z" fill="url(#base)"/><path d="M123 312L296 231Q310 224 328 231L505 313L332 395Q314 403 295 395Z" fill="#d6e8aa"/><path d="M143 315L299 242Q312 236 326 242L485 315L329 389Q313 395 297 388Z" fill="#e6edbd"/><path d="M174 315L310 252M231 344L368 278M291 373L429 307M199 289L369 369M255 263L426 343" stroke="#cbdcaa" stroke-width="2" opacity=".8"/><path d="M127 343L297 423Q314 432 333 423L502 344" stroke="#d3deab" stroke-width="4" fill="none" opacity=".5"/>
<ellipse cx="315" cy="316" rx="76" ry="24" fill="#416d55" opacity=".15"/>
<g class="mascot"><path d="M270 309v26q10 11 22 0v-26M340 309v26q11 11 22 0v-26" fill="#49594d"/><path d="M250 218l105-49 52 30v105l-105 49-52-29Z" fill="#d99561"/><path d="M250 218l105-49 52 30-105 49Z" fill="#ffe4a4"/><path d="M302 248l105-49v105l-105 49Z" fill="url(#face)"/><path d="M250 218l52 30v105l-52-29Z" fill="#e9ab72"/><path d="M320 274q9-12 15-3M369 251q9-12 15-3" stroke="#6c4c40" stroke-width="6" stroke-linecap="round" fill="none"/><ellipse cx="348" cy="289" rx="12" ry="10" fill="#ef9d75"/><path d="M344 287q5 7 10-2" fill="none" stroke="#724d3b" stroke-width="3" stroke-linecap="round"/><ellipse cx="324" cy="291" rx="8" ry="4" fill="#ee9b75" transform="rotate(-25 324 291)"/><ellipse cx="385" cy="265" rx="8" ry="4" fill="#ee9b75" transform="rotate(-25 385 265)"/><path d="M257 271q-20-17-20-2l15 26M406 246q17-29 24-18 3 6-25 39" fill="#d99561"/><ellipse cx="276" cy="252" rx="5" ry="9" fill="#ac774f" transform="rotate(-23 276 252)"/><ellipse cx="276" cy="298" rx="5" ry="9" fill="#ac774f" transform="rotate(-23 276 298)"/><ellipse cx="328" cy="211" rx="8" ry="4" fill="#dfab68"/>
<path d="M307 169l-8-36 23 9 13-25 12 20 24-16-9 37Z" fill="#e6ec82" stroke="#f7f8c5" stroke-width="3" stroke-linejoin="round"/><path d="M311 167l48-10" stroke="#b5bf68" stroke-width="5" stroke-linecap="round"/></g>
<g class="little-die"><path d="M147 215l57-27 35 20v59l-57 27-35-20Z" fill="#c77b70"/><path d="M147 215l57-27 35 20-57 28Z" fill="#ffc6a5"/><path d="M182 236l57-28v59l-57 27Z" fill="#efab93"/><ellipse cx="198" cy="244" rx="4" ry="5" fill="#a6635f"/><ellipse cx="223" cy="266" rx="4" ry="5" fill="#a6635f"/><ellipse cx="210" cy="255" rx="4" ry="5" fill="#a6635f"/><ellipse cx="164" cy="246" rx="4" ry="6" fill="#985955"/><ellipse cx="191" cy="214" rx="5" ry="3" fill="#bc776c"/></g>
<g class="floating-die"><path d="M412 124l54-26 35 20v55l-54 26-35-20Z" fill="#c5cdbc"/><path d="M412 124l54-26 35 20-54 26Z" fill="#fffef1"/><path d="M447 144l54-26v55l-54 26Z" fill="url(#ivory)"/><g fill="#7a9481"><ellipse cx="461" cy="151" rx="4" ry="5"/><ellipse cx="486" cy="139" rx="4" ry="5"/><ellipse cx="461" cy="179" rx="4" ry="5"/><ellipse cx="486" cy="167" rx="4" ry="5"/><ellipse cx="429" cy="153" rx="4" ry="6"/><ellipse cx="454" cy="121" rx="5" ry="3"/></g></g>
<path d="M144 127v24m-12-12h24M498 229v20m-10-10h20" stroke="#fcf7db" stroke-width="4" stroke-linecap="round"/><circle cx="380" cy="80" r="5" fill="#e9eeaa"/><circle cx="112" cy="258" r="4" fill="#f8ead3"/><path d="M233 105l4 10 10 4-10 4-4 10-4-10-10-4 10-4Z" fill="#f9eac0"/></g></svg>`;
function renderHub() {
  $('#app').innerHTML = `<section class="hub"><div class="hub-intro"><div class="eyebrow"><span class="tiny-star">✳</span> TELEFOON OP TAFEL. BENDE ERROND.</div><h1>Gooi iets<br>in de <span class="serif-word">groep.</span><span class="title-star" aria-hidden="true">✳</span></h1><p class="intro-copy">Goed gezelschap. Slechte worpen.<br>De rest regelen wij wel.</p><button class="text-button" id="intro-crew">${players.length ? `${players.length} spelers aan tafel` : 'Verzamel je bende'} <span aria-hidden="true">↗</span></button><div class="crew-preview">${players.slice(0,5).map(avatar).join('')}<span>${players.length ? players.length > 5 ? `+${players.length-5} andere legendes` : 'De tafel is gedekt.' : 'Geen login. Gewoon samen spelen.'}</span></div></div><div class="hero-world"><span class="world-label">HET LEVEN IS EEN DOBBELSPEL</span>${scene}<span class="world-caption"><span class="status-dot"></span> De 3-man wacht op zijn bende.</span><span class="world-index">01 / ∞</span></div></section><section class="games-section" aria-labelledby="games-title"><div class="section-title"><h2 id="games-title">Wat spelen we?</h2><span>ÉÉN TAFEL. ALLE SPELLETJES.</span></div><div class="game-grid"><button class="game-card available" id="play-three"><div class="game-card-top"><span class="tag">KLAAR OM TE SPELEN</span><span class="game-number">01</span></div><div class="game-card-body"><span class="mini-dice" aria-hidden="true">⚂</span><div><h3>3-man<span class="tiny-dot">.</span></h3><p>Twee dobbelstenen. Eén ongelukkige.</p></div><span class="round-arrow" aria-hidden="true">↗</span></div><div class="game-meta"><span>2–16 spelers</span><span>Jullie huisregels</span><span>∞ plezier</span></div></button><article class="game-card soon"><div class="game-card-top"><span class="tag">NOG EVEN GEDULD</span><span class="game-number">02</span></div><div class="game-card-body"><span class="mini-cards" aria-hidden="true">▱</span><div><h3>Volgende ronde</h3><p>Er is nog plaats aan tafel.</p></div><span class="coming-star" aria-hidden="true">✳</span></div><div class="game-meta"><span>Meer spelletjes volgen</span></div></article></div></section>`;
  $('#intro-crew').onclick = openCrew;
  $('#play-three').onclick = () => { if(players.length < 2) {openCrew();} else startGame(); };
}
function startGame() {if(!game)game=freshGame(players);screen='game';render();save();window.scrollTo({top:0,behavior:'smooth'});}
const pips = {1:[4],2:[0,8],3:[0,4,8],4:[0,2,6,8],5:[0,2,4,6,8],6:[0,2,3,5,6,8]};
function die(value, index) {
  const faces = [1,2,3,4,5,6].map(face => `<div class="die-face die-face--${face}" aria-hidden="true">${Array.from({length:9},(_,i)=>`<i class="${pips[face].includes(i)?'pip':''}"></i>`).join('')}</div>`).join('');
  return `<div class="die-wrap"><span class="die-ground" aria-hidden="true"></span><span class="die-impact" aria-hidden="true"></span><div class="die die--${index} face-up-${value}" data-value="${value}" role="img" aria-label="${value} ogen"><div class="die-cube">${faces}</div></div></div>`;
}
function renderGame() {
  const last = game.last, current = game.players[game.turn];
  $('#app').innerHTML = `<section class="play-screen"><div class="play-heading"><button class="text-button" id="back-hub">← De spelletjes</button><span class="eyebrow">3-MAN · JULLIE HUISREGELS</span><button class="secondary-button" id="show-rules">Spelregels <span aria-hidden="true">?</span></button></div><div class="play-layout"><aside class="table-panel"><div class="eyebrow">RONDOM DE TAFEL</div><h2>De bende<span class="tiny-dot">.</span></h2><ol class="table-players">${game.players.map((p,i)=>`<li class="${i===game.turn?'current':''}">${avatar(p,i)}<div><strong>${escape(p)}</strong><small>${p===game.threeMan ? game.multiplier===2?'Dubbel 3-man · ×2':'De 3-man · ×1':i===game.turn?'Aan de beurt':'Aan tafel'}</small></div>${i===game.turn?'<span aria-label="Aan de beurt">←</span>':p===game.threeMan?'<span aria-label="3-man">♛</span>':''}</li>`).join('')}</ol><button class="text-button" id="edit-crew">Bende aanpassen ↗</button><div class="table-note">Volgorde = zitvolgorde.<br>Geef de telefoon maar door.</div></aside><div class="roll-panel"><div class="turn-label"><span class="status-dot"></span>${last?`Worp ${game.rolls} van ${escape(last.player)}`:'Een verse tafel, een verse kans.'}</div><h1>${last?'Da’s een worp<span class="serif-word">.</span>':`Gooi maar,<br><span class="serif-word">${escape(current)}.</span>`}</h1><div class="dice-stage ${rolling?'rolling':''}" id="dice-stage">${die(last?.a||3,0)}${die(last?.b||1,1)}</div><div class="result-area" aria-live="polite" aria-atomic="true">${last?last.events.map(e=>`<div class="result-line ${escape(e.type)}"><span class="result-symbol" aria-hidden="true">${e.type==='role'?'♛':e.type==='give'?'↗':e.type==='free'?'✳':'↓'}</span><div><h3>${escape(e.title)}</h3><p>${escape(e.text)}</p></div></div>`).join(''):`<p class="first-roll-copy">Twee dobbelstenen. De rest is aan het lot.</p>`}</div><div class="roll-controls">${manual?`<form id="manual-form"><div class="manual-inputs"><label>Eerste dobbelsteen<select id="die-a">${[1,2,3,4,5,6].map(n=>`<option>${n}</option>`).join('')}</select></label><span>+</span><label>Tweede dobbelsteen<select id="die-b">${[1,2,3,4,5,6].map(n=>`<option>${n}</option>`).join('')}</select></label></div><button class="button roll-button" type="submit">Verwerk worp van ${escape(current)} <span>↗</span></button></form>`:`<button class="button roll-button" id="roll-button">${last?`${escape(current)}, jij bent`:'Gooi de dobbelstenen'} <span aria-hidden="true">⚄</span></button>`}<div class="under-roll"><button class="subtle-button" id="toggle-manual">${manual?'Digitaal gooien':'Echte dobbelstenen?'}</button><button class="subtle-button" id="undo-button" ${history.length?'':'disabled'}>↶ Worp terug</button></div></div></div><aside class="status-panel"><span class="eyebrow">DE KROON</span><div class="crown-icon" aria-hidden="true">♛</div><h2>${game.threeMan?escape(game.threeMan):'Wie wordt<br>de 3-man?'}</h2><p>${game.threeMan?game.multiplier===2?'Dubbel geluk. Dubbele slokken.':'De 3-man is gevonden.':'Gooi 2–1 en ontdek wie de kroon mag dragen.'}</p><span class="role-chip">${game.threeMan?`3-MAN ×${game.multiplier}`:'NOG NIEMAND'}</span><div class="quick-rules"><div><b>5</b><span>Vorige drinkt</span></div><div><b>7</b><span>Gooier drinkt</span></div><div><b>9</b><span>Volgende drinkt</span></div></div><button class="subtle-button" id="new-game">Nieuwe partij ↗</button></aside></div><p class="play-bottom">Op jullie tempo. Met jullie drankje. Ook prima met water of punten.</p></section>`;
  $('#back-hub').onclick=()=>{if(!rolling){screen='hub';render();}}; $('#show-rules').onclick=()=>$('#rules-dialog').showModal();$('#edit-crew').onclick=openCrew;
  $('#new-game').onclick=()=>$('#reset-dialog').showModal();
  $('#toggle-manual').onclick=()=>{if(rolling)return;manual=!manual;renderGame();};
  $('#undo-button').onclick=()=>{if(!rolling&&history.length){game=history.pop();save();renderGame();}};
  if(manual)$('#manual-form').onsubmit=e=>{e.preventDefault();doRoll(Number($('#die-a').value),Number($('#die-b').value));};
  else $('#roll-button').onclick=()=>doRoll(randomDie(),randomDie());
}
async function doRoll(a,b) {
  if(rolling)return;
  rolling=true;
  const stage=$('#dice-stage');
  stage.classList.add('rolling');
  stage.setAttribute('aria-busy','true');
  $('.roll-panel').classList.add('is-rolling');
  document.querySelectorAll('.roll-controls button,.roll-controls select,#back-hub,#new-game').forEach(el=>el.disabled=true);
  try {
    // Physical dice are already rolled: entered results appear immediately.
    if(!manual)await animateDice(stage,[a,b],{reducedMotion:window.matchMedia('(prefers-reduced-motion: reduce)').matches});
  } catch {
    // A presentation failure must never lose a roll or leave the controls locked.
  }
  history.push(structuredClone(game));
  if(history.length>50)history.shift();
  game=resolveRoll(game,a,b);
  rolling=false;
  save();
  if(screen==='game')renderGame();
}
function render() {$('#crew-count').textContent=players.length;screen==='game'?renderGame():renderHub();}
function openCrew() {if(rolling)return;renderPlayers();$('#crew-dialog').showModal();}
function renderPlayers() {
  const count = Math.max(2, players.length || 4);
  $('#player-count').innerHTML = Array.from({length:15}, (_,i) => `<option value="${i+2}" ${i+2===count?'selected':''}>${i+2} spelers</option>`).join('');
  $('#player-list').innerHTML=players.map((p,i)=>`<li>${avatar(p,i)}<strong>${escape(p)}</strong><div class="player-actions"><button class="icon-button" data-up="${i}" aria-label="${escape(p)} eerder aan de beurt" ${i===0?'disabled':''}>↑</button><button class="icon-button" data-remove="${i}" aria-label="${escape(p)} verwijderen">×</button></div></li>`).join('') || '<li class="empty-players">Een lege tafel. Wie schuift als eerste aan?</li>';
  $('#roster-warning').textContent=game?'Een wijziging aan de bende start een nieuwe partij.':'';
  $('#crew-done').textContent=players.length<2?'Nog minstens 2 spelers nodig':`${players.length} spelers. We zijn vertrokken ↗`;
  $('#crew-done').disabled=players.length<2;
  $('#crew-count').textContent=players.length;
}
function rosterChanged() {game=null;history=[];save();renderPlayers();if(screen==='game')screen='hub';render();}
$('#add-player').onsubmit=e=>{
  e.preventDefault();const input=$('#player-name'), name=input.value.trim().replace(/\s+/g,' ');$('#player-error').textContent='';
  if(!name){$('#player-error').textContent='Een naam erbij en je bent binnen.';return;}
  if(players.some(p=>p.toLocaleLowerCase()===name.toLocaleLowerCase())){$('#player-error').textContent='Die naam zit al aan tafel. Gebruik een bijnaam.';return;}
  if(players.length>=16){$('#player-error').textContent='De tafel zit vol: maximaal 16 spelers.';return;}
  players.push(name);input.value='';rosterChanged();input.focus();
};
$('#player-list').onclick=e=>{const remove=e.target.closest('[data-remove]'),up=e.target.closest('[data-up]');if(remove){players.splice(Number(remove.dataset.remove),1);rosterChanged();}if(up){const i=Number(up.dataset.up);if(i>0){[players[i-1],players[i]]=[players[i],players[i-1]];rosterChanged();}}};
$('#quick-start').onsubmit=e=>{
  e.preventDefault();
  let numberedPlayers;
  try {numberedPlayers=playersFromCount(Number($('#player-count').value));}
  catch(error) {toast(error.message);return;}
  if(JSON.stringify(players)!==JSON.stringify(numberedPlayers)) {
    players=numberedPlayers;
    rosterChanged();
  }
  $('#crew-dialog').close();
  startGame();
};
$('#crew-done').onclick=()=>{$('#crew-dialog').close();startGame();};
$('#crew-nav').onclick=openCrew;
$('#hub-nav').onclick=()=>{if(!rolling){screen='hub';render();}};
$('.brand').onclick=e=>{e.preventDefault();if(!rolling){screen='hub';render();}};
$('#about-button').onclick=()=>$('#about-dialog').showModal();
$('#cancel-reset').onclick=()=>$('#reset-dialog').close();
$('#confirm-reset').onclick=()=>{if(rolling)return;game=freshGame(players);history=[];save();$('#reset-dialog').close();renderGame();};
for(const dialog of document.querySelectorAll('dialog'))dialog.addEventListener('click',e=>{if(e.target===dialog){const rect=dialog.getBoundingClientRect();if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)dialog.close();}});
render();
