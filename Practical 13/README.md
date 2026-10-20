# Practical 13: PHP JSON API and AJAX/Fetch-Based CRUD without Page Reload

## Academic Information
- **Course**: Web Development Frameworks (`ITUE203`)
- **Institution**: CHAROTAR UNIVERSITY OF SCIENCE AND TECHNOLOGY (CHARUSAT)
- **Faculty**: Faculty of Technology and Engineering (FTE) / CSPIT
- **Department**: Computer Engineering
- **Semester**: 3rd Semester, Academic Year 2026–27
- **Course Outcomes**: `CO3, CO4, CO5`

---

## 1. Aim / Objective
To design and implement a Single-Page Application (SPA) architecture for StudentHub that decouples the frontend user interface from the backend database using a RESTful PHP JSON API (`api/students.php`) and consumes endpoints asynchronously using the JavaScript Fetch API (`async/await`). All CRUD operations (Create, Read, Update, Delete), live multi-criteria filtering, and error handling occur without full browser page reloads.

---

## 2. API Specification & Endpoints

| HTTP Method | Endpoint URI | Description | Request Payload | Success Status |
|:---:|---|---|---|:---:|
| `GET` | `/api/students.php` | List students with optional search & filters | Query params (`search`, `branch`, `status`) | `200 OK` |
| `GET` | `/api/students.php?id={id}` | Retrieve individual student record | None | `200 OK` |
| `POST` | `/api/students.php` | Add a new student record | JSON body (`student_id`, `name`, `email`, ...) | `201 Created` |
| `PUT` | `/api/students.php` | Update existing student record | JSON body (`id`, `name`, `email`, ...) | `200 OK` |
| `DELETE` | `/api/students.php?id={id}` | Delete student record permanently | Query param or JSON body (`id`) | `200 OK` |

### Standard Response Envelope Format:
```json
{
  "success": true,
  "status": 200,
  "message": "Student created successfully",
  "timestamp": "2026-10-20T22:00:00+05:30",
  "data": {
    "id": 12,
    "student_id": "25DCE050",
    "name": "Avi Beladiya",
    "email": "avi@charusat.edu.in",
    "branch": "CE"
  }
}
```

---

## 3. Frontend Architecture (Vanilla JavaScript ES6+)

1. **Zero Page Reloads**:
   All user actions (`submit`, `filter`, `delete`, `edit`) intercept standard browser navigation via `event.preventDefault()`, sending background HTTP requests via `fetch()`.

2. **Asynchronous Async/Await Flow**:
   Data requests use `async/await` syntax wrapped in `try...catch...finally` blocks, ensuring that loading indicators always dismiss regardless of network failure.

3. **Dynamic DOM Reconciliation**:
   - `renderTable()` constructs HTML table rows dynamically using template literals.
   - Deletion removes specific DOM elements smoothly (`opacity` & `transform` CSS transitions) before updating summary counters.

4. **Floating Toast Notification System**:
   Custom notification engine presents floating status toasts (Success, Error, Info) with automated dismissal timers.

---

## 4. File Structure
```
Practical 13/
├── index.html        # Single-Page Application (SPA) dashboard with modal & table
├── style.css         # Modern, responsive stylesheet with modal, toast & spinner styles
├── script.js         # Modular Fetch API client, modal controller & DOM renderer
├── api/
│   ├── db.php        # JSON-configured PDO connection and standardized response helpers
│   ├── students.php  # RESTful JSON CRUD API endpoint for student records
│   └── events.php    # Bonus RESTful JSON CRUD API endpoint for campus events
└── README.md         # Comprehensive documentation and viva preparation
```

---

## 5. Security & Validation Highlights

1. **Parameterized Queries**:
   All database operations use PDO prepared statements with parameter binding, eliminating SQL injection.
2. **Server-Side Input Validation**:
   Validates enrollment pattern, email format, and mobile digits before writing to MySQL, returning HTTP `422 Unprocessable Entity` with an array of errors on failure.
3. **Collision Detection**:
   Checks whether another student already holds the same email or enrollment ID before creating or updating records (`HTTP 409 Conflict`).
4. **CORS & Headers**:
   Sets `Content-Type: application/json; charset=UTF-8` and handles HTTP OPTIONS preflight queries cleanly.

---

## 6. How to Run

1. **Verify Services**: Ensure Apache and MySQL are running in XAMPP.
2. **Database Setup**: Confirm the `studenthub` database is imported (uses `students` table).
3. **Open Portal**: Navigate in your browser to:
   ```
   http://localhost/shub/Practical%2013/index.html
   ```

---

## 7. Manual Test Checklist

| Test No. | Action / Test Case | Expected Behavior | Status |
|:---:|---|---|:---:|
| **TC-01** | Open `index.html` | Spinner displays briefly; students load dynamically via Fetch API; stats update | **PASS** |
| **TC-02** | Type in Search Box | Results filter live (250ms debounce) without refreshing the webpage | **PASS** |
| **TC-03** | Change Department Dropdown | Table filters immediately via Fetch query | **PASS** |
| **TC-04** | Click "+ Add Student (Async)" | Modal popup opens; form resets; focus shifts to Enrollment input | **PASS** |
| **TC-05** | Submit form with empty fields | Displays inline error banner; blocks request | **PASS** |
| **TC-06** | Submit valid student | Closes modal; green toast appears; new student row prepends to table | **PASS** |
| **TC-07** | Click "Edit" on a student | Fetches student details via `GET ?id={id}`; pre-populates form; updates record via `PUT` | **PASS** |
| **TC-08** | Click "Delete" on a student | Prompts confirmation; sends `DELETE`; row fades out and removes from DOM | **PASS** |

---

## 8. Viva Questions & Answers

**Q1: Do PHP endpoints return valid JSON responses?**  
*Answer:* Yes. All PHP endpoints send the header `Content-Type: application/json; charset=UTF-8` and encode responses using `json_encode()` with standardized envelopes containing `success`, `status`, `message`, and `data` fields.

**Q2: How are HTTP GET, POST, PUT, and DELETE handled in PHP?**  
*Answer:* `GET` handles record retrieval. `POST` handles record creation. `PUT` handles complete updates (reading `php://input` stream or method overrides). `DELETE` handles record removal based on query parameters or payload IDs.

**Q3: How are loading, success, and error states handled on the frontend?**  
*Answer:* 
- **Loading State**: An animated spinner overlay (`.loading-overlay.active`) blurs the table while `fetch()` executes.
- **Success State**: Modals dismiss and a green floating toast notification slides in.
- **Error State**: Red toast notifications appear and validation error lists display inside the form without losing user input.

**Q4: Why is asynchronous Fetch API advantageous compared to standard form submission?**  
*Answer:* The Fetch API communicates in the background without causing a full-page reload. This eliminates flickering, preserves client-side scroll position and input states, reduces bandwidth consumption by transmitting lightweight JSON payloads instead of entire HTML documents, and provides a desktop-like user experience.

**Q5: What is the purpose of `php://input` in PHP REST APIs?**  
*Answer:* `$_POST` only parses `application/x-www-form-urlencoded` or `multipart/form-data` for HTTP `POST` requests. `php://input` is a read-only stream that allows PHP to read raw incoming HTTP request bodies, which is necessary for parsing JSON payloads and handling `PUT`, `PATCH`, or `DELETE` methods.
