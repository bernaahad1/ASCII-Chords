<?php
include_once "FavouriteChordsRequestHandler.php";

$response = null;


if ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['user_id']) && isset($_GET['chord_id'])) {
    $response = FavouriteChordsRequestHandler::getFavouriteChordByUserIdAndChordId($_GET['user_id'], $_GET['chord_id'])->jsonSerialize();
}
elseif ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['user_id'])) {
    $response = FavouriteChordsRequestHandler::getAllRecordsByUserId($_GET['user_id']);
}
elseif ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['chord_id'])) {
    $response = FavouriteChordsRequestHandler::getAllRecordsByChordId($_GET['chord_id']);
}
elseif ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_GET['user_id']) && isset($_GET['chord_id'])) {
    $response = FavouriteChordsRequestHandler::addFavouriteChord($_GET['user_id'], $_GET['chord_id']);
}
elseif ($_SERVER['REQUEST_METHOD'] == 'DELETE' && isset($_GET['user_id']) && isset($_GET['chord_id'])) {
    $response = FavouriteChordsRequestHandler::deleteFavouriteChord($_GET['user_id'], $_GET['chord_id']);
}

if ($response == null) {
    $response = "There is no data to display!";
}

echo json_encode($response, JSON_UNESCAPED_UNICODE);