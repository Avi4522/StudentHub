<?php
/**
 * StudentHub - Practical 7: View Stored Student Records (CSV & JSON)
 * Subject: Web Development Frameworks (ITUE203)
 * CHARUSAT University - Semester 3
 */

$csvFile = __DIR__ . DIRECTORY_SEPARATOR . 'students.csv';
$jsonFile = __DIR__ . DIRECTORY_SEPARATOR . 'students.json';

// --- Read CSV Data ---
$csvRows = [];
if (file_exists($csvFile)) {
    $handle = @fopen($csvFile, 'r');
    if ($handle) {
        $isFirstRow = true;
        while (($row = fgetcsv($handle)) !== false) {
            if ($isFirstRow) {
                $isFirstRow = false; // Skip header row
                continue;
            }
            if (!empty($row) && count($row) >= 8) {
                $csvRows[] = $row;
            }
        }
        fclose($handle);
    }
}

// --- Read JSON Data ---
$jsonRows = [];
if (file_exists($jsonFile)) {
    $content = @file_get_contents($jsonFile);
    if (!empty($content)) {
        $decoded = json_decode($content, true);
        if (is_array($decoded)) {
            $jsonRows = $decoded;
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>StudentHub - Practical 7: Stored Records Viewer</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <header class="site-header">
        <div class="header-container">
            <a href="index.php" class="logo">
                <span class="logo-icon">&#127891;</span>
                <span>Student Hub</span>
            </a>
            <nav class="nav-links">
                <a href="index.php" class="nav-link">&larr; Back to Registration Form</a>
                <a href="view_data.php" class="nav-link active">Stored Records Viewer</a>
                <span class="badge">Practical 7</span>
            </nav>
        </div>
    </header>

    <main class="main-wrapper">
        <div class="content-card content-card-wide">
            <div class="page-header">
                <span class="subheading">File System Persistence Demonstration</span>
                <h1>Stored Student Admissions Data</h1>
                <p>Displaying persistent records written via PHP POST handling to flat files (<code>students.csv</code> and <code>students.json</code>).</p>
            </div>

            <!-- CSV Records Section -->
            <section style="margin-bottom: 40px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h3>
                        <span class="storage-badge badge-csv">CSV Format</span>
                        Records from <code>students.csv</code> (<?= count($csvRows) ?> entries)
                    </h3>
                </div>

                <?php if (empty($csvRows)): ?>
                    <p style="color: var(--text-muted); padding: 20px 0; font-style: italic;">No student records found in CSV file yet. Submit a registration form to add data.</p>
                <?php else: ?>
                    <div class="table-wrapper">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Timestamp</th>
                                    <th>Enrollment No</th>
                                    <th>Full Name</th>
                                    <th>Email</th>
                                    <th>Mobile</th>
                                    <th>Dept</th>
                                    <th>Sem</th>
                                    <th>Course</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($csvRows as $index => $row): ?>
                                    <tr>
                                        <td><strong><?= $index + 1 ?></strong></td>
                                        <td><?= htmlspecialchars($row[0], ENT_QUOTES, 'UTF-8') ?></td>
                                        <td><code><?= htmlspecialchars(ltrim($row[1], "'"), ENT_QUOTES, 'UTF-8') ?></code></td>
                                        <td><?= htmlspecialchars(ltrim($row[2], "'"), ENT_QUOTES, 'UTF-8') ?></td>
                                        <td><?= htmlspecialchars(ltrim($row[3], "'"), ENT_QUOTES, 'UTF-8') ?></td>
                                        <td><?= htmlspecialchars(ltrim($row[4], "'"), ENT_QUOTES, 'UTF-8') ?></td>
                                        <td><span class="badge"><?= htmlspecialchars(ltrim($row[5], "'"), ENT_QUOTES, 'UTF-8') ?></span></td>
                                        <td>Sem <?= htmlspecialchars(ltrim($row[6], "'"), ENT_QUOTES, 'UTF-8') ?></td>
                                        <td><?= htmlspecialchars(ltrim($row[7], "'"), ENT_QUOTES, 'UTF-8') ?></td>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                <?php endif; ?>
            </section>

            <!-- JSON Records Section -->
            <section>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h3>
                        <span class="storage-badge badge-json">JSON Format</span>
                        Records from <code>students.json</code> (<?= count($jsonRows) ?> entries)
                    </h3>
                </div>

                <?php if (empty($jsonRows)): ?>
                    <p style="color: var(--text-muted); padding: 20px 0; font-style: italic;">No student records found in JSON file yet.</p>
                <?php else: ?>
                    <div class="table-wrapper">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Timestamp</th>
                                    <th>Enrollment No</th>
                                    <th>Full Name</th>
                                    <th>Email</th>
                                    <th>Mobile</th>
                                    <th>Dept</th>
                                    <th>Sem</th>
                                    <th>Course</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($jsonRows as $index => $item): ?>
                                    <tr>
                                        <td><strong><?= $index + 1 ?></strong></td>
                                        <td><?= htmlspecialchars($item['timestamp'] ?? '', ENT_QUOTES, 'UTF-8') ?></td>
                                        <td><code><?= htmlspecialchars($item['enrollmentNo'] ?? '', ENT_QUOTES, 'UTF-8') ?></code></td>
                                        <td><?= htmlspecialchars($item['fullName'] ?? '', ENT_QUOTES, 'UTF-8') ?></td>
                                        <td><?= htmlspecialchars($item['email'] ?? '', ENT_QUOTES, 'UTF-8') ?></td>
                                        <td><?= htmlspecialchars($item['mobile'] ?? '', ENT_QUOTES, 'UTF-8') ?></td>
                                        <td><span class="badge"><?= htmlspecialchars($item['department'] ?? '', ENT_QUOTES, 'UTF-8') ?></span></td>
                                        <td>Sem <?= htmlspecialchars((string)($item['semester'] ?? ''), ENT_QUOTES, 'UTF-8') ?></td>
                                        <td><?= htmlspecialchars($item['course'] ?? '', ENT_QUOTES, 'UTF-8') ?></td>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                <?php endif; ?>
            </section>

            <div style="margin-top: 32px; text-align: center;">
                <a href="index.php" class="btn btn-primary">&plus; Register Another Student</a>
            </div>
        </div>
    </main>

    <footer class="site-footer">
        <div class="footer-container">
            <p>&copy; 2026 StudentHub &bull; Charotar University of Science and Technology (CHARUSAT)</p>
            <p>Faculty of Technology and Engineering (FTE) &bull; Subject: ITUE203 Web Development Frameworks</p>
        </div>
    </footer>

</body>
</html>
