<?php
/**
 * StudentHub - Practical 8: PDO Database Connection Module
 * Subject: Web Development Frameworks (ITUE203)
 * CHARUSAT University - Semester 3
 */

/**
 * Returns an active PDO connection to the StudentHub MySQL database
 * @return PDO
 * @throws PDOException
 */
function getDbConnection(): PDO {
    static $pdoInstance = null;

    if ($pdoInstance !== null) {
        return $pdoInstance;
    }

    $configFile = __DIR__ . DIRECTORY_SEPARATOR . 'config.php';
    if (!file_exists($configFile)) {
        $configFile = __DIR__ . DIRECTORY_SEPARATOR . 'config.example.php';
    }

    $config = require $configFile;

    $host    = $config['host'] ?? 'localhost';
    $port    = $config['port'] ?? 3306;
    $dbname  = $config['dbname'] ?? 'studenthub';
    $user    = $config['username'] ?? 'root';
    $pass    = $config['password'] ?? '';
    $charset = $config['charset'] ?? 'utf8mb4';

    $dsn = "mysql:host={$host};port={$port};dbname={$dbname};charset={$charset}";

    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false, // Enforce native prepared statements in MySQL driver
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES {$charset} COLLATE utf8mb4_unicode_ci"
    ];

    try {
        $pdoInstance = new PDO($dsn, $user, $pass, $options);
        return $pdoInstance;
    } catch (PDOException $e) {
        // Log detailed error internally but expose safe generic message
        error_log("Database Connection Error: " . $e->getMessage());
        throw new PDOException("Database connection failed. Please ensure MySQL server is running in XAMPP and the 'studenthub' database is imported.", (int)$e->getCode());
    }
}

// Global convenience variable for direct inclusion
try {
    $pdo = getDbConnection();
} catch (PDOException $e) {
    $pdo = null;
    $dbError = $e->getMessage();
}
