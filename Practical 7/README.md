# Practical 7: PHP Form Processing with Server-Side Validation and CSV/JSON File Storage

## Academic Information
- **Course**: Web Development Frameworks (`ITUE203`)
- **Institution**: CHAROTAR UNIVERSITY OF SCIENCE AND TECHNOLOGY (CHARUSAT)
- **Faculty**: Faculty of Technology and Engineering (FTE) / CSPIT
- **Department**: Computer Engineering
- **Semester**: 3rd Semester, Academic Year 2026–27
- **Course Outcomes**: `CO1, CO5`

---

## 1. Aim / Objective
To design and implement a server-side web application using PHP to process HTTP POST form submissions, execute server-side validation and sanitization, neutralize CSV formula injection vulnerabilities, manage concurrent file locking (`flock`), and securely store structured records in flat files (`students.csv` and `students.json`) with an interactive data viewer.

---

## 2. Requirements & Security Measures

### A. Server-Side Validation Rules
Client-side validation can be bypassed by malicious actors. Therefore, PHP validates all constraints independently on the server:
- **Full Name**: Required, length between 3 and 50 characters, letters and spaces only (`preg_match('/^[a-zA-Z\s]+$/')`).
- **Enrollment Number**: Required, matches university pattern (e.g. `25DCE007`) (`preg_match('/^[0-9]{2}[A-Z]{2,4}[0-9]{3}$/')`).
- **Email Address**: Validated using `filter_var($email, FILTER_VALIDATE_EMAIL)`.
- **Mobile Number**: 10 digits starting with 6–9 (`preg_match('/^[6-9]\d{9}$/')`).
- **Academic Department**: Validated against an explicit whitelist (`['CE', 'IT', 'AI & DS', 'EC', 'ME', 'CL']`).
- **Semester**: Integer range check between 1 and 8 (`filter_var(..., FILTER_VALIDATE_INT, ['min_range' => 1, 'max_range' => 8])`).

### B. Prevention of CSV Formula Injection
Spreadsheet programs like Microsoft Excel and LibreOffice Calc execute cells beginning with `=`, `+`, `-`, or `@` as formulas or dynamic Data Exchange (DDE) commands. Our sanitization routine checks the first character and prepends a single quote (`'`), ensuring spreadsheet software parses the cell as inert text.

### C. Concurrency & Safe File Locking (`flock`)
To prevent data corruption caused by simultaneous user requests:
```php
$csvHandle = fopen($csvFile, 'a');
if (flock($csvHandle, LOCK_EX)) {
    fputcsv($csvHandle, $csvRow);
    flock($csvHandle, LOCK_UN);
}
fclose($csvHandle);
```

### D. Post-Redirect-Get (PRG) Pattern
After validating and storing data, `process.php` issues an HTTP `302 Found` redirect back to `index.php` with session flash messages. This prevents duplicate record submissions when a user refreshes the browser.

---

## 3. File Structure
```
Practical 7/
├── index.php        # Student admission form with session alerts & pre-population
├── process.php      # Server-side validation, sanitization & file storage controller
├── view_data.php    # HTML tabular viewer for records in students.csv and students.json
├── students.csv     # Flat CSV storage file with safe header
├── students.json    # Structured JSON array storage file
├── style.css        # Responsive interface matching StudentHub design
└── README.md        # Comprehensive documentation and viva preparation
```

---

## 4. How to Run in XAMPP
1. Copy or link this practical folder into your local XAMPP `htdocs` directory:
   ```
   C:\xampp\htdocs\StudentHub\Practical 7\
   ```
2. Start the **Apache** server from the **XAMPP Control Panel**.
3. Open your web browser and navigate to:
   ```
   http://localhost/StudentHub/Practical%207/
   ```
4. Fill out the form and submit. Inspect both `index.php` success alerts and `view_data.php` to observe newly appended records.

---

## 5. Verification Test Suite

| Test ID | Scenario Tested | Submitted Input | Expected Behavior | Status |
|:---:|---|---|---|:---:|
| **TC-01** | Direct GET Access | Navigating to `process.php` directly | Returns `405 Method Not Allowed` with error text. | **PASS** |
| **TC-02** | Missing Required Field | Empty Full Name submitted | Redirects to `index.php` with alert *"Full name is required"*; preserves other inputs. | **PASS** |
| **TC-03** | Invalid Email | `student.charusat` | Redirects with alert *"Email address is invalid."* | **PASS** |
| **TC-04** | Invalid Mobile | `5551234567` | Redirects with alert *"Mobile number must be exactly 10 digits starting with 6, 7, 8, or 9."* | **PASS** |
| **TC-05** | Formula Injection | Name = `=cmd|' /C calc'!A0` | Appended to CSV with leading apostrophe `'=cmd...`; spreadsheet opens safely without executing code. | **PASS** |
| **TC-06** | Successful Submit | Valid student info (Avi Beladiya, 25DCE007) | Redirects with green success alert; row appended to `students.csv` and `students.json`. | **PASS** |
| **TC-07** | Records Inspection | Open `view_data.php` | Both CSV and JSON tables render stored student row with escaped HTML entities. | **PASS** |

---

## 6. Viva Questions & Answers

**Q1: What is the Post-Redirect-Get (PRG) pattern and why is it essential?**  
*Answer:* PRG is a web development design pattern where a form submission via HTTP POST redirects to a GET request upon completion. It eliminates the *"Confirm Form Resubmission"* browser warning on reload and prevents duplicate database/file entries.

**Q2: What is CSV Formula Injection (Formula / DDE Injection)?**  
*Answer:* When untrusted user input starts with characters like `=`, `+`, `-`, or `@`, spreadsheet software interprets the value as an executable formula or command rather than raw text. Attackers can execute arbitrary local shell commands or exfiltrate private data. It is mitigated by prefixing user inputs with a single quote (`'`).

**Q3: Why is `flock()` necessary during PHP file writes?**  
*Answer:* Web servers handle multiple concurrent HTTP requests in parallel threads or worker processes. Without file locking (`LOCK_EX`), two simultaneous requests could write to the same file simultaneously, truncating content or producing corrupted, overlapping records.

**Q4: What is the difference between `htmlspecialchars()` and `strip_tags()`?**  
*Answer:* `strip_tags()` strips out HTML and PHP tags from a string entirely. `htmlspecialchars()` converts special characters (like `<`, `>`, `&`, `"`, `'`) into their corresponding HTML entities (e.g. `&lt;`, `&gt;`), preserving text content while neutralizing Cross-Site Scripting (XSS).

**Q5: How does `$_SESSION` maintain state across HTTP requests?**  
*Answer:* Because HTTP is stateless, PHP assigns each client a unique session identifier stored in a cookie (`PHPSESSID`). The server stores session variables on its local filesystem or cache keyed by that ID, retrieving the session data on subsequent requests.
