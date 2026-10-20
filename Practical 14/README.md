# Practical 14: Admin Dashboard with Role-Based Access Control, Dynamic Menu, and Audit Log

## Academic Information
- **Course**: Web Development Frameworks (`ITUE203`)
- **Institution**: CHAROTAR UNIVERSITY OF SCIENCE AND TECHNOLOGY (CHARUSAT)
- **Faculty**: Faculty of Technology and Engineering (FTE) / CSPIT
- **Department**: Computer Engineering
- **Semester**: 3rd Semester, Academic Year 2026–27
- **Course Outcomes**: `CO1, CO5`

---

## 1. Aim / Objective
To design and develop an enterprise-grade Executive Admin Dashboard for the StudentHub portal featuring Role-Based Access Control (RBAC), dynamic database metric computations (live student counts, event tallies, latest event registrations), dynamic role-driven navigation menus, and a tamper-resistant security audit logging mechanism (`audit_logs`) tracking administrative events and user sessions.

---

## 2. Role-Based Access Control (RBAC) Matrix

| Portal Route | Unauthenticated Guest | Student Role (`student`) | Admin Role (`admin`) |
|---|:---:|:---:|:---:|
| `login.php` | Allowed (Renders login form) | Auto-redirects to Student Portal | Auto-redirects to `index.php` |
| `index.php` (Dashboard) | **Blocked** (Redirects to `login.php`) | **Blocked** (HTTP 403 Forbidden) | **Allowed** (Executive console) |
| Dynamic Navigation Menu | None | Student-scoped links only | Full administrative menu suite |
| `audit_logs` Recording | Logs failed login attempts | Logs standard student activity | Logs administrative operations |
| `logout.php` | Redirects to `login.php` | Terminates session &amp; logs audit | Terminates session &amp; logs audit |

---

## 3. Dynamic Database Analytics Architecture

All dashboard values are computed in real time using optimized SQL queries on MySQL tables:
1. **Registered Users**: `SELECT COUNT(*) FROM users`
2. **Enrolled Students**: `SELECT COUNT(*) FROM students`
3. **Active Events**: `SELECT COUNT(*) FROM events`
4. **Event Registrations**: `SELECT COUNT(*) FROM registrations`
5. **Latest Registrations**:
   ```sql
   SELECT r.id, r.status, r.registration_date, s.name, s.student_id, e.title, e.category 
   FROM registrations r 
   JOIN students s ON r.student_id = s.id 
   JOIN events e ON r.event_id = e.id 
   ORDER BY r.id DESC LIMIT 6;
   ```
6. **Departmental Breakdown**:
   ```sql
   SELECT branch, COUNT(*) AS cnt FROM students GROUP BY branch ORDER BY cnt DESC;
   ```

---

## 4. Audit Logging Mechanism (`audit_logs`)

All critical authentication and system state changes invoke the centralized `logAudit()` helper:
```php
logAudit($userId, $username, $action, $entityType, $entityId, $details);
```
- Captures actor identity, client IP address (`$_SERVER['REMOTE_ADDR']`), action code (e.g. `AUTH_LOGIN_SUCCESS`, `EVENT_CREATED`), and timestamp.
- Allows retrospective incident investigation, security tracing, and compliance reporting.

---

## 5. File Structure
```
Practical 14/
├── index.php         # Executive admin dashboard with dynamic KPIs, recent registrations & audit trail
├── login.php         # Secure login portal with role-switching test credentials
├── logout.php        # Session termination controller with audit logging
├── auth.php          # RBAC middleware (requireAdmin, session timeout, dynamic menu generator)
├── audit_logger.php  # Centralized audit logging utility function
├── db.php            # Secure PDO database connectivity helper
├── admin.sql         # Master database schema and comprehensive seed data
├── style.css         # Modern, responsive executive dashboard stylesheet
└── README.md         # Comprehensive documentation and viva preparation
```

---

## 6. How to Run

1. **Start Services**: Ensure Apache and MySQL are running in XAMPP.
2. **Database Import**:
   ```bash
   mysql -u root -p studenthub < "e:/project/shub/Practical 14/admin.sql"
   ```
3. **Access Dashboard**:
   Navigate to:
   ```
   http://localhost/shub/Practical%2014/login.php
   ```
4. **Test Role Enforcement**:
   - Log in using **Admin** credentials (`admin` / `Admin@123`): Grants access to `index.php`.
   - Log in using **Student** credentials (`avibeladiya` / `Student@123`): Attempting to visit `Practical 14/index.php` displays `HTTP 403 Forbidden`.

---

## 7. Manual Test Checklist

| Test No. | Action / Test Case | Expected Behavior | Status |
|:---:|---|---|:---:|
| **TC-01** | Visit `index.php` without logging in | Redirects to `login.php?error=unauthorized` | **PASS** |
| **TC-02** | Sign in as Student | Redirects to student portal; visiting `index.php` triggers `403 Forbidden` screen | **PASS** |
| **TC-03** | Sign in as Admin | Authenticates, regenerates session ID, loads `index.php` dashboard | **PASS** |
| **TC-04** | Dynamic Metrics | Verifies live count of users, students, events, registrations loaded via SQL queries | **PASS** |
| **TC-05** | Dynamic Menu | Sidebar presents administrative options (Students, Events, Async API, Audit Trail) | **PASS** |
| **TC-06** | Latest Registrations | Renders table of student enrollments joined from `students` and `events` | **PASS** |
| **TC-07** | Live Audit Trail | Displays live stream of recent logins and admin events | **PASS** |
| **TC-08** | Manual Event Recorder | Submitting event in dashboard immediately prepends new audit record to log stream | **PASS** |
| **TC-09** | Logout Action | Destroys session and cookie; logs `AUTH_LOGOUT` in `audit_logs`; redirects to login | **PASS** |

---

## 8. Viva Questions & Answers

**Q1: Are dashboard values loaded dynamically from the database?**  
*Answer:* Yes. Dashboard values are loaded dynamically from the database using SQL queries (`COUNT(*)`, `GROUP BY`, and multi-table `JOIN` statements). No statistics or counts are hardcoded.

**Q2: How is access restricted strictly to admin users?**  
*Answer:* The `requireAdmin()` middleware in `auth.php` verifies that the user is authenticated and that `$_SESSION['role'] === 'admin'`. If unauthenticated, the user is redirected to `login.php`. If authenticated with a non-admin role (such as student), the server responds with an HTTP 403 Forbidden status code.

**Q3: Are role-based menus working?**  
*Answer:* Yes. The `getDynamicMenu()` function inspects `$_SESSION['role']` and returns navigation links tailored to the user's role. Administrators see management links (Students, Events, Async API, Audit Trail), while students receive links for their profile, course roster, and registered events.

**Q4: Are important admin actions recorded in `audit_logs`?**  
*Answer:* Yes. Important admin actions (successful and failed logins, logouts, entity creations, updates, and deletions) are recorded in the `audit_logs` table via `logAudit()`, capturing the actor's user ID, username, action type, affected entity, details, client IP address, and timestamp.

**Q5: Why is session regeneration critical upon authentication?**  
*Answer:* `session_regenerate_id(true)` invalidates the pre-login session ID and replaces it with a new cryptographically random ID. This prevents session fixation attacks, where an attacker tricks a victim into using a known session identifier before authenticating.
