# StudentHub Portal — Requirement Analysis

## 1. Project Overview

StudentHub Portal is a multi-role academic management web platform for a
college/university setting (DEPSTAR, CHARUSAT context). It replaces
scattered spreadsheets, WhatsApp groups, and paper notices with a single
web app where **Students**, **Faculty**, and **Admins** each get a
dashboard tailored to what they need to do.

**Problem it solves:**
- Students have no single place to check attendance %, grades, timetable,
  fee status, and notices — this information is currently spread across
  faculty announcements, physical notice boards, and separate ERP modules.
- Faculty spend manual effort taking attendance on paper/Excel and
  re-entering it, and have no quick way to broadcast a notice to just
  their sections.
- Admins lack a single console to manage users, courses, timetables, and
  see institution-wide reports (fee defaulters, attendance trends,
  enrollment numbers).

**Tech constraint (from scaffold):** plain HTML/CSS/JavaScript front end,
no framework — so requirements below are written to be deliverable with
static/vanilla JS pages plus a simple backend/data layer (can be mocked
with JSON/localStorage for the semester submission, or a real backend
later).

## 2. Objectives

1. Provide role-based dashboards for Student, Faculty, and Admin.
2. Digitize attendance capture and viewing.
3. Centralize grades, timetable, notices, and resources per course.
4. Give Admin a management console for users, courses, and reports.
5. Ship a minimum of 10 pages (actual inventory: 20 pages) with a
   consistent navbar/footer and role-aware navigation.

## 3. Scope

### In Scope
- Public marketing/info pages (Home, About, Features, Contact, FAQ).
- Auth flow (Login, Register) — role selected at login or assigned by Admin.
- Student, Faculty, and Admin dashboards and all sub-pages listed in the sitemap.
- Shared "Course Detail" page rendered differently per role.
- Static/mock data layer for the semester deliverable (JSON files or
  localStorage), structured so it can be swapped for a real API later.

### Out of Scope (for this semester submission)
- Payment gateway integration (Fee Status page will show data, not process live transactions).
- Real-time chat infrastructure for Messages (can be simulated with static/mock threads).
- Mobile native apps.
- Automated timetable generation/optimization (timetable is admin-entered, not algorithmically generated).
- Third-party LMS/plagiarism-checker integrations.

## 4. User Roles

| Role | Description | Primary Goals |
|---|---|---|
| **Visitor (unauthenticated)** | Anyone landing on the public site | Learn about the platform, find contact/FAQ info, reach Login/Register |
| **Student** | Enrolled student | Track attendance, grades, timetable, assignments, fees, notices |
| **Faculty** | Teaching staff | Mark attendance, upload grades, manage assignments/resources, message students, post notices |
| **Admin** | Institution administrator | Manage users/courses/timetable, view reports, manage fees & library, publish announcements |

## 5. Functional Requirements

### 5.1 Public Site
| ID | Requirement |
|---|---|
| FR-01 | Visitor can view Home page with platform overview and CTA to Login/Register |
| FR-02 | Visitor can view About page describing the platform/institution |
| FR-03 | Visitor can view Features page listing platform capabilities per role |
| FR-04 | Visitor can view Contact page with a contact form / institution contact details |
| FR-05 | Visitor can view FAQ page with common questions |
| FR-06 | Visitor can navigate to Login or Register from any public page |

### 5.2 Authentication
| ID | Requirement |
|---|---|
| FR-07 | User can register with name, email/enrollment ID, password, and role (or role assigned by Admin post-registration) |
| FR-08 | User can log in with credentials; system redirects to the correct role dashboard |
| FR-09 | System validates required fields and shows inline errors on Login/Register |
| FR-10 | Authenticated session persists across pages (until logout) |
| FR-11 | Unauthenticated users attempting to access a dashboard page are redirected to Login |

