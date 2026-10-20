# Practical 6: Rendering External JSON Data using Fetch API, Search and Filter

## Academic Information
- **Course**: Web Development Frameworks (`ITUE203`)
- **Institution**: CHAROTAR UNIVERSITY OF SCIENCE AND TECHNOLOGY (CHARUSAT)
- **Faculty**: Faculty of Technology and Engineering (FTE) / CSPIT
- **Department**: Computer Engineering
- **Semester**: 3rd Semester, Academic Year 2026–27
- **Course Outcomes**: `CO3, CO4`

---

## 1. Aim / Objective
To design and implement a dynamic data rendering portal for the StudentHub web application that consumes asynchronous external JSON data using the JavaScript Fetch API (`async/await`), parses dataset records dynamically, and implements real-time keyword searching, multi-criteria category filtering, bidirectional sorting algorithms, client-side pagination, skeleton loading states, graceful error handling, and dependent dropdown selections.

---

## 2. Requirements & Datasets

Three comprehensive, realistic academic JSON datasets were developed, each containing $\ge 15$ records:

| Dataset File | Record Count | Key Fields Included | Description |
|---|:---:|---|---|
| **`events.json`** | 16 | `id`, `title`, `category`, `date`, `venue`, `organizer`, `capacity`, `status`, `description` | Campus technical symposiums, hackathons, sports meets, cultural nights, and workshops. |
| **`students.json`** | 18 | `id`, `enrollmentNo`, `fullName`, `email`, `course`, `department`, `semester`, `academicYear`, `cgpa`, `gender` | Student directory with enrollment numbers, engineering programs, CGPA, and semester data. |
| **`faqs.json`** | 16 | `id`, `question`, `answer`, `category`, `tags` | Knowledge base addressing admissions, exam evaluation, Central Library IEEE resources, and hostel Wi-Fi. |

---

## 3. Core Functional Modules

### A. Fetch API & Async/Await Pattern
Data is loaded asynchronously using `fetch(filePath)` with ES6 `async/await` and wrapped in structured `try...catch...finally` blocks:
```javascript
const response = await fetch('events.json');
if (!response.ok) {
    throw new Error(`HTTP Error ${response.status}`);
}
const data = await response.json();
```
*Offline Resilience:* Successful responses are automatically mirrored into browser `localStorage`, ensuring data remains viewable even if the local network is temporarily disconnected.

### B. Searching & Multi-field Filtering (`Array.prototype.filter`)
Live search executes across multiple text properties with a 250ms debounce timer to prevent redundant processing:
- Matches against Title, Description, Venue, and Category for Events.
- Matches against Full Name, Enrollment Number, Email, and Course for Students.
- Matches against Questions, Answers, and Keyword Tags for FAQs.

### C. Sorting Algorithms (`Array.prototype.sort`)
Supports multiple ordering options:
- **Alphabetical Ascending / Descending**: `itemA.localeCompare(itemB)`
- **Chronological / Metric**: Compares timestamp dates for events or numerical CGPA values for students (`metricB - metricA`).

### D. Client-side Pagination (`Array.prototype.slice`)
Divides filtered results into pages:
$$\text{Total Pages} = \left\lceil \frac{\text{Filtered Records Count}}{\text{Page Size}} \right\rceil$$
$$\text{Page Records} = \text{filteredList}.\text{slice}((\text{currentPage} - 1) \times \text{pageSize},\, \text{currentPage} \times \text{pageSize})$$

### E. Dependent Dropdown Extension
Selecting an engineering department (e.g. *Computer Engineering*) dynamically populates its relevant specialization tracks (e.g., *Cloud Architecture, AI/ML, Cybersecurity, Robotics*) without hardcoding static HTML options.

---

## 4. File Structure
```
Practical 6/
├── index.html       # Dynamic data portal interface with tabs & toolbar
├── style.css        # Card grids, shimmer skeleton loaders, badges, pagination
├── script.js        # Modular Fetch API controller, filter/sort/pagination logic
├── events.json      # 16 detailed university event records
├── students.json    # 18 student directory profiles with CGPA metrics
├── faqs.json        # 16 academic FAQs categorized with keyword tags
└── README.md        # Comprehensive documentation and viva preparation
```

