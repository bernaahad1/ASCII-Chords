<?php

$response = null;

require_once "./ChordRequestHandler.php";

if ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['id'])) {
    $response = ChordRequestHandler::getSingleChord($_GET['id']);
}

elseif ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $response = ChordRequestHandler::getAllChordsIDs();
}

echo json_encode($response, JSON_UNESCAPED_UNICODE);