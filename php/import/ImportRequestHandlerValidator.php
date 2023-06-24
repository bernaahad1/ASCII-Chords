<?php
include_once "../exceptions/ExceptionObject.php";

abstract class ImportRequestHandlerValidator {
    protected static function validateFileContent($file_content) : void {
        if ($file_content == null || empty($file_content)) {
            ExceptionObject::setResponseCode(400, 'The file content cannot be null, empty or blank!');
        }
    }

}