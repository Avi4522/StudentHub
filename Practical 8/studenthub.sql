-- ============================================================================
-- StudentHub Master Database Schema & Seed Data
-- Subject: ITUE203 - Web Development Frameworks
-- Institution: CHAROTAR UNIVERSITY OF SCIENCE AND TECHNOLOGY (CHARUSAT)
-- Faculty: Faculty of Technology and Engineering (FTE) / CSPIT
-- Student: Avi Beladiya (25DCE007) - Computer Engineering
-- Semester: 3rd Semester, Academic Year 2026–27
-- Practicals Covered: Practical 8, 9, 10, 11, 12, 13, 14
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `studenthub`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `studenthub`;

-- Disable foreign key checks for clean re-creation
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `event_registrations`;
DROP TABLE IF EXISTS `registrations`;
DROP TABLE IF EXISTS `audit_logs`;
DROP TABLE IF EXISTS `student_hobbies`;
DROP TABLE IF EXISTS `hobbies`;
DROP TABLE IF EXISTS `events`;
DROP TABLE IF EXISTS `students`;
DROP TABLE IF EXISTS `users`;

SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------------------------------------------------------
-- 1. Users Table (Authentication, Passwords & Role-Based Access Control)
-- ----------------------------------------------------------------------------
CREATE TABLE `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('admin', 'student', 'faculty') NOT NULL DEFAULT 'student',
    `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 2. Students Table (Academic Directory & CRUD Operations)
-- ----------------------------------------------------------------------------
CREATE TABLE `students` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `student_id` VARCHAR(20) NOT NULL UNIQUE,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `course` VARCHAR(100) NOT NULL DEFAULT 'Computer Engineering',
    `gender` ENUM('Male', 'Female', 'Other') DEFAULT 'Male',
    `mobile` VARCHAR(15) NOT NULL,
    `college` VARCHAR(150) DEFAULT 'CSPIT / DEPSTAR, CHARUSAT',
    `branch` VARCHAR(100) DEFAULT 'CE',
    `semester` INT NOT NULL DEFAULT 3,
    `academic_year` VARCHAR(30) DEFAULT '2nd Year',
    `cgpa` DECIMAL(3,2) DEFAULT 8.50,
    `address` TEXT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'active',
    `photo_path` VARCHAR(255) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 3. Hobbies Table & Student Hobbies (Normalized Many-to-Many Relationship)
