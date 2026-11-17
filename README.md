# Africa Attention Lab

A React/Vite learning prototype with a hospital logistics case, three guided individual cases and reflection. Original fictional scenarios, local browser persistence, JSON export, no paid API and no backend.

## Publish this upload package

1. Extract the ZIP on your computer.
2. Sign in to GitHub and create a **public** repository called **africa-attention-lab**. Public repositories support GitHub Pages on GitHub Free. You can initialise it with a README so the Add file button is visible.
3. Choose **Add file → Upload files**. Open the extracted folder and drag its **contents** into the upload area, not the ZIP and not the enclosing folder. Replace the initial README with this one. Commit the upload.
4. Confirm the repository root shows **src**, **docs** and **package.json**.
5. Open **Settings → Pages**. Choose **Deploy from a branch**, then **main** and **/docs**, and save.
6. Wait for GitHub to report the published address, then open it. It usually has the form https://YOUR-USERNAME.github.io/africa-attention-lab/.

The docs folder is already built with relative asset links, so publication does not require Node.js, dependency installation or a GitHub build workflow. Keep docs/.nojekyll in the upload. Files with a leading dot may be hidden by some file pickers.

GitHub’s instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## What is included

- Hospital: 15-minute collaborative logistics prototype on one device.
- Policy / OpenPath: 10-minute community map; invitations, budgets, attendance and evidence.
- Finance / Kijani: 15-minute workshop map; contracts, cash timing, quality and learning.
- Talent / BrightBridge: 10-minute studio map; work allocation, capacity, usability and feedback.
- Reflection: 10-minute space to connect the contexts and export the session.

These are maximum activity windows totalling 60 minutes; early completion is allowed and briefings/transitions are untimed. Choices have authored fictional consequences, not validated cognitive, personality or employment scores. There is no points-for-speed incentive.

Each map provides a briefing, character introductions, visible mission context, plain-language definitions, alternative plan previews and a recap. Use click, keyboard or drag for plan flags. Read two sources before committing. Policy requests notes at two checkpoints; finance and talent request a note each round.

## Sessions and data

Responses remain in localStorage in the participant’s browser. There is no facilitator database or automatic data collection. Export JSON to keep a separate copy. Use non-identifying participant codes. Source-open counts show opening, not comprehension.

To resume, return with the same browser and participant ID and continue from the hospital screen. Timers continue while away. Localhost data does not automatically move to GitHub Pages because it is a different website origin. Browser clearing or private-mode closure can remove saved sessions. This is a learning prototype, not a secure student-records system.

## Local development and later updates

Use a Node.js version supported by the included Vite dependency. Install with npm ci, run npm run dev, and check npm test. npm run build creates a local production build.

After changing source, run **npm run build:pages** and upload/commit the regenerated **docs** folder together with your source changes. Source edits alone do not update the prebuilt live website.

## Verification

17 automated tests passed, including 231 reachable case paths, financial preview reconciliation, affordability, persistence, expiry and complete export. The browser walkthrough completed the hospital, all 12 individual decisions and reflection. Click, keyboard, finance drag, disabled unaffordable choice, saved drafts and a 390-pixel layout were checked. Physical touch hardware has not been tested.

## Package boundaries

This upload contains app source and the built website. It excludes participant exports, machine-specific installers, node_modules and local backups. No online repository or live deployment has been created by this package.
