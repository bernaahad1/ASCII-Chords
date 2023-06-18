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

        $chord = new Chord(null, $csv['0'], $csv['1']);

        try {
            $chord->addNewChord();
            
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage(),
            ]);
        }

    }
}