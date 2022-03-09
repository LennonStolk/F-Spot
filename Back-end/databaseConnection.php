<?php

$host = "rdbms.strato.de";
$dbname = "dbs1554223";
$username = "dbu230922";
$password = "Tamboerijn18";
$connectStr = "mysql:host=" . $host . ";dbname=" . $dbname . ";charset=utf8";
$db = new PDO($connectStr, $username, $password);