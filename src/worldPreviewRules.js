import { financeSnapshot } from './caseData.js';

// A selected option substitutes only the current round; it never alters saved decisions.
export function previewDecisions(s) {
  const decisions = s.decisions.filter(d => d.scene < s.scene);
  if (s.selected) decisions.push({ scene: s.scene, choice: s.selected });
  return decisions;
}
export function financePreview(s) {
  return financeSnapshot(previewDecisions(s));
}
export const teamPlans = {
  specialists: [['Imani', 3, 'Research'], ['Leo', 4, 'Build'], ['Tess', 4, 'Coordinate / test'], ['Noor', 3, 'Write / review']],
  coached: [['Imani', 3, '1 coaching + 2 research'], ['Leo', 4, 'Build'], ['Tess', 4, '1 learning + 3 coordination / testing'], ['Noor', 3, 'Write / review']],
  review: [['Imani', 3, '2 research + 1 review'], ['Leo', 4, '1 review + 3 build'], ['Tess', 4, 'Coordinate / test'], ['Noor', 3, 'Write / review']],
};
export const teamChanges = {
  scope: ['Smaller launch', 'Original date', '8 tokens retained', 'Tess takes a bounded follow-up; one coordination task is removed.'],
  contractor: ['Original scope', 'Original date', '0 tokens remain', 'Two researcher days; Imani’s remaining day supports the handover.'],
  extend: ['Original scope', '3 days later', '8 tokens retained', 'Resequence confirmed work; extra calendar time is not unagreed overtime.'],
};
export const testActions = {
  targeted: ['Navigation + wording + contrast', 'Repeat the registration task', 'Uses existing build and review slots.'],
  facilitated: ['Accessible facilitated route', 'Named owner + repair date', 'A supported pilot; independent use is not yet ready.'],
  pause: ['Review the full journey', 'Agree a revised release plan', 'Additional delay; a fresh scope and date agreement is required.'],
};
export const teamHabits = {
  handover: ['Shared notes', 'Backup owner', 'Next-project checkpoint'],
  development: ['Bounded testing assignment', 'Coaching + protected time', 'Review date'],
  scopehabit: ['Visible workload', 'Explicit trade-off for new work', 'Regular plan review'],
};
