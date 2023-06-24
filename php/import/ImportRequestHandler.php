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
        $file_content = str_replace('%23', '#', $file_content);

        foreach ($file_content as $line) {
            $line = self::prepareDataCSV($line);
            self::saveChord($line[0], $line[1]);
        }
    }

    private static function loadDataFromTxt($file_content) : void {
        $file_content = str_replace('%23', '#', $file_content);
        echo($file_content);
        $file_content =  explode(',', $file_content);

        foreach ($file_content as $line) {
            $line = self::prepareData($line);
            self::saveChord($line[0], $line[1]);
        }
    }

    private static function loadDataFromJson($file_content) : void {
        $file_content = str_replace('%23', '#', $file_content);
        $jsonData = json_decode($file_content, true);

        foreach ($jsonData as $line) {
            self::saveChord($line['name'], $line['description']);
        }
    }

    private static function prepareData($line) : array {
        $line = trim($line);
        return explode('|', $line);
    }

    private static function prepareDataCSV($line) : array {
        $line = trim($line);
        return explode(';', $line);
    }

    private static function saveChord($name, $description) : void {
        ChordRequestHandler::addNewChord(trim($name), trim($description));
    }
}