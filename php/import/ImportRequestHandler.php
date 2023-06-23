<?php

include_once "ImportRequestHandlerValidator.php";
include_once "../chords/ChordRequestHandler.php";

class ImportRequestHandler extends ImportRequestHandlerValidator {
    public static function getAllDataFromCSV($file_content) {
        try {
            self::loadDataFromCsv($file_content);
            return ['success' => true];

        } catch (Exception $e) {
            return [
                 'success' => false,
                 'message' => $e->getMessage(),
            ];
        }
    }

    public static function getAllDataFromTXT($file_content) {
        try {
            self::loadDataFromTxt($file_content);
            return ['success' => true];

        } catch (Exception $e) {
            return [
                 'success' => false,
                 'message' => $e->getMessage(),
            ];
        }
    }

    public static function getAllDataFromJSON($file_content) {
        try {
            self::loadDataFromJson($file_content);           
            return ['success' => true];

        } catch (Exception $e) {
            return [
                 'success' => false,
                 'message' => $e->getMessage(),
            ];
        }
    }

    private static function loadDataFromCsv($file_content) : void {
        echo($file_content);
        
        $file_content =  explode(',', $file_content);
        echo(11);
        echo($file_content);

        foreach ($file_content as $line) {
            echo($line."\n");
            // $line = self::prepareDataCSV($line);
            self::saveChord($line[0], $line[1]);
        }
    }
    //     $csv = array_map('str_getcsv', file($filePath));
    //         self::validateFileData($csv);

    //         for ($i = 0; $i < count($csv); $i++) {
    //             self::saveChord($csv[$i][0], $csv[$i][1]);
    //         }
    // }

    private static function loadDataFromTxt($file_content) : void {
        $file_content =  explode(',', $file_content);

        foreach ($file_content as $line) {
            echo($line."\n");
            $line = self::prepareData($line);
            self::saveChord($line[0], $line[1]);
        }
    }

    private static function loadDataFromJson($filePath) : void {
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

    private static function prepareDataCSV($line) : array {
        $line = trim($line);
        return explode(',', $line);
    }

    private static function saveChord($name, $description) : void {
        ChordRequestHandler::addNewChord(trim($name), trim($description));
    }
}