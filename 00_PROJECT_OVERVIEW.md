# 00_PROJECT_OVERVIEW

## 1. Module Overview
The Bimal Institute ERP & LMS is a comprehensive platform designed to manage both the educational and professional lifecycle of traders. It serves as an ecosystem transitioning users from "learners" to "professional traders," leveraging a strict Role-Based Architecture.

## 2. Business Goals
- Provide a robust LMS for trading education.
- Offer professional tools (Trade Journal, AI Coach) for live market execution.
- Dynamically alter user experience based on expertise (Student vs. Trader).
- Manage subscriptions, KYC, and live events effectively.

## 3. Functional Requirements
- Role switching between `student` and `trader`.
- LMS with courses, live classes, and progress tracking.
- Trade journaling with PnL and Win Rate calculation.
- AI Coach for behavioral insights.
- Admin Panel for user, course, event, and financial management.

## 4. Non-Functional Requirements
- High security and data privacy (especially for KYC and financial data).
- Scalability to handle live classes and concurrent users.
- Low latency for real-time market updates and signals.

## 5. Database Design
A relational database (PostgreSQL) is recommended to handle complex relationships between users, courses, trades, and payments.

## 6. Prisma Schema
(N/A - This is a high-level overview; specific schemas will be in module docs)

## 7. Relationships
- User (1:N) Trades
- User (M:N) Courses (via Enrollments)
- User (1:1) KYC
- Batch (1:N) Users

## 8. Folder Structure
- `/frontend`: Next.js admin panel and web app.
- `/backend`: Node.js/Express API.
- `/mobile`: React Native / Expo app.
- `/docs`: Documentation.

## 9. Backend Architecture
Node.js with Express/NestJS, utilizing Prisma ORM, Redis for caching/queues, and JWT for authentication.

## 10. Frontend Architecture
Next.js for the Admin panel with a component library (e.g., Shadcn UI). React Native for the mobile application.

## 11. API Endpoints
(N/A - General overview; endpoints detailed in specific modules)

## 12. Request Validation
Zod or Joi validation on all incoming API requests (e.g., trade entry, user registration).

## 13. Permissions
Role-Based Access Control (RBAC): Admin, Instructor, Student, Trader.

## 14. UI Screens
- Mobile: Dashboard, Learn, Journal, AI Coach, Profile.
- Admin: User Management, Course Builder, Events, Financials, Analytics.

## 15. Components
Reusable UI components across Admin (Tables, Forms, Modals) and Mobile (Cards, Charts, Banners).

## 16. Forms
User Registration, KYC Upload, Trade Entry, Course Creation, Event Scheduling.

## 17. Tables
Data Grids in Admin Panel for Users, Trades, Payments, Audit Logs.

## 18. Search
Global search in Admin for users, courses, and trades.

## 19. Filters
Filter users by role, trades by date/instrument, courses by category.

## 20. Pagination
Offset or cursor-based pagination for tables and lists (trades, users).

## 21. Bulk Actions
Admin capabilities: Bulk enroll users, bulk delete trades, bulk export reports.

## 22. Notifications
Push notifications for live classes, AI Coach alerts, and subscription renewals.

## 23. Audit Logs
Tracking critical admin actions (e.g., role changes, KYC approvals).

## 24. Events
Webhooks for payment success/failure, course completion events.

## 25. Scheduler
Cron jobs for subscription expiry checks, AI coach analysis generation.

## 26. Queue
Background processing for video encoding (courses), mass email/push notifications.

## 27. Edge Cases
- User role changes mid-subscription.
- Handling missing trade journal entries for AI Coach.

## 28. Security Rules
- Strict KYC data access.
- Rate limiting on login and critical APIs.
- Data isolation between users.

## 29. Future Scope
- Live market data integration.
- Advanced community features (forums, chat).

## 30. AI Implementation Prompt
"You are tasked with building the foundational scaffolding for the Bimal Institute ERP & LMS. Initialize the monorepo structure with frontend (Next.js) and backend (Node.js/Prisma), setting up the core user roles (Student, Trader, Admin) and basic authentication flow."
