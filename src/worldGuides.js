import { rounds as policyRounds } from './openPathRules';

const round = (name, labels, cargo, icon, objective) => ({ name, labels, cargo, icon, objective, action: 'Commit this plan', helper: 'Select a flag to preview its implications. Compare the plans, hear from two sources, then commit when ready.' });
export const guides = [
  {
    location: 'Mtoni County', welcome: 'Make room for opportunity.', map: 'Community planning map', enter: 'Enter the neighbourhood',
    context: 'OpenPath is a fictional foundation helping young adults prepare for paid work through practical training and employer interviews. Mtoni County is funding a small trial before deciding whether to support a larger programme. The applicants have different starting points: some need interview practice, while others also face travel, care or internet barriers.',
    authority: 'You lead the pilot. You can set entry rules, choose a funded delivery package and recommend changes. You cannot promise jobs, create extra places or assume the county will approve more money.',
    success: 'A useful pilot serves people fairly, stays within its resources and gives an honest account of what worked and what remains unknown. There is no single perfect route.',
    orientation: 'The three flags are alternative plans, not three tasks to complete. Changing flags changes your preview; only the commit button makes the decision final.',
    rounds: policyRounds,
    why: ['Your entry rule determines whose needs the programme must serve. A strong work sample may reflect prior opportunity as well as readiness.', 'The promises made during recruitment now need a practical delivery plan. A reserve is money left for uncertainty, not a measure of success.', 'The attendance pattern is feedback about the programme as well as the participants. Investigate the barrier before deciding what to change.', 'The county needs a defensible next step. Immediate participation figures and later employment outcomes answer different questions.'],
    terms: ['Eligibility means the entry rules. A supported draw helps applicants enter a lottery; it does not guarantee a place.', 'A token is a fictional budget unit. Each option is a complete package, so do not add the three prices together.', 'The denominator is the group used to calculate a rate. Starting with 30 people means accounting for all 30, including departures.', 'A comparison group would help distinguish programme effects from other changes. This pilot does not have one.'],
    recap: 'Look at who your entry rule served, what your delivery package enabled, how you responded to barriers and what your report can honestly claim.',
  },
  {
    location: 'Kijani Works', welcome: 'Keep the workshop moving.', map: 'Workshop planning map', enter: 'Enter the workshop',
    context: 'Kijani is a fictional furniture workshop with 12 people. Lakeview Learning needs 100 desks for its opening. Materials, production and pay happen before all the customer money arrives. You must make the order workable without treating money promised as money already in the bank.',
    authority: 'You manage the order. You can agree one of the offered contracts, arrange the listed payment responses and negotiate quality or timing changes. You cannot invent extra cash or assume a customer payment has arrived.',
    success: 'Keep track of cash, protect agreed obligations and explain who carries each risk. A profitable contract can still fail if bills fall due before payments arrive.',
    orientation: 'The flags represent alternative business plans. The worksheet separates cash available now from money owed and future payments. Previewing a plan does not spend money.',
    rounds: [
      round('Agree the order', ['Customer deposit', 'Two batches', 'Business loan'], 'Order contract', '▤', 'Find a workable way to fund production before delivery.'),
      round('Bridge the delay', ['Partial payment', 'Owner advance', 'Supplier agreement'], 'Payment plan', '◉', 'Cover a new operating obligation when the customer pays late.'),
      round('Protect the delivery', ['Repair & delay', 'Specialist finish', 'Smaller order'], 'Quality checklist', '✓', 'Respond to a quality issue within the cash you actually have.'),
      round('Prepare the next order', ['Cash calendar', 'Clearer terms', 'Earlier checks'], 'Learning folder', '▤', 'Choose one improvement and name the risk it leaves unresolved.'),
    ],
    why: ['The 120-unit price exceeds the 90-unit base costs, but 50 in the bank cannot pay 90 before delivery. This is a timing problem as well as a pricing decision.', 'The next operating period adds a new 12-unit bill. A partial customer payment is part of the original price; an owner advance creates a repayment obligation.', 'Quality, timing and cash are connected. The specialist is available only if the workshop can pay the 4-unit cost now.', 'The payment delay and finishing issue exposed different weaknesses. Choose a practical improvement without claiming it solves every problem.'],
    terms: ['Margin is price minus listed costs. Cash is money available now. A deposit is part of the price paid in advance.', 'A receivable is money owed by the customer. A liability is money Kijani must repay. Neither is a new sale.', 'A price reduction lowers the customer balance. It does not undo production costs already paid.', 'Projected settlement cash assumes the remaining receipts arrive and obligations are paid. It is not the same as profit.'],
    recap: 'Trace your contract, the late-payment response, the quality decision and the habit you chose for the next order. Which risk moved to someone else?',
  },
  {
    location: 'BrightBridge Studio', welcome: 'Help the team do good work.', map: 'Studio collaboration map', enter: 'Enter the studio',
    context: 'BrightBridge is a fictional four-person studio creating a community learning event and a digital guide. The client wants to launch in ten working days. Research helps the team understand learners; design and writing turn that understanding into a guide; testing checks whether people can actually use it.',
    authority: 'You lead the project. You can allocate the confirmed time, arrange support and negotiate scope or dates. You cannot assume overtime, demand private personal details or treat a person’s availability as a measure of commitment.',
    success: 'Make realistic commitments, support learning and use evidence to improve the work. The aim is a usable result and a sustainable team, not a ranking of personalities.',
    orientation: 'The flags are three ways to organise the next step. The team board shows available time and explicit trade-offs; it is not a productivity score.',
    rounds: [
      round('Build the team plan', ['Specialist leads', 'Coached testing', 'Early review'], 'Work plan', '▦', 'Match tasks to skills, support and confirmed availability.'),
      round('Adapt the commitment', ['Smaller launch', 'Add researcher', 'Extend the date'], 'Handover notes', '↻', 'Change the plan when a colleague’s availability changes.'),
      round('Listen to the users', ['Fix & retest', 'Supported pilot', 'Pause & review'], 'Test findings', '✓', 'Turn observed usability problems into a constructive next action.'),
      round('Carry learning forward', ['Handover habit', 'Supported growth', 'Visible workload'], 'Team learning card', '★', 'Give specific feedback and agree one improvement to check.'),
    ],
    why: ['All three plans fit the original availability. The difference is where knowledge sits, how early assumptions are checked and what support exists if plans change.', 'You have new information about capacity. A fair response changes work or expectations explicitly rather than silently adding another person’s workload.', 'Three of five volunteers struggled to find registration and one encountered low contrast. These observations identify problems to investigate, not a verdict on a colleague.', 'A useful retrospective turns a specific experience into a supported action with an owner and a review point. Personality labels do not explain what the work needs.'],
    terms: ['Capacity is the time confirmed for this project. One person-day is one person’s working day, not a calendar day for the whole team.', 'Scope is what you promise to deliver. Contingency is a reserve for unexpected work; the researcher uses all 8 tokens.', 'A usability test observes people trying a task. These five volunteers cannot establish how common a problem is across the whole audience.', 'A retrospective is a closing learning conversation. Feedback should describe observable work, its effect and a useful next step.'],
    recap: 'Follow how you assigned work, responded to changed capacity, used test evidence and supported the next project. Where did you change a promise rather than overload a person?',
  },
];
