<?php
require "../db/db_connection.php";
require "./FavouriteChords.php";
require "../../exceptions/BadRequestException.php";

class FavouriteChordsRequestHandler {
    public static function getAllRecordsByUserId(string $userId): array {
        $connection = (new Db())->getConnection();

        $selectStatement = $connection->prepare("SELECT * FROM `favourite_chords` WHERE user_id = ?");
        $selectStatement->execute([$userId]);

        $favourite_chords = [];
        foreach ($selectStatement->fetchAll() as $favourite_chord) {
            $favouriteChord = FavouriteChords::fromArray($favourite_chord);

            if (!self::isFavouriteChordForDeleted($favouriteChord)) {
                $favourite_chords[] = $favourite_chord;
            }
        }

        return $favourite_chords;
    }

    public static function getAllRecordsByChordId(string $chordId): array {
        
        $connection = (new Db())->getConnection();

        $selectStatement = $connection->prepare("SELECT * FROM `favourite_chords` WHERE chord_id = ?");
        $selectStatement->execute([$chordId]);

        $favourite_chords = [];
        foreach ($selectStatement->fetchAll() as $favourite_chord) {
            $favouriteChord = FavouriteChords::fromArray($favourite_chord);

            if (!self::isFavouriteChordForDeleted($favouriteChord)) {
                $favourite_chords[] = $favourite_chord;
            }
        }

        return $favourite_chords;
    }

    public static function getFavouriteChordByUserIdAndChordId($userId, $chordId): FavouriteChords {
        
        $connection = (new Db())->getConnection();

        $selectStatement = $connection->prepare("SELECT * FROM `favourite_chords` WHERE user_id = ? AND chord_id = ?");
        $selectStatement->execute([$userId, $chordId]);

        $favouriteChordFromDB = $selectStatement->fetch();
        
        if ($favouriteChordFromDB) {
            $favouriteChord = FavouriteChords::fromArray($favouriteChordFromDB);
            self::validateFavouriteChordForDeleted($favouriteChord);

            return $favouriteChord;
        }

        throw new BadRequestException('This chord cannot be accessed');
    }

    public static function addFavouriteChord($userId, $chordId) : bool {

        $db = new Db();

        $conn = $db->getConnection();

        $insertStatement = $conn->prepare(
            "INSERT INTO `favourite_chords` (user_id, chord_id, deleted)
             VALUES (:user_id, :chord_id, :deleted)"
        );

        $insertResult = $insertStatement->execute([
            'user_id' => $userId, 
            'chord_id' => $chordId, 
            'deleted'=> 0,
        ]);

        if (!$insertResult) {
            $errorInfo = $insertStatement->errorInfo();
            $errorMessage = "There was error while saving the favourite chord! Please try again!";

            if ($errorInfo[1] == 1062) {
                $errorMessage = "There is such favourite chord saved!";
            } else {
                $errorMessage = "Request failed, true again later";
            }

            throw new Exception($errorMessage);
        }

        return true;
    }

    public static function deleteFavouriteChord($userId, $chordId) {
        
        $favouriteChord = self::getFavouriteChordByUserIdAndChordId($userId, $chordId);
        self::validateFavouriteChordForDeleted($favouriteChord);

        $connection = (new Db())->getConnection();

        $selectStatement = $connection->prepare("UPDATE favourite_chords
                                                SET user_id = ?, chord_id = ?, deleted = 1
                                                WHERE user_id = ? AND chord_id = ?");
        
        $selectStatement->execute([$favouriteChord->getUserId(), $favouriteChord->getChordId(), $userId, $chordId]);

        $favChordFromDb = $selectStatement->fetch();

        if ($favChordFromDb) {
            return true;
        }

        throw new BadRequestException('This favourite chord cannot be accessed');
    }

    private static function isFavouriteChordForDeleted($favouriteChord) : bool {
        return $favouriteChord->getDeleted() == 1;
    }

    private static function validateFavouriteChordForDeleted($favouriteChord) : void {
        throw new ResourceNotFoundException("The resource has already been deleted!");
    }
}