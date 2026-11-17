import { financePreview, teamPlans, teamChanges, testActions, teamHabits } from './worldPreviewRules';

function Tiles({ items }) { return <div className="wg-tiles">{items.map(([label, value]) => <div key={label}><small>{label}</small><strong>{value}</strong></div>)}</div>; }
export default function WorldPreview({ s }) {
  if (s.caseIndex === 1) {
    const money = financePreview(s);
    return <section className="op-preview"><h3>{s.scene === 3 ? 'Settlement worksheet' : 'Cash timing worksheet'}</h3><p>Fictional cash units · {s.selected ? 'based on the plan shown' : 'based on earlier committed choices'}</p>{money ? <>
      <Tiles items={[[s.scene === 3 ? 'Cash before settlement' : s.selected ? 'Cash after this step' : 'Cash currently available', money.cash], ['Customer still owes', money.receivable], ['Repayments to settle', money.liabilities]]}/>
      <ol className="wg-money-route"><li>Cash available <b>{money.cash}</b></li><li>Collect outstanding <b>+{money.receivable}</b></li><li>Settle obligations <b>−{money.liabilities}</b></li>{money.remainingProduction > 0 && <li>Batch two <b>−48 +60</b></li>}</ol>
      {s.scene === 3 ? <p><strong>Projected closing cash: {money.finalCash}.</strong> Assumes all agreed payments arrive and no additional costs. This is not profit.</p> : <p>Future receipts cannot be spent today.{money.remainingProduction > 0 && ' Batch two still needs 48 cash units; its 60-unit receipt follows delivery.'}</p>}
      {s.scene === 2 && <p><strong>10 desks need finishing.</strong> Specialist cost: 4 now. {money.cash < 4 && s.selected !== 'specialist' ? 'Choose a plan that fits the cash available.' : 'Preview how each response changes cash or the customer balance.'}</p>}
    </> : <><Tiles items={[["Starting cash",50],["Base production cost",90],["Contract price",120]]}/><p>50 available − 90 due = a 40-unit funding gap before delivery. Select a contract flag to explore a way to cover it.</p></>}</section>;
  }
  const plan = s.scene === 0 ? s.selected : s.decisions[0]?.choice;
  const change = s.scene === 1 ? s.selected : s.decisions[1]?.choice;
  const rows = teamPlans[plan] ?? teamPlans.specialists;
  return <section className="op-preview"><h3>{['Team availability board','Revised commitment','User testing board','Next-project habit'][s.scene]}</h3>
    {s.scene === 0 ? <><p>Confirmed person-days · {s.selected ? 'selected allocation' : 'starting availability'}. This is time, not an ability score.</p><div className="wg-team">{rows.map(([name, days, task]) => <div key={name}><strong>{name}</strong><span aria-label={`${days} days`}>{Array.from({length:days},(_,i)=><i key={i}/>)}</span><small>{s.selected ? task : `${days} days available`}</small></div>)}</div></> : s.scene === 1 ? <><p>Imani has one confirmed day remaining and can hand over existing notes. Do not treat the original allocation as still available.</p>{teamChanges[change] ? <><Tiles items={teamChanges[change].slice(0,3).map((v,i)=>[['Scope','Timing','Contingency'][i],v])}/><p>{teamChanges[change][3]}</p></> : <p>Select a plan to compare scope, timing and the 8-token contingency.</p>}</> : s.scene === 2 ? <><Tiles items={[["Volunteer users",5],["Could not find registration",3],["Low-contrast problem",1]]}/><p>These observations may overlap. This is a small test, not a population estimate.</p>{testActions[s.selected] && <ol className="op-workflow">{testActions[s.selected].map(x=><li key={x}>{x}</li>)}</ol>}</> : <>{teamHabits[s.selected] ? <ol className="op-workflow">{teamHabits[s.selected].map(x=><li key={x}>{x}</li>)}</ol> : <p>Select a learning card to preview the practice you will carry forward.</p>}<p>Describe the work, agree support and set a checkpoint. No personality or potential rating is inferred.</p></>}
    {s.scene > 1 && teamChanges[change] && <p className="op-continuity">Earlier agreement: {teamChanges[change].slice(0,3).join(' · ')}. {s.scene === 2 ? 'The next choice may require another explicit agreement.' : 'Your response to user testing is recorded in the decision trail.'}</p>}
  </section>;
}

