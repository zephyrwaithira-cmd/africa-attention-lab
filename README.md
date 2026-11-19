# Africa Attention Lab

React/Vite learning pilot: a hospital logistics case (15 minutes), policy (10), finance (15), talent (10), and reflection (10). Fictional characters, guided maps, authored consequences and local saving. Early completion is allowed. These are learning activities, not validated cognitive, clinical or employment assessments.

## Session collection

The app saves progress in the participant's browser. At the end of reflection, participants may explicitly agree to submit their current journey using a facilitator-issued collection code. It sends the participant code, hospital response, case decisions and notes, source-open events, timings, reflection and self-reported confidence to Supabase. The previous island prototype is excluded. JSON download remains available when offline or when submission fails.

The participant receives a server receipt. A retry with the same submission ID and unchanged payload returns the same receipt without adding another response. Expired activities retain their draft status; receiving a session does not mean every activity was completed. Source-open events do not prove reading. Responses and timings are participant-supplied and not independently verified.

Use participant codes rather than names and avoid sensitive personal details in free text. Browser storage is local to a website address and device. Clearing storage can remove saved progress and receipts.

## Facilitator dashboard

Choose **Facilitator sign-in** on the welcome screen, or add `#facilitator` to the website address. Use an account created in this project's Supabase Authentication users, not a GitHub or Supabase dashboard login. The account must also appear in `aal_facilitators`.

- Create a labelled group code; save it when displayed. Each code allows 100 submissions over seven days. Share it separately with the intended group. Anyone with the code can submit; it does not authenticate participant identity.
- Refresh received sessions, inspect decisions and reflections, and download individual JSON records.
- Close a code when collection ends. Closure does not delete previous responses.
- Sign out when finished. Authentication tokens are kept in page memory, not localStorage; refresh requires sign-in again.

Only approved facilitators can read responses. All approved facilitators in this project can see all groups; this is not a separate workspace per facilitator. Never publish session exports or facilitator passwords in GitHub. For a removal request, locate the session by its receipt ID in Supabase and delete only that confirmed record. Keep a documented retention period for your pilot.

## Configuration and database

`public/collection-config.json` contains a public project URL and publishable key. These identify the app; database grants, RLS, and functions enforce access. Never put a secret/service-role key or a password in this file.

For a new database, run `supabase/01-private-storage.sql`, create a facilitator in Authentication, add that user's UUID to `aal_facilitators` using the SQL editor, and run `supabase/02-access-and-submission.sql`. Test permissions and the full submission/review flow before enabling collection. These migrations are already installed in the current pilot project.

To suspend collection in the website, set `enabled` to `false` and rebuild. This does not revoke existing group codes: close those through the dashboard if submissions must stop at the database too. Keep the contact text accurate for your pilot. Supabase Free has quotas and may pause inactive projects; this app uses no paid AI API.

## Develop, test and publish

1. `npm install`
2. `npm run dev`
3. `npm test`
4. `npm run build:pages`

GitHub Pages serves the prebuilt `docs` folder from `main`. Commit both source changes and the rebuilt `docs` folder; keep `docs/.nojekyll`. The build uses relative asset links for the repository subpath. No test harness is included in the website build.

Before collecting real sessions, verify anonymous reads are denied, your facilitator can sign in, and a fictional completed session can be submitted and reviewed. Exclude participant code `SYSTEM-TEST-20261118` from research analysis: it is a synthetic connectivity test.
