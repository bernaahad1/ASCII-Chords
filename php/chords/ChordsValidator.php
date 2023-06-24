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
        self::validateNameCharacters($name);
    }

    public static function validateNameCharacters($name): void {
        if (!(preg_match('/^[A-G](#|b)? (major|minor|diminished|augmented)$/', $name))) {
            ExceptionObject::setResponseCode(400, 'Name should contain a note and a type of chord');
        }
    }

    public static function validateDescription($description): void {
        self::validateStringValue($description, 'description');
        self::validateDescriptionCharacters($description);
    }

    public static function validateDescriptionCharacters($description): void {
        if (!(preg_match('/^([A-G](#|b)?\-){2}[A-G](#|b)?$/', $description))) {
            ExceptionObject::setResponseCode(400, 'Description should contain note-note-note');
        }
    }

    public static function validateStringValue($value, $text) : void {
        if ($value == null || empty($value)) {
            ExceptionObject::setResponseCode(400, 'The ' . $text . ' cannot be null, empty or blank!');
        }
    }
}