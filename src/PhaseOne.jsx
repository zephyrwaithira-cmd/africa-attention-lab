import { analyzeSession } from "./analyzeSession";
import { useCallback, useEffect, useReducer } from 'react';
import './PhaseOne.css';

const DURATION = 15 * 60 * 1000;
const evidence = [
  ['Stock report', 'The hospital has 120 fictional oxygen supply units. At current demand, this covers six hours. The normal delivery is delayed by twelve hours.'],
  ['Nearby supplier', 'A supplier can deliver 80 units in four hours for 60,000 scenario shillings. Road disruption could add three hours. Availability is confirmed; arrival time is uncertain.'],
  ['Partner hospital', 'A partner can lend 40 units in two hours for 15,000 scenario shillings in transport costs. This leaves the partner with a smaller reserve.'],
  ['Transport and budget', 'Your emergency budget is 70,000 scenario shillings. Only one hospital vehicle is available. Using it for collection prevents it from supporting transfers during that trip.'],
  ['Demand forecast', 'Demand may rise by 25% during the next six hours. The forecast is uncertain. Clinical staff must make all patient-care and treatment decisions.'],
  ['Coordination update', 'The district coordinator can help seek additional transport and funding, but neither is guaranteed. Explain what you will do if assistance does not arrive.'],
];
const options = ['Purchase from the supplier', 'Borrow from the partner hospital', 'Request district support and coordinate a combined plan'];
const initial = { status: 'briefing', start: null, now: null, events: [], opened: [], decision: '', rationale: '' };
function record(state, type, at, detail = '') {
  return [...state.events, { type, at, elapsed: state.start === null ? 0 : Math.max(0, at - state.start), detail }];
}
function reducer(state, action) {
  const { at } = action;
  if (action.type === 'start' && state.status === 'briefing') {
    return { ...state, status: 'active', start: at, now: at, events: record(state, 'Challenge started', at) };
  }
  if (state.status !== 'active') return state;
  if (at >= state.start + DURATION) {
    return { ...state, status: 'expired', now: at, events: record(state, 'Time expired — draft retained', state.start + DURATION) };
  }
  switch (action.type) {
    case 'tick': return { ...state, now: at };
    case 'open': return { ...state, opened: [...new Set([...state.opened, action.index])], events: record(state, 'Evidence opened', at, evidence[action.index][0]) };
    case 'decision': return { ...state, decision: action.value, events: record(state, 'Decision changed', at, action.value) };
    case 'rationale': return { ...state, rationale: action.value };
    case 'blur': return { ...state, events: record(state, 'Rationale editing ended', at) };
    case 'submit':
      if (!state.decision || !state.rationale.trim()) return state;
      return { ...state, status: 'submitted', now: at, events: record(state, 'Decision submitted', at) };
    default: return state;
  }
}
export default function PhaseOne({ participantId, onContinue }) {
const storageKey = `aal-phase-one-${participantId}`;

const [state, dispatch] = useReducer(
  reducer,
  initial,
  (defaultState) => {
    try {
      const saved = localStorage.getItem(storageKey);

      if (!saved) return defaultState;

      const parsed = JSON.parse(saved);

      if (
        !parsed ||
        !['briefing', 'active', 'submitted', 'expired'].includes(parsed.status) ||
        !Array.isArray(parsed.events) ||
        !Array.isArray(parsed.opened) ||
        typeof parsed.decision !== 'string' ||
        typeof parsed.rationale !== 'string' ||
        (parsed.status !== 'briefing' && !Number.isFinite(parsed.start))
      ) {
        return defaultState;
      }

      return {
        ...defaultState,
        ...parsed,
        now: ['submitted', 'expired'].includes(parsed.status) ? parsed.now : Date.now()
      };
    } catch {
      return defaultState;
    }
  }
);
useEffect(() => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch (error) {
    console.error('Could not save challenge progress:', error);
  }
}, [state, storageKey]);

const handleAction = useCallback((type, extra = {}) => dispatch({ type, at: Date.now(), ...extra }), []);
  useEffect(() => {
    if (state.status !== 'active') return;
    const tick = () => dispatch({ type: 'tick', at: Date.now() });
    const timer = window.setInterval(tick, 250);
    window.addEventListener('focus', tick);
    document.addEventListener('visibilitychange', tick);
    return () => { window.clearInterval(timer); window.removeEventListener('focus', tick); document.removeEventListener('visibilitychange', tick); };
  }, [state.status]);
  const seconds = state.start === null ? 900 : Math.max(0, Math.ceil((state.start + DURATION - state.now) / 1000));
  const done = ['submitted', 'expired'].includes(state.status);
  
const analysis = done
  ? analyzeSession({
      phase: 1,
      participantId,
      sessionState: state
    })
  : null;

  function downloadSession() {
  const id = String(participantId ?? '').trim();

  if (!id) {
    window.alert('A participant ID is required to export this session.');
    return;
  }

  if (state.start === null) {
    window.alert('Start the challenge before exporting a session.');
    return;
  }

  let downloadUrl;
  let link;

  try {
    const exportedAt = new Date().toISOString();

    const session = {
      schemaVersion: 1,
      project: 'Africa Attention Lab',
      phase: 1,
      participantId: id,
      exportedAt,
      timestampUnits: {
        start: 'Unix milliseconds',
        now: 'Unix milliseconds',
        eventAt: 'Unix milliseconds',
        eventElapsed: 'milliseconds since challenge start',
      },
      sessionState: state,
    };

    const blob = new Blob(
      [JSON.stringify(session, null, 2)],
      { type: 'application/json;charset=utf-8' }
    );

    const safeId = id.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 80);
    const safeDate = exportedAt.replace(/[:.]/g, '-');

    downloadUrl = URL.createObjectURL(blob);
    link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `africa-attention-lab_${safeId}_phase-1_${safeDate}.json`;

    document.body.appendChild(link);
    link.click();
  } catch (error) {
    console.error('Session export failed:', error);
    window.alert('The session could not be exported. Please try again.');
  } finally {
    link?.remove();

    if (downloadUrl) {
      window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
    }
  }
}
  return <main className="container phase-one"><article className="card phase-card">
    <div className="eyebrow">AFRICA ATTENTION LAB · PHASE 01</div>
    <h1>Hospital oxygen supply crisis</h1>
    <p>Participant: <strong>{participantId}</strong> · Collaborative challenge prototype</p>
