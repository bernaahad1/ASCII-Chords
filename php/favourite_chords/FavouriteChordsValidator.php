<?php
include_once "../exceptions/ExceptionObject.php";

abstract class FavouriteChordsValidator {
    public static function validateUserId($userId): void {
        if ($userId <= 0) {
            ExceptionObject::setResponseCode(400, 'User id cannot be null!');
        }
    }

    public static function validateChordId($chordId): void {
        if ($chordId <= 0) {
            ExceptionObject::setResponseCode(400, 'Chord id cannot be null!');
        }
    }
}