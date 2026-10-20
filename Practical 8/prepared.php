<?php
/**
 * StudentHub - Practical 8: PDO Prepared Statements Demonstration
 * Subject: Web Development Frameworks (ITUE203)
 * CHARUSAT University - Semester 3
 */

require_once __DIR__ . '/db.php';

$filterCourse = isset($_GET['course']) ? trim($_GET['course']) : 'Computer Engineering';
$minCgpa = isset($_GET['min_cgpa']) ? (float)$_GET['min_cgpa'] : 8.5;

$results = [];
$queryExecuted = '';

if ($pdo !== null) {
    try {
        // Example: Named Prepared Statement
        $sql = "SELECT id, student_id, name, email, course, semester, cgpa, status 
                FROM students 
                WHERE course = :course AND cgpa >= :min_cgpa 
                ORDER BY cgpa DESC";

        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':course', $filterCourse, PDO::PARAM_STR);
        $stmt->bindValue(':min_cgpa', $minCgpa, PDO::PARAM_STR);
        $stmt->execute();

        $results = $stmt->fetchAll();
        $queryExecuted = $sql;
    } catch (PDOException $e) {
        $error = $e->getMessage();
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>StudentHub - Practical 8: Prepared Statements Sandbox</title>
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
                <a href="index.php" class="nav-link">&larr; DB Monitor</a>
                <a href="prepared.php" class="nav-link active">Prepared Statements Sandbox</a>
                <span class="badge">Practical 8</span>
            </nav>
        </div>
    </header>

    <main class="main-wrapper">
        <div class="dashboard-container">
            <div class="page-header">
                <span class="subheading">SQL Injection Prevention &amp; Query Compilation</span>
                <h1>PDO Prepared Statements Sandbox</h1>
                <p>Demonstrating two-phase query execution (Prepare &amp; Execute) with named parameter binding to neutralize SQL Injection vulnerabilities.</p>
            </div>

            <!-- Theory Card -->
            <div class="section-card">
                <h2>Why PDO Prepared Statements Prevent SQL Injection</h2>
                <p class="section-desc">
                    In traditional SQL concatenation, user inputs alter the SQL syntax tree. With PDO prepared statements,
                    the database engine compiles the SQL command template <em>first</em>. User parameters are transmitted separately over the wire
                    as inert literal values, making it mathematically impossible for attacker input (e.g. <code>' OR '1'='1</code>) to modify query logic.
                </p>
                <div class="sql-box">
// Secure PDO Prepared Statement Pattern:
$stmt = $pdo->prepare("SELECT * FROM students WHERE course = :course AND cgpa >= :min_cgpa");
$stmt->bindValue(':course', $filterCourse, PDO::PARAM_STR);
$stmt->bindValue(':min_cgpa', $minCgpa, PDO::PARAM_STR);
$stmt->execute();
$records = $stmt->fetchAll();
                </div>
            </div>

            <!-- Filter Controls Form -->
            <div class="section-card">
                <h2>Live Parameterized Query Execution</h2>
                <form method="GET" action="prepared.php" style="display: flex; gap: 16px; flex-wrap: wrap; align-items: flex-end; margin-bottom: 24px;">
                    <div>
                        <label for="course" style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px;">Filter by Course:</label>
                        <select name="course" id="course" style="padding: 8px 12px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 14px;">
                            <option value="Computer Engineering" <?= $filterCourse === 'Computer Engineering' ? 'selected' : '' ?>>Computer Engineering</option>
                            <option value="Information Technology" <?= $filterCourse === 'Information Technology' ? 'selected' : '' ?>>Information Technology</option>
                            <option value="AI & Data Science" <?= $filterCourse === 'AI & Data Science' ? 'selected' : '' ?>>AI &amp; Data Science</option>
                            <option value="Civil Engineering" <?= $filterCourse === 'Civil Engineering' ? 'selected' : '' ?>>Civil Engineering</option>
                            <option value="Mechanical Engineering" <?= $filterCourse === 'Mechanical Engineering' ? 'selected' : '' ?>>Mechanical Engineering</option>
                        </select>
                    </div>

                    <div>
                        <label for="min_cgpa" style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px;">Minimum CGPA:</label>
                        <input type="number" step="0.1" min="0" max="10" name="min_cgpa" id="min_cgpa" value="<?= htmlspecialchars((string)$minCgpa) ?>" style="padding: 8px 12px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 14px; width: 120px;">
                    </div>

                    <button type="submit" class="btn btn-primary">Execute Prepared Query</button>
                    <a href="prepared.php" class="btn btn-outline">Reset Query</a>
                </form>

                <?php if ($pdo === null): ?>
                    <div style="background-color: #fef2f2; border: 1px solid #fca5a5; padding: 16px; border-radius: var(--radius-sm); color: #991b1b;">
                        <strong>Database Unavailable:</strong> Cannot execute query because MySQL connection failed. Please verify MySQL service in XAMPP.
                    </div>
                <?php else: ?>
                    <p style="font-size: 14px; color: var(--text-muted); margin-bottom: 12px;">
                        Retrieved <strong><?= count($results) ?></strong> matching students using prepared statement.
                    </p>

                    <div class="table-wrapper">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Enrollment No</th>
                                    <th>Student Name</th>
                                    <th>Email Address</th>
                                    <th>Course</th>
                                    <th>Semester</th>
                                    <th>CGPA</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php if (empty($results)): ?>
                                    <tr>
                                        <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 20px;">
                                            No student records found matching this course and CGPA threshold.
                                        </td>
                                    </tr>
                                <?php else: ?>
                                    <?php foreach ($results as $r): ?>
                                        <tr>
                                            <td><code><?= htmlspecialchars($r['student_id']) ?></code></td>
                                            <td><strong><?= htmlspecialchars($r['name']) ?></strong></td>
                                            <td><?= htmlspecialchars($r['email']) ?></td>
                                            <td><?= htmlspecialchars($r['course']) ?></td>
                                            <td>Sem <?= htmlspecialchars((string)$r['semester']) ?></td>
                                            <td><span class="badge" style="background-color: #fef3c7; color: #92400e;">&#11088; <?= htmlspecialchars(number_format((float)$r['cgpa'], 2)) ?></span></td>
                                            <td><span class="badge" style="background-color: #dcfce7; color: #166534;"><?= htmlspecialchars($r['status']) ?></span></td>
                                        </tr>
                                    <?php endforeach; ?>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>
                <?php endif; ?>
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
