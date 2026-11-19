import { useRef, useState } from 'react';
import { useCollection } from './collectionContext';
import { createCollectionClient, receiptKey, savedSubmission, submissionPayload } from './collectionApi';
export default function SessionSubmission({participantId,state,getExport}) {
  const {config,loading,error:configError}=useCollection();
  const key=receiptKey(participantId,state);
  const [saved,setSaved]=useState(()=>{try{return savedSubmission(key,localStorage);}catch{return {id:crypto.randomUUID(),receipt:null};}});
  const [code,setCode]=useState('');const [consented,setConsented]=useState(false);
  const [busy,setBusy]=useState(false);const [error,setError]=useState('');const inFlight=useRef(false);
  async function submit(event) {
    event.preventDefault();if(inFlight.current)return;inFlight.current=true;setBusy(true);setError('');
    try {
      const payload=submissionPayload(getExport());
      // Save the id before the network call, so a lost response can be retried safely.
      try { localStorage.setItem(key,JSON.stringify(saved)); } catch { /* In-memory retry remains available. */ }
      const receipt=await createCollectionClient(config).submit({id:saved.id,code,payload,consented});
      if(!receipt?.received_at || receipt.id!==saved.id)throw new Error('No valid receipt was returned. Keep your JSON copy and retry.');
      const next={id:saved.id,receipt};setSaved(next);setCode('');
      try {localStorage.setItem(key,JSON.stringify(next));} catch { /* Display the server receipt even if local storage fails. */ }
    } catch(caught){setError(caught.message || 'Submission failed. Your local session is safe.');}
    finally{inFlight.current=false;setBusy(false);}
  }
  return <section className="collection-card" aria-label="Share completed session"><h3>Send your session to the facilitator</h3>
    {loading?<p>Checking collection availability…</p>:!config.enabled?<p>{configError || 'Online collection is not set up yet. Download your JSON and send it through the channel agreed with your facilitator.'}</p>:saved.receipt?<div role="status"><strong>Session received.</strong><p>Receipt: <code>{saved.receipt.id}</code></p><p>Received {new Date(saved.receipt.received_at).toLocaleString()}. Keep this reference if you contact your facilitator.</p><p>{config.contact}</p></div>:<form onSubmit={submit}>
      <p>This sends your participant code, hospital response, case decisions, written reasoning, source-open events, timings, reflection and self-reported confidence to <strong>{config.facilitatorName}</strong>. They are stored in the project’s Supabase database for authorised facilitators to review.</p>
      <p>Your session is currently saved in this browser. Submission is optional; you can keep a JSON copy instead. Use a participant code, and avoid names or private details in your answers. {config.contact}</p>
      <label>Collection code<input value={code} onChange={e=>setCode(e.target.value)} autoComplete="off" spellCheck="false" maxLength={40} required disabled={busy}/></label>
      <label className="collection-check"><input type="checkbox" checked={consented} onChange={e=>setConsented(e.target.checked)} disabled={busy}/><span>I agree to send this session to the facilitator for research and learning review.</span></label>
      {error && <p role="alert">{error} Your local copy has not been removed.</p>}
      <button disabled={busy || !consented || !code.trim()}>{busy?'Sending…':'Submit session to facilitator'}</button>
    </form>}
  </section>;
}
