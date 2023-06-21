<?php

include_once "ImportRequestHandlerValidator.php";
include_once "../chords/ChordRequestHandler.php";

class ImportRequestHandler extends ImportRequestHandlerValidator {
    public static function getAllDataFromCSV($filePath) {
        self::validateFilePath($filePath);

        $csv = array_map('str_getcsv', file($filePath));
        self::validateFileData($csv);

        try {
            for ($i = 0; $i < count($csv); $i++) {
                ChordRequestHandler::addNewChord($csv[$i][0], $csv[$i][1]);
            }
            
            // return true;
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            // return false;
            echo json_encode([
                 'success' => false,
                 'message' => $e->getMessage(),
            ]);
        }

    }
}