### 5.3 Student Module
| ID | Requirement |
|---|---|
| FR-12 | Student Dashboard shows summary cards: attendance %, current grades/CGPA snapshot, pending assignments count, next class |
| FR-13 | My Courses lists all enrolled courses; clicking one opens Course Overview |
| FR-14 | Course Overview (Student view) shows syllabus/description, read-only, links to that course's Assignments, Attendance, Grades, Resources |
| FR-15 | Assignments (per course) lists assignment title, due date, submission status, and allows file upload before due date |
| FR-16 | Attendance (per course) shows date-wise present/absent log and overall % for that course |
| FR-17 | Grades (per course) shows marks/grades per assessment component |
| FR-18 | Resources (per course) lists downloadable materials faculty has uploaded |
| FR-19 | Timetable shows a weekly grid of the student's classes |
| FR-20 | Library shows book search/availability and the student's currently issued items |
| FR-21 | Messages lets student view/send messages to faculty |
| FR-22 | Notices shows institution/course notices, newest first |
| FR-23 | Fee Status shows fee structure, amount paid/due, and due dates |
| FR-24 | Notifications shows a feed of system alerts (low attendance warning, new grade posted, new notice) |
| FR-25 | Profile lets student view/edit personal details and change password |

### 5.4 Faculty Module
| ID | Requirement |
|---|---|
| FR-26 | Faculty Dashboard shows summary cards: today's classes, pending grade uploads, unread messages |
| FR-27 | My Courses lists courses/sections the faculty teaches |
| FR-28 | Students (per course) lists enrolled roster with contact info |
| FR-29 | Attendance (per course) lets faculty select date/section and mark each student Present/Absent, then submit |
| FR-30 | Assignments (per course) lets faculty create/edit assignments and view submission status per student |
| FR-31 | Grades (per course) lets faculty enter/edit marks per student per assessment component |
| FR-32 | Resources (per course) lets faculty upload/remove course materials |
| FR-33 | Timetable shows the faculty's own weekly teaching schedule |
| FR-34 | Messages lets faculty view/send messages to students |
| FR-35 | Notices lets faculty post a notice scoped to their course/section |
| FR-36 | Profile lets faculty view/edit personal details and change password |

### 5.5 Admin Module
| ID | Requirement |
|---|---|
| FR-37 | Admin Dashboard shows institution-wide stat cards: total students, total faculty, active courses, fee-pending alerts |
| FR-38 | Users page lets Admin create/edit/deactivate Student and Faculty accounts and assign roles |
| FR-39 | Courses page lets Admin create/edit courses and sections and assign faculty |
| FR-40 | Timetable (Admin) lets Admin create/edit the master timetable across all sections |
| FR-41 | Attendance (Admin) lets Admin view institution-wide attendance reports/filters |
| FR-42 | Grades (Admin) lets Admin view grade reports across courses |
| FR-43 | Fees page lets Admin manage fee structures and view defaulter lists |
| FR-44 | Library page lets Admin manage book inventory and issue/return records |
| FR-45 | Reports page lets Admin generate/export enrollment, attendance, and fee reports |
| FR-46 | Announcements lets Admin publish institution-wide notices visible to all roles |
| FR-47 | Settings lets Admin configure institution-level options (academic year, sections, etc.) |
| FR-48 | Profile lets Admin view/edit personal details and change password |

### 5.6 Shared / Cross-cutting
| ID | Requirement |
|---|---|
| FR-49 | A persistent, role-aware navbar and footer render on every authenticated page |
| FR-50 | Notices/Announcements published by Admin appear across Student and Faculty Notices pages |
| FR-51 | Course Detail is a single template that renders read-only widgets for Student and edit/roster widgets for Faculty, based on logged-in role |
| FR-52 | Logout is accessible from every authenticated page and clears the session |

## 6. Page → Requirement Mapping (Full Inventory, 20 Pages)

