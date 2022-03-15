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