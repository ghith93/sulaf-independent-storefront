# Project Memory Policy

Store only durable, non-sensitive project context that is useful across tasks.

## Allowed
- Approved brand positioning and public product facts
- Public website decisions and design principles
- Task status, technical decisions, source links, and dated change notes
- Generic operating procedures

## Prohibited
- Passwords, access tokens, API keys, recovery codes, private customer information
- Confidential product formulas, laboratory records, supplier quotations, private financial records
- Personal sensitive information

## Structure
- `decisions/`: dated decision records
- `projects/`: project status and milestones
- `playbooks/`: repeatable procedures

Each record should include date, owner/role, status (proposed/approved/retired), rationale, and source/evidence. Public-repository memory is public; never place private business memory here.
