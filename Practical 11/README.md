# Practical 11: Student Management System with CRUD Operations

## Academic Information
- **Course**: Web Development Frameworks (`ITUE203`)
- **Institution**: CHAROTAR UNIVERSITY OF SCIENCE AND TECHNOLOGY (CHARUSAT)
- **Faculty**: Faculty of Technology and Engineering (FTE) / CSPIT
- **Department**: Computer Engineering
- **Semester**: 3rd Semester, Academic Year 2026–27
- **Course Outcomes**: `CO1, CO5`

---

## 1. Aim / Objective
To design and implement a comprehensive Student Management System using PHP and MySQLi providing complete Create, Read, Update, and Delete (CRUD) operations. The module features multi-parameter search (enrollment, name, email), department and status filtering, server-side pagination, strict input validation with CSRF defense, and sanitization-secured CSV data export.

---

## 2. Core Functional Modules

### A. Create (Add Student)
- Form at `add.php` collects enrollment number, full name, email, mobile, department, semester, academic year, CGPA, address, and status.
- Validates enrollment pattern (`^[0-9]{2}[A-Z]{2,4}[0-9]{3}$`), email syntax, and 10-digit mobile number.
- Checks uniqueness of enrollment number and email before insertion.
- Inserts record into MySQL via parameterized prepared statement:
  ```php
  $stmt = $mysqli->prepare("INSERT INTO students (student_id, name, email, ...) VALUES (?, ?, ?, ...)");
  $stmt->bind_param("ssss...", $studentId, $name, $email, ...);
  $stmt->execute();
  ```

### B. Read (Directory & Search)
- `index.php` queries the database with dynamic `WHERE` clauses.
- Supports combined filters: keyword search, department dropdown, and status filter.
- Implements pagination to display records smoothly (6 records per page default).

### C. Update (Edit Record)
- Form at `edit.php?id={id}` pre-populates existing student data.
- Prevents collisions by verifying that the revised enrollment or email is not already taken by another student (`AND id != ?`).
- Executes safe `UPDATE` prepared query.

### D. Delete (Remove Record)
- Handled via `delete.php` using HTTP `POST` requests and CSRF tokens.
- Displays browser JavaScript confirmation dialog before triggering deletion.
- Prevents accidental URL-based deletion (rejects `GET` requests).

### E. CSV Export
- `export.php` generates a downloadable CSV matching current search/filter conditions.
- Prepends UTF-8 Byte Order Mark (`\xEF\xBB\xBF`) for clean opening in Microsoft Excel.
- Neutralizes CSV formula injection by quoting values starting with `=`, `+`, `-`, or `@`.

---

## 3. File Structure
```
Practical 11/
├── index.php        # Student directory with search, filter, pagination, and action buttons
├── add.php          # Add new student form with real-time validation and prepared insertion
├── edit.php         # Edit existing student form with pre-population and duplicate checking
├── delete.php       # Secure POST deletion handler with CSRF verification
├── export.php       # Dynamic CSV export handler with anti-formula injection
├── db.php           # Centralized MySQLi connection helper with exception handling
├── students.sql     # Database schema and initial seed data
├── style.css        # Responsive, modern stylesheet matching StudentHub design
└── README.md        # Comprehensive documentation and viva preparation
```

---

## 4. Security Implementation Highlights

1. **SQL Injection Neutralization**:
   All database operations use MySQLi parameterized prepared statements (`prepare()`, `bind_param()`, `execute()`). Zero user inputs are concatenated directly into SQL queries.

2. **Cross-Site Request Forgery (CSRF)**:
   All state-mutating operations (`add.php`, `edit.php`, `delete.php`) enforce cryptographic token validation using `hash_equals()`.

3. **Cross-Site Scripting (XSS)**:
   Every dynamic field displayed in HTML tables and form values is escaped using `htmlspecialchars($val, ENT_QUOTES, 'UTF-8')`.

4. **CSV Injection Mitigation**:
   Exported cells starting with spreadsheet formula triggers (`=`, `+`, `-`, `@`) are prefixed with `'` to prevent remote command execution in desktop spreadsheet software.

---

## 5. How to Run

1. **Start Apache & MySQL**: Open XAMPP Control Panel and start Apache and MySQL services.
2. **Database Setup**:
   Import `students.sql` or the master database schema:
   ```bash
   mysql -u root -p studenthub < "e:/project/shub/Practical 11/students.sql"
   ```
3. **Access Portal**:
   Open browser and navigate to:
   ```
   http://localhost/shub/Practical%2011/index.php
   ```

---

## 6. Manual Test Checklist

| Test No. | Action | Expected Output | Status |
|:---:|---|---|:---:|
| **TC-01** | Open `index.php` | Displays list of students with pagination and action buttons | **PASS** |
| **TC-02** | Enter "25DCE007" in Search box | Filters table to only show Avi Beladiya | **PASS** |
| **TC-03** | Select Department "CE" | Displays only students from Computer Engineering | **PASS** |
| **TC-04** | Click "Add New Student" | Opens `add.php` form with accessible validation | **PASS** |
| **TC-05** | Submit form with duplicate email | Displays error: "A student with this Enrollment Number or Email already exists" | **PASS** |
| **TC-06** | Submit valid student | Redirects to `index.php` with green success notification | **PASS** |
| **TC-07** | Click "Edit" on a student | Opens `edit.php` pre-populated with student data | **PASS** |
| **TC-08** | Click "Delete" button | Triggers confirmation prompt; removes record on confirmation | **PASS** |
| **TC-09** | Click "Export to CSV" | Downloads `.csv` file containing filtered records formatted for Excel | **PASS** |

---

## 7. Viva Questions & Answers

**Q1: What does CRUD stand for?**  
*Answer:* CRUD stands for Create, Read, Update, and Delete. These represent the four fundamental operations performed on persistent database storage.

**Q2: Which database interface is used in Practical 11?**  
*Answer:* PHP MySQLi (MySQL Improved) extension in object-oriented mode, utilizing prepared statements for data safety.

**Q3: What fields are maintained for each student?**  
*Answer:* Primary key `id`, enrollment number (`student_id`), full name (`name`), email address, mobile number, course, branch, semester, academic year, CGPA, address, account status, and timestamp.

**Q4: How does Practical 11 defend against SQL Injection?**  
*Answer:* By separating the SQL query template from user data using `mysqli::prepare()` and binding values strictly via typed placeholders (`bind_param`), which prevents user input from altering query execution logic.

**Q5: Why is POST required for deletion instead of GET links?**  
*Answer:* Using `GET` links for deletion (e.g. `delete.php?id=5`) is vulnerable to CSRF attacks, accidental browser prefetching, and web crawlers that follow links. Using `POST` alongside a one-time CSRF token ensures only intentional user submissions can trigger record removal.
