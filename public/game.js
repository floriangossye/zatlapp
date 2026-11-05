// Pure rules: no DOM, storage or random values. UI and tests share this engine.
export function freshGame(players) {
  return { players: [...players], turn: 0, threeMan: null, multiplier: 1, rolls: 0, last: null };
}
export function resolveRoll(state, a, b) {
  if (!state || state.players.length < 2) throw new Error('Voeg minstens 2 spelers toe.');
  if (![a,b].every(n => Number.isInteger(n) && n >= 1 && n <= 6)) throw new Error('Ongeldige dobbelsteen.');
  const next = structuredClone(state);
  const player = state.players[state.turn];
  const sum = a+b;
  const events = [];
  const is21 = sum === 3;
  if (is21) {
    const repeated = state.threeMan === player;
    next.threeMan = player;
    // House rule: cap at double until a new 3-man is selected.
    next.multiplier = repeated ? 2 : 1;
    events.push({type:'role',title: repeated ? `${player} is dubbel 3-man!` : `${player} is de 3-man!`, text: repeated ? 'Vanaf nu telt elke 3-man-slok dubbel.' : 'De kroon is van jou. Tot iemand anders 2–1 gooit.'});
  }
  if (a === b) events.push({type:'give',title:`${player}, deel ${a} ${a === 1 ? 'slok' : 'slokken'} uit.`,text:'Dubbel gegooid! Verdeel ze zoals je wilt.'});
  if ([5,7,9].includes(sum)) {
    const offset = sum === 5 ? -1 : sum === 9 ? 1 : 0;
    const drinker = state.players[(state.turn + offset + state.players.length) % state.players.length];
    events.push({type:'drink',title:`${drinker}, neem 1 slok.`,text:sum === 5 ? 'Vijf: de vorige speler drinkt.' : sum === 7 ? 'Zeven: de gooier drinkt.' : 'Negen: de volgende speler drinkt.'});
  }
  // A matching throw triggers once, even when a 3 and a multiple of 3 overlap.
  // 2–1 assigns the role first, then the new 3-man takes the matching sip.
  if (next.threeMan && (a === 3 || b === 3 || sum % 3 === 0)) events.push({type:'three',title:`${next.threeMan}, neem ${next.multiplier} ${next.multiplier === 1 ? 'slok' : 'slokken'}.`,text: next.multiplier === 2 ? 'Dubbel 3-man: deze telt dubbel.' : 'Een 3 of een totaal deelbaar door 3.'});
  if (!events.length) events.push({type:'free',title:'Even op adem komen.',text:'Geen opdracht bij deze worp. Geef maar door.'});
  next.rolls++;
  next.last = {a,b,player,events};
  next.turn = (state.turn + 1) % state.players.length;
  return next;
}
export function randomDie(cryptoSource = globalThis.crypto) {
  const values = new Uint32Array(1);
  // Rejection sampling avoids modulo bias.
  do { cryptoSource.getRandomValues(values); } while(values[0] >= 4294967292);
  return values[0] % 6 + 1;
}
