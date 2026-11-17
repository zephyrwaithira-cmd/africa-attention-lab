import test from 'node:test';
import assert from 'node:assert/strict';
import { cases, financeSnapshot, optionAvailable } from './src/caseData.js';
import { initial, reducer, restore, canSubmit, duration, exportSession } from './src/caseEngine.js';
const explanation = 'I used the evidence and considered who carries the remaining risk.';
function start(index = 0) { return reducer({ ...initial(), caseIndex: index }, { type: 'start', at: 1000 }); }
function ready(s, choice = cases[s.caseIndex].scenes[s.scene].options[0].id) {
  for (const source of cases[s.caseIndex].scenes[s.scene].sources.slice(0, 2)) s = reducer(s, { type: 'open', id: source.id, at: 2000 + s.scene * 10000 });
  s = reducer(s, { type: 'choose', id: choice, at: 2500 + s.scene * 10000 });
  return reducer(s, { type: 'note', value: explanation, at: 3000 + s.scene * 10000 });
}
function commit(s, choice) { return reducer(ready(s, choice), { type: 'submit', at: 4000 + s.scene * 10000 }); }
test('sources must be distinct; blank explanations and invalid choices do not submit', () => {
  let s = start();
  for (let n = 0; n < 3; n++) s = reducer(s, { type: 'open', id: 'applications', at: 1500 });
  s = reducer(s, { type: 'choose', id: 'mixed', at: 1800 });
  s = reducer(s, { type: 'note', value: explanation, at: 1900 });
  assert.equal(s.opened.length, 1); assert.equal(canSubmit(s), false);
  assert.equal(reducer(s, { type: 'submit', at: 2000 }).decisions.length, 0);
  s = ready(s);
  assert.equal(canSubmit(s), true);
  assert.equal(canSubmit({ ...s, note: '  ' }), true); // OpenPath round 1 no longer prompts a note.
  assert.equal(canSubmit({ ...s, selected: 'unknown' }), false);
});
test('all reachable choice branches finish; financial gating blocks only unaffordable speed', () => {
  const totals = [];
  function walk(s) {
    for (const option of cases[s.caseIndex].scenes[s.scene].options) {
      const available = optionAvailable(s.caseIndex, s.scene, option.id, s.decisions);
      const next = ready(s, option.id);
      if (!available) { assert.notEqual(next.selected, option.id); continue; }
      const submitted = reducer(next, { type: 'submit', at: 4000 + s.scene * 10000 });
      assert.equal(submitted.decisions.length, s.scene + 1);
      if (submitted.status === 'submitted') { totals[s.caseIndex] = (totals[s.caseIndex] ?? 0) + 1; continue; }
      walk(reducer(submitted, { type: 'next-scene', at: 4500 + s.scene * 10000 }));
    }
  }
  cases.forEach((_, i) => walk(start(i)));
  assert.deepEqual(totals, [81, 69, 81]);
});
test('cash ledger separates receivables, current cash, liabilities and later production', () => {
  assert.deepEqual(financeSnapshot([{ choice: 'deposit' }, { choice: 'partial' }, { choice: 'repair' }]), { cash: 10, receivable: 58, liabilities: 0, remainingProduction: 0, finalCash: 68 });
  assert.deepEqual(financeSnapshot([{ choice: 'staged' }, { choice: 'owner' }, { choice: 'repair' }]), { cash: 2, receivable: 60, liabilities: 12, remainingProduction: 48, finalCash: 62 });
  const debt = financeSnapshot([{ choice: 'loan' }, { choice: 'agreement' }, { choice: 'reduce' }]);
  assert.deepEqual(debt, { cash: 3, receivable: 108, liabilities: 61, remainingProduction: 0, finalCash: 50 });
  assert.equal(optionAvailable(1, 2, 'specialist', [{ choice: 'loan' }, { choice: 'agreement' }]), false);
  assert.equal(optionAvailable(1, 2, 'specialist', [{ choice: 'deposit' }, { choice: 'agreement' }]), true);
});
test('committed decisions are immutable and next-round controls reset', () => {
  const committed = commit(start());
  assert.equal(reducer(committed, { type: 'submit', at: 4500 }).decisions.length, 1);
  assert.equal(reducer(committed, { type: 'note', value: 'changed', at: 4500 }).note, explanation);
  const next = reducer(committed, { type: 'next-scene', at: 5000 });
  assert.equal(next.scene, 1); assert.equal(next.selected, ''); assert.deepEqual(next.opened, []); assert.equal(next.decisions[0].choiceTitle, cases[0].scenes[0].options[0].title);
});
test('timeout at the exact deadline retains drafts and prevents late submissions', () => {
  const s = ready(start());
  const expired = reducer(s, { type: 'submit', at: 1000 + duration(0) });
  assert.equal(expired.status, 'expired'); assert.equal(expired.note, explanation); assert.equal(expired.decisions.length, 0);
  assert.equal(expired.end, 601000);
  assert.equal(restore(JSON.stringify(s), 602000).status, 'expired');
  const feedback = commit(start());
  assert.equal(reducer(feedback, { type: 'next-scene', at: 601000 }).status, 'expired');
});
test('full journey restores at every checkpoint and includes evidence context in export', () => {
  let s = initial();
  for (let c = 0; c < 3; c++) {
    s = reducer(s, { type: 'start', at: 1000 });
    for (let i = 0; i < 4; i++) {
      s = ready(s);
      s = restore(JSON.stringify(s), 3500 + i * 10000);
      s = reducer(s, { type: 'submit', at: 4000 + i * 10000 });
      s = restore(JSON.stringify(s), 4200 + i * 10000);
      if (i < 3) s = reducer(s, { type: 'next-scene', at: 4500 + i * 10000 });
    }
    s = reducer(s, { type: 'next-case', at: 40000 });
    assert.equal(s.records.length, c + 1);
    s = restore(JSON.stringify(s), 40001);
  }
  s = reducer(s, { type: 'start', at: 50000 });
  assert.equal(canSubmit(s), false);
  for (let i = 0; i < 3; i++) s = reducer(s, { type: 'reflect', index: i, value: explanation, at: 51000 });
  s = reducer(s, { type: 'submit', at: 52000 });
  assert.equal(s.status, 'submitted');
  const payload = exportSession(s, 'TEST-V2', { status: 'submitted' }, { version: 1 }, 53000);
  assert.equal(payload.caseStudies.records.flatMap(r => r.decisions).length, 12);
  assert.equal(payload.previousIslandJourney.version, 1);
  assert.equal(payload.caseStudies.records[0].decisions[0].sourcesOpened.length, 2);
  assert.equal(JSON.parse(JSON.stringify(payload)).participantId, 'TEST-V2');
});
test('malformed saves fail safely and schema one is never silently migrated', () => {
  for (const value of ['{', '{}', JSON.stringify({ ...initial(), version: 1 }), JSON.stringify({ ...initial(), records: [{}] }), JSON.stringify({ ...start(), opened: [null] }), JSON.stringify({ ...start(), status: 'feedback' })]) assert.throws(() => restore(value, 1000));
});
test('export reconciles elapsed deadline even before browser timer fires', () => {
  const payload = exportSession(ready(start()), 'TEST', null, null, 700000);
  assert.equal(payload.caseStudies.status, 'expired');
  assert.equal(payload.caseStudies.events.at(-1).at, 601000);
});

