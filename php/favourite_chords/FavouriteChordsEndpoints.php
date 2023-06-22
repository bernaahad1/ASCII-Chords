<?php
session_start();

include_once "FavouriteChordsRequestHandler.php";

$response = null;

if ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_SESSION['user_id']) && isset($_GET['chord_id'])) {
    $response = ChordRequestHandler::getSingleChord(FavouriteChordsRequestHandler::getFavouriteChordByUserIdAndChordId($_SESSION['user_id'], $_GET['chord_id'])->getChordId())->jsonSerialize();
} 
elseif ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_SESSION['user_id'])) {
    $response = FavouriteChordsRequestHandler::getAllRecordsByUserId($_SESSION['user_id']);
} 
elseif ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['chord_id'])) {
    $response = FavouriteChordsRequestHandler::getAllRecordsByChordId($_GET['chord_id']);
}
 elseif ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_SESSION['user_id']) && isset($_GET['chord_id'])) {
    $response = FavouriteChordsRequestHandler::addFavouriteChord($_SESSION['user_id'], $_GET['chord_id']);
} 
elseif ($_SERVER['REQUEST_METHOD'] == 'DELETE' && isset($_SESSION['user_id']) && isset($_GET['chord_id'])) {
    $response = FavouriteChordsRequestHandler::deleteFavouriteChord($_SESSION['user_id'], $_GET['chord_id']);
}

if ($response == null) {
    $response = "There is no data to display!";
    // TODO better way of handling this
    http_response_code(204);

}

echo json_encode($response, JSON_UNESCAPED_UNICODE);