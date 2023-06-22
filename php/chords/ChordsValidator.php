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
        self::validateNameCharacters($name);
    }

    public static function validateNameCharacters($name): void {
        if (!(preg_match('/^[A-G](#|b)? (major|minor|diminished|augmented)$/', $name))) {
            throw new InvalidArgumentException('Name should contain a note and a type of chord');
        }
    }

    public static function validateDescription($description): void {
        self::validateStringValue($description, 'description');
        self::validateDescriptionCharacters($description);
    }

    public static function validateDescriptionCharacters($description): void {
        if (!(preg_match('/^([A-G](#|b)?\-){2}[A-G](#|b)?$/', $description))) {
            throw new InvalidArgumentException('Description should contain note-note-note');
        }
    }

    public static function validateStringValue($value, $text) : void {
        if ($value == null || empty($value)) {
            throw new InvalidArgumentException('The '.$text.' cannot be null, empty or blank!');
        }
    }
}