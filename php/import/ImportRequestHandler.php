<?php

require "ImportRequestHandlerValidator.php";
require "../chords/Chord.php";

class ImportRequestHandler extends ImportRequestHandlerValidator {
    public static function getAllDataFromCSV($filePath) {
        self::validateFilePath($filePath);

        $csv = array_map('str_getcsv', file($filePath));
        self::validateFileData($csv);

        // validate name
        // validate description


        $chord = new Chord(null, $csv[0][0], $csv[0][1]);

        try {
            $chord->addNewChord();
            
            return true;
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            return false;
            echo json_encode([
                 'success' => false,
                 'message' => $e->getMessage(),
            ]);
        }

    }
}