<p className="notice">
  Single-device prototype. Challenge progress and event
  timestamps are saved in this browser so you can resume
  after refreshing. Your responses stay on this device unless you choose
  to share your completed journey with the facilitator at the end.
</p>    <section aria-labelledby="briefing-title"><h2 id="briefing-title">Your briefing</h2>
      <p>A fictional district hospital’s oxygen delivery has been delayed. Your coordination team must propose a supply plan within a limited budget, account for uncertainty, and explain a fallback.</p>
      <p>This is a fictional logistics exercise, not medical guidance. Do not allocate treatment to patients. All quantities and costs are invented.</p>
      <ol><li>Review the evidence and identify constraints.</li><li>Discuss options, trade-offs, and missing information.</li><li>Choose a plan and explain your reasoning before time runs out.</li></ol>
    </section>
    {state.status === 'briefing' ? <><p>The 15-minute timer starts when you press the button below. At zero, editing stops and your unfinished draft remains visible.</p><button onClick={() => handleAction('start')}>Start 15-minute challenge</button></> : <>
      <div className="phase-timer" role="timer" aria-label="Time remaining">{String(Math.floor(seconds / 60)).padStart(2, '0')}:{String(seconds % 60).padStart(2, '0')} <span>remaining{done ? ' · stopped' : ''}</span></div>
      <p role="status">{state.status === 'submitted' ? 'Decision submitted for this session. Phase 1 complete.' : state.status === 'expired' ? 'Time is up. Your draft was retained but was not submitted.' : 'Challenge in progress. Review evidence, then submit your plan.'}</p>
      <h2>Evidence cards</h2><p>{state.opened.length} of {evidence.length} cards opened during the challenge.</p>
      <div className="evidence-grid">{evidence.map(([title, body], index) => <details key={title} onToggle={event => { if (event.currentTarget.open && !done) handleAction('open', { index }); }}><summary>{title}</summary><p>{body}</p></details>)}</div>
      <form onSubmit={event => { event.preventDefault(); handleAction('submit'); }}>
        <fieldset disabled={done}><legend>Your decision</legend>{options.map(option => <label className="phase-option" key={option}><input type="radio" name="decision" checked={state.decision === option} onChange={() => handleAction('decision', { value: option })} required />{option}</label>)}
        <label htmlFor="rationale">Rationale and contingency plan</label><p id="rationale-help">Use evidence, explain the budget and timing trade-offs, acknowledge uncertainty, and describe your fallback. If discussing as a group, include any unresolved disagreement.</p>
        <textarea id="rationale" aria-describedby="rationale-help" rows={7} maxLength={5000} value={state.rationale} onChange={event => handleAction('rationale', { value: event.target.value })} onBlur={() => handleAction('blur')} required />
        <button disabled={!state.decision || !state.rationale.trim()}>Submit final decision</button></fieldset>
      </form>
      <button type="button" onClick={downloadSession}>
  Download session JSON
</button>
<p>
  Download a snapshot of this participant’s current Phase 1 session.
  Active sessions are exported as drafts. This download does not send data to a server.
</p>
      {done && <section><h2>{state.status === 'submitted' ? 'Submitted response' : 'Unsubmitted draft'}</h2><p><strong>{state.decision || 'No decision selected'}</strong></p><p className="response-text">{state.rationale || 'No rationale entered.'}</p><p>No score or collaboration assessment is produced by this prototype. Continue to the individual case studies when you are ready.</p></section>}
      
{done && <button onClick={onContinue}>Continue to individual case studies →</button>}
{analysis && (
  <section className="analysis-report">
    <h2>Behavioral Analysis Report</h2>

    <p>
      Participant: <strong>{analysis.participantId}</strong>
    </p>

    <p>
      Evidence explored:
      <strong> {analysis.evidenceCoverage}%</strong>
    </p>

    <p>
      Decision revisions:
      <strong> {analysis.decisionRevisions}</strong>
    </p>

    <p>
      Completion time:
      <strong>
        {analysis.completionSeconds === null
          ? " Not submitted"
          : ` ${analysis.completionSeconds} seconds`}
      </strong>
    </p>

    <p>
      Reasoning evidence:
      <strong> {analysis.reasoningEvidence}</strong>
    </p>

    <p className="notice">
      These are descriptive behavioral indicators.
      They are not validated psychological or
      career-readiness scores.
    </p>
  </section>
)}

      <details className="event-log"><summary>Session event timestamps ({state.events.length})</summary><p>Local event preview only. Rationale keystrokes are not logged. Opening a card does not prove it was read.</p><ol>{state.events.map((event, index) => <li key={index}><time dateTime={new Date(event.at).toISOString()}>{new Date(event.at).toISOString()}</time> · +{Math.floor(event.elapsed / 1000)}s · {event.type}{event.detail && `: ${event.detail}`}</li>)}</ol></details>
    </>}
  </article></main>;
}





