# KinSignal — Your Personal Safety Companion

**Safety, when you need it.**

KinSignal is an experimental global personal-safety decision and response platform for SafeSpace Hacks 2026. It is not an emergency-service replacement.

## Implemented in the recovery branch
Interactive guest-mode demonstration backed by a deterministic TypeScript rule engine:
- Create a safety case and identify possible warning signals without claiming proof.
- Obtain contextual recommended actions and acknowledge their completion.
- Update a case while preserving earlier assessments and user action history.
- Export a transparent JSON decision receipt.
- Run six focused regression tests for assessment, false warnings, continuity and receipt truthfulness.

No external services or AI models are invoked. Guest cases are held **only in browser memory** and vanish on refresh. The demo does not verify real identities, URLs or message delivery.

## Running locally
Requires Node.js 22+.
```bash
npm install
npm run typecheck
npm test
npm run build
npm run dev
```
Open http://localhost:3000.

## Status
**Partial implementation, not production ready.** See [execution ledger](docs/EXECUTION_LEDGER.md). Test code is committed; test execution and passing results must still be independently verified.

Never enter passwords, one-time codes, financial secrets or private evidence into this demonstration.
