# Practical 12: Event Management System with CRUD Operations and Poster Upload

## Academic Information
- **Course**: Web Development Frameworks (`ITUE203`)
- **Institution**: CHAROTAR UNIVERSITY OF SCIENCE AND TECHNOLOGY (CHARUSAT)
- **Faculty**: Faculty of Technology and Engineering (FTE) / CSPIT
- **Department**: Computer Engineering
- **Semester**: 3rd Semester, Academic Year 2026–27
- **Course Outcomes**: `CO1, CO5`

---

## 1. Aim / Objective
To design and implement a comprehensive Event Management System for the StudentHub portal using PHP and MySQLi. The system delivers complete Create, Read, Update, and Delete (CRUD) operations, status tracking (`Open`, `Upcoming`, `Closed`), multi-criteria searching and filtering, secure binary file uploads for event posters with MIME/size validation, and filesystem cleanup upon record deletion.

---

## 2. Core Functional Modules

### A. Create (Add Event & Upload Poster)
- Form at `add.php` collects title, category (`Technical`, `Seminar`, `Workshop`, `Cultural`, `Sports`), date, time, venue, seating capacity, status, and poster artwork.
- Performs binary file upload validation:
  1. Checks upload error codes (`UPLOAD_ERR_OK`).
  2. Enforces maximum filesize limit (3 MB).
  3. Verifies authentic image MIME types via `getimagesize()` (`image/jpeg`, `image/png`, `image/webp`, `image/gif`).
  4. Generates cryptographically randomized filenames (`poster_{hex}.ext`) to prevent path traversal and overwriting.
  5. Moves file to `uploads/` directory via `move_uploaded_file()`.
- Inserts record into MySQL using parameterized prepared statement:
  ```php
  $stmt = $mysqli->prepare("INSERT INTO events (title, category, event_date, event_time, venue, description, capacity, status, poster) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
  $stmt->bind_param("ssssssiss", $title, $category, $eventDate, $eventTime, $venue, $description, $capacity, $status, $posterFilename);
  $stmt->execute();
  ```

### B. Read (Card Grid & Dynamic Filters)
- `index.php` queries the database with dynamic `WHERE` clauses.
- Summary cards display live counts for Total Events, Open Registrations, Upcoming Events, and Closed Events.
- Search toolbar allows keyword search across event title, venue, and description, with category and status dropdown filters.

### C. Update (Edit Details & Replace Poster)
- Form at `edit.php?id={id}` pre-populates existing event attributes and displays the current poster thumbnail.
- Allows optional poster replacement: if a new file is uploaded, the previous custom poster is unlinked from `uploads/` using `unlink()`, preventing orphaned files on the server.

### D. Delete (Remove Event & Cleanup Files)
- Secure POST deletion in `delete.php` protected with CSRF tokens.
- Retrieves the stored poster filename before deletion and unlinks it from disk (unless it is the fallback `default_poster.png`).

---

## 3. Database Schema (`events` Table)

