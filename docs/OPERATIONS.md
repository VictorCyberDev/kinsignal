# Deployment and operational controls

## Stage 1
1. Create a dedicated KinSignal Supabase project subject to organization choice and cost confirmation.
2. Run SQL migration on staging; inspect RLS and grants using Supabase advisors.
3. Configure URL + publishable key as environment variables in Vercel, not in source control.
4. Test two separate identities: user A cannot read, update, delete or insert as user B.
5. Only then enable registered-case storage in the user interface.
6. Confirm no contact or emergency notification can be sent inadvertently.
7. Run browser tests and independent privacy and safety review before public release.

## Incident response
For suspected data exposure, disable affected operations, preserve minimal audit evidence, rotate relevant credentials, investigate scope, assess notification obligations, fix and retest. Do not claim global regulatory compliance without legal review.

## Rollback
Roll back application deployment using the previous verified commit. Database migrations are additive; prefer a separate reviewed follow-up migration rather than dropping potentially sensitive records.
