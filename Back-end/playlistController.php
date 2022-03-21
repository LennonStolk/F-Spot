<?php

// Enables CORS
header("Access-Control-Allow-Origin: *");

// Adds validation functions that are needed
include_once "./validationFunctions.php";

// Makes a connection to the database
include_once "./databaseConnection.php";

// Checks for a method
if (isset($_POST["method"])) {
    $method = $_POST["method"];
}
else {
    echo(json_encode('noMethodFound'));;
}

if ($method == "createPlaylist") {
    $userName = isset($_POST["userName"]) ? $_POST["userName"] : null;
    $password = isset($_POST["password"]) ? $_POST["password"] : null;
    $playlistName = isset($_POST["playlistName"]) ? $_POST["playlistName"] : null;

    if (authenticate($db, $userName, $password) == false) {
        echo(json_encode('authenticationFailed'));
        die();
    }

    createPlaylist($db, $userName, $playlistName);
}
elseif ($method == "getPlaylists") {
    $userName = isset($_POST["userName"]) ? $_POST["userName"] : null;
    $password = isset($_POST["password"]) ? $_POST["password"] : null;

    if (authenticate($db, $userName, $password) == false) {
        echo(json_encode('authenticationFailed'));
        die();
    }

    getPlaylists($db, $userName);
}
elseif ($method == "removePlaylist") {
    $userName = isset($_POST["userName"]) ? $_POST["userName"] : null;
    $password = isset($_POST["password"]) ? $_POST["password"] : null;
    $playlistId = isset($_POST["playlistId"]) ? $_POST["playlistId"] : null;

    if (authenticate($db, $userName, $password) == false) {
        echo(json_encode('authenticationFailed'));
        die();
    }

    removePlaylist($db, $userName, $playlistId);
}

function createPlaylist($db, $userName, $playlistName) {
    // Check conditions
    if (strlen($playlistName) > 15) {
        echo(json_encode('playlistNameTooLong'));
        die();
    }
    elseif ($playlistName == "") {
        echo(json_encode('emptyFields'));
        die();
    }
    elseif (checkLegalCharacters($userName, "abcdefghijklmnopqrstuvwxyz1234567890_-") == false) {
        echo(json_encode('illegalCharacters'));
        die();
    }

    // Get id from user
    $userId = getIdFromUserName($db, $userName);

    // Insert playlist into database
    $sql = 'INSERT INTO fspot_playlists (name, userId) VALUES (:playlistName, :userId);';
    $vars = [
        "playlistName" => $playlistName,
        "userId" => $userId,
    ];
    $stmt = $db->prepare($sql);
    $stmt->execute($vars);

    // Get inserted playlist
    $sql = 'SELECT * FROM fspot_playlists WHERE id = :id';
    $vars = ["id" => $db->lastInsertId()];
    $stmt = $db->prepare($sql);
    $stmt->execute($vars);
    $result = $stmt->fetch();

    echo(json_encode($result));
    die();
}

function getPlaylists($db, $userName) {
    // Get id from user
    $userId = getIdFromUserName($db, $userName);

    // Get playlists
    $sql = 'SELECT * FROM fspot_playlists WHERE userId = :userId';
    $vars = ["userId" => $userId];
    $stmt = $db->prepare($sql);
    $stmt->execute($vars);
    $result = $stmt->fetchAll();

    echo(json_encode($result));
    die();
}

function removePlaylist($db, $userName, $id) {
    // Get id from user
    $userId = getIdFromUserName($db, $userName);

    // Get playlists
    $sql = 'DELETE FROM fspot_playlists WHERE userId = :userId AND id = :id';
    $vars = [
        "userId" => $userId,
        "id" => $id,
    ];
    $stmt = $db->prepare($sql);
    $stmt->execute($vars);

    echo(json_encode("successfullyRemoved"));
    die();
}

function getPlaylistEntries($db, $userName, $playlistId) {
    // Get id from user
    $userId = getIdFromUserName($db, $userName);

    // Get playlists
    $sql = 'SELECT * FROM fspot_playlist_entries WHERE userId = :userId AND playlistId = :playlistId';
    $vars = [
        "userId" => $userId,
        "playlistId" => $playlistId,
    ];
    $stmt = $db->prepare($sql);
    $stmt->execute($vars);
    $result = $stmt->fetchAll();

    echo(json_encode($result));
    die();
}

function getIdFromUserName($db, $userName) {
    $sql = 'SELECT id FROM fspot_users WHERE username = :userName';
    $vars = ["userName" => $userName];
    $stmt = $db->prepare($sql);
    $stmt->execute($vars);
    $result = $stmt->fetch()[0];

    return $result;
}

function getPasswordHash($db, $userName) {
    $sql = 'SELECT password FROM fspot_users WHERE username = :userName';
    $vars = ["userName" => $userName];
    $stmt = $db->prepare($sql);
    $stmt->execute($vars);
    $result = $stmt->fetch()[0];

    return $result;
}

function checkNameExists($db, $userName) {
    $sql = 'SELECT * FROM fspot_users WHERE username = :userName';
    $vars = ["userName" => $userName];
    $stmt = $db->prepare($sql);
    $stmt->execute($vars);
    $result = ($stmt->fetch() > 0) ? true : false;

    return $result;
}

function authenticate($db, $userName, $password) {
    if (anyEmpty([$userName, $password])) {
        return false;
    } 
    elseif (!checkNameExists($db, $userName)) {
        return false;
    }
    else {
        $dbHash = getPasswordHash($db, $userName);
        $passwordCorrect = password_verify($password, $dbHash);

        return $passwordCorrect;
    }
}