```sql
CREATE TABLE `events` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(150) NOT NULL,
    `category` VARCHAR(50) NOT NULL DEFAULT 'Technical',
    `event_date` DATE NOT NULL,
    `event_time` TIME DEFAULT '10:00:00',
    `venue` VARCHAR(150) DEFAULT 'Seminar Hall, CHARUSAT',
    `description` TEXT NULL,
    `capacity` INT DEFAULT 100,
    `status` ENUM('Open', 'Closed', 'Upcoming') DEFAULT 'Open',
    `poster` VARCHAR(255) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 4. File Structure
```
Practical 12/
├── index.php        # Event cards grid, status counters, search & filter toolbar
├── add.php          # Event creation form with poster file upload & MIME validation
├── edit.php         # Event modification form with poster replacement & preview
├── delete.php       # Secure POST deletion controller with poster filesystem unlinking
├── db.php           # Centralized MySQLi connection helper
├── events.sql       # Database schema and seed events
├── style.css        # Responsive stylesheet adhering to StudentHub design system
├── uploads/         # Storage folder for event posters
│   └── default_poster.png  # Fallback branded artwork
└── README.md        # Comprehensive documentation and viva preparation
```

---

## 5. Security Implementation Highlights

1. **Prepared Statements**: All database queries use MySQLi parameterized statements to prevent SQL injection attacks.
2. **File Upload Security**:
   - Random filename generation prevents file overwriting and shell upload attacks.
   - Server-side MIME verification prevents malicious scripts masked as images from executing.
   - Max file size enforcement prevents denial-of-service through storage exhaustion.
3. **Cross-Site Request Forgery (CSRF)**: State modifications require a valid session CSRF token verified via `hash_equals()`.
4. **XSS Neutralization**: Dynamic database values rendered in HTML are filtered through `htmlspecialchars()`.

---

## 6. How to Run

1. **Start Apache & MySQL**: Ensure both are active in XAMPP Control Panel.
2. **Database Setup**:
   Import `events.sql` into MySQL:
   ```bash
   mysql -u root -p studenthub < "e:/project/shub/Practical 12/events.sql"
   ```
3. **Access Module**:
   Navigate to:
   ```
   http://localhost/shub/Practical%2012/index.php
   ```

---

## 7. Manual Test Checklist

| Test No. | Component / Feature | Action / Test Case | Expected Behavior | Result |
|:---:|---|---|---|:---:|
| **TC-01** | Events Listing | Open `index.php` | Renders cards grid with poster images, date, time, badges, and capacity | **PASS** |
| **TC-02** | Statistics Counters | Observe top stats bar | Accurately calculates Total, Open, Upcoming, and Closed event counts | **PASS** |
| **TC-03** | Keyword Search | Enter "Hackathon" in search box | Filters grid to show only HackCHARUSAT 2026 | **PASS** |
| **TC-04** | Status Filter | Select "Upcoming" from dropdown | Filters cards to show only upcoming events | **PASS** |
| **TC-05** | Add Event | Fill form at `add.php` and submit | Saves event, moves poster to `uploads/`, redirects with success banner | **PASS** |
| **TC-06** | Poster Validation | Attempt uploading a `.txt` or `.exe` file | Blocks upload; displays "Invalid image format" error | **PASS** |
| **TC-07** | Edit Event | Modify event at `edit.php` | Pre-populates all values, allows updating fields, saves successfully | **PASS** |
| **TC-08** | Delete Event | Click "Delete" on an event | Prompts confirmation; removes record from DB and deletes poster from `uploads/` | **PASS** |

---

## 8. Viva Questions & Answers

**Q1: What does CRUD mean in Event Management?**  
*Answer:* CRUD stands for Create, Read, Update, and Delete. In Event Management, these operations represent creating new events, reading/listing scheduled campus events, updating event logistics (dates, venue, capacity, posters), and deleting expired or cancelled events.

**Q2: What information is stored for each event?**  
*Answer:* Primary key `id`, event title, category, event date, event time, campus venue, description, seating/registration capacity, registration status (`Open`, `Upcoming`, `Closed`), poster image filename, and timestamp.

**Q3: How are event posters handled securely during upload?**  
*Answer:* The PHP script checks `$_FILES['poster']` for upload errors, enforces a 3 MB file size limit, validates the true image MIME type using `getimagesize()`, generates a cryptographically random filename (`poster_{hex}.ext`), and moves the file to the `uploads/` folder. Only the sanitized filename is stored in MySQL.

**Q4: Can events be searched and filtered dynamically?**  
*Answer:* Yes. `index.php` executes parameterized MySQLi queries combining keyword search (matching title, venue, or description) with categorical and status dropdown filters.

**Q5: What happens to poster files when an event is deleted?**  
*Answer:* When an event is deleted via `delete.php`, the system queries the database for the poster filename. If the poster is custom (not the fallback `default_poster.png`), it executes PHP's `unlink()` function to permanently delete the image file from the `uploads/` folder, preventing storage clutter.
