<?php

include_once "ImportRequestHandlerValidator.php";
include_once "../chords/ChordRequestHandler.php";

class ImportRequestHandler extends ImportRequestHandlerValidator {
    public static function getAllDataFromCSV($filePath) {
        self::validateFilePath($filePath);

        try {
            self::loadDataFromCsv($filePath);
            
            return ['success' => true];
        } catch (Exception $e) {
            return [
                 'success' => false,
                 'message' => $e->getMessage(),
            ];
        }
    }

    public static function getAllDataFromTXT($filePath) {
        self::validateFilePath($filePath);

        try {
            self::loadDataFromTxt($filePath);
            
            return ['success' => true];
        } catch (Exception $e) {
            return [
                 'success' => false,
                 'message' => $e->getMessage(),
            ];
        }
    }

    public static function getAllDataFromJSON($filePath) {
        self::validateFilePath($filePath);

        try {
            self::loadDataFromJson($filePath);
            
            return ['success' => true];
        } catch (Exception $e) {
            return [
                 'success' => false,
                 'message' => $e->getMessage(),
            ];
        }
    }

    private static function loadDataFromCsv($filePath) {
        $csv = array_map('str_getcsv', file($filePath));
            self::validateFileData($csv);

            for ($i = 0; $i < count($csv); $i++) {
                self::saveChord($csv[$i][0], $csv[$i][1]);
            }
    }

    private static function loadDataFromTxt($filePath) : void {
        $handle = fopen($filePath, "r");
        if ($handle) {
            $i=0;
            while (($line = fgets($handle)) !== false) {
                $data = self::prepareData($line);
                self::saveChord($data[0], $data[1]);

                $i++;
            }
            fclose($handle);
        } else {
            throw new RuntimeException("There was problem in opening the file!");
        }
    }

    private static function loadDataFromJson($filePath) {
        $jsonFile = file_get_contents($filePath);

        $jsonData = json_decode($jsonFile, true);
        
        for ($i = 0; $i < count($jsonData['chords']); $i++) {
            self::saveChord($jsonData['chords'][$i]['name'], $jsonData['chords'][$i]['description']);
        }
    }

    private static function prepareData($line) : array {
        $line = trim($line);
        return explode('|', $line);
    }

    private static function saveChord($name, $description) : void {
        ChordRequestHandler::addNewChord($name, $description);
    }
}