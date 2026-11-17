import test from 'node:test';
import assert from 'node:assert/strict';
import { financePreview, previewDecisions, teamPlans, teamChanges } from './src/worldPreviewRules.js';
import { cases, financeSnapshot, optionAvailable } from './src/caseData.js';
import { initial, reducer, restore, exportSession } from './src/caseEngine.js';

test('finance previews reconcile for every reachable branch without double charging committed choices', () => {
  function visit(decisions, scene) {
    for (const option of cases[1].scenes[scene].options) {
      if (!optionAvailable(1, scene, option.id, decisions)) continue;
      const state = { ...initial(), caseIndex: 1, scene, selected: option.id, decisions };
      const before = JSON.stringify(state);
      const expected = [...decisions, {scene, choice: option.id}];
      assert.deepEqual(financePreview(state), financeSnapshot(expected));
      assert.equal(JSON.stringify(state), before);
      assert.deepEqual(financePreview({...state, decisions:expected, status:'feedback'}), financeSnapshot(expected));
      assert.ok(financePreview(state).cash >= 0);
      if(scene < 3) visit(expected,scene+1);
    }
  }
  visit([],0);
});

test('unselected and expired previews preserve prior commitments and drafts', () => {
  const prior=[{scene:0,choice:'loan'},{scene:1,choice:'agreement'}];
  const state={...initial(),caseIndex:1,scene:2,decisions:prior};
  assert.deepEqual(previewDecisions(state),prior);
  assert.equal(financePreview(state).cash,3);
  assert.deepEqual(financePreview({...state,status:'expired',selected:'reduce'}),{cash:3,receivable:108,liabilities:61,remainingProduction:0,finalCash:50});
  assert.deepEqual(state.decisions,prior);
});

test('talent allocations never exceed the original confirmed capacity and reserve changes are explicit', () => {
  for(const rows of Object.values(teamPlans)) {
    assert.deepEqual(rows.map(x=>x[1]),[3,4,4,3]);
    assert.equal(rows.reduce((sum,x)=>sum+x[1],0),14);
  }
  assert.equal(teamChanges.contractor[2],'0 tokens remain');
  assert.equal(teamChanges.scope[2],'8 tokens retained');
  assert.equal(teamChanges.extend[1],'3 days later');
});

test('new map sessions retain all three case records through reflection and export', () => {
  let s=initial(),at=1000;
  const act=(type,extra={})=>{s=reducer(s,{type,at:at+=100,...extra});};
  for(let world=0;world<3;world++) {
    act('start');
    for(let scene=0;scene<4;scene++) {
      for(const source of cases[world].scenes[scene].sources.slice(0,2))act('open',{id:source.id});
      act('choose',{id:cases[world].scenes[scene].options[0].id});
      act('note',{value:'I considered the evidence and the remaining risk.'});
      act('submit');
      s=restore(JSON.stringify(s),at);
      if(scene<3) act('next-scene');
    }
    act('next-case');
  }
  act('start');
  for(let index=0;index<3;index++)act('reflect',{index,value:'My specific improvement is to check assumptions before committing.'});
  act('submit');
  const result=exportSession(s,'TEST',null,null,at);
  assert.equal(s.status,'submitted');
  assert.equal(result.interfaceVersion,'guided-world-maps-2');
  assert.equal(result.caseStudies.records.length,3);
  assert.deepEqual(result.caseStudies.records.map(x=>x.decisions.length),[4,4,4]);
});
