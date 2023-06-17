<?php

$response = null;

require "./UserRequestHandler.php";

if ($_SERVER['REQUEST_METHOD'] == 'PUT' && isset($_GET['id']) && isset($_POST['update'])) {
    $response = UserRequestHandler::updateUserById($_GET['id'], $_PUT['update']);
}
    
elseif ($_SERVER['REQUEST_METHOD'] == 'DELETE' && isset($_GET['id'])) {
    $response = UserRequestHandler::deleteUserById($_GET['id']);
}

if ($response == null) {
    echo "There is no data to display!";
}

echo json_encode($response, JSON_UNESCAPED_UNICODE);