# Security and privacy boundaries

- Guest cases are volatile in-memory state. Do not paste passwords, OTPs, card details, private addresses or safety-critical evidence.
- Registered persistence requires a dedicated KinSignal Supabase project and an explicitly applied migration.
- RLS enforces `auth.uid() = owner_id` across reads, writes, updates and deletes. Cross-user testing with real identities must occur before deployment.
- The invitations table is *not* an active sharing service. There is no recipient policy, token redemption or notification adapter yet.
- The resource directory is publicly readable only for reviewed and sourced entries. No public write permissions.
- Database exports, user consent, emergency escalation, regional legal compliance and specialist review are not yet commissioned.
- Evaluate SSR auth session refresh before adding privileged route handlers; do not use service-role keys in browsers.
- Never claim an AI warning is a fact, and never auto-visit user-provided links.
