<?php
include_once "../user/User.php";
include_once "../user/UserRequestHandler.php";

try {
    UserRequestHandler::saveNewUser();
    
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
    ]);
}