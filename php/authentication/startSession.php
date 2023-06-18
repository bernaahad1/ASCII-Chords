<?php

session_start();

echo json_encode([
    'logged' => isset($_SESSION['email']),
    'email' => isset($_SESSION['email']) ? $_SESSION['email'] : null,
]);
