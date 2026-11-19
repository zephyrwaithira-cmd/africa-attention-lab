import { cases, optionAvailable, financeSnapshot } from './caseData.js';
export const duration = i => (cases[i]?.minutes ?? 10) * 60000;
export const initial = () => ({ version: 2, caseIndex: 0, scene: 0, status: 'briefing', start: null, end: null, selected: '', note: '', opened: [], decisions: [], events: [], records: [], reflection: ['', '', ''], confidence: 5 });
const log = (s, type, at, detail = {}) => [...s.events, { type, at, elapsed: s.start === null ? 0 : Math.max(0, at - s.start), scene: s.scene, ...detail }];
export function reconcile(s, at) {
  if (['active', 'feedback'].includes(s.status) && at >= s.start + duration(s.caseIndex)) {
    const end = s.start + duration(s.caseIndex);
    return { ...s, status: 'expired', end, events: log(s, 'time-expired-draft-retained', end) };
  }
  return s;
}
export const noteRequired = s => s.caseIndex !== 0 || [1, 3].includes(s.scene);
export function canSubmit(s) {
  if (s.status !== 'active') return false;
  if (s.caseIndex === 3) return s.reflection.every(x => x.trim().length >= 20);
  const scene = cases[s.caseIndex].scenes[s.scene];
  return s.opened.length >= 2 && (!noteRequired(s) || s.note.trim().length >= 20) && scene.options.some(o => o.id === s.selected) && optionAvailable(s.caseIndex, s.scene, s.selected, s.decisions);
}
export function reducer(state, a) {
  if (!Number.isFinite(a.at)) return state;
  const s = reconcile(state, a.at);
  if (a.type === 'tick') return s;
  if (a.type === 'start' && s.status === 'briefing') return { ...s, status: 'active', start: a.at, events: log(s, 'case-started', a.at) };
  if (a.type === 'next-case' && ['submitted', 'expired'].includes(s.status) && s.caseIndex < 3) {
    const { records, ...record } = s;
    return { ...initial(), caseIndex: s.caseIndex + 1, records: [...records, record] };
  }
  if (a.type === 'next-scene' && s.status === 'feedback') return { ...s, scene: s.scene + 1, selected: '', note: '', opened: [], status: 'active', events: log(s, 'next-scene', a.at, { nextScene: s.scene + 1 }) };
  if (s.status !== 'active') return s;
  if (a.type === 'reflect' && s.caseIndex === 3 && [0, 1, 2].includes(a.index) && typeof a.value === 'string') return { ...s, reflection: s.reflection.map((x, i) => i === a.index ? a.value.slice(0, 3000) : x) };
  if (a.type === 'confidence' && s.caseIndex === 3 && Number.isInteger(a.value) && a.value >= 1 && a.value <= 10) return { ...s, confidence: a.value };
  if (a.type === 'submit' && canSubmit(s)) {
    if (s.caseIndex === 3) return { ...s, status: 'submitted', end: a.at, events: log(s, 'reflection-submitted', a.at) };
    const scene = cases[s.caseIndex].scenes[s.scene];
    const option = scene.options.find(o => o.id === s.selected);
    const decision = { scene: s.scene, title: scene.title, prompt: scene.prompt, choice: option.id, choiceTitle: option.title, rationale: s.note.trim(), rationaleRequested: noteRequired(s), outcome: option.outcome, next: option.next ?? '', sourcesOpened: scene.sources.filter(x => s.opened.includes(x.id)), at: a.at };
    const last = s.scene === cases[s.caseIndex].scenes.length - 1;
    return { ...s, decisions: [...s.decisions, decision], status: last ? 'submitted' : 'feedback', end: last ? a.at : null, events: log(s, 'decision-committed', a.at, { choice: option.id }) };
  }
  if (s.caseIndex === 3) return s;
  const scene = cases[s.caseIndex].scenes[s.scene];
  if (a.type === 'open' && scene.sources.some(x => x.id === a.id)) return { ...s, opened: [...new Set([...s.opened, a.id])], events: log(s, 'source-opened', a.at, { source: a.id }) };
  if (a.type === 'choose' && scene.options.some(x => x.id === a.id) && optionAvailable(s.caseIndex, s.scene, a.id, s.decisions)) return { ...s, selected: a.id, events: log(s, 'option-selected', a.at, { choice: a.id }) };
  if (a.type === 'note' && typeof a.value === 'string') return { ...s, note: a.value.slice(0, 3000) };
  return s;
}
function validRecord(s, expectedIndex) {
  if (!s || s.version !== 2 || s.caseIndex !== expectedIndex || !Number.isInteger(s.scene) || s.scene < 0 || s.scene >= (cases[expectedIndex]?.scenes.length ?? 1)) return false;
  if (!['briefing', 'active', 'feedback', 'submitted', 'expired'].includes(s.status) || (s.status !== 'briefing' && !Number.isFinite(s.start)) || (s.end !== null && !Number.isFinite(s.end))) return false;
  if (typeof s.selected !== 'string' || typeof s.note !== 'string' || !Array.isArray(s.opened) || !s.opened.every(x => typeof x === 'string') || new Set(s.opened).size !== s.opened.length) return false;
  if (!Array.isArray(s.events) || !s.events.every(x => x && typeof x.type === 'string' && Number.isFinite(x.at) && Number.isFinite(x.elapsed))) return false;
  if (!Array.isArray(s.reflection) || s.reflection.length !== 3 || !s.reflection.every(x => typeof x === 'string') || !Number.isInteger(s.confidence) || s.confidence < 1 || s.confidence > 10) return false;
  if (!Array.isArray(s.decisions) || s.decisions.length > (expectedIndex === 3 ? 0 : 4)) return false;
  if (!s.decisions.every((d, i) => d && d.scene === i && cases[expectedIndex]?.scenes[i]?.options.some(o => o.id === d.choice) && typeof d.rationale === 'string' && typeof d.outcome === 'string' && typeof d.choiceTitle === 'string' && Number.isFinite(d.at))) return false;
  if (expectedIndex < 3) {
    const scene = cases[expectedIndex].scenes[s.scene];
    if (!s.opened.every(id => scene.sources.some(x => x.id === id)) || (s.selected && !scene.options.some(x => x.id === s.selected))) return false;
    if (s.status === 'feedback' && (s.decisions.length !== s.scene + 1 || s.scene === 3)) return false;
    if (s.status === 'submitted' && (s.scene !== 3 || s.decisions.length !== 4 || !Number.isFinite(s.end))) return false;
    if (s.status === 'active' && s.decisions.length !== s.scene) return false;
  } else if (s.status === 'feedback') return false;
  return true;
}
export function restore(raw, at) {
  const s = JSON.parse(raw);
  if (!s || !Number.isInteger(s.caseIndex) || s.caseIndex < 0 || s.caseIndex > 3 || !validRecord(s, s.caseIndex) || !Array.isArray(s.records) || s.records.length !== s.caseIndex || !s.records.every((r, i) => validRecord(r, i) && ['submitted', 'expired'].includes(r.status))) throw new Error('Unrecognised or damaged case-study save.');
  return reconcile(s, at);
}
export function exportSession(s, participantId, phaseOne, previousJourney, at) {
  const current = reconcile(s, at);
  return { schemaVersion: 3, contentVersion: 'fictional-case-studies-2026-11-v2', interfaceVersion: 'guided-world-maps-2', project: 'Africa Attention Lab', participantId, exportedAt: new Date(at).toISOString(), metricNotice: 'Authored fictional consequences, not predictions or validated ability scores. Source-open events do not prove reading. Confidence is self-reported. No AI scoring. Optional session sharing uses Supabase.', timing: 'Unix milliseconds. Maximum activity budgets: hospital 15, policy 10, finance 15, talent 10, reflection 10 minutes. Early submission allowed; transitions untimed. Timers continue while away.', phaseOne, previousIslandJourney: previousJourney, caseStudies: current, financeSummary: current.caseIndex === 1 ? financeSnapshot(current.decisions) : financeSnapshot(current.records.find(r => r.caseIndex === 1)?.decisions ?? []) };
}

