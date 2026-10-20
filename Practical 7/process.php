<?php
/**
 * StudentHub - Practical 7: PHP Form Processing with CSV/JSON Storage
 * Subject: Web Development Frameworks (ITUE203)
 * CHARUSAT University - Semester 3
 */

session_start();

// Ensure request is submitted via HTTP POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die('Method Not Allowed: This script only accepts HTTP POST submissions.');
}

$errors = [];
$old = [];

// --------------------------------------------------------------------------
// 1. Sanitize & Normalize Inputs
// --------------------------------------------------------------------------
$fullName = isset($_POST['fullName']) ? trim(strip_tags($_POST['fullName'])) : '';
$enrollmentNo = isset($_POST['enrollmentNo']) ? strtoupper(trim(strip_tags($_POST['enrollmentNo']))) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$mobile = isset($_POST['mobile']) ? trim($_POST['mobile']) : '';
$department = isset($_POST['department']) ? trim($_POST['department']) : '';
$semester = isset($_POST['semester']) ? trim($_POST['semester']) : '';
$course = isset($_POST['course']) ? trim(strip_tags($_POST['course'])) : '';

$old = [
    'fullName' => $fullName,
    'enrollmentNo' => $enrollmentNo,
    'email' => $email,
    'mobile' => $mobile,
    'department' => $department,
    'semester' => $semester,
    'course' => $course
];

// --------------------------------------------------------------------------
// 2. Server-side Validation
// --------------------------------------------------------------------------
// Full Name
if (empty($fullName)) {
    $errors[] = 'Full name is required.';
} elseif (strlen($fullName) < 3 || strlen($fullName) > 50) {
    $errors[] = 'Full name must be between 3 and 50 characters.';
} elseif (!preg_match('/^[a-zA-Z\s]+$/', $fullName)) {
    $errors[] = 'Full name must contain alphabetic letters and spaces only.';
}

// Enrollment Number (e.g. 25DCE007)
if (empty($enrollmentNo)) {
    $errors[] = 'Enrollment number is required.';
} elseif (!preg_match('/^[0-9]{2}[A-Z]{2,4}[0-9]{3}$/', $enrollmentNo)) {
    $errors[] = 'Enrollment number format is invalid (expected format: 25DCE007).';
}

// Email
if (empty($email)) {
    $errors[] = 'Email address is required.';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Email address is invalid.';
}

// Mobile (10-digit Indian mobile starting with 6-9)
if (empty($mobile)) {
    $errors[] = 'Mobile number is required.';
} elseif (!preg_match('/^[6-9]\d{9}$/', $mobile)) {
    $errors[] = 'Mobile number must be exactly 10 digits starting with 6, 7, 8, or 9.';
}

// Department
$allowedDepartments = ['CE', 'IT', 'AI & DS', 'EC', 'ME', 'CL'];
if (empty($department) || !in_array($department, $allowedDepartments, true)) {
    $errors[] = 'Please select a valid academic department from the list.';
}

// Semester
$semInt = filter_var($semester, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1, 'max_range' => 8]]);
if ($semInt === false) {
    $errors[] = 'Semester must be an integer between 1 and 8.';
}

// Course
if (empty($course)) {
    $errors[] = 'Course / Program name is required.';
}

// --------------------------------------------------------------------------
// 3. Handle Validation Failures
// --------------------------------------------------------------------------
if (!empty($errors)) {
    $_SESSION['p7_errors'] = $errors;
    $_SESSION['p7_old'] = $old;
    header('Location: index.php');
    exit;
}

// --------------------------------------------------------------------------
// 4. Prevent CSV Formula Injection
// Spreadsheet software (Excel, Calc) interprets cells beginning with =, +, -, @ as executable formulas.
// --------------------------------------------------------------------------
function sanitizeForCsv(string $value): string {
    $dangerousChars = ['=', '+', '-', '@', "\t", "\r"];
    if (isset($value[0]) && in_array($value[0], $dangerousChars, true)) {
        return "'" . $value; // Prepend apostrophe to neutralize formula execution
    }
    return $value;
}

// --------------------------------------------------------------------------
// 5. Safe Storage into CSV & JSON Files
// --------------------------------------------------------------------------
$timestamp = date('Y-m-d H:i:s');
$csvFile = __DIR__ . DIRECTORY_SEPARATOR . 'students.csv';
$jsonFile = __DIR__ . DIRECTORY_SEPARATOR . 'students.json';

// --- A. Store in CSV ---
$csvRow = [
    $timestamp,
    sanitizeForCsv($enrollmentNo),
    sanitizeForCsv($fullName),
    sanitizeForCsv($email),
    sanitizeForCsv($mobile),
    sanitizeForCsv($department),
    sanitizeForCsv((string)$semInt),
    sanitizeForCsv($course)
];

$csvHandle = @fopen($csvFile, 'a');
if (!$csvHandle) {
    $_SESSION['p7_errors'] = ['Server storage error: Could not open CSV file for writing.'];
    $_SESSION['p7_old'] = $old;
    header('Location: index.php');
    exit;
}

if (flock($csvHandle, LOCK_EX)) {
    fputcsv($csvHandle, $csvRow);
    flock($csvHandle, LOCK_UN);
} else {
    fclose($csvHandle);
    $_SESSION['p7_errors'] = ['Server storage error: CSV file lock acquisition failed.'];
    header('Location: index.php');
    exit;
}
fclose($csvHandle);

// --- B. Store in JSON ---
$newRecord = [
    'timestamp' => $timestamp,
    'enrollmentNo' => $enrollmentNo,
    'fullName' => $fullName,
    'email' => $email,
    'mobile' => $mobile,
    'department' => $department,
    'semester' => (int)$semInt,
    'course' => $course
];

$existingJson = [];
if (file_exists($jsonFile)) {
    $content = @file_get_contents($jsonFile);
    if (!empty($content)) {
        $decoded = json_decode($content, true);
        if (is_array($decoded)) {
            $existingJson = $decoded;
        }
    }
}

$existingJson[] = $newRecord;

$jsonHandle = @fopen($jsonFile, 'c+');
if ($jsonHandle) {
    if (flock($jsonHandle, LOCK_EX)) {
        ftruncate($jsonHandle, 0);
        rewind($jsonHandle);
        fwrite($jsonHandle, json_encode($existingJson, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
        flock($jsonHandle, LOCK_UN);
    }
    fclose($jsonHandle);
}

// --------------------------------------------------------------------------
// 6. Success Response via PRG Pattern
// --------------------------------------------------------------------------
$_SESSION['p7_success'] = "Student record for {$fullName} ({$enrollmentNo}) has been safely saved to both CSV and JSON storage files!";
unset($_SESSION['p7_old'], $_SESSION['p7_errors']);

header('Location: index.php');
exit;
