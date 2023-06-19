<?php

session_start();

$loginInput = json_decode(file_get_contents('php://input'), true);

if (isset($_SESSION['email'])) {
    echo json_encode([
        'success' => true,
        'email' => $_SESSION['email'],
    ]);
} else {
    $email = $loginInput['email'];
    $password = $loginInput['password'];

    require_once "../user/User.php";

    $user = new User(null, null, null, $loginInput['email'], $loginInput['password']);
    try {
        $user->login();

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