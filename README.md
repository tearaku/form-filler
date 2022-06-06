# 簡易公文自動生產機
## Objectives / Roadmap
Quick checklist of things to be done, more will be added later
- [x] User profile page
    - [] Refactor: use spread syntax for fields that do not require post-processing (code looks nicer that way XD)
- [] API Routes
    - [] Error handling in DB accesses: website shouldn't die from an error!
        - EX: see "/api/department/index.ts" for example
    - [] Refactor: standardize responses -> to contain data (if any) & message for frontend to display status (success / error / etc.)
- [x] Event creation
    - [] Minor issue: field arrays -> requires multiple submit-clicks before they're registered as "inputted"
- [x] Event registration (as non-hosts)
- [] Pull department info into a separate page
    - [] Only admin (maybe just through direct db access? XD) & club leader can modify the settings here
    - [] Club leader should be able to transfer its position to someone else (via email? show that on header bar)
- [] Conforming to FB login requirement (deleting all user info on request)
    - [] Cascading deletes on all info linked to Account
- [] Switch out all the event-fetching SWRs w/ usage of store (ex: zustand)
- [] Add FAQ / help instructions (on ALL pages!)