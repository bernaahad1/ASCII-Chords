<?php

$phpInput = json_decode(file_get_contents('php://input'), true);
// $phpInput = $_POST;

// validate php input

$username = $phpInput['username'];
$first_name = $phpInput['first_name'];
$last_name = $phpInput['last_name'];
$email = $phpInput['email'];
$password = $phpInput['password']; 


require_once "../user/User.php";

$user = new User($username, $first_name, $last_name, $email, $password);

try {
    $user->saveNewUser();
    
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
    ]);
}