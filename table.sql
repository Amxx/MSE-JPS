-- phpMyAdmin SQL Dump
-- version 4.3.12
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Mar 28, 2015 at 04:08 AM
-- Server version: 10.0.17-MariaDB-log
-- PHP Version: 5.6.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `MSE-JPS`
--

-- --------------------------------------------------------

--
-- Table structure for table `articles`
--

CREATE TABLE IF NOT EXISTS `articles` (
  `Article_ID` int(10) NOT NULL,
  `Page_ID` int(10) NOT NULL COMMENT 't',
  `Article_Title` varchar(256) DEFAULT NULL,
  `Article_Text` text,
  `Article_Javascript` text,
  `Article_Timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Article_Archived` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `citations`
--

CREATE TABLE IF NOT EXISTS `citations` (
  `Article_ID` int(10) NOT NULL,
  `Reference_ID` int(10) NOT NULL,
  `Citation_Order` int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `links`
--

CREATE TABLE IF NOT EXISTS `links` (
  `Link_ID` int(10) NOT NULL,
  `Link_Title` varchar(256) NOT NULL,
  `Link_Content` text NOT NULL,
  `Link_Timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `pages`
--

CREATE TABLE IF NOT EXISTS `pages` (
  `Page_ID` int(10) NOT NULL,
  `Page_Title` varchar(256) DEFAULT NULL,
  `Page_Block` varchar(256) DEFAULT NULL,
  `Page_Order` int(10) DEFAULT NULL,
  `Page_Default` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `references`
--

CREATE TABLE IF NOT EXISTS `references` (
  `Reference_ID` int(10) NOT NULL,
  `Reference_Title` varchar(256) DEFAULT NULL,
  `Reference_Authors` varchar(1024) DEFAULT NULL,
  `Reference_Ref` varchar(1024) DEFAULT NULL,
  `Reference_Abstract` text,
  `Reference_Bibtex` text,
  `Reference_Timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `referencesources`
--

CREATE TABLE IF NOT EXISTS `referencesources` (
  `Referencesource_ID` int(10) NOT NULL,
  `Reference_ID` int(10) NOT NULL,
  `Referencesource_Name` varchar(256) NOT NULL,
  `Referencesource_Url` varchar(256) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `socials`
--

CREATE TABLE IF NOT EXISTS `socials` (
  `Social_ID` int(10) NOT NULL,
  `Social_Title` varchar(256) NOT NULL,
  `Social_Img` varchar(256) NOT NULL,
  `Social_Url` varchar(256) NOT NULL,
  `Social_Timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `articles`
--
ALTER TABLE `articles`
  ADD PRIMARY KEY (`Article_ID`), ADD KEY `Page_ID` (`Page_ID`);

--
-- Indexes for table `citations`
--
ALTER TABLE `citations`
  ADD KEY `Article_ID` (`Article_ID`), ADD KEY `Reference_ID` (`Reference_ID`);

--
-- Indexes for table `links`
--
ALTER TABLE `links`
  ADD PRIMARY KEY (`Link_ID`);

--
-- Indexes for table `pages`
--
ALTER TABLE `pages`
  ADD PRIMARY KEY (`Page_ID`), ADD UNIQUE KEY `order` (`Page_Order`);

--
-- Indexes for table `references`
--
ALTER TABLE `references`
  ADD PRIMARY KEY (`Reference_ID`);

--
-- Indexes for table `referencesources`
--
ALTER TABLE `referencesources`
  ADD PRIMARY KEY (`Referencesource_ID`), ADD KEY `Reference_ID` (`Reference_ID`);

--
-- Indexes for table `socials`
--
ALTER TABLE `socials`
  ADD PRIMARY KEY (`Social_ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `articles`
--
ALTER TABLE `articles`
  MODIFY `Article_ID` int(10) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=28;
--
-- AUTO_INCREMENT for table `links`
--
ALTER TABLE `links`
  MODIFY `Link_ID` int(10) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `pages`
--
ALTER TABLE `pages`
  MODIFY `Page_ID` int(10) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=10;
--
-- AUTO_INCREMENT for table `references`
--
ALTER TABLE `references`
  MODIFY `Reference_ID` int(10) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `referencesources`
--
ALTER TABLE `referencesources`
  MODIFY `Referencesource_ID` int(10) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `socials`
--
ALTER TABLE `socials`
  MODIFY `Social_ID` int(10) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `articles`
--
ALTER TABLE `articles`
ADD CONSTRAINT `articles_ibfk_1` FOREIGN KEY (`Page_ID`) REFERENCES `pages` (`page_id`);

--
-- Constraints for table `citations`
--
ALTER TABLE `citations`
ADD CONSTRAINT `citations_ibfk_1` FOREIGN KEY (`Article_ID`) REFERENCES `articles` (`Article_ID`),
ADD CONSTRAINT `citations_ibfk_2` FOREIGN KEY (`Reference_ID`) REFERENCES `references` (`Reference_ID`);

--
-- Constraints for table `referencesources`
--
ALTER TABLE `referencesources`
ADD CONSTRAINT `referencesources_ibfk_1` FOREIGN KEY (`Reference_ID`) REFERENCES `references` (`Reference_ID`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
