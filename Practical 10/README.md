# Practical 10: Secure Login/Logout with Sessions, Role-Based Access, Timeout, and Remember-Me Token

## Academic Information
- **Course**: Web Development Frameworks (`ITUE203`)
- **Institution**: CHAROTAR UNIVERSITY OF SCIENCE AND TECHNOLOGY (CHARUSAT)
- **Faculty**: Faculty of Technology and Engineering (FTE) / CSPIT
- **Department**: Computer Engineering
- **Semester**: 3rd Semester, Academic Year 2026–27
- **Course Outcomes**: `CO1, CO5`

---

## 1. Aim / Objective
To design and implement a secure, session-driven authentication system in PHP featuring password verification using `password_verify()`, session fixation prevention via `session_regenerate_id(true)`, role-based access control (RBAC) with server-side authorization enforcement, automatic server-side inactivity session timeouts, and complete session invalidation upon logout.

---

## 2. Role-Based Access Control (RBAC) Matrix

| Portal Page / Route | Unauthenticated Visitor | Authenticated Student (`student`) | Authenticated Administrator (`admin`) |
|---|:---:|:---:|:---:|
| `login.php` | Allowed (Renders form) | Auto-redirects to `student.php` | Auto-redirects to `admin.php` |
| `student.php` | **Blocked** (Redirects to `login.php`) | **Allowed** (Renders student portal) | **Allowed** (Superuser view) |
| `admin.php` | **Blocked** (Redirects to `login.php`) | **Blocked** (Returns `403 Forbidden`) | **Allowed** (Renders executive console) |
| `logout.php` | Redirects to `login.php` | Destroys session &amp; cookies | Destroys session &amp; cookies |

---

## 3. Session Security Architecture

### A. Session Fixation Mitigation (`session_regenerate_id`)
When a user authenticates, their pre-login session ID is discarded and a new cryptographically random session identifier is issued immediately:
```php
session_regenerate_id(true); // 'true' deletes old session file from server
```

### B. Inactivity Timeout Enforcement
Every authenticated request invokes `checkSessionTimeout(900)`. If more than 15 minutes (900 seconds) have elapsed since the user's last interaction:
```php
if ((time() - $_SESSION['last_activity']) > 900) {
    session_unset();
    session_destroy();
    header('Location: login.php?error=timeout');
    exit;
}
$_SESSION['last_activity'] = time();
```

### C. Secure Cookie Flags
Cookies are restricted via PHP configuration:
```php
session_set_cookie_params([
    'lifetime' => 0,          // Expires on browser window close
    'path'     => '/',
    'httponly' => true,       // Neutralizes XSS session hijacking via document.cookie
    'samesite' => 'Lax'       // Mitigates CSRF requests
]);
```

---

## 4. Documented Local Demo Accounts

| Role | Username / Identifier | Password | Destination Dashboard |
|:---:|---|---|:---:|
| **Administrator** | `admin@studenthub.edu` (or `admin`) | `Admin@123` | `admin.php` |
| **Student** | `25dce007@charusat.edu.in` (or `avibeladiya`) | `Student@123` | `student.php` |
| **Faculty** | `faculty@studenthub.edu` (or `dr_sharma`) | `Faculty@123` | `student.php` |

---

## 5. File Structure
```
Practical 10/
├── login.php        # Login form, password_verify() & role redirection
├── logout.php       # Complete session destruction & cookie invalidation
├── auth.php         # RBAC middleware, timeout checker & 403 error page
├── admin.php        # Protected administrator management portal
├── student.php      # Protected student portal with RBAC test trigger
├── db.php           # PDO database connection module
├── style.css        # Responsive dashboard styling
└── README.md        # Comprehensive documentation and viva preparation
```

---

## 6. How to Run in XAMPP
1. Import `database/studenthub.sql` into phpMyAdmin (if not already completed in Practical 8).
2. Open:
   ```
   http://localhost/StudentHub/Practical%2010/login.php
   ```
3. Test login with `admin@studenthub.edu` $\rightarrow$ verifies redirect to `admin.php`.
4. Log out, then log in with `25dce007@charusat.edu.in` $\rightarrow$ verifies redirect to `student.php`.
5. While logged in as a student, attempt to manually navigate to `admin.php` $\rightarrow$ observe the `403 Forbidden` access denied screen.

---

## 7. Verification Test Suite

| Test ID | Scenario Tested | Action / Credentials | Expected Outcome | Status |
|:---:|---|---|---|:---:|
| **TC-01** | Invalid Password | Valid username + wrong password | Rejected with *"Invalid username/email or password"* without revealing which field failed. | **PASS** |
| **TC-02** | Admin Authentication | `admin@studenthub.edu` / `Admin@123` | `password_verify` succeeds; session regenerated; redirected to `admin.php`. | **PASS** |
| **TC-03** | Student Authentication | `25dce007@charusat.edu.in` / `Student@123` | Session regenerated; redirected to `student.php`. | **PASS** |
| **TC-04** | Direct URL Protection | Unauthenticated visit to `admin.php` | Intercepted by `requireRole()`; redirected to `login.php?error=unauthorized`. | **PASS** |
| **TC-05** | Unauthorized Role Access | Logged-in student visits `admin.php` | Intercepted; returns `403 Forbidden` Access Denied page. | **PASS** |
| **TC-06** | Session Invalidation | Click "Log Out" | Session destroyed on server; cookie expired; redirected to `login.php?logout=success`. | **PASS** |
| **TC-07** | Inactivity Timeout | Fast-forward `last_activity` > 900s | Next request redirects to `login.php?error=timeout`. | **PASS** |

---

## 8. Viva Questions & Answers

**Q1: How does `password_verify()` work internally in PHP?**  
*Answer:* `password_verify($password, $hash)` extracts the salt, cost, and algorithm parameters from the stored 60-character hash string, re-hashes the user's submitted password using those identical parameters, and performs a timing-safe comparison between the two digests.

**Q2: What is Session Fixation and how is it prevented?**  
*Answer:* In a session fixation attack, an adversary tricks a victim into using a known session ID (e.g., via a phishing link). When the victim logs in, the attacker uses that same session ID to hijack their account. Calling `session_regenerate_id(true)` immediately after login generates a brand-new ID and destroys the old one, neutralizing the attack.

**Q3: Why is hiding a navigation link insufficient for Role-Based Access Control?**  
*Answer:* "Security through obscurity" is not security. Anyone can inspect HTML or manually enter an admin URL (e.g., `admin.php`). True RBAC must be strictly enforced server-side before executing privileged controller logic or outputting private data.

**Q4: Why should login failure messages not specify whether the username or password was incorrect?**  
*Answer:* Revealing that "Username does not exist" allows attackers to harvest and enumerate valid registered accounts. A generic message like *"Invalid username/email or password"* protects user privacy.

**Q5: What is the significance of the `httponly` flag on session cookies?**  
*Answer:* The `httponly` flag instructs the browser that the cookie must not be accessed via client-side scripts (such as `document.cookie`). If an attacker finds an XSS vulnerability on the site, they still cannot steal the session cookie.
