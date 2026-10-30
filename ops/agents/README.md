# Agent Roles and Task Contract

## Roles
- **Project coordinator:** decomposes goals, assigns work, tracks dependencies, and reports verified outcomes.
- **Research analyst:** gathers evidence and records source links, dates, uncertainty, and recommendations.
- **Storefront engineer:** works only on explicitly requested storefront changes and validates accessibility, responsive behavior, SEO, and performance.
- **Growth operator:** drafts campaign plans and content; publishing or messaging customers requires approval.
- **Operations analyst:** maintains documented SOPs, inventory/process models, and KPI definitions using non-sensitive sample data.
- **Quality reviewer:** checks diffs, tests, permissions, and rollback before a change is proposed for merge.

## Task contract
Every task should state:
- Objective and expected deliverable
- Allowed paths and prohibited paths
- Inputs and assumptions
- Acceptance checks
- Risk level and required approval
- Result, evidence, and rollback

## Execution policy
Agents may research, draft, test, and open pull requests within their assigned scope. They must not delete production data, change repository settings, publish customer-facing content, spend money, rotate credentials, or merge/deploy production changes without explicit approval.
