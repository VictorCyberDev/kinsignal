# KinSignal — Safety, when you need it

**When something doesn't feel right, know what to do next.**

KinSignal is an evolving global personal-safety companion. It helps people interpret uncertain situations through transparent warning signals, independently verify claims, follow protective actions, involve trusted people only with consent, document actions, explore country-specific sources and practice safer decisions.

**Website:** https://kinsignal.vercel.app/  
**Open engineering PR:** https://github.com/VictorCyberDev/kinsignal/pull/1  
**Complete current truth and blockers:** [Release coverage](docs/RELEASE_COVERAGE.md)

## Implemented demonstration
- Unified guest case creation and deterministic risk signals with uncertainty.
- ActionFlow tasks, completed-action history and case reassessment.
- Synthetic one-click demo scenarios; private notes and decision receipt export.
- User-controlled redacted support request (copy, not delivery).
- Offline-only URL parsing; privacy checkup; session/opt-in local Safety Passport.
- Safety Atlas with dated official starting points for 12 countries.
- Interactive scenario-based learning and public trust/terms explanations.
- Optional Supabase authentication and private case storage code; **inactive until an isolated project is configured**.
- GitHub CI, Chromium E2E tests, Axe automated accessibility check and real screenshot artifacts.
- Partial PWA public guidance caching; **never caches private cases by default**.

## Run locally
Requires Node.js 22+.

```bash
npm install
npm run typecheck
npm test
npm run build
npm run dev
```

For browser tests after installing Chromium:

```bash
npx playwright install chromium
npm run build
npm run test:e2e
```

## Cloud setup
Create a dedicated KinSignal Supabase project. Never reuse an unrelated production database. Apply the reviewed SQL migration from `supabase/migrations` only on the dedicated project, validate RLS with two distinct authenticated users, then configure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` securely in the hosting environment. Never expose service-role credentials.

## Product limits
This app is not an emergency service, professional safety assessor, antivirus scanner, identity certification system, or guaranteed fraud detector. **Do not enter passwords, OTPs, full payment credentials, private addresses or confidential evidence.**

The current public site is a **working guest demonstration**, not a completed production-safe global platform. External notification delivery, private evidence vault, authenticated support grants, full legal/content reviews, and the final hackathon submission are outstanding. See [the release coverage matrix](docs/RELEASE_COVERAGE.md), [architecture](docs/ARCHITECTURE.md) and [hackathon evidence](docs/HACKATHON_EVIDENCE.md).
