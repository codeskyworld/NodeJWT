 CREATE DATABASE IF NOT EXISTS webcomputing;
 
 USE webcomputing;
 
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(500) NOT NULL,
  `password` varchar(500) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
