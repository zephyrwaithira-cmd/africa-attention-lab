export const CONSENT_VERSION = 'session-sharing-v1';
export function validateConfig(value) {
  if (!value?.enabled) return { enabled: false };
  let url;
  try { url = new URL(value.supabaseUrl); } catch { throw new Error('Collection setup is incomplete. JSON download is still available.'); }
  if (url.protocol !== 'https:' || !/^[a-z0-9-]+\.supabase\.co$/.test(url.hostname) || url.pathname !== '/' || url.search || url.hash || url.username || url.password || url.port) throw new Error('Use the HTTPS project URL from Supabase.');
  if (typeof value.publishableKey !== 'string' || !/^sb_publishable_[A-Za-z0-9_-]+$/.test(value.publishableKey)) throw new Error('Collection needs a Supabase publishable key. Never use a secret or service-role key.');
  return { enabled: true, supabaseUrl: url.origin, publishableKey: value.publishableKey, facilitatorName: String(value.facilitatorName || 'Africa Attention Lab facilitator').slice(0,120), contact: String(value.contact || 'Contact your facilitator about your submission.').slice(0,300) };
}
export function submissionPayload(exported) {
  const state = exported?.caseStudies;
  if (state?.caseIndex !== 3 || !['submitted','expired'].includes(state.status) || state.records?.length !== 3) throw new Error('Finish the journey before submitting. You can still download a draft.');
  if (!/^[A-Za-z0-9_-]{1,64}$/.test(exported.participantId)) throw new Error('Online submission needs a participant code of 1–64 letters, numbers, underscores or hyphens. Download your JSON and contact the facilitator.');
  // Leave earlier, unrelated island sessions out of the collection payload.
  const result = { schemaVersion: exported.schemaVersion, contentVersion: exported.contentVersion, interfaceVersion: exported.interfaceVersion, participantId: exported.participantId, phaseOne: exported.phaseOne, caseStudies: state, financeSummary: exported.financeSummary, metricNotice: exported.metricNotice };
  if (new TextEncoder().encode(JSON.stringify(result)).length > 250000) throw new Error('This session is too large to submit online. Download the JSON and contact the facilitator.');
  return result;
}
export function receiptKey(participantId, state) { return `aal-cloud-v1-${participantId}-${state.start}-${state.end}`; }
export function savedSubmission(key, storage) {
  try { const value=JSON.parse(storage.getItem(key)); if (/^[0-9a-f-]{36}$/.test(value?.id)) return value; } catch { /* Storage may be unavailable. */ }
  return { id: crypto.randomUUID(), receipt: null };
}
export function downloadJson(value, name) {
  const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'}));
  const link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export function createCollectionClient(config, fetcher = fetch) {
  async function request(path, {body, token, method} = {}) {
    if (!config.enabled) throw new Error('Online collection is not configured yet.');
    const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),20000);
    try {
      const response=await fetcher(config.supabaseUrl+path,{method:method || (body===undefined?'GET':'POST'),headers:{apikey:config.publishableKey,'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},body:body===undefined?undefined:JSON.stringify(body),signal:controller.signal,cache:'no-store'});
      const result=await response.json().catch(()=>null);
      if (!response.ok) {
        const error=new Error(response.status===401?'Your sign-in expired or the credentials were not accepted. Sign in again.':response.status===403?'This account is not authorised to review sessions.':result?.message?.startsWith('AAL:')?result.message.slice(4).trim():response.status===429?'Too many requests. Wait a moment and try again.':'The service could not complete the request. Check your connection and project setup, then retry.');
        error.status=response.status;throw error;
      }
      return result;
    } catch(error) { if(error.name==='AbortError') throw new Error('The request timed out. Your local work is safe. Retry to check the same submission.', { cause: error }); throw error; }
    finally { clearTimeout(timeout); }
  }
  return {
    async submit({id,code,payload,consented}) {
      if(!consented)throw new Error('Please agree to share this session before submitting.');
      if(!/^[a-f0-9]{32}$/.test(code.trim().toLowerCase()))throw new Error('Enter the 32-character collection code from your facilitator.');
      return request('/rest/v1/rpc/aal_submit_session',{body:{p_id:id,p_code:code.trim().toLowerCase(),p_payload:payload,p_consent_version:CONSENT_VERSION}});
    },
    async signIn(email,password) {
      const auth=await request('/auth/v1/token?grant_type=password',{body:{email,password}});
      const token=auth?.access_token;
      if(!token)throw new Error('Sign-in did not return a session. Try again.');
      if(await request('/rest/v1/rpc/aal_is_facilitator',{body:{},token})!==true) { await request('/auth/v1/logout',{token,body:{}}).catch(()=>{}); throw new Error('This account is not on the facilitator access list.'); }
      return {token,expiresAt:Date.now()+Number(auth.expires_in || 3600)*1000};
    },
    signOut: token=>request('/auth/v1/logout',{token,body:{}}),
    list: (token,page=0)=>request(`/rest/v1/aal_sessions?select=id,participant_id,received_at,reflection_status,collection_label&order=received_at.desc,id.desc&limit=25&offset=${Math.max(0,Math.floor(page))*25}`,{token}),
    async session(token,id) { if(!/^[0-9a-f-]{36}$/.test(id))throw new Error('Invalid session reference.');const rows=await request(`/rest/v1/aal_sessions?id=eq.${id}&select=*`,{token});if(!rows?.length)throw new Error('Session not found or access was removed.');return rows[0]; },
    createCode: (token,label)=>request('/rest/v1/rpc/aal_create_collection',{token,body:{p_label:label,p_limit:100,p_days:7}}),
    codes: token=>request('/rest/v1/aal_collections?select=id,label,expires_at,max_submissions,submissions,closed&order=created_at.desc&limit=25',{token}),
    closeCode: (token,id)=>request('/rest/v1/rpc/aal_close_collection',{token,body:{p_id:id}}),
  };
}
