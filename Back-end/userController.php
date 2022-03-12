<?php

// Adds validation functions that are needed
include_once "./validationFunctions.php";

// Makes a connection to the database
include_once "./databaseConnection.php";

// Checks for a method
if (isset($_POST["method"])) {
    $method = $_POST["method"];
}
else {
    echo 'noMethodFound';
}

if ($method == "createAccount") {
    $userName = isset($_POST["userName"]) ? $_POST["userName"] : null;
    $email = isset($_POST["email"]) ? $_POST["email"] : null;
    $password = isset($_POST["password"]) ? $_POST["password"] : null;
    createAccount($db, $userName, $email, $password);
}

if ($method == "logIn") {
    $userName = isset($_POST["userName"]) ? $_POST["userName"] : null;
    $password = isset($_POST["password"]) ? $_POST["password"] : null;
    logIn($db, $userName, $password);
}

if ($method == "checkEmailExists") {
    $email = isset($_POST["email"]) ? $_POST["email"] : null;

    echo checkEmailExists($db, $email);
}

if ($method == "checkNameExists") {
    $userName = isset($_POST["userName"]) ? $_POST["userName"] : null;

    echo checkNameExists($db, $userName);
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

function checkEmailExists($db, $email) {
    $sql = 'SELECT * FROM fspot_users WHERE email = :email';
    $vars = ["email" => $email];
    $stmt = $db->prepare($sql);
    $stmt->execute($vars);
    $result = ($stmt->fetch() > 0) ? true : false;

    return $result;
}

function createAccount($db, $userName, $email, $password) {
    if (anyEmpty([$userName, $email, $password])) {
        echo 'emptyFields';
        die();
    } 
    elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo 'invalidEmail';
        die();
    }
    elseif (strlen($userName) > 15) {
        echo 'nameTooLong';
        die();
    }
    elseif (strlen($email) > 50) {
        echo 'emailTooLong';
        die();
    }
    elseif (checkNameExists($db, $userName)) {
        echo 'nameAlreadyExists';
        die();
    }
    elseif (checkEmailExists($db, $email)) {
        echo 'emailAlreadyExists';
        die();
    }
    elseif (($password = password_hash($password, PASSWORD_DEFAULT)) == false) {
        echo 'passwordCantBeHashed';
        die();
    }
    elseif (checkLegalCharacters($userName, "abcdefghijklmnopqrstuvwxyz1234567890_-") == false) {
        echo 'illegalCharacters';
        die();
    }
    else {
        $sql = 'INSERT INTO fspot_users (username, email, password) VALUES (:userName, :email, :password);';
        $vars = [
            "userName" => $userName,
            "email" => $email,
            "password" => $password,
        ];
        $stmt = $db->prepare($sql);
        $stmt->execute($vars);

        echo 'successfullyMadeAccount';
        die();
    }
}

function logIn($db, $userName, $password) {
    if (anyEmpty([$userName, $password])) {
        echo 'emptyFields';
        die();
    } 
    elseif (!checkNameExists($db, $userName)) {
        echo 'nameDoesntExist';
        die();
    }
    else {
        $dbHash = getPasswordHash($db, $userName);
        $passwordCorrect = password_verify($password, $dbHash);

        if ($passwordCorrect != 1) {
            echo 'wrongPassword';
            die();
        }
        else {
            echo 'successfullyLoggedIn';
            die();
        }
    }
}