<?php
require "./UserRequestHandler.php";

$response = null;

if ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['user_id'])) {
    $response = UserRequestHandler::getUserById($_GET['user_id'])->jsonSerialize();
}
elseif ($_SERVER['REQUEST_METHOD'] == 'PUT' && isset($_GET['user_id'])) {
    $response = UserRequestHandler::updateUserById($_GET['user_id']);
}   
elseif ($_SERVER['REQUEST_METHOD'] == 'DELETE' && isset($_GET['user_id'])) {
    $response = UserRequestHandler::deleteUserById($_GET['user_id']);
}

if ($response == null) {
    $response = "There is no data to display!";
}

echo json_encode($response, JSON_UNESCAPED_UNICODE);