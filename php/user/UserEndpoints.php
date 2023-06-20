<?php
session_start();

include_once "UserRequestHandler.php";

$response = null;

// echo $_SESSION['user_id'];

if ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_SESSION['user_id'])) {
    $response = UserRequestHandler::getUserById($_SESSION['user_id'])->jsonSerialize();
}
elseif ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['email'])) {
    $response = UserRequestHandler::getUserByEmail($_GET['email']);
}
elseif ($_SERVER['REQUEST_METHOD'] == 'PUT' && isset($_SESSION['user_id'])) {
    $response = UserRequestHandler::updateUserById($_SESSION['user_id']);
}   
elseif ($_SERVER['REQUEST_METHOD'] == 'DELETE' && isset($_SESSION['user_id'])) {
    $response = UserRequestHandler::deleteUserById($_SESSION['user_id']);
}

// if ($_SESSION['user_id'] == null) {
//     $response = "AAAAAA!";
// }

if ($response == null) {
    $response = "There is no data to display!";
}

echo json_encode($response, JSON_UNESCAPED_UNICODE);