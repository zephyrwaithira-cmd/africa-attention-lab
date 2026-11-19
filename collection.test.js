import test from 'node:test';
import assert from 'node:assert/strict';
import { validateConfig, submissionPayload, createCollectionClient, savedSubmission } from './src/collectionApi.js';
import { initial, reducer, exportSession, duration } from './src/caseEngine.js';

const config = { enabled: true, supabaseUrl: 'https://example.supabase.co', publishableKey: 'sb_publishable_test' };
const id = '00000000-0000-4000-8000-000000000001';
const code = 'a'.repeat(32);
function finished() {
  let state=initial(); let at=1000;
  for(let i=0;i<4;i++) {
    state=reducer(state,{type:'start',at});
    at+=duration(i);
    state=reducer(state,{type:'tick',at});
    if(i<3)state=reducer(state,{type:'next-case',at});
  }
  return exportSession(state,'TEST-P01',null,{privateOldSession:true},at);
}
const ok=value=>({ok:true,status:200,json:async()=>value});

test('only HTTPS Supabase public keys are accepted',()=>{
  assert.equal(validateConfig(config).enabled,true);
  assert.deepEqual(validateConfig({enabled:false}),{enabled:false});
  for(const publishableKey of ['sb_secret_private','eyJlegacy','',null])assert.throws(()=>validateConfig({...config,publishableKey}));
  for(const supabaseUrl of ['http://example.supabase.co','https://example.supabase.co.evil.test','https://user:pass@example.supabase.co','https://example.supabase.co/path'])assert.throws(()=>validateConfig({...config,supabaseUrl}));
});
test('payload excludes old sessions and varying export dates, retains expired drafts',()=>{
  const full=finished();const payload=submissionPayload(full);
  assert.equal(payload.caseStudies.status,'expired');
  assert.equal(payload.caseStudies.records.length,3);
  assert.equal(payload.previousIslandJourney,undefined);
  assert.equal(payload.exportedAt,undefined);
  assert.deepEqual(payload,submissionPayload({...full,exportedAt:'later'}));
  assert.throws(()=>submissionPayload({...full,participantId:'Full name with spaces'}));
  assert.throws(()=>submissionPayload({...full,caseStudies:initial()}));
  assert.throws(()=>submissionPayload({...full,phaseOne:{rationale:'x'.repeat(250001)}}));
});
test('consent and code required before any submission request',async()=>{
  let calls=0;const api=createCollectionClient(config,async()=>{calls++;return ok({id});});
  await assert.rejects(api.submit({id,code,payload:{},consented:false}));
  await assert.rejects(api.submit({id,code:'bad',payload:{},consented:true}));
  assert.equal(calls,0);
});
test('submission retries reuse id and body, public key is not used as a user token',async()=>{
  const calls=[];const api=createCollectionClient(config,async(url,options)=>{calls.push({url,options});return ok({id,received_at:'2026-11-18T00:00:00Z'});});
  const args={id,code,payload:submissionPayload(finished()),consented:true};
  await api.submit(args);await api.submit(args);
  assert.equal(calls[0].options.body,calls[1].options.body);
  assert.equal(calls[0].options.headers.Authorization,undefined);
  assert.equal(calls[0].options.headers.apikey,config.publishableKey);
  assert.equal(savedSubmission('test',{getItem:()=>JSON.stringify({id,receipt:null})}).id,id);
});
test('signed in accounts must pass server facilitator check',async()=>{
  const paths=[];const api=createCollectionClient(config,async(url)=>{paths.push(url);return ok(url.includes('/token?')?{access_token:'user-token',expires_in:3600}:false);});
  await assert.rejects(api.signIn('test@example.com','test'),/access list/);
  assert.equal(paths.length,3);
  assert.match(paths[2],/logout/);
});
test('facilitator reads send user bearer token and preserve safe errors',async()=>{
  let captured;const api=createCollectionClient(config,async(url,options)=>{captured={url,options};return ok([]);});
  await api.list('user-token',2);
  assert.match(captured.url,/offset=50/);
  assert.equal(captured.options.headers.Authorization,'Bearer user-token');
  const denied=createCollectionClient(config,async()=>({ok:false,status:403,json:async()=>({message:'private database detail'})}));
  await assert.rejects(denied.list('bad'),/not authorised/);
});
test('network failures are surfaced without fabricating a receipt',async()=>{
  const api=createCollectionClient(config,async()=>{throw new TypeError('offline');});
  await assert.rejects(api.submit({id,code,payload:submissionPayload(finished()),consented:true}),/offline/);
});