---

## 5. How to Run
> **Important Note:** Modern web browsers block `fetch()` calls to local files (`file:///`) under the Same-Origin / CORS security policy. The project must be served over an HTTP local server:

1. **Option 1 (VS Code Live Server)**: Right-click `index.html` $\rightarrow$ *"Open with Live Server"*.
2. **Option 2 (Node.js)**:
   ```bash
   npx serve "Practical 6"
   # or:
   npx http-server "Practical 6" -p 8080
   ```
3. Open `http://localhost:8080` (or the URL displayed in terminal).

---

## 6. Verification Test Suite

| Test ID | Feature Tested | Action Performed | Expected Behavior | Result |
|:---:|---|---|---|:---:|
| **TC-01** | Initial Fetch | Page load on `index.html` | Shimmer skeleton loader displays briefly; 16 event cards loaded; category dropdown populated. | **PASS** |
| **TC-02** | Tab Switch | Click "Student Directory (18)" | Active tab highlights; student profiles rendered with avatars, enrollment IDs, and CGPA badges. | **PASS** |
| **TC-03** | Keyword Search | Type `"hackathon"` into search bar | Grid immediately filters to 1 matching event card; results count updates to *"Showing 1–1 of 1 records"*. | **PASS** |
| **TC-04** | Search Clear | Click "&times;" button in search input | Search input resets; full dataset restored; clear button hides. | **PASS** |
| **TC-05** | Category Filter | Select `"Technical"` from category dropdown | Shows only technical symposiums and hackathons; hides cultural/sports entries. | **PASS** |
| **TC-06** | Sorting | Select *"Date / CGPA (Highest First)"* on Students tab | Students sorted in descending order of CGPA (top student 9.50 first). | **PASS** |
| **TC-07** | Pagination | Change page size to 6, click "Next &raquo;" | Displays records 7 through 12; active page button highlights `2`; Prev button enables. | **PASS** |
| **TC-08** | Empty State | Enter nonsense search term (e.g. `"xyz123"`) | Alert banner *"No Matching Records Found"* displays with "Reset Filters" action button. | **PASS** |
| **TC-09** | Dependent Select| Select "Computer Engineering" in extension card | Specialization dropdown populates with CE tracks (Cloud, AI/ML, Cyber, Robotics). | **PASS** |
| **TC-10** | Error Recovery | Disconnect or rename JSON file, click "Retry" | Displays structured Error Banner indicating failure without uncaught console crashes. | **PASS** |

---

## 7. Viva Questions & Answers

**Q1: What is the Fetch API and how does it improve upon `XMLHttpRequest`?**  
*Answer:* The Fetch API is a modern, native browser interface for making asynchronous HTTP requests. Unlike the callback-based `XMLHttpRequest`, `fetch()` uses Promises, integrates cleanly with `async/await`, offers simpler request/response streaming, and provides better error handling.

**Q2: Why does `fetch()` not reject HTTP 404 or 500 errors in its `.catch()` block?**  
*Answer:* `fetch()` only rejects a Promise when a true network failure or CORS error occurs. If the server responds with an HTTP status code like 404 Not Found or 500 Internal Error, the Promise still resolves. Developers must explicitly check `response.ok` (which is `true` for status codes 200–299).

**Q3: Explain the difference between `map()`, `filter()`, and `slice()` in JavaScript array processing.**  
*Answer:*
- `filter()` returns a new array containing only elements that satisfy a boolean predicate function.
- `map()` returns a new array with each element transformed by a callback function.
- `slice(start, end)` returns a shallow copy of a portion of an array without modifying the original array (ideal for pagination).

**Q4: Why does opening a local HTML file directly via `file://` cause Fetch to fail?**  
*Answer:* Modern browsers enforce the Same-Origin Policy (SOP). The `file://` protocol lacks an HTTP origin header, which causes security blocks on asynchronous file reads (`CORS request not supported for file://`). Serving over `http://localhost` solves this.

**Q5: What is debouncing in a search input and why is it used?**  
*Answer:* Debouncing postpones function execution until a specified delay (e.g. 250ms) has elapsed since the last keystroke. It prevents running costly filtering, DOM re-rendering, or API calls on every individual character typed.
