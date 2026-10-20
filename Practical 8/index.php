<?php
/**
 * StudentHub - Practical 8: MySQL Schema & PDO Database Connectivity Test
 * Subject: Web Development Frameworks (ITUE203)
 * CHARUSAT University - Semester 3
 */

require_once __DIR__ . '/db.php';

$isConnected = ($pdo !== null);
$serverVersion = 'N/A';
$dbName = 'studenthub';
$tableCounts = [
    'users' => 0,
    'students' => 0,
    'events' => 0,
    'registrations' => 0,
    'audit_logs' => 0
];

if ($isConnected) {
    try {
        $serverVersion = $pdo->getAttribute(PDO::ATTR_SERVER_VERSION);

        // Fetch counts for core tables
        foreach ($tableCounts as $tbl => &$count) {
            try {
                $stmt = $pdo->query("SELECT COUNT(*) FROM `{$tbl}`");
                $count = (int)$stmt->fetchColumn();
            } catch (Exception $e) {
                $count = 0;
            }
        }
        unset($count);
    } catch (PDOException $e) {
        $isConnected = false;
        $dbError = $e->getMessage();
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>StudentHub - Practical 8: Database Connectivity &amp; Schema</title>
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
                <a href="index.php" class="nav-link active">Database Status</a>
                <a href="prepared.php" class="nav-link">Prepared Statements Demo &rarr;</a>
                <span class="badge">Practical 8</span>
            </nav>
        </div>
    </header>

    <main class="main-wrapper">
        <div class="dashboard-container">
            <div class="page-header">
                <span class="subheading">CHARUSAT &bull; FTE &bull; Practical 8</span>
                <h1>MySQL Schema &amp; PDO Database Connectivity</h1>
                <p>Establishing an enterprise-ready PDO database connection with prepared statements, normalized 3NF relational schema, and seed verification.</p>
            </div>

            <!-- Connection Status Banner -->
            <?php if ($isConnected): ?>
                <div class="status-card connected" role="region" aria-label="Database Status">
                    <div class="status-left">
                        <span class="status-pill">&#10004; CONNECTED</span>
                        <div>
                            <h3 style="color: #166534; font-size: 18px;">PDO MySQL Connection Established</h3>
                            <p style="color: #15803d; font-size: 13px;">Connected securely to database <code><?= htmlspecialchars($dbName) ?></code> with native prepared statements enabled.</p>
                        </div>
                    </div>
                    <div class="status-meta">
                        <span><strong>Host:</strong> localhost:3306</span>
                        <span><strong>Driver:</strong> PDO_MYSQL</span>
                        <span><strong>Server Version:</strong> <?= htmlspecialchars($serverVersion) ?></span>
                        <span><strong>Charset:</strong> UTF-8 (utf8mb4)</span>
                    </div>
                </div>
            <?php else: ?>
                <div class="status-card disconnected" role="region" aria-label="Database Status">
                    <div class="status-left">
                        <span class="status-pill">&#9888; DISCONNECTED</span>
                        <div>
                            <h3 style="color: #991b1b; font-size: 18px;">Database Connection Offline</h3>
                            <p style="color: #b91c1c; font-size: 13px;"><?= htmlspecialchars($dbError ?? 'MySQL server unreachable') ?></p>
                        </div>
                    </div>
                    <div style="background: #ffffff; padding: 12px 16px; border-radius: var(--radius-sm); border: 1px solid #fca5a5; font-size: 13px;">
                        <strong>Troubleshooting Steps:</strong>
                        <ol style="margin-left: 20px; margin-top: 4px;">
                            <li>Start <strong>Apache</strong> and <strong>MySQL</strong> in the XAMPP Control Panel.</li>
                            <li>Open <code>http://localhost/phpmyadmin</code> in your web browser.</li>
                            <li>Create database <code>studenthub</code> and import <code>database/studenthub.sql</code>.</li>
                        </ol>
                    </div>
                </div>
            <?php endif; ?>

            <!-- Table Inventory Stat Grid -->
            <section class="stats-grid">
                <div class="stat-card">
                    <div class="stat-title">Registered Users</div>
                    <div class="stat-value"><?= $tableCounts['users'] ?></div>
                    <div class="stat-desc">Admin, Student &amp; Faculty roles</div>
                </div>

                <div class="stat-card">
                    <div class="stat-title">Student Records</div>
                    <div class="stat-value"><?= $tableCounts['students'] ?></div>
                    <div class="stat-desc">Across CE, IT, AI, EC, ME, CL</div>
                </div>

                <div class="stat-card">
                    <div class="stat-title">Campus Events</div>
                    <div class="stat-value"><?= $tableCounts['events'] ?></div>
                    <div class="stat-desc">Tech Expos, Workshops, Fests</div>
                </div>

                <div class="stat-card">
                    <div class="stat-title">Event Registrations</div>
                    <div class="stat-value"><?= $tableCounts['registrations'] ?></div>
                    <div class="stat-desc">Unique student event bookings</div>
                </div>

                <div class="stat-card">
                    <div class="stat-title">Audit Trail Entries</div>
                    <div class="stat-value"><?= $tableCounts['audit_logs'] ?></div>
                    <div class="stat-desc">Administrative action tracking</div>
                </div>
            </section>

            <!-- Relational Schema Information Card -->
            <div class="section-card">
                <h2>Relational Schema Architecture (3rd Normal Form)</h2>
                <p class="section-desc">
                    The StudentHub database is normalized to eliminate data redundancy and insertion/deletion anomalies:
                </p>

                <div class="table-wrapper">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Table Name</th>
                                <th>Primary Key</th>
                                <th>Foreign Keys</th>
                                <th>Key Unique Constraints</th>
                                <th>Storage Engine</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><code>users</code></td>
                                <td><code>id</code> (INT AUTO)</td>
                                <td>None</td>
                                <td><code>username</code>, <code>email</code></td>
                                <td>InnoDB</td>
                            </tr>
                            <tr>
                                <td><code>students</code></td>
                                <td><code>id</code> (INT AUTO)</td>
                                <td>None (user link via enrollment)</td>
                                <td><code>student_id</code>, <code>email</code></td>
                                <td>InnoDB</td>
                            </tr>
                            <tr>
                                <td><code>hobbies</code></td>
                                <td><code>hobby_id</code> (INT AUTO)</td>
                                <td>None</td>
                                <td><code>hobby_name</code></td>
                                <td>InnoDB</td>
                            </tr>
                            <tr>
                                <td><code>student_hobbies</code></td>
                                <td><code>(student_id, hobby_id)</code></td>
                                <td><code>student_id &rarr; students(id)</code>, <code>hobby_id &rarr; hobbies(hobby_id)</code></td>
                                <td>Composite Primary Key</td>
                                <td>InnoDB</td>
                            </tr>
                            <tr>
                                <td><code>events</code></td>
                                <td><code>id</code> (INT AUTO)</td>
                                <td>None</td>
                                <td>None</td>
                                <td>InnoDB</td>
                            </tr>
                            <tr>
                                <td><code>registrations</code></td>
                                <td><code>id</code> (INT AUTO)</td>
                                <td><code>student_id &rarr; students(id)</code>, <code>event_id &rarr; events(id)</code></td>
                                <td><code>UNIQUE(student_id, event_id)</code></td>
                                <td>InnoDB</td>
                            </tr>
                            <tr>
                                <td><code>audit_logs</code></td>
                                <td><code>id</code> (INT AUTO)</td>
                                <td><code>user_id &rarr; users(id)</code></td>
                                <td>None</td>
                                <td>InnoDB</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div style="margin-top: 24px; display: flex; gap: 12px; flex-wrap: wrap;">
                    <a href="prepared.php" class="btn btn-primary">Try Prepared Statements Demo &rarr;</a>
                    <a href="studenthub.sql" class="btn btn-outline" download>Download Master SQL Schema</a>
                </div>
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
