<?php
abstract class ChordsValidator {
    public static function validateChordId($chordId): void {
        if ($chordId <= 0) {
            throw new InvalidArgumentException('Chord id cannot be null!');
        }
    }

    public static function validateUserId($userId): void {
        if ($userId <= 0) {
            throw new InvalidArgumentException('User id cannot be null!');
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
            throw new InvalidArgumentException('The '.$text.' cannot be null, empty or blank!');
        }
    }
}