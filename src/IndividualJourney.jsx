import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { cases, financeSnapshot, optionAvailable } from './caseData';
import { initial, reducer, restore, duration, canSubmit, exportSession } from './caseEngine';
import './Islands.css';
import './CaseStudies.css';
import OpenPathGame from './OpenPathGame';
import SessionSubmission from './SessionSubmission';

function load(key, oldKey) {
  let raw = null;
  try { raw = localStorage.getItem(key); return { session: raw ? restore(raw, Date.now()) : initial(), error: '', raw, previous: !!localStorage.getItem(oldKey) }; }
  catch { return { session: initial(), error: 'Your saved case study could not be read. It has not been replaced. Download the saved data below before seeking help.', raw, previous: false }; }
}
function saveDownload(data, name) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
  const link = document.createElement('a'); link.href = url; link.download = name; document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1500);
}
function readStored(key) {
  try { const raw = localStorage.getItem(key); if (!raw) return null; try { return JSON.parse(raw); } catch { return { unreadableJson: raw }; } }
  catch { return { unavailable: 'Browser storage could not be read.' }; }
}
function DecisionTrail({ records }) {
  return <div className="decision-trail">{records.map(d => <details key={d.scene}><summary>{d.scene + 1}. {d.title} · {d.choiceTitle}</summary><p>{d.rationale}</p><p><strong>Fictional consequence:</strong> {d.outcome}</p></details>)}</div>;
}
export default function IndividualJourney({ participantId }) {
  const key = `aal-case-studies-v2-${participantId}`;
  const oldKey = `aal-islands-v1-${participantId}`;
  const [loaded] = useState(() => load(key, oldKey));
  const [s, dispatch] = useReducer(reducer, loaded.session);
  const [saveError, setSaveError] = useState('');
  const [now, setNow] = useState(Date.now);
  const heading = useRef(null);
  const act = useCallback((type, extra = {}) => dispatch({ type, at: Date.now(), ...extra }), []);
  useEffect(() => {
    if (loaded.error) return;
    try { localStorage.setItem(key, JSON.stringify(s)); queueMicrotask(() => setSaveError('')); }
    catch { queueMicrotask(() => setSaveError('Saving is unavailable. Keep this tab open and download your session before leaving.')); }
  }, [s, key, loaded.error]);
  useEffect(() => {
    const tick = () => { const at = Date.now(); setNow(at); dispatch({ type: 'tick', at }); };
    const timer = setInterval(tick, 500);
    window.addEventListener('focus', tick);
    document.addEventListener('visibilitychange', tick);
    return () => { clearInterval(timer); window.removeEventListener('focus', tick); document.removeEventListener('visibilitychange', tick); };
  }, []);
  useEffect(() => { heading.current?.focus(); }, [s.caseIndex, s.scene, s.status]);
  const current = cases[s.caseIndex];
  const scene = current?.scenes[s.scene];
  const finished = ['submitted', 'expired'].includes(s.status);
  const feedback = s.status === 'feedback';
  const seconds = s.start === null ? duration(s.caseIndex) / 1000 : Math.max(0, Math.ceil((s.start + duration(s.caseIndex) - (s.end ?? Math.max(now, s.start))) / 1000));
  const previous = s.decisions[s.scene - 1];
  const cash = s.caseIndex === 1 ? financeSnapshot(s.decisions) : null;
  function download() {
    try {
      const payload = loaded.error ? { participantId, recovery: loaded.raw, error: loaded.error } : exportSession(s, participantId, readStored(`aal-phase-one-${participantId}`), readStored(oldKey), Date.now());
      saveDownload(payload, `aal-cases-${participantId.replace(/[^a-z0-9_-]/gi, '_')}-${Date.now()}.json`);
    } catch { setSaveError('The download could not be created. Keep this page open and try again.'); }
  }
  if (s.caseIndex < 3) return <OpenPathGame key={`${s.caseIndex}-${s.scene}-${s.status === 'briefing' ? 'intro' : 'live'}`} s={s} participantId={participantId} act={act} seconds={seconds} error={loaded.error || saveError} blocked={!!loaded.error} download={download} hasPrevious={loaded.previous} />;
  return <main className={`islands case-studies world-${s.caseIndex}`}>
    <header className="island-header"><strong>AFRICA ATTENTION LAB</strong><span>{participantId} · {current ? 'INDIVIDUAL CASE STUDIES' : 'REFLECTION'}</span><a href="#case-content">Skip to case study</a></header>
    <nav className="world-map" aria-label="Case study journey">{[...cases.map(c => c.domain), 'Reflection'].map((label, i) => <div key={label} className={i === s.caseIndex ? 'current' : ''} aria-current={i === s.caseIndex ? 'step' : undefined}><span className="mini-island" aria-hidden="true">{cases[i]?.icon ?? '✦'}</span><strong>{label}</strong><small>{i < s.caseIndex ? 'Visited' : i === s.caseIndex ? 'You are here' : 'Up next'} · {cases[i]?.minutes ?? 10} min</small></div>)}</nav>
    <div className="case-layout">
      <aside className="case-sidebar">
        <div className="company-card"><div className="company-mark" aria-hidden="true">{current?.icon ?? '✦'}</div><span className="case-kicker">{current ? 'FICTIONAL CASE STUDY' : 'YOUR LEARNING JOURNEY'}</span><h1>{current?.company ?? 'Pause. Look back.'}</h1><p>{current?.role ?? 'Connect what you learned across healthcare, policy, finance and teamwork.'}</p><div className="case-timer" role="timer" aria-label="Time remaining">{Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')} <small>{s.status === 'briefing' ? 'starts when you enter' : finished ? 'stopped' : 'remaining'}</small></div></div>
        {current && <><details className="desk-reference"><summary>Your brief & goals</summary><p>{current.brief}</p><ul>{current.goals.map(g => <li key={g}>{g}</li>)}</ul></details><details className="desk-reference"><summary>Plain-language guide</summary><dl>{current.glossary.map(([term, definition]) => <div key={term}><dt>{term}</dt><dd>{definition}</dd></div>)}</dl></details></>}
        {cash && <section className="cash-board"><h2>{s.scene === 3 || finished ? 'Settlement worksheet' : 'Cash checkpoint'}</h2><p>Fictional cash units · based on your committed choices.</p><dl><div><dt>Cash on hand before settlement</dt><dd>{cash.cash}</dd></div><div><dt>Customer balance before settlement</dt><dd>{cash.receivable}</dd></div><div><dt>Other repayments to settle</dt><dd>{cash.liabilities}</dd></div>{cash.remainingProduction > 0 && <div><dt>Batch two still costs</dt><dd>{cash.remainingProduction}</dd></div>}</dl>{s.scene === 3 || finished ? <p><strong>Projected cash after all receipts and payments: {cash.finalCash}.</strong> {cash.remainingProduction > 0 && 'Includes paying 48 for batch two and receiving its 60 payment.'} Assumes every agreed payment arrives and no other costs occur.</p> : <p>Amounts due are not cash you can spend today.</p>}</section>}
        <button className="secondary" onClick={download}>{loaded.error ? 'Download saved data for recovery' : 'Download session JSON ↓'}</button><p className="hint">Local browser storage · no paid API. Use one tab per participant.</p>
      </aside>
      <article className="mission-panel case-panel" id="case-content">
        {(loaded.error || saveError) && <p role="alert" className="warning">{loaded.error || saveError}</p>}
        <p className="simulation-note">Original fictional companies and people. Consequences are written for learning; they are not predictions or ability scores.</p>
        {loaded.previous && s.caseIndex === 0 && s.status === 'briefing' && <p className="feedback">Your earlier island session is kept separately. These expanded case studies start a new journey and do not overwrite it. Both versions are included when you export.</p>}
        {s.status === 'briefing' ? <>
          <span className="case-kicker">{current ? `${current.domain} · four decision rounds` : 'Ten-minute reflection space'}</span>
          <h2 ref={heading} tabIndex={-1}>{current?.title ?? 'What changed in your thinking?'}</h2>
          <p className="story-lead">{current?.brief ?? 'Review your decisions, explain one revision and choose one improvement to try in a future situation. There are no model answers and no inferred personality ratings.'}</p>
          {current && <><div className="stakes"><strong>What is at stake?</strong><p>{current.stakes}</p></div><h3>Meet the people</h3><div className="character-grid">{current.cast.map(p => <section className="character" key={p.id}><div className={`portrait ${p.color}`} aria-hidden="true"><span className="hair"/><span className="eyes">••</span><span className="smile"/></div><div><h4>{p.name}</h4><span>{p.role}</span><p>“{p.quote}”</p></div></section>)}</div></>}
          <div className="brief-rules"><strong>How to play</strong><p>{current ? 'Hear from at least two people or evidence sources in each round. Choose a plan and briefly explain it. Commit to see a consequence, then move to the next scene. You can change your choice before committing.' : 'Use examples from your own decisions. Your self-reported confidence is kept separate from game outcomes.'}</p><p>Up to {current?.minutes ?? 10} minutes. The timer continues while you are away. You can finish early; there is no waiting period or speed bonus.</p></div>
          <button disabled={!!loaded.error} onClick={() => act('start')}>{current ? `Enter ${current.company}` : 'Begin reflection'} →</button>
        </> : finished ? <>
          <span className="case-kicker">{s.status === 'expired' ? 'TIME WINDOW ENDED' : 'CASE CLOSED'}</span><h2 ref={heading} tabIndex={-1}>{current ? `${current.company}: your decision trail` : 'Your journey is saved'}</h2>
          <p role="status">{s.status === 'expired' ? 'Time is up. Committed decisions and any unfinished draft are retained. This is recorded as expired, not fully submitted.' : current ? 'You completed all four decisions. Review the trade-offs you chose below.' : 'Your reflection is complete. Download your session for your own record or discussion with a facilitator.'}</p>
          {current ? <>{s.status === 'submitted' && <div className="consequence"><strong>Final fictional consequence</strong><p>{s.decisions.at(-1).outcome}</p></div>}<DecisionTrail records={s.decisions}/>{s.status === 'expired' && s.decisions.length === s.scene && <div className="feedback"><strong>Unfinished round: {scene.title}</strong><p>Draft choice: {scene.options.find(o => o.id === s.selected)?.title ?? 'No choice selected'}</p><p>{s.note || 'No draft note entered.'}</p></div>}</> : <><p>Confidence: {s.confidence}/10 · self-reported</p>{s.reflection.map((r, i) => <div key={i} className="feedback"><strong>{['Evidence that mattered', 'A decision you reconsidered', 'A next step'][i]}</strong><p>{r || 'Not answered'}</p></div>)}</>}
          {current ? <button onClick={() => act('next-case')}>Continue to {cases[s.caseIndex + 1]?.company ?? 'reflection'} →</button> : <button onClick={download}>Download completed session ↓</button>}
          {!current && !loaded.error && <SessionSubmission participantId={participantId} state={s} getExport={() => exportSession(s, participantId, readStored(`aal-phase-one-${participantId}`), null, Date.now())} />}
        </> : s.caseIndex === 3 ? <>
          <h2 ref={heading} tabIndex={-1}>Connect the four contexts</h2><p>Your hospital response is included in the export. Below are the choices you made in the three individual cases.</p>
          {s.records.map(r => <details className="reflection-review" key={r.caseIndex}><summary>{cases[r.caseIndex].company} · {r.status} · {r.decisions.length}/4 decisions</summary><DecisionTrail records={r.decisions}/></details>)}
          {['Which evidence or conversation most influenced a decision? Explain what it changed.', 'Compare two contexts, including the hospital case if useful. Where did you change your approach—or keep it for a clear reason?', 'What is one concrete improvement you would try next time, and how would you check whether it helped?'].map((prompt, i) => <label className="reason" key={prompt}>{prompt}<textarea maxLength={3000} rows={4} value={s.reflection[i]} onChange={e => act('reflect', { index: i, value: e.target.value })}/></label>)}
          <label>Confidence in your reasoning: {s.confidence}/10<input type="range" min={1} max={10} value={s.confidence} onChange={e => act('confidence', { value: Number(e.target.value) })}/></label><p className="hint">Write at least a short sentence (20 characters) for each prompt. Length is not scored.</p><button disabled={!canSubmit(s)} onClick={() => act('submit')}>Complete reflection ✓</button>
        </> : <>
          <ol className="scene-progress" aria-label="Case study rounds">{current.scenes.map((x, i) => <li key={x.title} className={i === s.scene ? 'active' : i < s.scene ? 'visited' : ''} aria-current={i === s.scene ? 'step' : undefined}><span>{i < s.scene ? '✓' : i + 1}</span><small>{x.title}</small></li>)}</ol>
          <span className="case-kicker">{scene.tag}</span><h2 ref={heading} tabIndex={-1}>{scene.title}</h2>
          {previous?.next && <p className="continuity"><strong>Because of your earlier choice:</strong> {previous.next}</p>}
          <p className="story-lead">{scene.story}</p>
          {feedback ? <section className="consequence"><span className="case-kicker">FICTIONAL CONSEQUENCE · NO POINTS AWARDED</span><h3>{s.decisions.at(-1).choiceTitle}</h3><p>{s.decisions.at(-1).outcome}</p><details><summary>Your reasoning</summary><p>{s.decisions.at(-1).rationale}</p></details><button onClick={() => act('next-scene')}>See what happens next →</button></section> : <>
            <h3>Listen & investigate <small>{s.opened.length}/3 opened</small></h3><p className="hint">Open at least two sources. A source can add context without providing the whole answer.</p>
            <div className="source-grid">{scene.sources.map(source => { const person = current.cast.find(p => p.id === source.id); return <details key={`${s.caseIndex}-${s.scene}-${source.id}`} className="source-card" onToggle={e => { if (e.currentTarget.open) act('open', { id: source.id }); }}><summary><span className={`source-avatar ${person?.color ?? 'paper'}`} aria-hidden="true">{person ? person.name.slice(0, 1) : '▤'}</span><span><strong>{source.who}</strong><small>{source.kind}{s.opened.includes(source.id) ? ' · opened' : ''}</small></span><span aria-hidden="true">＋</span></summary><p>{source.text}</p></details>; })}</div>
            <fieldset className="choice-field"><legend>{scene.question}</legend>{scene.options.map(option => { const available = optionAvailable(s.caseIndex, s.scene, option.id, s.decisions); return <label className={`plan-card ${s.selected === option.id ? 'selected' : ''} ${!available ? 'unavailable' : ''}`} key={option.id}><input type="radio" name={`scene-${s.caseIndex}-${s.scene}`} value={option.id} checked={s.selected === option.id} disabled={!available} onChange={() => act('choose', { id: option.id })}/><span><strong>{option.title}</strong><span className="plan-description">{option.description}</span><span className="tradeoff"><b>Trade-off:</b> {option.tradeoff}</span>{!available && <span className="warning">Unavailable: your current cash is below the 4 units required. Choose a plan you can fund.</span>}</span></label>; })}</fieldset>
            <label className="reason">Your decision note<span className="prompt-help">{scene.prompt}</span><textarea value={s.note} maxLength={3000} rows={4} placeholder="Use a detail from the case and explain your reasoning…" onChange={e => act('note', { value: e.target.value })}/></label>
            <p className="hint">Open two sources, choose a plan and write a short explanation (at least 20 characters). Longer answers earn no extra points.</p><button disabled={!canSubmit(s)} onClick={() => act('submit')}>Commit decision & see consequence →</button>
          </>}
          {s.decisions.length > 0 && !feedback && <details className="reflection-review"><summary>Your earlier decisions</summary><DecisionTrail records={s.decisions}/></details>}
        </>}
      </article>
    </div>
  </main>;
}



