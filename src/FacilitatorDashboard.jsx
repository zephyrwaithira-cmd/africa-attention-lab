import { useEffect, useRef, useState } from 'react';
import { useCollection } from './collectionContext';
import { createCollectionClient, downloadJson } from './collectionApi';

const array=value=>Array.isArray(value)?value.filter(item=>item!==null):[];
const text=value=>typeof value==='string'||typeof value==='number'?String(value):'Not recorded';
function SessionDetail({row}) {
  const payload=row.payload || {};const state=payload.caseStudies || {};const phase=payload.phaseOne || {};
  return <section className="collection-card" aria-label="Session detail"><h2>{text(row.participant_id)}</h2><p>Received {new Date(row.received_at).toLocaleString()} · {text(row.collection_label)}</p><p>Participant-submitted records; timings and source opens are descriptive, not verified ability scores.</p>
    <button onClick={()=>downloadJson(row,`aal-review-${row.id}.json`)}>Download this session JSON</button>
    <details><summary>Hospital response · {text(phase.status)}</summary><p><strong>{text(phase.decision)}</strong></p><p className="collection-answer">{text(phase.rationale)}</p></details>
    {array(state.records).map((record,i)=><details key={i}><summary>{['Policy · OpenPath','Finance · Kijani','Talent · BrightBridge'][i] || 'Case'} · {text(record.status)} · {array(record.decisions).length}/4 decisions</summary>{array(record.decisions).map((decision,j)=><article key={j}><h3>{text(decision.title)}</h3><p><strong>{text(decision.choiceTitle)}</strong></p><p className="collection-answer">{decision.rationale?text(decision.rationale):decision.rationaleRequested===false?'No written note requested for this round.':'No note recorded.'}</p><p><small>Sources opened: {array(decision.sourcesOpened).map(x=>text(x.who)).join(', ') || 'None recorded'}. Opening does not prove reading.</small></p><p>Authored consequence: {text(decision.outcome)}</p></article>)}</details>)}
    <h3>Reflection · {text(state.status)}</h3>{array(state.reflection).map((answer,i)=><div key={i}><strong>{['Evidence that mattered','A reconsidered decision','Next step'][i]}</strong><p className="collection-answer">{text(answer)}</p></div>)}<p>Confidence: {text(state.confidence)}/10 · self-reported</p>
    <p>Sharing notice: {text(row.consent_version)}. {row.received_at && 'Receipt time is recorded by the server.'}</p>
  </section>;
}
export default function FacilitatorDashboard() {
  const {config,loading,error:configError}=useCollection();
  const [auth,setAuth]=useState(null);const [email,setEmail]=useState('');const [password,setPassword]=useState('');
  const [rows,setRows]=useState([]);const [collections,setCollections]=useState([]);const [detail,setDetail]=useState(null);
  const [page,setPage]=useState(0);const [busy,setBusy]=useState(false);const [error,setError]=useState('');
  const [label,setLabel]=useState('');const [newCode,setNewCode]=useState(null);const generation=useRef(0);
  const api=createCollectionClient(config);
  useEffect(() => () => { generation.current++; }, []);
  function clear() { generation.current++;setAuth(null);setRows([]);setCollections([]);setDetail(null);setNewCode(null);setPassword('');setPage(0); }
  useEffect(()=>{
    if(!auth)return;
    const timer=setTimeout(()=>{generation.current++;setAuth(null);setRows([]);setCollections([]);setDetail(null);setNewCode(null);setError('Your session expired. Sign in again.');},Math.max(0,auth.expiresAt-Date.now()));
    return ()=>clearTimeout(timer);
  },[auth]);
  async function run(task) {
    if(busy)return;const current=generation.current;setBusy(true);setError('');
    try { await task(current); }catch(caught){if(current===generation.current){if(caught.status===401 || caught.status===403)clear();setError(caught.message || 'The request failed.');}}
    finally{setBusy(false);}
  }
  async function load(token,nextPage,current) {
    const [sessions,codes]=await Promise.all([api.list(token,nextPage),api.codes(token)]);
    if(current!==generation.current)return;
    setRows(array(sessions));setCollections(array(codes));setPage(nextPage);setDetail(null);
  }
  async function login(event) {event.preventDefault();await run(async current=>{const signedIn=await api.signIn(email,password);setPassword('');if(current!==generation.current){await api.signOut(signedIn.token).catch(()=>{});return;}try{await load(signedIn.token,0,current);if(current===generation.current)setAuth(signedIn);else await api.signOut(signedIn.token).catch(()=>{});}catch(error){await api.signOut(signedIn.token).catch(()=>{});throw error;}});}
  function signOut() {const token=auth?.token;clear();setError('');if(token)api.signOut(token).catch(()=>{});}
  return <main className="facilitator"><header><div><p>AFRICA ATTENTION LAB</p><h1>Facilitator dashboard</h1></div><a href="#">Back to participant experience</a>{auth && <button onClick={signOut}>Sign out</button>}</header>
    {error && <p className="collection-error" role="alert">{error}</p>}
    {loading?<p>Loading collection settings…</p>:!config.enabled?<section className="collection-card"><h2>Database setup needed</h2><p>{configError || 'The dashboard is ready to connect, but online collection has not been activated.'}</p><p>Complete the Supabase setup guide before sharing collection codes.</p></section>:!auth?<form className="collection-card collection-login" onSubmit={login}><h2>Sign in to review sessions</h2><p>Only accounts added to the facilitator access list can read responses. This dashboard does not save your password or sign-in token in browser storage.</p><label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="username" required disabled={busy}/></label><label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" required disabled={busy}/></label><button disabled={busy}>{busy?'Signing in…':'Sign in'}</button></form>:<>
      <section className="collection-card"><h2>Collect a group’s sessions</h2><p>Create a code and give it to your participants separately from the public website link. Each code accepts up to 100 submissions over seven days. It grants submission access only, never access to responses.</p>
        <form className="collection-inline" onSubmit={event=>{event.preventDefault();run(async current=>{const value=await api.createCode(auth.token,label.trim());if(current!==generation.current)return;setNewCode(value);setLabel('');await load(auth.token,page,current);});}}><label>Group label<input maxLength={80} value={label} onChange={e=>setLabel(e.target.value)} placeholder="Workshop group A" required disabled={busy}/></label><button disabled={busy || !label.trim()}>Create collection code</button></form>
        {newCode && <div className="collection-receipt" role="status"><strong>Save this code now; it is shown only here.</strong><p><code>{text(newCode.code)}</code></p><p>Expires {new Date(newCode.expires_at).toLocaleString()}.</p></div>}
        <details><summary>Recent collection groups</summary>{collections.length===0?<p>No collection groups yet.</p>:collections.map(item=><div className="collection-group" key={item.id}><p><strong>{text(item.label)}</strong> · {item.submissions}/{item.max_submissions} received · {item.closed?'Closed':new Date(item.expires_at)<=new Date()?'Expired':`Expires ${new Date(item.expires_at).toLocaleString()}`}</p><button disabled={busy || item.closed} onClick={()=>run(async current=>{await api.closeCode(auth.token,item.id);await load(auth.token,page,current);})}>Close this code</button></div>)}</details>
      </section>
      <section className="collection-card"><div className="collection-toolbar"><h2>Received sessions</h2><button disabled={busy} onClick={()=>run(current=>load(auth.token,0,current))}>Refresh newest</button></div><p>Page {page+1} · up to 25 sessions. Click a participant code to inspect responses.</p>
        {rows.length===0?<p>No sessions on this page yet.</p>:<div className="collection-table"><table><thead><tr><th>Participant</th><th>Group</th><th>Received</th><th>Reflection</th></tr></thead><tbody>{rows.map(row=><tr key={row.id}><td><button disabled={busy} onClick={()=>run(async current=>{const value=await api.session(auth.token,row.id);if(current===generation.current)setDetail(value);})}>{text(row.participant_id)}</button></td><td>{text(row.collection_label)}</td><td>{new Date(row.received_at).toLocaleString()}</td><td>{text(row.reflection_status)}</td></tr>)}</tbody></table></div>}
        <div className="collection-toolbar"><button disabled={busy || page===0} onClick={()=>run(current=>load(auth.token,page-1,current))}>Newer</button><button disabled={busy || rows.length<25} onClick={()=>run(current=>load(auth.token,page+1,current))}>Older</button></div>
      </section>{detail && <SessionDetail row={detail}/>}<p>Keep exports private. To remove a participant’s stored response, use its receipt ID in the project database.</p>
    </>}
  </main>;
}
