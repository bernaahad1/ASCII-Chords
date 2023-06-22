<?php
session_start();

include_once "UserRequestHandler.php";
include_once "../exceptions/NoContentException.php";

$response = null;

if ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_SESSION['user_id'])) {
    $response = UserRequestHandler::getUserById($_SESSION['user_id'])->jsonSerialize();
}
elseif ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['email'])) {
    $response = UserRequestHandler::getUserByEmail($_GET['email']);
}
elseif ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $response = UserRequestHandler::saveNewUser();
} 
elseif ($_SERVER['REQUEST_METHOD'] == 'PUT' && isset($_SESSION['user_id'])) {
    $response = UserRequestHandler::updateUserById($_SESSION['user_id']);
}   
elseif ($_SERVER['REQUEST_METHOD'] == 'DELETE' && isset($_SESSION['user_id'])) {
    $response = UserRequestHandler::deleteUserById($_SESSION['user_id']);
}

if ($response == null) {
    throw new NoContentException("There is no content!");
}

echo json_encode($response, JSON_UNESCAPED_UNICODE);