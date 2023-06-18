<?php

// $response = null;

require "./FavouriteChordsRequestHandler.php";

if ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['user_id'])) {
    $response = FavouriteChordsRequestHandler::getAllRecordsByUserId($_GET['user_id']);
}
elseif ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['chord_id'])) {
    $response = FavouriteChordsRequestHandler::getAllRecordsByChordId($_GET['chord_id']);
}

if ($response == null) {
    echo "There is no data to display!";
}

echo json_encode($response, JSON_UNESCAPED_UNICODE);