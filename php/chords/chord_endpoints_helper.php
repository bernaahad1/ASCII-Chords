<?php

$response = null;

require_once "./ChordRequestHandler.php";

if ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['id'])) {
    $response = ChordRequestHandler::getSingleChord($_GET['id']);
}

echo json_encode($response, JSON_UNESCAPED_UNICODE);