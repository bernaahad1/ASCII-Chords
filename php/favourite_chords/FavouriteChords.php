<?php
include_once "FavouriteChordsValidator.php";

class FavouriteChords extends FavouriteChordsValidator implements JsonSerializable {
    private $user_id;
    private $chord_id;
    private $deleted;

    public function __construct($user_id, $chord_id, $deleted) {
        $this->validateUserId($user_id);
        $this->validateChordId($chord_id);

        $this->user_id = $user_id;
        $this->chord_id = $chord_id;
        $this->deleted = $deleted;
    }

    public function getUserId() : int {
        return $this->user_id;
    }

    public function getChordId() : int {
        return $this->chord_id;
    }

    public function getDeleted() : int {
        return $this->deleted;
    }

    public function jsonSerialize(): array {
        return [
            'user_id' => $this->user_id,
            'chord_id' => $this->chord_id,
        ];
    }

    public static function fromArray(array $favChordsData): FavouriteChords {
        return new FavouriteChords($favChordsData['user_id'], $favChordsData['chord_id'], $favChordsData['deleted']);
    }
}