-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 16, 2023 at 07:37 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ascii_chords`
--

-- --------------------------------------------------------

--
-- Table structure for table `chords`
--

CREATE TABLE `chords` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` varchar(100) NOT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chords`
--

INSERT INTO `chords` (`id`, `name`, `description`, `deleted`) VALUES
(1, 'C major', 'C-E-G', 0),
(2, 'C# major', 'C#-E#-G#', 0),
(3, 'D major', 'D-F#-A', 0),
(4, 'Eb major', 'Eb-G-Bb', 0),
(5, 'E major', 'E-G-B', 0),
(6, 'F major', 'F-A-C', 0),
(7, 'F# major', 'F#-A#-C#', 0),
(8, 'G major', 'G-B-D', 0),
(9, 'Ab major', 'Ab-C-Eb', 0),
(10, 'A major', 'A-C#-E', 0),
(11, 'Bb major', 'Bb-D-F', 0),
(12, 'B major', 'B-D#-F#', 0),
(13, 'C minor', 'C-Eb-G', 0),
(14, 'C# minor', 'C#-E-G#', 0),
(15, 'D minor', 'D-F-A', 0),
(16, 'Eb minor', 'Eb-Gb-Bb', 0),
(17, 'E minor', 'E-G-B', 0),
(18, 'F minor', 'F-Ab-C', 0),
(19, 'F# minor', 'F#-A-C#', 0),
(20, 'G minor', 'G-Bb-D', 0),
(21, 'Ab minor', 'Ab-B-Eb', 0),
(22, 'A minor', 'A-C-E', 0),
(23, 'Bb minor', 'Bb-Db-F', 0),
(24, 'B minor', 'B-D-F#', 0);

-- --------------------------------------------------------

--
-- Table structure for table `favourite_chords`
--

CREATE TABLE `favourite_chords` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `chord_id` bigint(20) UNSIGNED NOT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `username` varchar(50) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chords`
--
ALTER TABLE `chords`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`,`description`);

--
-- Indexes for table `favourite_chords`
--
ALTER TABLE `favourite_chords`
  ADD PRIMARY KEY (`id`),
  ADD KEY `User id constraint` (`user_id`),
  ADD KEY `Chord id constraint` (`chord_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`,`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chords`
--
ALTER TABLE `chords`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `favourite_chords`
--
ALTER TABLE `favourite_chords`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `favourite_chords`
--
ALTER TABLE `favourite_chords`
  ADD CONSTRAINT `Chord id constraint` FOREIGN KEY (`chord_id`) REFERENCES `chords` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `User id constraint` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
