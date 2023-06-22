<?php
session_start();

include_once "ChordRequestHandler.php";

$response = null;

if ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_SESSION['user_id'])) {
    $response = ChordRequestHandler::getChordsFavouriteByUserId($_SESSION['user_id']);
}
elseif ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['id'])) {
    $response = ChordRequestHandler::getSingleChord($_GET['id'])->jsonSerialize();
}
elseif ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $response = ChordRequestHandler::getAllChordsIDs();
}
elseif($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_GET['name']) && isset($_GET['description'])) {
    $response = ChordRequestHandler::addNewChord($_GET['name'], $_GET['description']);
}
elseif($_SERVER['REQUEST_METHOD'] == 'PUT' && isset($_GET['id'])) {
    $response = ChordRequestHandler::updateChord($_GET['id']);
}
elseif($_SERVER['REQUEST_METHOD'] == 'DELETE' && isset($_GET['id'])) {
    $response = ChordRequestHandler::deleteChord($_GET['id']);
}

if ($response == null) {
    $response = "There is no data to display!";
}

echo json_encode($response, JSON_UNESCAPED_UNICODE);