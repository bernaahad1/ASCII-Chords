<?php
session_start();

include_once "../user/UserRequestHandler.php";
include_once "../user/User.php";

$loginInput = json_decode(file_get_contents('php://input'), true);

if (isset($_SESSION['email'])) {
    echo json_encode([
        'success' => true,
        'email' => $_SESSION['email'],
    ]);
} else {
    $email = $loginInput['email'];
    $password = $loginInput['password'];

    try {
        UserRequestHandler::login($loginInput['email'], $loginInput['password']);

        $_SESSION['user_id'] = UserRequestHandler::getUserByEmail($loginInput['email']);
        $_SESSION['email'] = $loginInput['email'];

        echo json_encode([
            'success' => true,
            'email' => $_SESSION['email'],
        ]);
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
        ]);
    }

}