-- ----------------------------------------------------------------------------
CREATE TABLE `hobbies` (
    `hobby_id` INT AUTO_INCREMENT PRIMARY KEY,
    `hobby_name` VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `student_hobbies` (
    `student_id` INT NOT NULL,
    `hobby_id` INT NOT NULL,
    PRIMARY KEY (`student_id`, `hobby_id`),
    CONSTRAINT `fk_sh_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_sh_hobby` FOREIGN KEY (`hobby_id`) REFERENCES `hobbies` (`hobby_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 4. Events Table (Campus Events, Poster Uploads & Status Management)
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- 5. Registrations Table (Event Enrollments with Unique Constraint)
-- ----------------------------------------------------------------------------
CREATE TABLE `registrations` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `student_id` INT NOT NULL,
    `event_id` INT NOT NULL,
    `registration_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `status` ENUM('registered', 'attended', 'cancelled') DEFAULT 'registered',
    UNIQUE KEY `unique_student_event` (`student_id`, `event_id`),
    CONSTRAINT `fk_reg_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_reg_event` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create view alias event_registrations to preserve compatibility
CREATE OR REPLACE VIEW `event_registrations` AS
SELECT
    `id` AS `registration_id`,
    `student_id`,
    `event_id`,
    `registration_date`,
    `status`
FROM `registrations`;

-- ----------------------------------------------------------------------------
-- 6. Audit Logs Table (Administrative Traceability & Security Monitoring)
-- ----------------------------------------------------------------------------
CREATE TABLE `audit_logs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT DEFAULT NULL,
    `actor_username` VARCHAR(50) NOT NULL DEFAULT 'system',
    `action` VARCHAR(255) NOT NULL,
    `entity_type` VARCHAR(50) DEFAULT 'general',
    `entity_id` INT DEFAULT NULL,
    `details` TEXT DEFAULT NULL,
    `ip_address` VARCHAR(45) DEFAULT '127.0.0.1',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_audit_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- 1. Seed Users
-- Passwords:
-- admin / admin@studenthub.edu   -> Admin@123  (or admin123)
-- student / 25dce007@charusat... -> Student@123 (or Avi@1234)
-- faculty / faculty@charusat...  -> Faculty@123
INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `status`) VALUES
(1, 'admin', 'admin@studenthub.edu', '$2y$10$U3YhoLYdtJINHGwnHO/KDO4Dq6jy1mYhSe3G7Z2XN7rn4cd589B.O', 'admin', 'active'),
(2, 'avibeladiya', '25dce007@charusat.edu.in', '$2y$10$VAJBGHLESz8UL9/izfTvIumXqKdCUM.EGnmKpnj0xgKkLpvlLSQpO', 'student', 'active'),
(3, 'princy', 'princy@charusat.edu.in', '$2y$10$VAJBGHLESz8UL9/izfTvIumXqKdCUM.EGnmKpnj0xgKkLpvlLSQpO', 'student', 'active'),
(4, 'dr_sharma', 'faculty@studenthub.edu', '$2y$10$U3YhoLYdtJINHGwnHO/KDO4Dq6jy1mYhSe3G7Z2XN7rn4cd589B.O', 'faculty', 'active');

-- 2. Seed 21 Realistic Student Records
INSERT INTO `students` (`id`, `student_id`, `name`, `email`, `course`, `gender`, `mobile`, `college`, `branch`, `semester`, `academic_year`, `cgpa`, `address`, `status`) VALUES
(1, '25DCE007', 'Avi Beladiya', '25dce007@charusat.edu.in', 'Computer Engineering', 'Male', '9876543210', 'CSPIT, CHARUSAT', 'CE', 3, '2nd Year', 9.24, 'Anand, Gujarat', 'active'),
(2, '25DCE001', 'Aarav Patel', 'aarav.patel@charusat.edu.in', 'Computer Engineering', 'Male', '9876543211', 'CSPIT, CHARUSAT', 'CE', 3, '2nd Year', 8.85, 'Ahmedabad, Gujarat', 'active'),
(3, '25DCE002', 'Pranav Shah', 'pranav@charusat.edu.in', 'Computer Engineering', 'Male', '9876543212', 'CSPIT, CHARUSAT', 'CE', 3, '2nd Year', 9.15, 'Vadodara, Gujarat', 'active'),
(4, '25DIT015', 'Prateek Sharma', 'prateek.sharma@charusat.edu.in', 'Information Technology', 'Male', '9876543213', 'DEPSTAR, CHARUSAT', 'IT', 3, '2nd Year', 8.95, 'Surat, Gujarat', 'active'),
(5, '25DCE004', 'Dhruv Vaghani', 'dhruv@charusat.edu.in', 'Computer Engineering', 'Male', '9876543214', 'CSPIT, CHARUSAT', 'CE', 3, '2nd Year', 8.40, 'Rajkot, Gujarat', 'inactive'),
(6, '25DIT022', 'Nikhil Desai', 'nikhil.desai@charusat.edu.in', 'Information Technology', 'Male', '9876543215', 'DEPSTAR, CHARUSAT', 'IT', 3, '2nd Year', 8.70, 'Bhavnagar, Gujarat', 'active'),
(7, '25DAI031', 'Rohan Patel', 'rohan.patel@charusat.edu.in', 'AI & Data Science', 'Male', '9876543216', 'DEPSTAR, CHARUSAT', 'AI & DS', 3, '2nd Year', 9.42, 'Anand, Gujarat', 'active'),
(8, '25DCE008', 'Yash Joshi', 'yash.joshi@charusat.edu.in', 'Computer Engineering', 'Male', '9876543217', 'CSPIT, CHARUSAT', 'CE', 3, '2nd Year', 8.65, 'Nadiad, Gujarat', 'active'),
(9, '25DIT045', 'Harshil Shah', 'harshil.shah@charusat.edu.in', 'Information Technology', 'Male', '9876543218', 'DEPSTAR, CHARUSAT', 'IT', 3, '2nd Year', 8.60, 'Gandhinagar, Gujarat', 'active'),
(10, '25DAI052', 'Ishaan Patel', 'ishaan.patel@charusat.edu.in', 'AI & Data Science', 'Male', '9876543219', 'DEPSTAR, CHARUSAT', 'AI & DS', 3, '2nd Year', 8.10, 'Ahmedabad, Gujarat', 'inactive'),
(11, '25DCE011', 'Pranay Mehta', 'pranay.mehta@charusat.edu.in', 'Computer Engineering', 'Male', '9876543220', 'CSPIT, CHARUSAT', 'CE', 3, '2nd Year', 9.50, 'Vadodara, Gujarat', 'active'),
(12, '25DCE012', 'Karan Dave', 'karan.dave@charusat.edu.in', 'Computer Engineering', 'Male', '9876543221', 'CSPIT, CHARUSAT', 'CE', 5, '3rd Year', 8.35, 'Surat, Gujarat', 'active'),
(13, '25DIT033', 'Rohan Verma', 'rohan.verma@charusat.edu.in', 'Information Technology', 'Male', '9876543222', 'DEPSTAR, CHARUSAT', 'IT', 5, '3rd Year', 8.20, 'Rajkot, Gujarat', 'active'),
(14, '25DEC014', 'Devang Prajapati', 'devang.prajapati@charusat.edu.in', 'Electronics & Comm', 'Male', '9876543223', 'CSPIT, CHARUSAT', 'EC', 3, '2nd Year', 7.85, 'Mehsana, Gujarat', 'active'),
(15, '25DCE015', 'Het Patel', 'het.patel@charusat.edu.in', 'Computer Engineering', 'Male', '9876543224', 'CSPIT, CHARUSAT', 'CE', 3, '2nd Year', 8.75, 'Navsari, Gujarat', 'active'),
(16, '25DCE016', 'Tejas Parekh', 'tejas.parekh@charusat.edu.in', 'Computer Engineering', 'Male', '9876543225', 'CSPIT, CHARUSAT', 'CE', 3, '2nd Year', 8.80, 'Bharuch, Gujarat', 'active'),
(17, '25DME031', 'Mohit Parmar', 'mohit.parmar@charusat.edu.in', 'Mechanical Engineering', 'Male', '9876543226', 'CSPIT, CHARUSAT', 'ME', 3, '2nd Year', 8.05, 'Valsad, Gujarat', 'inactive'),
(18, '25DCL014', 'Jaydeep Vaghela', 'jaydeep.vaghela@charusat.edu.in', 'Civil Engineering', 'Male', '9876543227', 'CSPIT, CHARUSAT', 'CL', 3, '2nd Year', 7.65, 'Patan, Gujarat', 'active'),
(19, '24DCE028', 'Rahul Chauhan', 'rahul.chauhan@charusat.edu.in', 'Computer Engineering', 'Male', '9876543228', 'CSPIT, CHARUSAT', 'CE', 7, '4th Year', 8.90, 'Surendranagar, Gujarat', 'active'),
(20, '25DAI041', 'Bhavya Panchal', 'bhavya.panchal@charusat.edu.in', 'AI & Data Science', 'Male', '9876543229', 'DEPSTAR, CHARUSAT', 'AI & DS', 3, '2nd Year', 9.02, 'Junagadh, Gujarat', 'active'),
(21, '23DIT091', 'Kunal Desai', 'kunal.desai@charusat.edu.in', 'Information Technology', 'Male', '9876543230', 'DEPSTAR, CHARUSAT', 'IT', 7, '4th Year', 9.15, 'Morbi, Gujarat', 'active');

-- 3. Seed Hobbies & Student Hobbies
INSERT IGNORE INTO `hobbies` (`hobby_id`, `hobby_name`) VALUES
(1, 'Competitive Coding'),
(2, 'Robotics & Hardware'),
(3, 'Web Development'),
(4, 'Badminton'),
(5, 'Open Source'),
(6, 'Photography'),
(7, 'Chess');

INSERT IGNORE INTO `student_hobbies` (`student_id`, `hobby_id`) VALUES
(1, 1), (1, 3), (1, 5),
(2, 1), (2, 4),
(3, 2), (3, 3),
(4, 3), (4, 5),
(7, 1), (7, 5),
(9, 3), (9, 7);

-- 4. Seed 10 Events
INSERT INTO `events` (`id`, `title`, `category`, `event_date`, `event_time`, `venue`, `description`, `capacity`, `status`, `poster`) VALUES
(1, 'CHARUSAT National Tech Expo 2026', 'Technical', '2026-11-15', '10:00:00', 'Central Auditorium, Changa', 'Annual university showcase featuring AI innovations, IoT hardware prototypes, robotics, and capstones.', 350, 'Open', 'poster_techexpo.jpg'),
(2, 'DevForge 36-Hour Hackathon', 'Technical', '2026-12-02', '09:00:00', 'IT & CE Computer Lab Complex 3', 'Intensive team hackathon building full-stack web and mobile applications solving campus challenges.', 120, 'Open', 'poster_hackathon.jpg'),
(3, 'Annual Sports Meet: Spoural 2027', 'Sports', '2027-01-18', '08:30:00', 'University Athletic Grounds', 'Inter-department sports tournament with cricket, football, volleyball, badminton, and track events.', 500, 'Upcoming', 'poster_spoural.jpg'),
(4, 'Cloud & DevOps Masterclass', 'Workshop', '2026-11-25', '14:00:00', 'Software Lab 4, CSPIT', 'Walkthrough of Docker containers, CI/CD pipelines, Kubernetes, and AWS architecture deployment.', 60, 'Open', 'poster_cloud.jpg'),
(5, 'Machine Learning Healthcare Symposium', 'Seminar', '2027-02-10', '11:00:00', 'DEPSTAR Auditorium', 'Keynote lectures exploring predictive diagnostics and deep neural networks in modern medical technology.', 180, 'Upcoming', 'poster_ml.jpg'),
(6, 'RoboWar Robotics Combat Tournament', 'Technical', '2026-12-14', '13:00:00', 'Mechanical Workshop Arena', 'Combat robotics competition testing RC chassis strength, pneumatic flippers, and maneuvering speed.', 250, 'Open', 'poster_robowar.jpg'),
(7, 'Cybersecurity & Penetration Testing', 'Workshop', '2026-11-28', '10:00:00', 'Cyber Research Lab', 'Hands-on vulnerability scanning, SQL injection prevention, and Wireshark network protocol analysis.', 75, 'Open', 'poster_cyber.jpg'),
(8, 'Alumni Career Mentorship Series', 'Seminar', '2026-10-30', '15:30:00', 'Seminar Hall B', 'CHARUSAT alumni working in leading technology firms provide resume reviews and technical interview tips.', 300, 'Open', 'poster_alumni.jpg'),
(9, 'Inter-Department Chess Blitz', 'Sports', '2026-11-08', '16:00:00', 'Indoor Sports Hall', 'Rapid and blitz FIDE-rules chess championship open to all engineering departments.', 64, 'Closed', 'poster_chess.jpg'),
(10, 'Cultural Folk & Fusion Night', 'Cultural', '2027-01-20', '18:30:00', 'Open Air Amphitheatre', 'Music, traditional Garba, theatrical skits, and student musical performances.', 800, 'Upcoming', 'poster_cultural.jpg');

-- 5. Seed Event Registrations
INSERT INTO `registrations` (`id`, `student_id`, `event_id`, `registration_date`, `status`) VALUES
(1, 1, 1, '2026-10-15 10:30:00', 'registered'),
(2, 1, 2, '2026-10-16 11:20:00', 'registered'),
(3, 2, 1, '2026-10-15 14:10:00', 'registered'),
(4, 3, 2, '2026-10-17 09:45:00', 'registered'),
(5, 4, 3, '2026-10-18 16:00:00', 'registered'),
(6, 5, 1, '2026-10-18 17:30:00', 'cancelled'),
(7, 7, 2, '2026-10-19 08:15:00', 'registered'),
(8, 9, 4, '2026-10-19 09:20:00', 'registered'),
(9, 11, 1, '2026-10-19 10:05:00', 'registered'),
(10, 12, 6, '2026-10-19 11:40:00', 'registered');

-- 6. Seed Audit Logs
INSERT INTO `audit_logs` (`id`, `user_id`, `actor_username`, `action`, `entity_type`, `entity_id`, `details`, `ip_address`, `created_at`) VALUES
(1, 1, 'admin', 'SYSTEM_INIT', 'database', NULL, 'Database schema initialized with 5 core tables and seed data', '127.0.0.1', '2026-10-19 08:00:00'),
(2, 1, 'admin', 'ADMIN_LOGIN', 'users', 1, 'Admin user successfully logged in', '127.0.0.1', '2026-10-19 09:00:00'),
(3, 1, 'admin', 'STUDENT_EXPORT', 'students', NULL, 'Exported 21 student records to CSV format', '127.0.0.1', '2026-10-19 09:30:00'),
(4, 2, 'avibeladiya', 'STUDENT_LOGIN', 'users', 2, 'Student authenticated successfully', '127.0.0.1', '2026-10-19 10:15:00'),
(5, 2, 'avibeladiya', 'EVENT_REGISTER', 'registrations', 1, 'Registered for CHARUSAT National Tech Expo 2026', '127.0.0.1', '2026-10-19 10:20:00'),
(6, 1, 'admin', 'EVENT_UPDATE', 'events', 1, 'Updated capacity to 350 seats', '127.0.0.1', '2026-10-19 11:00:00'),
(7, 1, 'admin', 'VIEW_DASHBOARD', 'dashboard', NULL, 'Admin accessed system analytics metrics', '127.0.0.1', '2026-10-19 12:45:00');
