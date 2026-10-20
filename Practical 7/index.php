<?php
/**
 * StudentHub - Practical 7: PHP Form Processing with CSV/JSON Storage
 * Subject: Web Development Frameworks (ITUE203)
 * CHARUSAT University - Semester 3
 */

session_start();

$errors = $_SESSION['p7_errors'] ?? [];
$success = $_SESSION['p7_success'] ?? null;
$old = $_SESSION['p7_old'] ?? [];

// Clear flash errors and success once read
unset($_SESSION['p7_errors'], $_SESSION['p7_success']);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="StudentHub - Practical 7: PHP Form Processing with Server-Side Validation and CSV/JSON Storage">
    <title>StudentHub - Practical 7: PHP Server-Side Form Processing</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <!-- Header / Navbar -->
    <header class="site-header">
        <div class="header-container">
            <a href="index.php" class="logo">
                <span class="logo-icon">&#127891;</span>
                <span>Student Hub</span>
            </a>
            <nav class="nav-links">
                <a href="index.php" class="nav-link active">Registration Form</a>
                <a href="view_data.php" class="nav-link">View Stored Records &rarr;</a>
                <span class="badge">Practical 7</span>
            </nav>
        </div>
    </header>

    <!-- Main Content Area -->
    <main class="main-wrapper">
        <div class="content-card">
            <!-- Header Banner -->
            <div class="page-header">
                <span class="subheading">CHARUSAT &bull; FTE &bull; Practical 7</span>
                <h1>PHP Form Processing &amp; File Storage</h1>
                <p>Server-side HTTP POST data validation, input sanitization, CSV formula injection neutralization, and concurrent file locking.</p>
            </div>

            <!-- Flash Success Message -->
            <?php if (!empty($success)): ?>
                <div class="alert alert-success" role="alert">
                    <span class="alert-icon">&#10004;</span>
                    <div class="alert-content">
                        <h4>Submission Saved Successfully!</h4>
                        <p><?= htmlspecialchars($success, ENT_QUOTES, 'UTF-8') ?></p>
                        <p style="margin-top: 8px;">
                            <a href="view_data.php" class="btn btn-sm btn-primary">Inspect Stored Records &rarr;</a>
                        </p>
                    </div>
                </div>
            <?php endif; ?>

            <!-- Flash Error Messages -->
            <?php if (!empty($errors)): ?>
                <div class="alert alert-error" role="alert">
                    <span class="alert-icon">&#9888;</span>
                    <div class="alert-content">
                        <h4>Server Validation Failed:</h4>
                        <ul>
                            <?php foreach ($errors as $err): ?>
                                <li><?= htmlspecialchars($err, ENT_QUOTES, 'UTF-8') ?></li>
                            <?php endforeach; ?>
                        </ul>
                    </div>
                </div>
            <?php endif; ?>

            <!-- Registration Form -->
            <form action="process.php" method="POST" class="form-grid">
                <!-- Row 1: Full Name & Enrollment No -->
                <div class="form-row">
                    <div class="form-group">
                        <label for="fullName">Full Name <span class="required">*</span></label>
                        <input 
                            type="text" 
                            id="fullName" 
                            name="fullName" 
                            placeholder="e.g. Avi Beladiya" 
                            value="<?= htmlspecialchars($old['fullName'] ?? '', ENT_QUOTES, 'UTF-8') ?>"
                            required
                        >
                    </div>

                    <div class="form-group">
                        <label for="enrollmentNo">Enrollment Number <span class="required">*</span></label>
                        <input 
                            type="text" 
                            id="enrollmentNo" 
                            name="enrollmentNo" 
                            placeholder="e.g. 25DCE007" 
                            value="<?= htmlspecialchars($old['enrollmentNo'] ?? '', ENT_QUOTES, 'UTF-8') ?>"
                            required
                        >
                    </div>
                </div>

                <!-- Row 2: Email & Mobile Number -->
                <div class="form-row">
                    <div class="form-group">
                        <label for="email">Student Email Address <span class="required">*</span></label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            placeholder="e.g. 25dce007@charusat.edu.in" 
                            value="<?= htmlspecialchars($old['email'] ?? '', ENT_QUOTES, 'UTF-8') ?>"
                            required
                        >
                    </div>

                    <div class="form-group">
                        <label for="mobile">Mobile Number (10 digits) <span class="required">*</span></label>
                        <input 
                            type="tel" 
                            id="mobile" 
                            name="mobile" 
                            placeholder="e.g. 9876543210" 
                            maxlength="10" 
                            value="<?= htmlspecialchars($old['mobile'] ?? '', ENT_QUOTES, 'UTF-8') ?>"
                            required
                        >
                    </div>
                </div>

                <!-- Row 3: Department & Semester -->
                <div class="form-row">
                    <div class="form-group">
                        <label for="department">Academic Department <span class="required">*</span></label>
                        <select id="department" name="department" required>
                            <option value="" disabled <?= empty($old['department']) ? 'selected' : '' ?>>Select Department</option>
                            <option value="CE" <?= ($old['department'] ?? '') === 'CE' ? 'selected' : '' ?>>Computer Engineering (CE)</option>
                            <option value="IT" <?= ($old['department'] ?? '') === 'IT' ? 'selected' : '' ?>>Information Technology (IT)</option>
                            <option value="AI & DS" <?= ($old['department'] ?? '') === 'AI & DS' ? 'selected' : '' ?>>AI &amp; Data Science (AI &amp; DS)</option>
                            <option value="EC" <?= ($old['department'] ?? '') === 'EC' ? 'selected' : '' ?>>Electronics &amp; Comm (EC)</option>
                            <option value="ME" <?= ($old['department'] ?? '') === 'ME' ? 'selected' : '' ?>>Mechanical Engineering (ME)</option>
                            <option value="CL" <?= ($old['department'] ?? '') === 'CL' ? 'selected' : '' ?>>Civil Engineering (CL)</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="semester">Current Semester <span class="required">*</span></label>
                        <select id="semester" name="semester" required>
                            <option value="" disabled <?= empty($old['semester']) ? 'selected' : '' ?>>Select Semester</option>
                            <?php for ($s = 1; $s <= 8; $s++): ?>
                                <option value="<?= $s ?>" <?= ($old['semester'] ?? '') == $s ? 'selected' : '' ?>>
                                    Semester <?= $s ?>
                                </option>
                            <?php endfor; ?>
                        </select>
                    </div>
                </div>

                <!-- Row 4: Course Program Title -->
                <div class="form-group">
                    <label for="course">Program / Degree Name <span class="required">*</span></label>
                    <input 
                        type="text" 
                        id="course" 
                        name="course" 
                        placeholder="e.g. Bachelor of Technology (B.Tech)" 
                        value="<?= htmlspecialchars($old['course'] ?? 'Bachelor of Technology (B.Tech)', ENT_QUOTES, 'UTF-8') ?>"
                        required
                    >
                </div>

                <!-- Form Action Buttons -->
                <div class="form-actions">
                    <a href="view_data.php" class="btn btn-outline">View Existing Records</a>
                    <button type="submit" class="btn btn-primary">&#128190; Submit &amp; Save Record</button>
                </div>
            </form>
        </div>
    </main>

    <!-- Footer -->
    <footer class="site-footer">
        <div class="footer-container">
            <p>&copy; 2026 StudentHub &bull; Charotar University of Science and Technology (CHARUSAT)</p>
            <p>Faculty of Technology and Engineering (FTE) &bull; Subject: ITUE203 Web Development Frameworks</p>
        </div>
    </footer>

</body>
</html>
