# Practical 5: Registration Form with Frontend Validation and User-Friendly Error Handling

## Academic Information
- **Course**: Web Development Frameworks (`ITUE203`)
- **Institution**: CHAROTAR UNIVERSITY OF SCIENCE AND TECHNOLOGY (CHARUSAT)
- **Faculty**: Faculty of Technology and Engineering (FTE) / CSPIT
- **Department**: Computer Engineering
- **Semester**: 3rd Semester, Academic Year 2026–27
- **Course Outcomes**: `CO1, CO3`

---

## 1. Aim / Objective
To design and implement a comprehensive Student Registration Form for the StudentHub web portal featuring robust client-side validation using HTML5 input constraints, JavaScript Regular Expressions (Regex), a dynamic real-time password strength meter, inline contextual error notifications, accessible form attributes, and safe demonstration feedback without persisting plaintext credentials client-side.

---

## 2. Requirements & Form Fields

| Field Name | HTML5 Input Type | Validation Rules & Criteria | Error Message Displayed |
|---|---|---|---|
| **Full Name** | `type="text"` | Minimum 3 characters; alphabetic letters & spaces only (`/^[a-zA-Z\s]{3,50}$/`) | *"Full name must contain letters and spaces only (min 3 chars)."* |
| **Email Address** | `type="email"` | Valid standard email pattern (`/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`) | *"Please enter a valid email address."* |
| **Mobile Number** | `type="tel"` | Exactly 10 digits starting with 6, 7, 8, or 9 (`/^[6-9]\d{9}$/`) | *"Must be a valid 10-digit mobile number starting with 6-9."* |
| **Gender** | `type="radio"` | At least one radio button selected (Male, Female, Other) | *"Please select your gender."* |
| **Course** | `<select>` | Valid non-empty selection from engineering programs | *"Please select an engineering branch."* |
| **Academic Year** | `<select>` | Valid selection (1st, 2nd, 3rd, 4th Year) | *"Please select your current academic year."* |
| **Password** | `type="password"` | Min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special character | *"Password must satisfy all 5 requirements listed above."* |
| **Confirm Password** | `type="password"` | Must match password field value exactly | *"Passwords do not match."* |
| **Terms & Conditions**| `type="checkbox"` | Checkbox must be explicitly checked | *"You must accept the terms and conditions to register."* |

---

## 3. Password Strength Meter Scoring
The password strength calculation analyzes 5 discrete security criteria:
1. **Length**: $\ge 8$ characters.
2. **Uppercase**: Contains at least one $[A-Z]$.
3. **Lowercase**: Contains at least one $[a-z]$.
4. **Number**: Contains at least one $[0-9]$.
5. **Special Symbol**: Contains at least one $[!@\#\$\%\^\&\*\(\),\.?":\{\}|<>_\-+=]$.

| Score | Rating | Color Code | Bar Width | Rule State |
|:---:|:---:|:---:|:---:|---|
| **0** | None | Transparent | `0%` | Unchecked |
| **1 – 2** | Weak | Red (`#dc2626`) | `30%` | Insufficient complexity |
| **3** | Fair | Orange (`#ea580c`) | `60%` | Missing symbols or numbers |
| **4** | Good | Blue (`#0284c7`) | `80%` | Almost complete |
| **5** | Strong | Green (`#16a34a`) | `100%` | Fully compliant &amp; secure |

---

## 4. File Structure
```
Practical 5/
├── index.html       # Accessible student registration form
├── style.css        # Responsive form styles, error indicators, strength meter
├── script.js        # Comprehensive regex validation and dynamic UI handlers
└── README.md        # Lab documentation, test suite, and viva preparation
```

---

## 5. How to Run
1. Open `Practical 5/index.html` in any modern web browser or start a local dev server.
2. Attempt submitting the empty form to observe all inline error highlights and automatic smooth scrolling to the first invalid field.
3. Test valid entries and real-time password strength meter feedback.

---

## 6. Validation Test Suite (Valid vs Invalid Cases)

| Test ID | Field Tested | Input Value | Expected Validation Result | Status |
|:---:|---|---|---|:---:|
| **TC-01** | Full Name | `"A1"` | **Rejected**: Less than 3 chars and contains digits | **PASS** |
| **TC-02** | Full Name | `"Avi Beladiya"` | **Accepted**: Valid alphabetic string | **PASS** |
| **TC-03** | Email | `"student@"` | **Rejected**: Incomplete domain | **PASS** |
| **TC-04** | Email | `"25dce007@charusat.edu.in"`| **Accepted**: Valid academic email format | **PASS** |
| **TC-05** | Mobile | `"1234567890"` | **Rejected**: Does not begin with 6, 7, 8, or 9 | **PASS** |
| **TC-06** | Mobile | `"9876543210"` | **Accepted**: Valid 10-digit Indian mobile number | **PASS** |
| **TC-07** | Password | `"pass123"` | **Rejected**: Strength meter = Weak; missing uppercase & symbol | **PASS** |
| **TC-08** | Password | `"Charusat@2026"` | **Accepted**: Strength meter = Strong (100% green); all 5 rules checked | **PASS** |
| **TC-09** | Confirm Pwd | `"Charusat@2025"` | **Rejected**: Value does not match password | **PASS** |
| **TC-10** | Confirm Pwd | `"Charusat@2026"` | **Accepted**: Value matches password exactly | **PASS** |
| **TC-11** | Terms Checkbox | `Unchecked` | **Rejected**: Form submission blocked | **PASS** |
| **TC-12** | Form Submit | All valid inputs | **Success Card Displayed** with sanitized summary | **PASS** |

---

## 7. Viva Questions & Answers

**Q1: What is client-side form validation and why is it important?**  
*Answer:* Client-side validation checks user inputs in the web browser before submitting data across the network to a web server. It provides immediate user feedback, improves user experience (UX), reduces network bandwidth consumption, and prevents unnecessary server processing.

**Q2: Does client-side validation replace server-side validation?**  
*Answer:* **No.** Client-side validation is solely for user convenience. Malicious users can easily bypass frontend scripts (e.g., using Postman, curl, or disabling JavaScript). Server-side validation is mandatory for application security and data integrity.

**Q3: How does the Regular Expression `^[6-9]\d{9}$` validate an Indian mobile number?**  
*Answer:* 
- `^` asserts the start of the string.
- `[6-9]` restricts the first digit to 6, 7, 8, or 9 (valid Indian telecom mobile prefixes).
- `\d{9}` requires exactly nine consecutive digits following the first digit.
- `$` asserts the end of the string, ensuring no extra trailing characters exist.

**Q4: What is the purpose of the `novalidate` attribute on the `<form>` tag?**  
*Answer:* The `novalidate` attribute disables the browser's native default tooltips (which look inconsistent across different browsers and operating systems) so that custom JavaScript validation and custom-styled inline error messages can take full control.

**Q5: How is accessibility preserved in custom error displays?**  
*Answer:* Each input is bound to its error message via `aria-describedby="fieldError"`. When an error is triggered, `aria-invalid="true"` is set on the input, and the error container has `role="alert"` so assistive technologies immediately announce the error condition.
