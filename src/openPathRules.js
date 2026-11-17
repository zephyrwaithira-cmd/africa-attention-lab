// Visual quantities mirror the authored case. They are not effectiveness scores.
export const rounds = [
  { name: 'Open the doors', objective: 'Give 30 people a route into the programme.', cargo: '30 invitations', icon: '✉', action: 'Send invitations', labels: ['Work sample', 'Reserved places', 'Two routes'], helper: 'Compare the three recruitment flags. The people below show how the 30 places are allocated, not who will get a job.' },
  { name: 'Build the programme', objective: 'Choose a delivery plan within 60 tokens.', cargo: '60-token purse', icon: '◉', action: 'Fund this plan', labels: ['Daytime centre', 'Evening hubs', 'Blended learning'], helper: 'Move your programme purse to a venue, or select its flag. Compare the spending and what remains in reserve.' },
  { name: 'Respond to the gap', objective: 'Adapt when real attendance challenges appear.', cargo: 'Response plan', icon: '↻', action: 'Put response into action', labels: ['Catch-up route', 'Appeal & replace', 'Pause & redesign'], helper: 'Choose a response flag to preview how the programme changes. A missed session is a question to investigate, not a judgement about a person.' },
  { name: 'Share what you learned', objective: 'Make a useful report without promising more than the evidence shows.', cargo: 'Evidence folder', icon: '▤', action: 'Send the report', labels: ['Delivery review', 'Access review', 'Staged evidence'], helper: 'Choose a report flag. Separate what you can check now from what needs more time.' },
];
export const recruitment = {
  readiness: [{ name: 'Work sample places', count: 30, color: 'blue' }],
  barriers: [{ name: 'Barrier-reserved places', count: 20, color: 'coral' }, { name: 'Open draw', count: 10, color: 'gold' }],
  mixed: [{ name: 'Work sample places', count: 15, color: 'blue' }, { name: 'Supported application + draw', count: 15, color: 'gold' }],
};
export const packages = {
  day: { name: 'Daytime centre', training: 30, support: 15, admin: 5, reserve: 10, supportLabel: 'Travel', issue: '6 participants report daytime clashes', affected: 6 },
  evening: { name: 'Neighbourhood evenings', training: 36, support: 12, admin: 10, reserve: 2, supportLabel: 'Care support', issue: '4 participants work evenings', affected: 4 },
  blended: { name: 'Blended learning', training: 30, support: 18, admin: 6, reserve: 6, supportLabel: 'Device loans', issue: '6 participants have unreliable connectivity', affected: 6 },
};
export const responsePreview = {
  support: { title: 'Redirect staff time', steps: ['Postpone publicity', 'Phone check-ins', 'Catch-up session'], caption: 'No extra token cost. The original 30 participants stay visible in the report.' },
  replace: { title: 'Make space for an appeal', steps: ['Contact participants', 'Hear explanations', 'Fill vacant places'], caption: 'Document departures and replacements separately. Do not claim that replacing people improved the original group’s completion.' },
  redesign: { title: 'Move the programme checkpoint', steps: ['Pause for 1 week', 'Request agreement', 'Rebook interviews'], caption: 'A request for funding is not approval. The revised plan depends on the county’s decision.' },
};
export const reportPreview = {
  delivery: { now: ['Attendance & departures', 'Verified spending', 'Interview invitations'], later: ['Three-month employment follow-up'], title: 'Delivery and cost review' },
  equity: { now: ['Participation barriers', 'Support used', 'Experiences of people who left'], later: ['Longer-term outcomes', 'Larger samples for comparisons'], title: 'Access and experience review' },
  followup: { now: ['Honest interim account', 'Spending and changes'], later: ['Three-month follow-up', 'Decision on expansion'], title: 'Staged evidence plan' },
};
export function deliveryFor(s) {
  const id = s.scene === 1 && s.selected ? s.selected : s.decisions.find(d => d.scene === 1)?.choice;
  return packages[id] ?? null;
}
