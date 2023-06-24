<?php
include_once "../exceptions/ResourceNotFoundException.php";

abstract class ImportRequestHandlerValidator {
    protected static function validateFileContent($file_content) : void {
        if ($file_content == null || empty($file_content)) {
            throw new InvalidArgumentException('The file path cannot be null, empty or blank!');
        }
    }

}