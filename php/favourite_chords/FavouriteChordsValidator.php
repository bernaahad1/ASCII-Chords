<?php
abstract class FavouriteChordsValidator {
    public static function validateUserId($userId): void {
        if ($userId <= 0) {
            throw new InvalidArgumentException('User id cannot be null!');
        }
    }

    public static function validateChordId($chordId): void {
        if ($chordId <= 0) {
            throw new InvalidArgumentException('Chord id cannot be null!');
        }
    }
}