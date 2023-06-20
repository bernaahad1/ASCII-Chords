<?php
include_once "../user/User.php";

$phpInput = json_decode(file_get_contents('php://input'), true);
// $phpInput = $_POST;

// validate php input

$username = $phpInput['username'];
$first_name = $phpInput['first_name'];
$last_name = $phpInput['last_name'];
$email = $phpInput['email'];
$password = $phpInput['password']; 

$user = new User($username, $first_name, $last_name, $email, $password, 0);

try {
    $user->saveNewUser();
    
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
    ]);
}