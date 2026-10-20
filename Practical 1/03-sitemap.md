# StudentHub Portal — Sitemap

HOME
│
├── About
├── Features
├── Contact
├── FAQ
├── Login
└── Register

Student Dashboard
│
├── Dashboard
├── My Courses
│   ├── Course Overview
│   ├── Assignments
│   ├── Attendance
│   ├── Grades
│   └── Resources
├── Timetable
├── Library
├── Messages
├── Notices
├── Fee Status
├── Notifications
└── Profile

Faculty Dashboard
│
├── Dashboard
├── My Courses
│   ├── Students
│   ├── Attendance
│   ├── Assignments
│   ├── Grades
│   └── Resources
├── Timetable
├── Messages
├── Notices
└── Profile

Admin Dashboard
│
├── Dashboard
├── Users
├── Courses
├── Timetable
├── Attendance
├── Grades
├── Fees
├── Library
├── Reports
├── Announcements
├── Settings
└── Profile


## Notes

- Login/Register are the only public authenticated-flow pages; Landing is
  fully public.
- "Course Detail" is a shared page rendered differently depending on
  viewer role (read-only for Student, roster/edit tools for Faculty).
- Every authenticated page shares a persistent navbar (role-aware links)
  and footer; Profile & Settings and Notices are reachable from all three
  dashboards.
- 20 pages total in the full inventory (see `02-requirement-analysis.md`
  section 6 for the requirement → page mapping), exceeding the 10-page
  minimum.
