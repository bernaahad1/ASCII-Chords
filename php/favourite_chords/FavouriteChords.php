<?php
require "./FavouriteChordsValidator.php";

class FavouriteChords extends FavouriteChordsValidator {
    private $user_id;
    private $chord_id;

    public function __construct($user_id, $chord_id) {
        $this->validateUserId($user_id);
        $this->validateChordId($chord_id);

        $this->user_id = $user_id;
        $this->chord_id = $chord_id;
    }

    public function jsonSerialize(): array {
        return [
            'user_id' => $this->user_id,
            'chord_id' => $this->chord_id,
        ];
    }

    public static function fromArray(array $favChordsData): FavouriteChords {
        return new FavouriteChords($favChordsData['user_id'], $favChordsData['chord_id']);
    }
}