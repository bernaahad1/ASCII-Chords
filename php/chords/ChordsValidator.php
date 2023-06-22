<?php
include_once "../exceptions/ExceptionObject.php";

abstract class ChordsValidator {
    public static function validateChordId($chordId): void {
        if ($chordId <= 0) {
            ExceptionObject::setResponseCode(400, 'Chord id cannot be null!');
        }
    }

    public static function validateUserId($userId): void {
        if ($userId <= 0) {
            ExceptionObject::setResponseCode(400, 'User id cannot be null!');
        }
    }

    public static function validateName($name): void {
        self::validateStringValue($name, 'name');
    }

    public static function validateDescription($description): void {
        self::validateStringValue($description, 'description');
    }

    public static function validateStringValue($value, $text) : void {
        if ($value == null || empty($value)) {
            ExceptionObject::setResponseCode(400, 'The '.$text.' cannot be null, empty or blank!');
        }
    }
}