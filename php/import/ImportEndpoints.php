<?php
session_start();

include_once "ImportRequestHandler.php";
include_once "../exceptions/ExceptionObject.php";

$response = null;

if (!isset($_SESSION['user_id'])) {
    ExceptionObject::setResponseCode(401, "Please log in into your account or register!");
}

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_GET['csv_file_path'])) {
    $response = ImportRequestHandler::getAllDataFromCSV($_GET['csv_file_path']);
}
elseif ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_GET['txt_file_path'])) {
    $response = ImportRequestHandler::getAllDataFromTXT($_GET['txt_file_path']);
}
elseif ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_GET['json_file_path'])) {
     $response = ImportRequestHandler::getAllDataFromJSON($_GET['json_file_path']);
}

if ($response == null) {
    $response = "There is no data to display!";
}

echo json_encode($response, JSON_UNESCAPED_UNICODE);