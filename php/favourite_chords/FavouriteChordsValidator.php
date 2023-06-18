<?php

abstract class FavouriteChordsValidator {
    public function validateUserId($userId): void {
        if ($userId <= 0) {
            throw new InvalidArgumentException('The constructor accepts only positive values for user id!');
        }
    }

    public function validateChordId($chordId): void {
        if ($chordId <= 0) {
            throw new InvalidArgumentException('The constructor accepts only positive values for chord id!');
        }
    }
}