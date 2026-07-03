# TASK TRACKER — Bimal Institute ERP & LMS Documentation

Purpose: confirm, module by module, that nothing is missing. Update this
file every time a module document is finished. Do not mark a module ✅
until all 30 sub-sections are checked.

Legend: `[ ]` not started · `[~]` in progress · `[x]` done

---

## How to use this file

1. Pick the next `[ ]` module below.
2. Generate it using `MASTER_PROJECT_PROMPT.md`.
3. Tick off each of the 30 sections for that module as it's written.
4. Only flip the module's top-level box to `[x]` once all 30 are `[x]`.
5. If a section is intentionally skipped, write `[x] (N/A – reason)` — never
   leave it blank, so "skipped on purpose" is distinguishable from
   "forgotten."

---

## MODULE CHECKLIST

### Root
- [x] 00_PROJECT_OVERVIEW.md
  - [x] 1. Module Overview
  - [x] 2. Business Goals
  - [x] 3. Functional Requirements
  - [x] 4. Non-Functional Requirements
  - [x] 5. Database Design
  - [x] 6. Prisma Schema (N/A – Overview)
  - [x] 7. Relationships
  - [x] 8. Folder Structure
  - [x] 9. Backend Architecture
  - [x] 10. Frontend Architecture
  - [x] 11. API Endpoints (N/A – Overview)
  - [x] 12. Request Validation
  - [x] 13. Permissions
  - [x] 14. UI Screens
  - [x] 15. Components
  - [x] 16. Forms
  - [x] 17. Tables
  - [x] 18. Search
  - [x] 19. Filters
  - [x] 20. Pagination
  - [x] 21. Bulk Actions
  - [x] 22. Notifications
  - [x] 23. Audit Logs
  - [x] 24. Events
  - [x] 25. Scheduler
  - [x] 26. Queue
  - [x] 27. Edge Cases
  - [x] 28. Security Rules
  - [x] 29. Future Scope
  - [x] 30. AI Implementation Prompt
- [ ] 01_TECH_STACK.md
- [ ] 02_ARCHITECTURE.md

### core/
- [ ] 03_AUTHENTICATION.md
- [ ] 04_ROLES_PERMISSIONS.md
- [ ] 05_USERS.md
- [ ] 06_SETTINGS.md
- [ ] 07_MEDIA.md
- [ ] 08_AUDIT_LOGS.md
- [ ] 09_NOTIFICATIONS.md
- [ ] 10_COMMON_MODULE.md
- [ ] 11_SEARCH_FILTER.md
- [ ] 12_TABLE_SYSTEM.md

### lms/
- [ ] 13_COURSE_MANAGEMENT.md
- [ ] 14_CATEGORY_TAGS.md
- [ ] 15_MODULE_MANAGEMENT.md
- [ ] 16_LESSON_MANAGEMENT.md
- [ ] 17_CONTENT_BLOCKS.md
- [ ] 18_VIDEO_MANAGEMENT.md
- [ ] 19_QUIZ_SYSTEM.md
- [ ] 20_ASSIGNMENTS.md
- [ ] 21_CERTIFICATES.md
- [ ] 22_STUDENT_PROGRESS.md

### finance/
- [ ] 23_SUBSCRIPTIONS.md
- [ ] 24_PAYMENTS.md
- [ ] 25_COUPONS.md
- [ ] 26_INVOICES.md

### learning/
- [ ] 27_BATCHES.md
- [ ] 28_LIVE_CLASSES.md
- [ ] 29_ATTENDANCE.md
- [ ] 30_MY_COURSES.md

### trading/
- [ ] 31_TRADE_JOURNAL.md
- [ ] 32_AI_COACH.md
- [ ] 33_ANALYTICS.md

### marketing/
- [ ] 34_BANNERS.md
- [ ] 35_EVENTS.md
- [ ] 36_NOTIFICATIONS.md

### admin/
- [ ] 37_DASHBOARD.md
- [ ] 38_REPORTS.md
- [ ] 39_ACTIVITY_TIMELINE.md

### frontend/
- [ ] 40_FRONTEND_ARCHITECTURE.md
- [ ] 41_COMPONENT_LIBRARY.md
- [ ] 42_PAGES.md
- [ ] 43_UI_GUIDELINES.md

### backend/
- [ ] 44_BACKEND_ARCHITECTURE.md
- [ ] 45_API_GUIDELINES.md
- [ ] 46_DATABASE.md
- [ ] 47_PRISMA.md
- [ ] 48_EVENTS.md
- [ ] 49_QUEUE.md
- [ ] 50_SCHEDULER.md

### Root
- [ ] 99_FUTURE_ROADMAP.md

---

## PER-MODULE SECTION CHECKLIST (copy this block for the module you're on)

```
### <MODULE_NAME>.md
- [ ] 1. Module Overview
- [ ] 2. Business Goals
- [ ] 3. Functional Requirements
- [ ] 4. Non-Functional Requirements
- [ ] 5. Database Design
- [ ] 6. Prisma Schema
- [ ] 7. Relationships
- [ ] 8. Folder Structure
- [ ] 9. Backend Architecture
- [ ] 10. Frontend Architecture
- [ ] 11. API Endpoints
- [ ] 12. Request Validation
- [ ] 13. Permissions
- [ ] 14. UI Screens
- [ ] 15. Components
- [ ] 16. Forms
- [ ] 17. Tables
- [ ] 18. Search
- [ ] 19. Filters
- [ ] 20. Pagination
- [ ] 21. Bulk Actions
- [ ] 22. Notifications
- [ ] 23. Audit Logs
- [ ] 24. Events
- [ ] 25. Scheduler
- [ ] 26. Queue
- [ ] 27. Edge Cases
- [ ] 28. Security Rules
- [ ] 29. Future Scope
- [ ] 30. AI Implementation Prompt
```

---

## CROSS-CUTTING FEATURE COVERAGE (tick off per module as it's addressed)

Track which modules have explicitly stated how they integrate with each
platform-wide capability. A module isn't "done" if this row is blank for it.

| Module | Sidebar | Timeline | Recycle Bin | Version Hist. | Draft Flow | Search | Queue | Sockets | Feature Flags |
|---|---|---|---|---|---|---|---|---|---|
| 00_PROJECT_OVERVIEW | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A |
| 13_COURSE_MANAGEMENT | | | | | | | | | |
| 23_SUBSCRIPTIONS | | | | | | | | | |
| 31_TRADE_JOURNAL | | | | | | | | | |
| ... | | | | | | | | | |

(Add a row per module as you complete it; mark ✅/❌/N-A per column.)

---

## PROGRESS SUMMARY

- Total modules: 51
- Completed: 1
- In progress: 0
- Not started: 50

Update these counts manually each time you tick a module complete.
