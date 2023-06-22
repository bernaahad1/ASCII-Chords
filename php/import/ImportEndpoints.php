<?php

include_once "./ImportRequestHandler.php";

$response = null;

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