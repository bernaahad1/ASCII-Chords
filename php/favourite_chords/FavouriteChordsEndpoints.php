<?php
session_start();

include_once "FavouriteChordsRequestHandler.php";
include_once "../exceptions/ExceptionObject.php";

$response = null;

if (!isset($_SESSION['user_id'])) {
    ExceptionObject::setResponseCode(401, "Please log in into your account or register!");
}


if ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_SESSION['user_id']) && isset($_GET['chord_id'])) {
    $response = ChordRequestHandler::getSingleChord(FavouriteChordsRequestHandler::getFavouriteChordByUserIdAndChordId($_SESSION['user_id'], $_GET['chord_id'])->getChordId())->jsonSerialize();
} elseif ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_SESSION['user_id'])) {
    $response = FavouriteChordsRequestHandler::getAllRecordsByUserId($_SESSION['user_id']);
} elseif ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['chord_id'])) {
    $response = FavouriteChordsRequestHandler::getAllRecordsByChordId($_GET['chord_id']);
} elseif ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_SESSION['user_id']) && isset($_GET['chord_id'])) {
    $response = FavouriteChordsRequestHandler::addFavouriteChord($_SESSION['user_id'], $_GET['chord_id']);
} elseif ($_SERVER['REQUEST_METHOD'] == 'DELETE' && isset($_SESSION['user_id']) && isset($_GET['chord_id'])) {
    $response = FavouriteChordsRequestHandler::deleteFavouriteChord($_SESSION['user_id'], $_GET['chord_id']);
}

if ($response == null) {
    ExceptionObject::setResponseCode(204, "There aren't any favourite chords!");
}

echo json_encode($response, JSON_UNESCAPED_UNICODE);