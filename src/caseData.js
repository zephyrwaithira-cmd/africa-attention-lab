// Original fictional learning cases. Outcomes are authored branches, not predictions.
export const cases = [
  {
    id: 'openpath', company: 'OpenPath Foundation', title: 'Who gets a way in?', domain: 'Policy', minutes: 10, icon: '⚑',
    role: 'You are the programme lead at a small foundation helping young adults move into paid work.',
    brief: 'The fictional county of Mtoni has offered OpenPath 60 programme tokens for a six-week employment pilot. There are 120 interested young adults and only 30 funded places. Your county partner wants quick results; the people applying face different barriers. You decide who the pilot serves, how it runs, and what success means.',
    stakes: 'A fast, visible launch could secure future support. But a programme that is easy to count may leave out people who need it most.',
    goals: ['Make an understandable, defensible eligibility policy.', 'Spend within the pilot budget without hiding who is excluded.', 'Respond to feedback and define what the pilot can actually tell you.'],
    glossary: [['Eligibility', 'The rules used to decide who may take part.'], ['Pilot', 'A small trial used to learn before expanding.'], ['Reach', 'How many people a programme serves; it does not show who benefits or whether jobs result.']],
    cast: [
      { id: 'amina', name: 'Amina', role: 'Participant representative', color: 'mint', quote: 'I want a fair chance, but I cannot stop caring for my younger brother to attend every weekday.' },
      { id: 'joel', name: 'Joel', role: 'Employer liaison', color: 'gold', quote: 'Employers will offer interviews. They have not promised jobs.' },
      { id: 'ruth', name: 'Ruth', role: 'County programme officer', color: 'coral', quote: 'We need a clear account of public money. A good photo is useful, but it is not evidence of employment.' },
    ],
    scenes: [
      {
        title: 'The invitation', tag: 'Monday · planning meeting',
        story: 'You need to publish the entry rules tomorrow. One proposal is to select the applicants most likely to get a job quickly. Another is to prioritise people facing the greatest barriers. Both sound reasonable, but they would select different people.',
        question: 'How will you allocate the 30 places?',
        sources: [
          { id: 'applications', who: 'Applicant snapshot', kind: 'Evidence', text: 'Of 120 applicants, 50 have reliable internet, 45 report travel-cost barriers and 35 have care duties. These groups overlap, so do not add the figures together. The snapshot is self-reported, not independently verified.' },
          { id: 'amina', who: 'Amina', kind: 'Conversation', text: 'An online-only application would be easiest for the staff. But some people would need to pay a cybercafé or ask someone else to fill it in. A support desk at the community centre would help.' },
          { id: 'joel', who: 'Joel', kind: 'Conversation', text: 'Two employers will interview 20 candidates who finish the training. They need basic communication and numeracy, not a university degree. We do not yet know which applicants need additional support.' },
        ],
        options: [
          { id: 'readiness', title: 'Select for immediate readiness', description: 'Use a short work sample and select 30 applicants who are closest to interview-ready.', tradeoff: 'Faster preparation; applicants with bigger barriers may be excluded.', outcome: 'You select 30 applicants using the work sample. Employers welcome the clear standard. Amina asks whether the process measures opportunity as well as readiness.', next: 'Your readiness-first selection has prompted questions about who never had a chance to prepare.' },
          { id: 'barriers', title: 'Prioritise barriers to access', description: 'Reserve 20 places for applicants reporting travel, care or connectivity barriers; allocate 10 through an open draw.', tradeoff: 'More inclusive access; additional support may reduce the training budget.', outcome: 'Thirty places are allocated, including 20 reserved places. Staff now need a practical support plan. Some applicants ask how self-reported barriers were assessed.', next: 'Your reserved places widen access, but the promised support now has to be delivered.' },
          { id: 'mixed', title: 'Create two routes in', description: 'Use a basic work sample for 15 places and a supported application process with a draw for the other 15.', tradeoff: 'Balances two aims; requires clear communication and more administration.', outcome: 'Two routes are announced. Applicants have more than one way in, but the team must explain why the rules differ. Joel asks how both groups will be prepared for interviews.', next: 'Your two-route policy needs a delivery model that serves different starting points.' },
        ],
        prompt: 'Who benefits from your rule, who might miss out, and what would you tell an unsuccessful applicant?',
      },
      {
        title: 'Promises meet the budget', tag: 'Week 1 · delivery design',
        story: 'All three delivery packages fit the 60-token budget. The choice is about the experience you can realistically provide. The costs below include training and support; they are complete packages, not extra charges.',
        question: 'Which delivery package will you fund?',
        sources: [
          { id: 'costs', who: 'Finance sheet', kind: 'Evidence', text: 'Daytime centre: training 30 + travel 15 + administration 5 = 50 tokens. Neighbourhood evenings: training 36 + care support 12 + administration 10 = 58. Blended learning: training 30 + device loans 18 + administration 6 = 54. The budget is 60.' },
          { id: 'amina', who: 'Amina', kind: 'Conversation', text: 'Evenings would help me, but not everyone. Some people work at night. Ask participants about their schedules instead of assuming we all have the same needs.' },
          { id: 'joel', who: 'Joel', kind: 'Conversation', text: 'The employers can visit the main centre. They could also interview remotely, but somebody must arrange devices and a quiet room.' },
        ],
        options: [
          { id: 'day', title: 'Daytime centre · 50 tokens', description: 'One central venue, travel support and in-person employer visits. Keep 10 tokens in reserve.', tradeoff: 'Clear coordination; daytime care and work duties remain a barrier.', outcome: 'The centre opens with 10 tokens unspent. Training and interviews are easy to coordinate, but six participants report daytime clashes.', next: 'Six participants cannot reliably attend daytime sessions. Your reserve is 10 tokens.' },
          { id: 'evening', title: 'Neighbourhood evenings · 58 tokens', description: 'Smaller local groups with care support. Keep 2 tokens in reserve.', tradeoff: 'Lower travel burden; less room in the budget for surprises.', outcome: 'Neighbourhood sessions launch. Four participants who work evenings cannot attend consistently. Only two tokens remain for adjustments.', next: 'Four participants work evenings and are missing sessions. Your reserve is only 2 tokens.' },
          { id: 'blended', title: 'Blended learning · 54 tokens', description: 'Mix self-paced tasks, device loans and a weekly group session. Keep 6 tokens in reserve.', tradeoff: 'Flexible schedules; connectivity and independent study remain challenging.', outcome: 'Devices are loaned out. Six participants struggle with unreliable connectivity, despite having a device. Six tokens remain.', next: 'Six participants have devices but unreliable connectivity. Your reserve is 6 tokens.' },
        ],
        prompt: 'Why does this package fit your entry policy, and what risk does your remaining reserve need to cover?',
      },
      {
        title: 'The people behind the attendance sheet', tag: 'Week 2 · participant feedback',
        story: 'Attendance has exposed a gap in your plan. Staff suggest removing participants who miss two sessions so that the completion rate looks stronger. You need to respond before the next session.',
        question: 'How will you handle the attendance problem?',
        sources: [
          { id: 'amina', who: 'Amina', kind: 'Conversation', text: 'A missed session does not always mean someone has stopped trying. Please ask what happened before taking away their place. But do tell us the minimum work required to finish.' },
          { id: 'operations', who: 'Operations note', kind: 'Evidence', text: 'The existing team can offer one catch-up session and phone check-ins by postponing a planned publicity event. This adds no token cost, but reduces publicity. A full schedule redesign needs a new funding agreement.' },
          { id: 'ruth', who: 'Ruth', kind: 'Conversation', text: 'Do not quietly change the denominator. If 30 people joined, the report must still explain what happened to all 30, including withdrawals.' },
        ],
        options: [
          { id: 'support', title: 'Check in, then offer a catch-up route', description: 'Use the publicity time for check-ins and a catch-up session. Keep transparent completion requirements.', tradeoff: 'Less publicity; staff must manage an additional learning route.', outcome: 'The team redirects its publicity time. Some participants use the catch-up route; attendance is not guaranteed. Everyone remains visible in the reporting.', next: 'You offered a catch-up route and retained the original group in your reporting.' },
          { id: 'replace', title: 'Apply the attendance rule with an appeal', description: 'Contact absent participants, allow them to explain, then offer genuinely vacant places to the waiting list.', tradeoff: 'Protects pace; late entrants may struggle and some original participants leave.', outcome: 'Staff document each contact and appeal before replacing vacant places. The waiting list moves, but the final report must distinguish original participants from replacements.', next: 'You used documented appeals and replacements, so cohort changes must be reported separately.' },
          { id: 'redesign', title: 'Pause and seek a revised agreement', description: 'Ask the county for permission to redesign the schedule and support offer before continuing.', tradeoff: 'May address the cause; delays training and employer interviews.', outcome: 'Ruth agrees to review a revised proposal, not to fund it automatically. Training pauses for a week and employer dates need renegotiation.', next: 'Your redesign request paused delivery. Additional funding has not yet been approved.' },
        ],
        prompt: 'How does your response treat participants fairly while keeping a credible programme?',
      },
      {
        title: 'Tell the whole story', tag: 'Week 6 · learning review',
        story: 'The county asks whether this pilot should expand. Your team can assemble one primary report this week. Some outcomes will take longer to observe. A careful answer may be more useful than an impressive-looking number.',
        question: 'What will you put at the centre of the report?',
        sources: [
          { id: 'ruth', who: 'Ruth', kind: 'Conversation', text: 'I need to know what happened, what it cost and what remains uncertain. If the programme changed midway, explain why. Do not call interviews jobs.' },
          { id: 'tracking', who: 'Tracking plan', kind: 'Evidence', text: 'Attendance, spending and interview invitations can be checked now. Paid employment requires follow-up after three months. This small pilot has no comparison group, so it cannot establish that the programme caused job outcomes.' },
          { id: 'amina', who: 'Amina', kind: 'Conversation', text: 'Please include people who left. Their experiences could explain why the next version needs to change.' },
        ],
        options: [
          { id: 'delivery', title: 'Delivery and cost review', description: 'Report attendance, completions, costs and departures for the full cohort; propose a later employment follow-up.', tradeoff: 'Auditable now; does not answer the employment question yet.', outcome: 'The report can support decisions about delivery and cost. It explicitly leaves the employment effect unresolved.' },
          { id: 'equity', title: 'Access and experience review', description: 'Compare participation barriers, support use and experiences, including people who left; include spending.', tradeoff: 'Explains inclusion; small groups limit firm comparisons.', outcome: 'The report highlights who the design served and missed. Small subgroup counts are described cautiously, without ranking people.' },
          { id: 'followup', title: 'Staged evidence plan', description: 'Publish an interim account now and recommend waiting for a three-month follow-up before expanding.', tradeoff: 'More information later; expansion and funding decisions may be delayed.', outcome: 'The county receives an honest interim account and a follow-up plan. Expansion remains a decision under uncertainty.' },
        ],
        prompt: 'Name one claim your report can support, one it cannot, and one change you would test next.',
      },
    ],
  },
  {
    id: 'kijani', company: 'Kijani Works', title: 'A big order. A small cash cushion.', domain: 'Finance', minutes: 15, icon: '◆',
    role: 'You manage a 12-person furniture workshop. You do not need accounting knowledge; all the figures and terms are provided.',
    brief: 'A fictional training centre, Lakeview Learning, wants 100 desks. The contract pays 120 cash units. Kijani has 50 units in the bank. Materials cost 60 and wages plus overheads cost 30 before delivery. A profitable order could still leave the workshop short of cash at the wrong moment.',
    stakes: 'You want the work, but people need predictable pay, the customer needs desks and the workshop needs enough cash to keep operating.',
    goals: ['Distinguish money promised from money available.', 'Choose a workable payment and delivery plan.', 'Respond to a delay while explaining who carries the risk.'],
    glossary: [['Cash flow', 'When money actually arrives and leaves.'], ['Margin', 'Revenue minus the listed costs. It is not the same as cash in the bank.'], ['Deposit', 'Part of the price paid before delivery.'], ['Receivable', 'Money a customer owes you. It is not cash available to spend yet.'], ['Overheads', 'Operating costs such as rent and electricity.']],
    cast: [
      { id: 'njeri', name: 'Njeri', role: 'Finance coordinator', color: 'gold', quote: 'We can be profitable on paper and still run out of money on payday.' },
      { id: 'sam', name: 'Sam', role: 'Workshop lead', color: 'mint', quote: 'Tell us the real schedule before promising a deadline. Rushing can create rework.' },
      { id: 'leah', name: 'Leah', role: 'Customer contact', color: 'coral', quote: 'We need desks for opening week. I can discuss staged delivery, but I need something concrete.' },
    ],
    scenes: [
      {
        title: 'Before you say yes', tag: 'Day 1 · contract discussion',
        story: 'The customer initially proposes paying everything once the desks are assembled, before collection. Kijani would have 50 units available against 90 due before delivery: a 40-unit gap. Choose one of three arrangements the parties are willing to sign.',
        question: 'Which contract arrangement will you agree?',
        sources: [
          { id: 'ledger', who: 'Cash worksheet', kind: 'Evidence', text: 'Starting cash 50. Contract revenue 120. Materials 60 + wages/overheads 30 = 90 listed costs. Base margin is 30. The no-deposit plan has a 40-unit pre-delivery gap: 90 − 50.' },
          { id: 'njeri', who: 'Njeri', kind: 'Conversation', text: 'A 50-unit deposit closes the gap with a 10-unit cushion. A loan supplies 45 but costs 5 in fees. Splitting the order avoids the loan but adds 6 in logistics costs.' },
          { id: 'leah', who: 'Leah', kind: 'Conversation', text: 'I can agree to a 50-unit deposit and a 70-unit balance, or two batches paid at 60 each when ready for collection. If you use a loan, our original 120 payment once the desks are assembled can stand. These are agreed possibilities, not guaranteed payment dates.' },
        ],
        options: [
          { id: 'deposit', title: 'Negotiate a 50-unit deposit', description: 'Cash before costs: 50 + 50 = 100. Pay 90, leaving 10. Collect the remaining 70 when the desks are assembled.', tradeoff: 'No finance fee; depends on the deposit arriving before work starts.', outcome: 'The deposit arrives as agreed and you pay the listed 90 costs. Your cash cushion is 10. The remaining 70 is due when the desks are assembled, before collection.', next: 'Your deposit plan has left 10 cash units after production costs, with 70 still due.' },
          { id: 'staged', title: 'Deliver two batches', description: 'Batch one costs 48, leaving 2. Its 60 payment funds batch two at 48. Total costs become 96.', tradeoff: 'Lower upfront exposure; a late first payment blocks batch two.', outcome: 'Batch one is ready for collection after 48 units of costs, leaving 2 cash units. Its 60-unit payment is due before batch two starts. Total listed costs are 96.', next: 'Your staged plan has batch one ready for collection. Cash is 2; its 60 payment is due before you can fund batch two.' },
          { id: 'loan', title: 'Use a short-term business loan', description: 'Borrow 45. Cash becomes 95, then 5 after the 90 production costs. Repay 50 including fees after the customer pays.', tradeoff: 'Keeps the original delivery plan; repayment pressure and a 5-unit fee reduce flexibility.', outcome: 'You borrow 45 and pay 90 costs, leaving 5 cash units. The customer owes 120 and the lender will be owed 50 including the agreed fee.', next: 'Your loan plan has left 5 cash units, a 120 customer receivable and a 50 loan repayment due.' },
        ],
        prompt: 'Explain why your plan is workable and what could still make its cash timing fail.',
      },
      {
        title: 'The money is late', tag: 'Payment day · unexpected email',
        story: 'Lakeview reports a ten-day delay in the payment currently due. Separately, Kijani must pay 12 units for its next operating period. These are new costs, not part of the earlier 90. You need a response today.',
        question: 'How will you bridge the next operating period?',
        sources: [
          { id: 'njeri', who: 'Njeri', kind: 'Conversation', text: 'Against the new 12-unit obligation, the deposit plan is short 2, the staged plan short 10 and the loan plan short 7. Credit already committed to the order is not free cash we can spend again.' },
          { id: 'leah', who: 'Leah', kind: 'Conversation', text: 'We can release 12 units today from the payment already owed. This is an advance against that balance, not additional revenue. The rest would follow after ten days.' },
          { id: 'sam', who: 'Sam', kind: 'Conversation', text: 'A payroll delay should never be assumed. Staff have bills. Tell us what is happening and protect agreed pay where possible. A delivery pause needs a written conversation with the customer.' },
        ],
        options: [
          { id: 'partial', title: 'Request the 12-unit partial payment', description: 'Collect 12 of the amount already owed and use it for the next operating period. Reduce the customer balance by 12.', tradeoff: 'No added fee; the remaining payment is still exposed to delay.', outcome: 'The agreed 12 arrives and covers the new 12 obligation. Your earlier cash cushion is preserved. The customer now owes 12 less; total revenue has not increased.', next: 'You covered the operating period with a partial customer payment. The remaining balance is still due.' },
          { id: 'owner', title: 'Use a 12-unit owner advance', description: 'The owner offers 12 interest-free units for the operating period, repayable when the customer pays.', tradeoff: 'Protects the customer relationship; creates an additional 12-unit repayment obligation.', outcome: 'The owner advance covers the operating period. Your earlier cash cushion is preserved, but 12 must later be repaid to the owner.', next: 'You covered the operating period using an owner advance. Remember the extra 12-unit repayment.' },
          { id: 'agreement', title: 'Negotiate timing with suppliers', description: 'Pay 2 now and defer 10 of the new operating obligation by written agreement. The deferral costs 1 extra unit later.', tradeoff: 'All three plans can cover 2 now; later liabilities rise to 11 and supplier goodwill is used.', outcome: 'The supplier accepts the written deferral. Cash falls by 2 today and 11 is due later. Staff pay is not deferred in this agreement.', next: 'You paid 2 and deferred 10 with a 1-unit fee. That 11-unit obligation remains due.' },
        ],
        prompt: 'What obligation remains after your choice, and who now carries the risk of another delay?',
      },
      {
        title: 'A quality problem cannot wait', tag: 'Workshop inspection · the same afternoon',
        story: 'During the final release inspection, Sam finds that 10 assembled desks need additional finishing. These desks are still under Kijani’s control. An available workshop slot can fix them at no extra cash cost but adds two days. A specialist can fix them now for 4 units. Unfinished desks will not be released.',
        question: 'How will you handle the affected desks?',
        sources: [
          { id: 'sam', who: 'Sam', kind: 'Conversation', text: 'We have isolated the 10 affected desks. The other desks pass the check. The two-day internal repair uses an existing staff slot; overtime has not been budgeted or agreed.' },
          { id: 'leah', who: 'Leah', kind: 'Conversation', text: 'I can accept a two-day delay for the affected desks, or a temporary reduction of the order by 10. A reduction lowers the total price by 12 units; it does not refund costs you already incurred.' },
          { id: 'cash', who: 'Updated cash check', kind: 'Evidence', text: 'The specialist requires 4 cash units today. If you chose supplier deferral, your cushion fell by 2; otherwise it stayed unchanged. Check available cash before choosing speed. A smaller order reduces the eventual customer balance by 12.' },
        ],
        options: [
          { id: 'repair', title: 'Repair internally and agree a delay', description: 'Keep the order intact and use the existing workshop slot. Agree a two-day delay for the 10 desks.', tradeoff: 'Preserves cash and price; changes the customer’s schedule.', outcome: 'The customer accepts the documented two-day adjustment. The workshop repairs and rechecks the desks without an additional cash charge.', next: 'You kept the order intact and agreed a two-day quality repair.' },
          { id: 'specialist', title: 'Use the specialist · 4 cash units', description: 'Pay for the same-day finishing slot, then recheck the desks before release.', tradeoff: 'Preserves delivery timing; reduces your remaining cash cushion.', outcome: 'The specialist completes the finishing and Sam rechecks the desks. Your cash falls by 4; the customer price stays unchanged.', next: 'You spent 4 on specialist finishing to preserve the delivery date.' },
          { id: 'reduce', title: 'Agree a smaller order', description: 'Remove the 10 affected desks from this contract and reduce the customer balance by 12.', tradeoff: 'Avoids an immediate repair bill; gives up revenue despite costs already incurred.', outcome: 'The customer accepts a 12-unit price reduction. The affected desks remain in the workshop; any later sale is uncertain and is not counted as cash.', next: 'You reduced the contract price by 12. Do not count an uncertain resale as money already received.' },
        ],
        prompt: 'Explain how your earlier financing choices affect this decision, including the customer and workshop consequences.',
      },
      {
        title: 'The next order', tag: 'Ten days later · review meeting',
        story: 'The overdue customer payment arrives as agreed. If you chose staged delivery, it now funds the second batch, which costs 48 and brings a further 60 payment when ready. Your outstanding obligations still need to be settled. The team wants one change before accepting another large order. Each option takes the same two hours of management time.',
        question: 'Which improvement will you prioritise?',
        sources: [
          { id: 'njeri', who: 'Njeri', kind: 'Conversation', text: 'Money received is not all spare money. Settle any loan, owner advance and deferred supplier payments first. Keep a calendar of due dates as well as a profit estimate.' },
          { id: 'sam', who: 'Sam', kind: 'Conversation', text: 'An earlier quality check would help us catch finishing problems before the deadline. It would not, on its own, solve late payments.' },
          { id: 'leah', who: 'Leah', kind: 'Conversation', text: 'A realistic contract should say when deposits are due, what happens after a delay, and how we agree changes. Clear terms help both sides.' },
        ],
        options: [
          { id: 'cashplan', title: 'A weekly cash and obligations calendar', description: 'Track expected receipts, committed payments and a minimum reserve before accepting work.', tradeoff: 'Improves visibility; forecasts still depend on uncertain payment dates.', outcome: 'The team introduces a weekly cash check with named owners for each payment assumption.' },
          { id: 'terms', title: 'Clearer payment and change terms', description: 'Define deposits, stage payments and agreed responses to delay before starting the next order.', tradeoff: 'Shares risk more explicitly; some customers may resist the terms.', outcome: 'Leah and the team draft a plain-language contract checklist for future negotiations.' },
          { id: 'quality', title: 'Earlier quality and capacity checks', description: 'Add a finishing checkpoint and confirm production capacity before promising delivery dates.', tradeoff: 'Reduces late surprises; leaves payment-risk controls needing separate attention.', outcome: 'Sam adds an earlier inspection and a capacity check to the production plan.' },
        ],
        prompt: 'Which problem does this improvement address, which does it leave unresolved, and what would you track next time?',
      },
    ],
  },
  {
    id: 'brightbridge', company: 'BrightBridge Studio', title: 'A team is more than a skills list.', domain: 'Talent', minutes: 10, icon: '★',
    role: 'You lead a four-person studio producing a community learning event and a small digital guide.',
    brief: 'A client wants a useful public launch in ten working days. The work includes gathering learner needs, making the guide, and testing it with users. Your team has different strengths and available time. You decide the work plan, how to support people and what to do when capacity changes.',
    stakes: 'A polished launch means little if the guide is hard to use. Overloading a reliable colleague may protect one deadline while damaging the next project.',
    goals: ['Use evidence about skills and availability rather than assumptions about people.', 'Respond to changed capacity through support, scope or timing.', 'Give specific feedback and share learning with the team.'],
    glossary: [['Capacity', 'Time a person can realistically give this project.'], ['Scope', 'The set of things the project promises to deliver.'], ['Milestone', 'A planned point for checking work and adjusting the plan.'], ['Handover', 'Sharing the information someone needs to take over work.']],
    cast: [
      { id: 'imani', name: 'Imani', role: 'Research and facilitation', color: 'mint', quote: 'I can turn interviews into a clear brief. I have three days available, not a full week.' },
      { id: 'leo', name: 'Leo', role: 'Designer and builder', color: 'gold', quote: 'I can build quickly once the brief is stable. Late changes cost time.' },
      { id: 'tess', name: 'Tess', role: 'Coordinator and tester', color: 'coral', quote: 'I want to lead more user testing. I can do it with a short coaching session.' },
      { id: 'noor', name: 'Noor', role: 'Writer and accessibility reviewer', color: 'lavender', quote: 'Plain language and accessibility are part of making something usable, not decoration at the end.' },
    ],
    scenes: [
      {
        title: 'Assign the work, not the labels', tag: 'Day 1 · team planning',
        story: 'Choose a work plan after hearing from the team. Each plan is feasible at this point, but creates a different dependence. No plan requires unpaid overtime. A day means one person’s available working day.',
        question: 'How will you organise the first milestone?',
        sources: [
          { id: 'capacity', who: 'Availability board', kind: 'Evidence', text: 'Imani: 3 days for research or coaching. Leo: 4 days for design/build. Tess: 4 days for coordination/testing. Noor: 3 days for writing/review. Nobody has agreed to exceed these limits.' },
          { id: 'tess', who: 'Tess', kind: 'Conversation', text: 'I have coordinated two launches and helped with interviews. If Imani coaches me for one day, I can lead a small test and bring back questions I cannot answer.' },
          { id: 'noor', who: 'Noor', kind: 'Conversation', text: 'Let me review the outline before the build. If I only see the guide at the end, rewriting it could force Leo to redo layouts.' },
        ],
        options: [
          { id: 'specialists', title: 'Give each specialist a clear lead', description: 'Imani leads research for 3 days; Leo builds for 4; Tess coordinates/tests for 4; Noor writes/reviews for 3.', tradeoff: 'Clear ownership; knowledge is concentrated in individual people.', outcome: 'The team understands its roles. Each person is fully committed and there is no built-in backup for Imani’s research.', next: 'Your specialist plan has clear ownership, but research knowledge is concentrated with Imani.' },
          { id: 'coached', title: 'Create a coached testing partnership', description: 'Imani spends 1 day coaching Tess and 2 on research; Tess uses 1 day learning and 3 coordinating/testing. Leo and Noor retain their roles.', tradeoff: 'Builds a backup and a development opportunity; leaves less coordination time.', outcome: 'Tess begins a coached test plan and Imani shares interview notes. Coordination time is tighter, but more than one person understands the research.', next: 'Your coached plan has given Tess a research handover, with less coordination time available.' },
          { id: 'review', title: 'Use an early review checkpoint', description: 'Imani uses 2 days for research and 1 for a shared review; Leo uses 1 review day and 3 build days; Tess and Noor keep their 4 and 3 days.', tradeoff: 'Catches misunderstandings early; reduces build time and requires a smaller first version.', outcome: 'The team agrees a simpler first version and holds an early review. More assumptions are visible before the build begins.', next: 'Your review-first plan has a smaller first version and a shared record of the assumptions.' },
        ],
        prompt: 'Whose strengths and availability shaped your plan, and where is its biggest dependency?',
      },
      {
        title: 'Capacity changes', tag: 'Day 3 · a private update',
        story: 'Imani tells you that only one of her planned days remains available because of an unexpected personal commitment. She can provide a short handover but does not want to discuss private details. The client still expects the original launch date.',
        question: 'What will you change?',
        sources: [
          { id: 'imani', who: 'Imani', kind: 'Conversation', text: 'I can organise the existing notes and explain the open questions. Please plan using the time I have confirmed. I cannot promise evenings.' },
          { id: 'tess', who: 'Tess', kind: 'Conversation', text: 'I can take a structured follow-up interview if somebody covers one coordination task. I should not simply inherit all the missing work on top of my current load.' },
          { id: 'client', who: 'Client message', kind: 'Evidence', text: 'The client can accept a smaller launch on the original date, or the full scope three days later. A contracted researcher is also available for two days using the project’s entire 8-token contingency; they need a handover.' },
        ],
        options: [
          { id: 'scope', title: 'Reduce scope and redistribute explicitly', description: 'Agree a smaller launch; hand notes to Tess and remove one coordination task to make room for follow-up.', tradeoff: 'Keeps the date without extra spend; some promised features move to a later phase.', outcome: 'The client approves a smaller launch. Tess takes a bounded follow-up task, and the team records what has moved out of scope.', next: 'Your revised commitment is a smaller launch on the original date. Do not quietly add the removed features back.' },
          { id: 'contractor', title: 'Use the contingency for a researcher', description: 'Spend the agreed 8 tokens on two researcher days and use Imani’s remaining time for handover.', tradeoff: 'Preserves scope and date; spends the full financial contingency and adds coordination.', outcome: 'The researcher joins with a written brief. Scope stays intact, but the contingency is now zero and someone must check the handover.', next: 'You hired a researcher and used all 8 contingency tokens. The handover is now a critical dependency.' },
          { id: 'extend', title: 'Agree the three-day extension', description: 'Keep the full scope and sequence the team’s remaining available work over a longer schedule.', tradeoff: 'Avoids assuming overtime; changes the client’s launch arrangements.', outcome: 'The client agrees to the new date. The team publishes the revised sequence and confirms that the extension does not mean extra unagreed work.', next: 'You agreed a three-day extension to preserve scope within confirmed availability.' },
        ],
        prompt: 'What responsibility changes hands, what work or expectation changes, and how will you communicate that clearly?',
      },
      {
        title: 'The test that changes the conversation', tag: 'First milestone · user feedback',
        story: 'Five volunteer users try the draft guide. Three cannot find the registration step. One cannot read a low-contrast instruction. Leo says the build follows the brief; Tess says the test shows a real problem. You need a useful next action, not a verdict on a colleague.',
        question: 'How will you respond to the test?',
        sources: [
          { id: 'test', who: 'Test notes', kind: 'Evidence', text: 'This is a small usability test, not a representative survey. It identifies specific obstacles but cannot estimate how common they are across the whole audience. No volunteer was asked to share sensitive personal information.' },
          { id: 'leo', who: 'Leo', kind: 'Conversation', text: 'I can make a focused change to navigation in one existing build slot. If we redesign the whole guide, we need a new scope or date agreement.' },
          { id: 'noor', who: 'Noor', kind: 'Conversation', text: 'I can clarify the registration wording and contrast in my next review slot. Then Tess could retest the specific task. We should not make the user work around a problem we can fix.' },
        ],
        options: [
          { id: 'targeted', title: 'Fix the observed obstacles and retest', description: 'Use the existing build/review slots for navigation, wording and contrast; Tess repeats the registration task.', tradeoff: 'Addresses observed problems; other parts of the guide remain less tested.', outcome: 'The team makes targeted changes and repeats the task. The new test is evidence about this revision, not proof that every user will succeed.', next: 'You used specific test evidence to revise and retest the registration flow.' },
          { id: 'facilitated', title: 'Use a facilitated launch while fixing the guide', description: 'Provide an accessible facilitator-led registration route, label the guide as a pilot and schedule the focused repair.', tradeoff: 'Maintains a supported launch; self-service remains limited and a repair commitment is essential.', outcome: 'The client agrees to a supported pilot launch. A named owner and repair date are published; the guide is not described as ready for independent use.', next: 'You chose a supported pilot, with an explicit limitation and a repair owner/date.' },
          { id: 'pause', title: 'Pause release and renegotiate the review', description: 'Show the client the observed issues and ask for time to review the full journey before launch.', tradeoff: 'Creates room for broader checking; adds delay and requires a new agreement.', outcome: 'The client agrees to discuss a revised release plan. The team documents what must be checked before making a fresh commitment.', next: 'You paused release for a broader review, so a new scope and date agreement is required.' },
        ],
        prompt: 'What evidence would you discuss with the team, and how would you avoid turning a design problem into blame?',
      },
      {
        title: 'Help the next project go better', tag: 'Retrospective · closing meeting',
        story: 'The team has one hour to reflect and agree a practical improvement. Choose an approach, then write the feedback you would actually give. Keep it about observable work and support, not personality labels.',
        question: 'How will you use the closing meeting?',
        sources: [
          { id: 'tess', who: 'Tess', kind: 'Conversation', text: 'I want feedback on the test I ran: what was useful, what should I change, and what support would help me lead the next one?' },
          { id: 'imani', who: 'Imani', kind: 'Conversation', text: 'A good handover should not depend on a crisis. We could keep research notes accessible to the people who need them throughout the project.' },
          { id: 'retro', who: 'Meeting note', kind: 'Evidence', text: 'The notes show changes in availability, scope and user feedback. They do not measure anyone’s personality, motivation or long-term potential. Discuss specific decisions and conditions.' },
        ],
        options: [
          { id: 'handover', title: 'Improve the team’s handover habit', description: 'Agree a shared note format, a backup owner and a short checkpoint for each critical task.', tradeoff: 'Reduces single-person dependencies; requires time to maintain the notes.', outcome: 'The team names an owner and a next-project checkpoint for the new handover practice.' },
          { id: 'development', title: 'Agree one supported development goal', description: 'Give Tess specific feedback and plan a bounded next testing assignment with coaching and protected time.', tradeoff: 'Builds a person’s capability; wider workflow problems still need attention.', outcome: 'Tess leaves with a concrete next assignment, agreed support and a review date rather than a vague instruction to improve.' },
          { id: 'scopehabit', title: 'Make scope and capacity visible', description: 'Agree a shared workload board and require an explicit trade-off whenever a new task is added.', tradeoff: 'Clarifies commitments; the board is useful only if people update it honestly.', outcome: 'The team agrees to name what moves, who agrees and when the plan is reviewed before accepting additional work.' },
        ],
        prompt: 'Write two or three sentences of specific feedback to one character, then name one improvement and how you would check it.',
      },
    ],
  },
];

export function financeSnapshot(decisions) {
  if (!decisions[0]) return null;
  const first = decisions[0].choice;
  let cash = { deposit: 10, staged: 2, loan: 5 }[first];
  let receivable = { deposit: 70, staged: 60, loan: 120 }[first];
  let liabilities = first === 'loan' ? 50 : 0;
  const second = decisions[1]?.choice;
  if (second === 'partial') receivable -= 12;
  if (second === 'owner') liabilities += 12;
  if (second === 'agreement') { cash -= 2; liabilities += 11; }
  if (decisions[2]?.choice === 'specialist') cash -= 4;
  if (decisions[2]?.choice === 'reduce') receivable -= 12;
  // In the staged route, batch two still costs 48 and its 60 receipt follows delivery.
  const finalCash = cash + receivable - liabilities + (first === 'staged' ? 60 - 48 : 0);
  return { cash, receivable, liabilities, remainingProduction: first === 'staged' ? 48 : 0, finalCash };
}
export function optionAvailable(caseIndex, sceneIndex, optionId, decisions) {
  if (caseIndex === 1 && sceneIndex === 2 && optionId === 'specialist') return financeSnapshot(decisions)?.cash >= 4;
  return true;
}


