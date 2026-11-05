import test from 'node:test';
import assert from 'node:assert/strict';
import {freshGame,resolveRoll,randomDie,playersFromCount} from '../public/game.js';
const base=()=>freshGame(['Flo','Sam','Kim']);
test('all 36 outcomes advance once, preserve state, and return an instruction',()=>{for(let a=1;a<=6;a++)for(let b=1;b<=6;b++){const s=base(), before=JSON.stringify(s), n=resolveRoll(s,a,b);assert.equal(JSON.stringify(s),before);assert.equal(n.turn,1);assert.equal(n.rolls,1);assert.ok(n.last.events.length);assert.equal(n.last.a,a);}});
test('doubles distribute face value, not the sum',()=>{for(let d=1;d<=6;d++){const e=resolveRoll(base(),d,d).last.events.find(e=>e.type==='give');assert.ok(e.title.includes(` ${d} `));}});
test('5 previous wraps, 7 self, 9 next',()=>{for(const [a,b,name] of [[1,4,'Kim'],[1,6,'Flo'],[4,5,'Sam']])assert.ok(resolveRoll(base(),a,b).last.events.find(e=>e.type==='drink').title.startsWith(name));});
test('2–1 assigns role and applies sip; a repeated role is double, capped at two',()=>{let s=resolveRoll(base(),2,1);assert.equal(s.threeMan,'Flo');assert.equal(s.multiplier,1);assert.equal(s.last.events.find(e=>e.type==='three').title,'Flo, neem 1 slok.');s.turn=0;s=resolveRoll(s,1,2);assert.equal(s.multiplier,2);assert.equal(s.last.events.find(e=>e.type==='three').title,'Flo, neem 2 slokken.');s.turn=0;s=resolveRoll(s,2,1);assert.equal(s.multiplier,2);});
test('new role holder resets double',()=>{let s=base();s.threeMan='Kim';s.multiplier=2;const n=resolveRoll(s,1,2);assert.equal(n.threeMan,'Flo');assert.equal(n.multiplier,1);});
test('every trigger, overlap once, plus independent instructions',()=>{for(let a=1;a<=6;a++)for(let b=1;b<=6;b++){let s=base();s.threeMan='Kim';const n=resolveRoll(s,a,b);assert.equal(n.last.events.filter(e=>e.type==='three').length,a===3||b===3||(a+b)%3===0?1:0);}let s=base();s.threeMan='Kim';assert.deepEqual(resolveRoll(s,3,6).last.events.map(e=>e.type),['drink','three']);assert.deepEqual(resolveRoll(s,3,3).last.events.map(e=>e.type),['give','three']);});
test('invalid dice and insufficient players rejected',()=>{for(const pair of [[0,1],[7,1],[1.5,2],[NaN,1]])assert.throws(()=>resolveRoll(base(),...pair));assert.throws(()=>resolveRoll(freshGame(['Flo']),1,2));});
test('random dice reject biased tail and stay within 1–6',()=>{let values=[4294967295,8];const fake={getRandomValues:a=>{a[0]=values.shift();}};assert.equal(randomDie(fake),3);for(let i=0;i<100;i++){const n=randomDie();assert.ok(n>=1&&n<=6);}});

test('count-only games validate the group and keep turns and roles distinct',()=>{
  for(const count of [2,4,16]) {
    const players=playersFromCount(count);
    assert.equal(players.length,count);
    assert.equal(new Set(players).size,count);
    assert.equal(players[0],'Speler 1');
    assert.equal(players.at(-1),`Speler ${count}`);
    const assigned=resolveRoll(freshGame(players),2,1);
    assert.equal(assigned.threeMan,'Speler 1');
    assert.equal(assigned.turn,1);
    const previous=resolveRoll(freshGame(players),1,4);
    assert.equal(previous.last.events[0].title,`Speler ${count}, neem 1 slok.`);
  }
  for(const count of [0,1,17,2.5,NaN,'4',undefined])assert.throws(()=>playersFromCount(count));
});
