CREATE TABLE IF NOT EXISTS `fspot_playlists` (
  `id` int(30) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(15) NOT NULL,
  `userId` int(30) NOT NULL,
  FOREIGN KEY (userId) REFERENCES fspot_users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;