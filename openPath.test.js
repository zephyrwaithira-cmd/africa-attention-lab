import test from 'node:test';
import assert from 'node:assert/strict';
import { initial, reducer, noteRequired, canSubmit, restore, exportSession } from './src/caseEngine.js';
import { recruitment, packages, deliveryFor, responsePreview, reportPreview } from './src/openPathRules.js';
import { cases } from './src/caseData.js';
function prepare(scene) {
  let s = { ...initial(), status: 'active', start: 1000, scene };
  for (const item of cases[0].scenes[scene].sources.slice(0,2)) s = reducer(s, { type: 'open', id: item.id, at: 2000 });
  return reducer(s, { type: 'choose', id: cases[0].scenes[scene].options[0].id, at: 3000 });
}
test('visual places and delivery budgets match the case quantities', () => {
  for (const groups of Object.values(recruitment)) assert.equal(groups.reduce((n,g) => n+g.count,0),30);
  for (const p of Object.values(packages)) assert.equal(p.training+p.support+p.admin+p.reserve,60);
  assert.deepEqual(Object.values(packages).map(p => p.reserve), [10,2,6]);
  assert.deepEqual(Object.values(packages).map(p => p.affected), [6,4,6]);
});
test('notes are required only at two OpenPath checkpoints; other cases unchanged', () => {
  for (let i=0;i<4;i++) {
    const s = prepare(i);
    assert.equal(noteRequired(s), [1,3].includes(i));
    assert.equal(canSubmit(s), ![1,3].includes(i));
    const committed = reducer({ ...s, note: [1,3].includes(i) ? 'This is a specific explanation of the chosen trade-off.' : '' }, { type:'submit',at:4000 });
    assert.equal(committed.decisions.at(-1).rationaleRequested,[1,3].includes(i));
  }
  for (const caseIndex of [1,2,3]) assert.equal(noteRequired({caseIndex,scene:0}),true);
});
test('previews do not commit a plan or advance the mission', () => {
  let s=prepare(1);
  s=reducer(s,{type:'choose',id:'evening',at:3500});
  assert.equal(deliveryFor(s).reserve,2);
  s=reducer(s,{type:'choose',id:'blended',at:3600});
  assert.equal(deliveryFor(s).reserve,6);
  assert.equal(s.decisions.length,0);
  assert.equal(s.scene,1);
  assert.equal(deliveryFor({...s,scene:2,selected:'support',decisions:[{scene:1,choice:'day'}]}).reserve,10);
});
test('every visual response and report corresponds to an authored option', () => {
  assert.deepEqual(Object.keys(responsePreview), cases[0].scenes[2].options.map(o=>o.id));
  assert.deepEqual(Object.keys(reportPreview), cases[0].scenes[3].options.map(o=>o.id));
});
test('existing v2 saves remain valid and unprompted notes stay explicit in export', () => {
  const old = reducer({...prepare(0),note:'Legacy written rationale retained.'},{type:'submit',at:4000});
  delete old.decisions[0].rationaleRequested;
  const saved=restore(JSON.stringify(old),4500);
  assert.equal(saved.decisions[0].rationale,'Legacy written rationale retained.');
  const fresh=reducer(prepare(0),{type:'submit',at:4000});
  const result=exportSession(fresh,'MAP-TEST',null,null,4500);
  assert.equal(result.interfaceVersion,'guided-world-maps-2');
  assert.equal(result.caseStudies.decisions[0].rationale,'');
  assert.equal(result.caseStudies.decisions[0].rationaleRequested,false);
});