| # | Page | Role(s) | Requirement IDs |
|---|---|---|---|
| 1 | Home | Public | FR-01 |
| 2 | About | Public | FR-02 |
| 3 | Features | Public | FR-03 |
| 4 | Contact | Public | FR-04 |
| 5 | FAQ | Public | FR-05 |
| 6 | Login | Public | FR-08, FR-09, FR-10 |
| 7 | Register | Public | FR-07, FR-09 |
| 8 | Student Dashboard | Student | FR-12 |
| 9 | My Courses (+ Course Overview / Assignments / Attendance / Grades / Resources) | Student | FR-13–FR-18 |
| 10 | Timetable (Student) | Student | FR-19 |
| 11 | Library (Student) | Student | FR-20 |
| 12 | Messages (Student) | Student | FR-21 |
| 13 | Notices (Student) | Student | FR-22, FR-50 |
| 14 | Fee Status | Student | FR-23 |
| 15 | Notifications | Student | FR-24 |
| 16 | Profile (Student) | Student | FR-25 |
| 17 | Faculty Dashboard | Faculty | FR-26 |
| 18 | My Courses (+ Students / Attendance / Assignments / Grades / Resources) | Faculty | FR-27–FR-32 |
| 19 | Timetable (Faculty) | Faculty | FR-33 |
| 20 | Messages (Faculty) | Faculty | FR-34 |
| 21 | Notices (Faculty) | Faculty | FR-35, FR-50 |
| 22 | Profile (Faculty) | Faculty | FR-36 |
| 23 | Admin Dashboard | Admin | FR-37 |
| 24 | Users | Admin | FR-38 |
| 25 | Courses | Admin | FR-39 |
| 26 | Timetable (Admin) | Admin | FR-40 |
| 27 | Attendance (Admin) | Admin | FR-41 |
| 28 | Grades (Admin) | Admin | FR-42 |
| 29 | Fees | Admin | FR-43 |
| 30 | Library (Admin) | Admin | FR-44 |
| 31 | Reports | Admin | FR-45 |
| 32 | Announcements | Admin | FR-46, FR-50 |
| 33 | Settings | Admin | FR-47 |
| 34 | Profile (Admin) | Admin | FR-48 |

> Note: rows 9 and 18 each bundle 5 sub-pages (Course Overview/Students,
> Assignments, Attendance, Grades, Resources), which is why the sitemap's
> "20 pages total" collapses several of these table rows into one nested
> branch. Counted individually at the leaf level, the build totals ~30+
> screens/states — comfortably over the 10-page minimum either way.

## 7. Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Usability** | Consistent navbar/sidebar across all authenticated pages; role-aware links only show what that role can access; forms show inline validation errors |
| **Performance** | Pages should render key content within 2 seconds on a typical broadband connection (static assets, no heavy frameworks) |
| **Responsiveness** | Layout should be usable on tablet widths (≥768px) at minimum; mobile-friendly is a stretch goal |
| **Security** | Passwords never stored/displayed in plain text; role-based access control enforced (a Student cannot reach Admin/Faculty routes even via direct URL) |
| **Data Integrity** | Attendance/grades once submitted by Faculty should be editable only by that Faculty or Admin, with a visible "last updated" timestamp |
| **Maintainability** | Vanilla HTML/CSS/JS kept in a clear folder structure (per-role page folders, shared `components/` and `assets/`) so future teammates/reviewers can navigate it |
| **Accessibility** | Sufficient color contrast, semantic HTML tags, labelled form fields |
| **Browser Support** | Latest Chrome, Firefox, Edge (no IE support required) |

## 8. Assumptions

- One student belongs to exactly one section/batch at a time.
- One faculty can teach multiple courses/sections.
- Fee payment processing is out of scope; only fee **status** is displayed.
- For the semester deliverable, data can be served from static JSON/mock
  files rather than a live database; the folder structure should still
  separate "data" from "presentation" so a real backend can be swapped in
  later without a rewrite.

## 9. Constraints

- Must be built with plain HTML, CSS, and JavaScript (no frontend framework), per the existing project scaffold.
- Must ship within the semester timeline, following the week-by-week roadmap already defined for the project.
- Minimum 10 pages required by the assignment brief; this analysis targets the fuller 20-page sitemap already scoped.

## 10. Traceability Summary

- **52 functional requirements** (FR-01 to FR-52) covering Public, Auth, Student, Faculty, Admin, and Shared/cross-cutting behavior.
- **8 non-functional requirement categories.**
- **20-page sitemap** (34 rows in the full page-level mapping table when sub-pages are broken out), every page traceable to at least one FR.
