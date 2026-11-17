import { useEffect, useRef, useState } from 'react';
import { cases, optionAvailable } from './caseData';
import { canSubmit, noteRequired } from './caseEngine';
import { recruitment, responsePreview, reportPreview, deliveryFor } from './openPathRules';
import { Avatar } from './OpenPathArt';
import WorldArt from './WorldArt';
import WorldPreview from './WorldPreview.jsx';
import { guides } from './worldGuides';
import './GuidedWorlds.css';
import './OpenPathGame.css';

function PeoplePreview({ choice }) {
  const groups = recruitment[choice] ?? [{ name: 'Unallocated places', count: 30, color: 'empty' }];
  return <section className="op-preview"><div className="op-preview-heading"><strong>30 invitations</strong><span>120 applicants · 90 without a place in this pilot</span></div><div className="op-people" aria-hidden="true">{groups.flatMap(g => Array.from({ length: g.count }, (_, i) => <span key={`${g.color}-${i}`} className={`op-person ${g.color}`}><i/><b/></span>))}</div><ul className="op-key">{groups.map(g => <li key={g.name}><i className={g.color}/><strong>{g.count}</strong> {g.name}</li>)}</ul><p>Places are not job offers. The coloured figures show the rules for allocation, not predicted outcomes or individual identities.</p></section>;
}
function BudgetPreview({ delivery }) {
  const parts = delivery ? [{ title: 'Training', value: delivery.training, color: 'blue' }, { title: delivery.supportLabel, value: delivery.support, color: 'coral' }, { title: 'Administration', value: delivery.admin, color: 'gold' }, { title: 'Reserve', value: delivery.reserve, color: 'green' }] : [{ title: 'Unallocated', value: 60, color: 'empty' }];
  return <section className="op-preview"><div className="op-preview-heading"><strong>{delivery ? `${60 - delivery.reserve} spent · ${delivery.reserve} in reserve` : '60 programme tokens'}</strong><span>Each coin = 2 tokens</span></div><div className="op-budget-track" aria-hidden="true">{parts.map(p => <span className={p.color} key={p.title} style={{ width: `${p.value / 60 * 100}%` }}/>)}</div><div className="op-coins" aria-hidden="true">{Array.from({ length: 30 }, (_, i) => <i key={i} className={delivery && i * 2 >= 60 - delivery.reserve ? 'reserve' : delivery ? 'spent' : ''}>●</i>)}</div><ul className="op-key">{parts.map(p => <li key={p.title}><i className={p.color}/><strong>{p.value}</strong> {p.title}</li>)}</ul><p>Complete package costs from the case. A larger reserve leaves more room for change; it is not automatically a better plan.</p></section>;
}
function ResponsePreview({ choice, delivery }) {
  const response = responsePreview[choice];
  return <section className="op-preview"><div className="op-preview-heading"><strong>{delivery?.issue ?? 'Investigate the attendance gap'}</strong><span>{delivery ? `${delivery.reserve} tokens remain` : 'Use the context from your delivery choice'}</span></div>{delivery && <div className="op-attendance" aria-label={`${delivery.affected} of 30 participants report this barrier; this does not identify who they are.`}>{Array.from({ length: 30 }, (_, i) => <span aria-hidden="true" key={i} className={i < delivery.affected ? 'barrier' : ''}>{i < delivery.affected ? '?' : '•'}</span>)}</div>}{response ? <><strong>{response.title}</strong><ol className="op-workflow">{response.steps.map(step => <li key={step}>{step}</li>)}</ol><p>{response.caption}</p></> : <p>Select a response flag to see which work changes. There is no automatic prediction of how many people return.</p>}</section>;
}
function ReportPreview({ choice }) {
  const report = reportPreview[choice];
  return <section className="op-preview"><div className="op-preview-heading"><strong>{report?.title ?? 'Build your evidence folder'}</strong><span>Evidence, not a score</span></div><div className="op-report"><div><span className="op-file-icon" aria-hidden="true">▤</span><strong>Can check now</strong><ul>{(report?.now ?? ['Choose a report flag']).map(x => <li key={x}>{x}</li>)}</ul></div><div><span className="op-file-icon" aria-hidden="true">◷</span><strong>Needs more time</strong><ul>{(report?.later ?? ['Employment follow-up']).map(x => <li key={x}>{x}</li>)}</ul></div></div><p>No comparison group means this pilot cannot establish that the programme caused jobs.</p></section>;
}
export default function OpenPathGame({ s, participantId, act, seconds, error, blocked, download, hasPrevious }) {
  const [speaker, setSpeaker] = useState(null);
  const [motionOff, setMotionOff] = useState(() => { try { const saved = localStorage.getItem('aal-reduced-motion'); if (saved !== null) return saved === 'true'; } catch { /* Preferences remain optional when storage is unavailable. */ } return window.matchMedia('(prefers-reduced-motion: reduce)').matches; });
  const [dragging, setDragging] = useState(false);
  const heading = useRef(null);
  const dialogue = useRef(null);
  const current = cases[s.caseIndex];
  const guide = guides[s.caseIndex];
  const rounds = guide.rounds;
  const scene = current.scenes[s.scene];
  const round = rounds[s.scene];
  const active = s.status === 'active' && !blocked;
  const done = ['submitted', 'expired'].includes(s.status);
  const feedback = s.status === 'feedback';
  const selectedIndex = scene.options.findIndex(o => o.id === s.selected);
  const selected = scene.options[selectedIndex];
  const source = scene.sources.find(x => x.id === speaker);
  const previous = s.decisions[s.scene - 1];
  const delivery = deliveryFor(s);
  const explanationNeeded = noteRequired(s);
  useEffect(() => { heading.current?.focus({ preventScroll: true }); window.scrollTo(0, 0); }, [s.scene, s.status]);
  function visit(id) { setSpeaker(id); act('open', { id }); requestAnimationFrame(() => dialogue.current?.focus()); }
  function choose(id) { if (active && optionAvailable(s.caseIndex, s.scene, id, s.decisions)) act('choose', { id }); }
  function beginDrag(event) {
    if (!active || event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
  }
  function endDrag(event) {
    const target = document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-plan-id]');
    if (dragging && target && !target.disabled) choose(target.dataset.planId);
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }
  return <main className={`op-game wg-world-${s.caseIndex} ${motionOff ? 'op-still' : ''}`}>
    <header className="op-header"><div className="op-brand"><span aria-hidden="true">✦</span><div>AFRICA ATTENTION LAB<small>{current.company} · {participantId}</small></div></div><div className="op-top-actions"><label><input type="checkbox" checked={motionOff} onChange={e => { setMotionOff(e.target.checked); try { localStorage.setItem('aal-reduced-motion', String(e.target.checked)); } catch { /* Keep the preference for this screen. */ } }}/> Reduce motion</label><button className="op-quiet" onClick={download}>Save JSON ↓</button></div></header>
    <div className="op-journey"><a href="#op-mission">Skip to mission</a><ol aria-label={`${current.domain} milestones`}>{rounds.map((r, i) => <li key={r.name} className={s.decisions.length > i ? 'visited' : i === s.scene ? 'here' : ''} aria-current={i === s.scene ? 'step' : undefined}><span>{s.decisions.length > i ? '✓' : i + 1}</span>{r.name}</li>)}</ol><div className="op-clock" role="timer" aria-label="Time remaining"><span aria-hidden="true">◷</span> {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}<small>{s.status === 'briefing' ? 'starts on entry' : done ? 'stopped' : 'remaining'}</small></div></div>
    {error && <p className="op-alert" role="alert">{error}</p>}
    <div className="op-heading"><div><p className="op-eyebrow">{guide.location.toUpperCase()} · {s.status === 'briefing' ? 'YOUR CASE STUDY' : `MISSION ${s.scene + 1} OF 4`}</p><h1 ref={heading} tabIndex={-1}>{s.status === 'briefing' ? guide.welcome : done ? 'Your decisions shaped this story.' : round.name}</h1><p>{s.status === 'briefing' ? current.role : round.objective}</p></div><div className="op-mission-badge"><strong>{done ? s.decisions.length : s.opened.length}</strong><span>{done ? 'decisions made' : 'sources opened'}<small>{done ? 'out of 4' : 'of 3 this round'}</small></span></div></div>
    <nav className="wg-journey" aria-label="Experience journey">{['Hospital', 'Policy', 'Finance', 'Talent', 'Reflection'].map((label,i)=><span key={label} aria-current={i===s.caseIndex+1?'step':undefined}>{i<s.caseIndex+1?'✓ ':''}{label}</span>)}</nav>
    {s.status === 'briefing' && <section className="wg-introduction" aria-label="Your case briefing"><div><span className="op-eyebrow">THE STORY SO FAR</span><h2>{current.title}</h2><p>{guide.context}</p><p className="wg-key-facts">{current.brief}</p></div><div><h3>Your role and boundaries</h3><p>{guide.authority}</p><h3>What a useful outcome looks like</h3><p>{guide.success}</p></div><div className="wg-cast">{current.cast.map(person=><article key={person.id}><span className="op-avatar"><Avatar person={person.id}/></span><div><strong>{person.name}</strong><small>{person.role}</small><p>“{person.quote}”</p></div></article>)}</div></section>}
    {s.status !== 'briefing' && !feedback && !done && <section className="wg-story" aria-label="Mission context"><div><span className="op-eyebrow">{scene.tag} · WHAT HAS HAPPENED?</span><h2>{scene.title}</h2>{previous?.next && <p className="op-continuity"><strong>Your earlier choice:</strong> {previous.next}</p>}<p>{scene.story}</p></div><div><h3>Why this matters</h3><p>{guide.why[s.scene]}</p><p className="wg-definition">{guide.terms[s.scene]}</p></div></section>}
    <div className="op-play-layout">
      <section className="op-world" aria-label={`${current.domain} interactive map`}>
        <div id="op-map-board" className={`op-map ${dragging ? 'op-dragging' : ''}`}>
          <WorldArt world={s.caseIndex} selectedIndex={selectedIndex} changed={feedback || done}/>
          <span className="op-map-label">{guide.map.toUpperCase()}</span>
          {scene.options.map((option, i) => <button key={option.id} className={`op-flag op-flag-${i} ${selected?.id === option.id ? 'chosen' : ''}`} disabled={!active || !optionAvailable(s.caseIndex, s.scene, option.id, s.decisions)} aria-pressed={selected?.id === option.id} aria-label={`Preview ${option.title}`} onClick={() => choose(option.id)} data-plan-id={option.id}><span className="op-flag-pin" aria-hidden="true">{selected?.id === option.id ? '✓' : i + 1}</span><strong>{round.labels[i]}</strong><small>{!optionAvailable(s.caseIndex, s.scene, option.id, s.decisions) ? 'Needs 4 cash · unavailable' : s.caseIndex === 0 && s.scene === 1 ? ['50 tokens', '58 tokens', '54 tokens'][i] : 'Preview plan'}</small></button>)}
          <div className="op-map-caption"><span aria-hidden="true">⌁</span> {s.status === 'briefing' ? 'Enter the case to explore the plan flags.' : feedback ? 'Decision committed. See the update from your team.' : done ? 'Every choice stays in your decision trail.' : 'Select a plan flag. Explore before you commit.'}</div>
        </div>
        <div className="op-map-tools"><div className="op-cargo" data-draggable={active} onPointerDown={beginDrag} onPointerUp={endDrag} onPointerCancel={() => setDragging(false)}><span aria-hidden="true">{round.icon}</span><div><strong>{round.cargo}</strong><small>{active ? 'Drag to a flag, or simply select the flag' : 'Your mission resource'}</small></div></div><p>{s.caseIndex === 0 && s.scene === 1 ? 'Programme tokens are fictional budget units.' : 'No points for speed. Take time to compare.'}</p></div>
        <div className="op-contacts" aria-label="People and evidence to consult">{scene.sources.map(item => <button key={item.id} className={`op-contact ${speaker === item.id ? 'speaking' : ''}`} disabled={!active} aria-pressed={speaker === item.id} onClick={() => visit(item.id)} aria-label={`Consult ${item.who}`}><span className="op-avatar"><Avatar person={item.id}/>{s.opened.includes(item.id) && <i aria-hidden="true">✓</i>}</span><span><strong>{item.who}</strong><small>{s.opened.includes(item.id) ? 'Opened · talk again' : item.kind === 'Evidence' ? 'Inspect evidence' : 'Hear their perspective'}</small></span></button>)}</div>
        {s.status !== 'briefing' && <><div className="op-preview-tag">{s.status === 'expired' && s.decisions.length === s.scene ? 'UNCOMMITTED DRAFT' : feedback || done ? 'COMMITTED PLAN' : 'LIVE PREVIEW · TRY ANOTHER FLAG TO COMPARE'}</div>{s.caseIndex !== 0 ? <WorldPreview s={s}/> : s.scene === 0 ? <PeoplePreview choice={s.selected}/> : s.scene === 1 ? <BudgetPreview delivery={delivery}/> : s.scene === 2 ? <ResponsePreview choice={s.selected} delivery={delivery}/> : <ReportPreview choice={s.selected}/>}</>}
        <details className="op-reference"><summary>Tell me more · case & plain-language guide</summary><p>{guide.context}</p><p>{current.brief}</p><p>{guide.authority}</p><ul>{current.goals.map(goal=><li key={goal}>{goal}</li>)}</ul><dl>{current.glossary.map(([term, meaning]) => <div key={term}><dt>{term}</dt><dd>{meaning}</dd></div>)}</dl></details>
      </section>
      <section className="op-mission" id="op-mission" aria-label="Current mission">
        {s.status === 'briefing' ? <>
          <span className="op-eyebrow">YOUR GUIDE TO THE MAP</span><h2>Explore. Compare. Decide.</h2><p>{guide.orientation}</p>
          <ol className="op-how"><li><span>1</span><div><strong>Read the scene</strong><small>Understand what changed and why your decision matters.</small></div></li><li><span>2</span><div><strong>Hear two perspectives</strong><small>Open people or evidence cards below the map. Every source has a partial view.</small></div></li><li><span>3</span><div><strong>Try the plan flags</strong><small>Click, use the keyboard or drag the resource. Watch the preview change.</small></div></li><li><span>4</span><div><strong>Commit and see what follows</strong><small>{s.caseIndex===0?'Write at the budget and final-report checkpoints.':'Add a short decision note each round.'} Your choice becomes part of the story.</small></div></li></ol>
          <p className="op-note">{current.stakes}</p>
          {hasPrevious && <p className="op-note">Your earlier island session remains saved separately.</p>}
          <button className="op-primary" disabled={blocked} onClick={() => act('start')}>{guide.enter} →</button><p className="op-small">Up to {current.minutes} minutes. Read this briefing before starting the timer. The timer continues while away. You may finish early. No speed score.</p>
        </> : feedback || done ? <>
          <div className="op-speaker"><span className="op-avatar"><Avatar person={current.cast[s.scene % current.cast.length].id}/></span><div><strong>{s.status === 'expired' ? 'Time window ended' : 'A new update'}</strong><small>{s.status === 'expired' ? 'Your work has been retained' : 'Fictional consequence of your decision'}</small></div></div>
          {s.status === 'expired' ? <><h2>Your decision trail is safe.</h2><p>The case is recorded as expired. You can review your committed choices and continue with any unfinished work kept as a draft.</p>{s.decisions.length === s.scene && <div className="op-note"><strong>Uncommitted draft</strong><p>{selected?.title ?? 'No plan selected.'}</p><p>{s.note || 'No note entered.'}</p></div>}</> : <><h2>{s.decisions.at(-1)?.choiceTitle}</h2><p className="op-outcome" role="status">{s.decisions.at(-1)?.outcome}</p><div className="op-stamp"><span aria-hidden="true">✓</span> Milestone {s.scene + 1} recorded<span>No ranking or ability score</span></div></>}
          {feedback && <div className="wg-next"><h3>What your choice changes</h3><p>{s.decisions.at(-1)?.next}</p><h3>Next in the story</h3><p>{current.scenes[s.scene+1]?.tag}: {rounds[s.scene+1]?.objective}</p></div>}
          {done && <section className="wg-recap" aria-label="Your story recap"><h3>Your story, in four decisions</h3><p>{guide.recap}</p><ol>{current.scenes.map((item,i)=>{const decision=s.decisions.find(d=>d.scene===i);return <li key={item.title}><span>{i+1}</span><div><strong>{item.title}</strong><p>{decision?.choiceTitle ?? 'Not committed'}</p>{decision && <small>{decision.outcome}</small>}</div></li>;})}</ol><p><strong>Carry this question forward:</strong> Which trade-off would you revisit if you had one more piece of evidence?</p></section>}
          {feedback ? <button className="op-primary" onClick={() => act('next-scene')}>Follow the next development →</button> : <button className="op-primary" onClick={() => act('next-case')}>Continue to {cases[s.caseIndex+1]?.company ?? 'reflection'} →</button>}
          <details className="op-reference"><summary>Your decision trail · {s.decisions.length}/4</summary>{s.decisions.map(d => <div className="op-trail-item" key={d.scene}><strong>{d.scene + 1}. {d.choiceTitle}</strong><p>{d.outcome}</p>{d.rationale && <p>Your note: {d.rationale}</p>}</div>)}</details>
        </> : <>
          <p className="op-eyebrow">YOUR NEXT DECISION</p><h2>{scene.question}</h2><p className="op-small">Read the scene above, then open two sources below the map and preview a flag.</p>
          <div className="op-dialogue" ref={dialogue} tabIndex={-1} aria-live="polite">{source ? <><div className="op-speaker"><span className="op-avatar"><Avatar person={source.id}/></span><div><strong>{source.who}</strong><small>{source.kind === 'Evidence' ? 'Evidence from the case' : 'Their perspective'}</small></div></div><p>{source.text}</p></> : <><strong>Start a conversation.</strong><p>Select a person or evidence card below the map. Each one adds a different piece of the picture.</p></>}</div>
          <a className="op-back-map" href="#op-map-board">↑ Compare plans on the map</a><details className="op-reference"><summary>What is happening?</summary><p>{scene.story}</p></details>
          {selected ? <div className="op-plan-detail"><span className="op-eyebrow">YOUR PLAN PREVIEW</span><h3>{selected.title}</h3><p>{selected.description}</p><div className="op-tradeoff"><strong>Trade-off</strong><p>{selected.tradeoff}</p></div></div> : <div className="op-empty-plan"><span aria-hidden="true">⌁</span><p>{round.helper}</p></div>}
          {explanationNeeded && <label className="op-note-label">{s.caseIndex === 0 ? (s.scene === 1 ? 'A quick budget checkpoint' : 'Your final learning note') : 'Your decision note'}<small>{scene.prompt}</small><textarea rows={3} maxLength={3000} value={s.note} onChange={e => act('note', { value: e.target.value })} placeholder="Use one detail from the case…"/></label>}
          <div className="op-ready" aria-live="polite"><span className={s.opened.length >= 2 ? 'ready' : ''}>{s.opened.length >= 2 ? '✓' : '○'} Two sources explored</span><span className={selected ? 'ready' : ''}>{selected ? '✓' : '○'} Plan selected</span>{explanationNeeded && <span className={s.note.trim().length >= 20 ? 'ready' : ''}>{s.note.trim().length >= 20 ? '✓' : '○'} Short note (20 characters)</span>}</div>
          <button className="op-primary" disabled={blocked || !canSubmit(s)} onClick={() => act('submit')}>{round.action} →</button><p className="op-small">Explore alternatives before committing. Longer answers earn no extra points.</p>
        </>}
      </section>
    </div><footer className="op-footer">Fictional people, quantities and authored consequences · Opening a source does not prove reading · Saved on this browser · No AI or paid API</footer>
  </main>;
}




