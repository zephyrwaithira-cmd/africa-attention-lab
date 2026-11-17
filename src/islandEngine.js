export const minutes = [10, 15, 10, 10];
export const titles = ['Policy Island', 'Budget Island', 'Talent Island', 'Reflection'];
export const policies = [
  { name: 'Travel passes', cost: 2, reach: 3, access: 4, detail: 'Verified survey: travel costs stop 40 of 100 surveyed learners attending. Sample covers two wards only.' },
  { name: 'Apprenticeships', cost: 3, reach: 4, access: 2, detail: 'Signed employer letters offer 30 placements. Applicants need transport and daytime availability.' },
  { name: 'Evening training', cost: 2, reach: 3, access: 3, detail: 'Community centres confirm evening space. Trainers are available; equipment is limited.' },
  { name: 'Device library', cost: 3, reach: 2, access: 4, detail: 'Inventory confirms 20 loan devices. Maintenance and accessible software need funding.' },
  { name: 'Launch festival', cost: 2, reach: 4, access: 1, detail: 'Promoter predicts 5,000 visitors. No attendance evidence or employment follow-up is supplied.' },
  { name: 'Online campaign', cost: 1, reach: 3, access: 1, detail: 'A popular post claims everyone wants online training. Followers are not a representative sample.' },
];
export const people = [
  { name: 'Ari', skills: [3, 1, 2], capacity: 3 },
  { name: 'Bo', skills: [1, 3, 2], capacity: 2 },
  { name: 'Cy', skills: [2, 2, 3], capacity: 3 },
  { name: 'Dee', skills: [3, 2, 1], capacity: 2 },
];
export const roles = ['Policy research', 'Budget oversight', 'Community outreach'];
export const blank = () => ({ version: 1, stage: 0, start: null, end: null, status: 'ready', events: [], records: [], inspected: [], selected: [], rationale: '', allocation: [3, 3, 3], shock: false, assignments: ['', '', ''], trials: [], reflection: ['', '', ''], confidence: 5 });
export function policyResult(selected) {
  return selected.reduce((r, i) => ({ cost: r.cost + policies[i].cost, reach: r.reach + policies[i].reach, access: r.access + policies[i].access }), { cost: 0, reach: 0, access: 0 });
}
export function budgetResult(allocation, shock) {
  const costs = shock ? [2, 1, 1] : [1, 1, 1];
  return { cost: allocation.reduce((n, x, i) => n + x * costs[i], 0), limit: shock ? 10 : 12, outputs: allocation.map((x, i) => x * [8, 5, 3][i]) };
}
export function talentResult(assignments, round) {
  const needs = round >= 1 ? [2, 2, 3] : [2, 2, 2];
  return roles.map((role, i) => {
    const p = people[Number(assignments[i])];
    if (assignments[i] === '' || !p) return `${role}: assign a team member.`;
    const load = assignments.filter(x => x === assignments[i]).length + (i === 2 && round >= 1 ? 1 : 0);
    return `${role}: ${p.skills[i] < needs[i] ? 'skill gap' : load > p.capacity ? 'capacity exceeded' : 'ready'}.`;
  });
}
export function canFinish(s) {
  if (s.stage === 0) return s.selected.length === 3 && policyResult(s.selected).cost <= 7 && !!s.rationale.trim();
  if (s.stage === 1) return s.shock && budgetResult(s.allocation, true).cost <= 10 && s.allocation.every(x => x > 0) && !!s.rationale.trim();
  if (s.stage === 2) return s.trials.length >= 2 && s.trials.at(-1).feedback.every(x => x.endsWith('ready.')) && JSON.stringify(s.assignments) === JSON.stringify(s.trials.at(-1).assignments) && !!s.rationale.trim();
  return s.reflection.every(x => x.trim());
}
function event(s, type, at, detail) { return [...s.events, { type, at, elapsed: Math.max(0, at - (s.start ?? at)), stage: s.stage, detail }]; }
export function reconcile(s, at) {
  if (s.status !== 'active') return s;
  let n = s;
  if (s.stage === 1 && !s.shock && at >= s.start + 7 * 60000) n = { ...s, shock: true, events: event(s, 'funding-shock', s.start + 7 * 60000, { costs: [2, 1, 1], budget: 10 }) };
  if (at >= s.start + minutes[s.stage] * 60000) return { ...n, status: 'expired', end: s.start + minutes[s.stage] * 60000, events: event(n, 'expired-draft-retained', s.start + minutes[s.stage] * 60000) };
  return n;
}
export function reducer(state, a) {
  const s = reconcile(state, a.at);
  if (a.type === 'tick') return s;
  if (a.type === 'start' && s.status === 'ready') return { ...s, start: a.at, status: 'active', events: event(s, 'start', a.at) };
  if (a.type === 'next' && ['submitted', 'expired'].includes(s.status) && s.stage < 3) {
    const { records, ...record } = s;
    return { ...blank(), stage: s.stage + 1, records: [...records, record] };
  }
  if (s.status !== 'active') return s;
  if (a.type === 'finish') return canFinish(s) ? { ...s, status: 'submitted', end: a.at, events: event(s, 'submitted', a.at) } : s;
  if (a.type === 'inspect' && Number.isInteger(a.index) && policies[a.index]) return { ...s, inspected: [...new Set([...s.inspected, a.index])], events: event(s, 'evidence-opened', a.at, a.index) };
  if (a.type === 'policy' && policies[a.index]) {
    const selected = s.selected.includes(a.index) ? s.selected.filter(i => i !== a.index) : [...s.selected, a.index];
    if (selected.length > 3 || policyResult(selected).cost > 7) return s;
    return { ...s, selected, events: event(s, 'policy-choice', a.at, selected) };
  }
  if (a.type === 'allocate' && [0, 1, 2].includes(a.index) && Number.isInteger(a.value) && a.value >= 0 && a.value <= 12) {
    const allocation = s.allocation.map((x, i) => i === a.index ? a.value : x);
    return { ...s, allocation, events: event(s, 'allocation-change', a.at, allocation) };
  }
  if (a.type === 'assign' && [0, 1, 2].includes(a.index) && ['', '0', '1', '2', '3'].includes(a.value)) {
    const assignments = s.assignments.map((x, i) => i === a.index ? a.value : x);
    return { ...s, assignments, events: event(s, 'assignment-change', a.at, assignments) };
  }
  if (a.type === 'trial' && s.assignments.every(x => x !== '')) {
    const trial = { at: a.at, assignments: [...s.assignments], feedback: talentResult(s.assignments, s.trials.length) };
    return { ...s, trials: [...s.trials, trial], events: event(s, 'team-trial', a.at, trial) };
  }
  if (a.type === 'rationale') return { ...s, rationale: String(a.value).slice(0, 3000) };
  if (a.type === 'reflection' && [0, 1, 2].includes(a.index)) return { ...s, reflection: s.reflection.map((x, i) => i === a.index ? String(a.value).slice(0, 3000) : x) };
  if (a.type === 'confidence' && a.value >= 1 && a.value <= 10) return { ...s, confidence: a.value };
  return s;
}
export function restore(raw, at) {
  const s = JSON.parse(raw);
  if (!s || s.version !== 1 || !Number.isInteger(s.stage) || s.stage < 0 || s.stage > 3 || !['ready', 'active', 'submitted', 'expired'].includes(s.status) || !Array.isArray(s.events) || !Array.isArray(s.records) || !Array.isArray(s.inspected) || !Array.isArray(s.selected) || !Array.isArray(s.trials) || !Array.isArray(s.allocation) || s.allocation.length !== 3 || !s.allocation.every(x => Number.isInteger(x) && x >= 0 && x <= 12) || !Array.isArray(s.assignments) || s.assignments.length !== 3 || !s.assignments.every(x => ['', '0', '1', '2', '3'].includes(x)) || !Array.isArray(s.reflection) || s.reflection.length !== 3 || !s.reflection.every(x => typeof x === 'string') || typeof s.rationale !== 'string' || (s.status !== 'ready' && !Number.isFinite(s.start)) || !s.selected.every(i => Number.isInteger(i) && policies[i])) throw new Error('Invalid saved session');
  return reconcile(s, at);
}
