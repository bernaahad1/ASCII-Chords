<?php

require "./ImportRequestHandler.php";

$response = null;

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['csv_file_path'])) {
    $response = ImportRequestHandler::getAllDataFromCSV($_POST['csv_file_path']);
}
// elseif ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['chord_id'])) {
//     $response = FavouriteChordsRequestHandler::getAllRecordsByChordId($_GET['chord_id']);
// }
// elseif ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['user_id']) && isset($_GET['chord_id'])) {
//     $response = FavouriteChordsRequestHandler::getFavouriteChordByUserIdAndChordId($_GET['user_id'], $_GET['chord_id']);
// }
// elseif ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_GET['user_id']) && isset($_GET['chord_id'])) {
//     $response = FavouriteChordsRequestHandler::addFavouriteChord($_GET['user_id'], $_GET['chord_id']);
// }
// elseif ($_SERVER['REQUEST_METHOD'] == 'DELETE' && isset($_GET['user_id']) && isset($_GET['chord_id'])) {
//     $response = FavouriteChordsRequestHandler::deleteFavouriteChord($_GET['user_id'], $_GET['chord_id']);
// }

if ($response == null) {
    echo "There is no data to display!";
}

echo json_encode($response, JSON_UNESCAPED_UNICODE);