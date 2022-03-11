CREATE TABLE IF NOT EXISTS `fspot_playlist_entries` (
  `id` int(30) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `position` int(30) NOT NULL,
  `playlistId` int(30) NOT NULL,
  `songId` int(30) NOT NULL,
  FOREIGN KEY (playlistId) REFERENCES fspot_playlists(id),
  FOREIGN KEY (songId) REFERENCES fspot_songs(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;