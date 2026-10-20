# Practical 9: Secure User Registration with Database Insert, Duplicate Email Check, and Password Hashing

## Academic Information
- **Course**: Web Development Frameworks (`ITUE203`)
- **Institution**: CHAROTAR UNIVERSITY OF SCIENCE AND TECHNOLOGY (CHARUSAT)
- **Faculty**: Faculty of Technology and Engineering (FTE) / CSPIT
- **Department**: Computer Engineering
- **Semester**: 3rd Semester, Academic Year 2026–27
- **Course Outcomes**: `CO1, CO3, CO5`

---

## 1. Aim / Objective
To design and implement a secure user registration module using PHP, MySQLi, and MySQL that performs server-side input validation, checks for duplicate email addresses and usernames using prepared statements, applies cryptographic password hashing (`password_hash` with BCrypt), validates Cross-Site Request Forgery (CSRF) tokens, prevents SQL Injection, and logs security audit trail entries.

---

## 2. Security Architecture & Implementation Details

### A. Cryptographic Password Hashing (`password_hash`)
Plaintext passwords must never be stored in persistent storage:
```php
$hashedPassword = password_hash($password, PASSWORD_BCRYPT, ['cost' => 10]);
```
- **Algorithm**: BCrypt (`$2y$10$...`) creates a 60-character slow, adaptive hash.
- **Salt Generation**: Automatically generates a cryptographically secure, random 22-character salt for each user, defeating pre-computed rainbow table attacks.
- **Cost Factor**: Configured to `10` ($2^{10} = 1024$ key expansion rounds), balancing server responsiveness against brute-force resistance.

### B. Two-Tier Duplicate Checking via MySQLi Prepared Statements
Before executing an `INSERT` statement, the application runs parameterized `SELECT` queries to ensure uniqueness:
```php
// Check duplicate email
$stmt = $mysqli->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows > 0) {
    // Flag duplicate email error
}
$stmt->close();
```
Additionally, the database schema enforces `UNIQUE KEY` constraints on both `email` and `username`. Any concurrent collision triggers error code `1062`, which is caught and handled gracefully.

### C. CSRF Token Defense
Every rendered registration form embeds a cryptographically random, unguessable token:
```php
$_SESSION['csrf_token'] = bin2hex(random_bytes(32));
```
Upon form submission, `hash_equals($_SESSION['csrf_token'], $_POST['csrf_token'])` verifies that the request originated from an authentic user session rather than a cross-site malicious request.

---

## 3. File Structure
```
Practical 9/
├── register.php     # Unified registration form, CSRF token handling & processor
├── db_mysqli.php    # Object-oriented MySQLi connection module with error reporting
├── style.css        # Responsive stylesheet adhering to StudentHub brand
└── README.md        # Comprehensive documentation and viva preparation
```

---

## 4. How to Run in XAMPP
1. Ensure the `studenthub` database is imported in phpMyAdmin (from Practical 8).
2. Copy or link this project into your XAMPP web root:
   ```
   C:\xampp\htdocs\StudentHub\Practical 9\
   ```
3. Open:
   ```
   http://localhost/StudentHub/Practical%209/register.php
   ```
4. Test new registrations and duplicate checks. Verify in phpMyAdmin `users` table that passwords appear as `$2y$10$...` hashes.

---

## 5. Verification Test Suite

| Test ID | Test Scenario | Input Data | Expected Result | Status |
|:---:|---|---|---|:---:|
| **TC-01** | Missing Required Field | Empty username or email | Displays *"Username is required"* without database query. | **PASS** |
| **TC-02** | Invalid Email | `student@invalid` | Displays *"Email address format is invalid."* | **PASS** |
| **TC-03** | Weak Password | `abc123` | Displays *"Password must include uppercase, lowercase, number, and special character (min 8)."* | **PASS** |
| **TC-04** | Duplicate Email | `admin@studenthub.edu` | Checks database; displays *"An account with this email address already exists."* | **PASS** |
| **TC-05** | Duplicate Username | `admin` | Checks database; displays *"This username is already taken."* | **PASS** |
| **TC-06** | CSRF Tampering | Modifying hidden `csrf_token` value | Displays *"Security check failed: Invalid or expired CSRF token."* | **PASS** |
| **TC-07** | Valid Registration | Unique username & email, strong password | Row inserted into `users` with BCrypt hash; audit log entry recorded; success banner displayed. | **PASS** |

---

## 6. Viva Questions & Answers

**Q1: Why should legacy hashing algorithms like MD5 and SHA-1 never be used for passwords?**  
*Answer:* MD5 and SHA-1 are general-purpose, high-speed digest algorithms. Modern GPUs can compute billions of MD5/SHA-1 hashes per second, making brute-force and rainbow table lookups trivial. BCrypt is intentionally slow and CPU/memory-intensive, rendering mass cracking impractical.

**Q2: What is the purpose of `bind_param()` in MySQLi?**  
*Answer:* `bind_param()` binds PHP variables to the query placeholders (`?`) and declares their data types (`s` for string, `i` for integer, `d` for double, `b` for blob). The MySQL engine treats these bound variables as literal data, preventing user inputs from escaping into executable SQL commands.

**Q3: How does `hash_equals()` protect against timing attacks?**  
*Answer:* A standard string equality comparison (`===`) terminates as soon as the first mismatched byte is encountered, leaking execution time information that attackers can measure to guess secrets. `hash_equals()` compares strings in constant time, neutralizing timing side-channel attacks.

**Q4: What is the difference between client-side and database-level unique constraints?**  
*Answer:* A client-side or pre-insert check queries the database to see if a record exists. However, in a race condition (two requests submitted simultaneously), both checks might pass at the same millisecond. The database `UNIQUE` constraint acts as the ultimate source of truth, aborting duplicate inserts at the storage engine level.

**Q5: What happens when `password_hash()` creates a hash?**  
*Answer:* It generates a single 60-character string containing four delimited parts: the algorithm identifier (e.g. `$2y$`), the cost parameter (e.g. `$10$`), the 22-character random salt, and the computed hash digest.
