<?php
include_once "../exceptions/ResourceNotFoundException.php";

abstract class ImportRequestHandlerValidator {
    protected static function validateFilePath($filePath) : void {
        if ($filePath == null || empty($filePath)) {
            throw new InvalidArgumentException('The file path cannot be null, empty or blank!');
        }
    }

    protected static function validateFileData($fileData) {
        if ($fileData == null) {
            throw new ResourceNotFoundException('The file is empty!');
        } 
    }
}