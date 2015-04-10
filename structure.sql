-- phpMyAdmin SQL Dump
-- version 4.4.1.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Apr 10, 2015 at 07:42 PM
-- Server version: 10.0.17-MariaDB-log
-- PHP Version: 5.6.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `amxx_website`
--

-- --------------------------------------------------------

--
-- Table structure for table `MSE_articles`
--

CREATE TABLE IF NOT EXISTS `MSE_articles` (
  `Article_ID` int(10) NOT NULL,
  `Page_ID` int(10) NOT NULL COMMENT 't',
  `Article_Title` varchar(256) DEFAULT NULL,
  `Article_Text` text,
  `Article_Javascript` text,
  `Article_Timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Article_Order` int(10) DEFAULT NULL,
  `Article_Archived` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `MSE_citations`
--

CREATE TABLE IF NOT EXISTS `MSE_citations` (
  `Citation_ID` int(10) NOT NULL,
  `Article_ID` int(10) NOT NULL,
  `Reference_ID` int(10) NOT NULL,
  `Citation_Order` int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `MSE_links`
--

CREATE TABLE IF NOT EXISTS `MSE_links` (
  `Link_ID` int(10) NOT NULL,
  `Link_Title` varchar(256) NOT NULL,
  `Link_Content` text NOT NULL,
  `Link_Order` int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `MSE_pages`
--

CREATE TABLE IF NOT EXISTS `MSE_pages` (
  `Page_ID` int(10) NOT NULL,
  `Page_Title` varchar(256) DEFAULT NULL,
  `Page_Style` varchar(256) DEFAULT NULL,
  `Page_Bordered` tinyint(1) NOT NULL,
  `Page_Expandable` tinyint(1) NOT NULL,
  `Page_Order` int(10) DEFAULT NULL,
  `Page_Default` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `MSE_references`
--

CREATE TABLE IF NOT EXISTS `MSE_references` (
  `Reference_ID` int(10) NOT NULL,
  `Reference_Title` varchar(256) DEFAULT NULL,
  `Reference_Authors` varchar(1024) DEFAULT NULL,
  `Reference_Ref` varchar(1024) DEFAULT NULL,
  `Reference_Abstract` text,
  `Reference_Bibtex` text,
  `Reference_Timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `MSE_socials`
--

CREATE TABLE IF NOT EXISTS `MSE_socials` (
  `Social_ID` int(10) NOT NULL,
  `Social_Title` varchar(256) NOT NULL,
  `Social_Img` varchar(256) NOT NULL,
  `Social_Url` varchar(256) NOT NULL,
  `Social_ShowText` tinyint(1) NOT NULL DEFAULT '1',
  `Social_Order` int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `MSE_sources`
--

CREATE TABLE IF NOT EXISTS `MSE_sources` (
  `Source_ID` int(10) NOT NULL,
  `Reference_ID` int(10) NOT NULL,
  `Source_Title` varchar(256) NOT NULL,
  `Source_Url` varchar(256) NOT NULL,
  `Source_Order` int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `MSE_articles`
--
ALTER TABLE `MSE_articles`
  ADD PRIMARY KEY (`Article_ID`),
  ADD KEY `Page_ID` (`Page_ID`);

--
-- Indexes for table `MSE_citations`
--
ALTER TABLE `MSE_citations`
  ADD PRIMARY KEY (`Citation_ID`),
  ADD KEY `Article_ID` (`Article_ID`),
  ADD KEY `Reference_ID` (`Reference_ID`);

--
-- Indexes for table `MSE_links`
--
ALTER TABLE `MSE_links`
  ADD PRIMARY KEY (`Link_ID`);

--
-- Indexes for table `MSE_pages`
--
ALTER TABLE `MSE_pages`
  ADD PRIMARY KEY (`Page_ID`),
  ADD KEY `Page_ID` (`Page_ID`);

--
-- Indexes for table `MSE_references`
--
ALTER TABLE `MSE_references`
  ADD PRIMARY KEY (`Reference_ID`);

--
-- Indexes for table `MSE_socials`
--
ALTER TABLE `MSE_socials`
  ADD PRIMARY KEY (`Social_ID`);

--
-- Indexes for table `MSE_sources`
--
ALTER TABLE `MSE_sources`
  ADD PRIMARY KEY (`Source_ID`),
  ADD KEY `Reference_ID` (`Reference_ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `MSE_articles`
--
ALTER TABLE `MSE_articles`
  MODIFY `Article_ID` int(10) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `MSE_citations`
--
ALTER TABLE `MSE_citations`
  MODIFY `Citation_ID` int(10) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `MSE_links`
--
ALTER TABLE `MSE_links`
  MODIFY `Link_ID` int(10) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `MSE_pages`
--
ALTER TABLE `MSE_pages`
  MODIFY `Page_ID` int(10) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `MSE_references`
--
ALTER TABLE `MSE_references`
  MODIFY `Reference_ID` int(10) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `MSE_socials`
--
ALTER TABLE `MSE_socials`
  MODIFY `Social_ID` int(10) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `MSE_sources`
--
ALTER TABLE `MSE_sources`
  MODIFY `Source_ID` int(10) NOT NULL AUTO_INCREMENT;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `MSE_articles`
--
ALTER TABLE `MSE_articles`
  ADD CONSTRAINT `MSE_articles_ibfk_1` FOREIGN KEY (`Page_ID`) REFERENCES `MSE_pages` (`Page_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `MSE_citations`
--
ALTER TABLE `MSE_citations`
  ADD CONSTRAINT `MSE_citations_ibfk_1` FOREIGN KEY (`Article_ID`) REFERENCES `MSE_articles` (`Article_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `MSE_citations_ibfk_2` FOREIGN KEY (`Reference_ID`) REFERENCES `MSE_references` (`Reference_ID`) ON DELETE CASCADE;

--
-- Constraints for table `MSE_sources`
--
ALTER TABLE `MSE_sources`
  ADD CONSTRAINT `MSE_sources_ibfk_1` FOREIGN KEY (`Reference_ID`) REFERENCES `MSE_references` (`Reference_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
