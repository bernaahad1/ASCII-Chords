<?php
include_once "../db/db_connection.php";
include_once "FavouriteChords.php";
include_once "../exceptions/BadRequestException.php";

class FavouriteChordsRequestHandler {
    public static function getAllRecordsByUserId(string $userId): array {
        $connection = (new Db())->getConnection();

        echo "getAllRecordsByUserId";
        $selectStatement = $connection->prepare("SELECT * FROM `favourite_chords` WHERE user_id = ?");
        $selectStatement->execute([$userId]);

        $favourite_chords = [];
        foreach ($selectStatement->fetchAll() as $favourite_chord) {
            if (!self::isFavouriteChordForDeleted($favourite_chord)) {
                $favourite_chords[] = FavouriteChords::fromArray($favourite_chord)->jsonSerialize();
            }
        }

        return $favourite_chords;
    }

    public static function getAllRecordsByChordId(string $chordId): array {
        
        $connection = (new Db())->getConnection();

        echo "getAllRecordsByChordId";
        $selectStatement = $connection->prepare("SELECT * FROM `favourite_chords` WHERE chord_id = ?");
        $selectStatement->execute([$chordId]);

        $favourite_chords = [];
        foreach ($selectStatement->fetchAll() as $favourite_chord) {
            if (!self::isFavouriteChordForDeleted($favourite_chord)) {
                $favourite_chords[] = FavouriteChords::fromArray($favourite_chord)->jsonSerialize();
            }
        }

        return $favourite_chords;
    }

    public static function getFavouriteChordByUserIdAndChordId($userId, $chordId): FavouriteChords {
        $connection = (new Db())->getConnection();

        echo "getFavouriteChordByUserIdAndChordId";
        $selectStatement = $connection->prepare("SELECT * FROM `favourite_chords` WHERE user_id = ? AND chord_id = ?");
        $selectStatement->execute([$userId, $chordId]);

        $favouriteChordFromDB = $selectStatement->fetch();
        
        if ($favouriteChordFromDB) {
            self::validateFavouriteChordForDeleted($favouriteChordFromDB);

            return FavouriteChords::fromArray($favouriteChordFromDB);
        }

        throw new BadRequestException('This chord cannot be accessed');
    }

    public static function addFavouriteChord($userId, $chordId) : bool {
        $connection = (new Db())->getConnection();

        echo "addFavouriteChord";
        $insertStatement = $connection->prepare(
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

    public static function deleteAllFavouriteChordsByUserId($userId, $connection) {
        // $user = self::getAllRecordsByUserId($userId);
        // self::validateUserForDeleted($user);

        // $connection = (new Db())->getConnection();

        $selectStatement = $connection->prepare("UPDATE favourite_chords
                                                SET deleted = 1
                                                WHERE user_id = ?");

        if ($selectStatement->execute([$userId])) {
            return true;
        }

        throw new BadRequestException('This user cannot be accessed');
    }

    public static function deleteFavouriteChord($userId, $chordId) {
        $favouriteChord = self::getFavouriteChordByUserIdAndChordId($userId, $chordId);
        self::validateFavouriteChordForDeletedObject($favouriteChord);

        echo "deleteFavouriteChord";
        $connection = (new Db())->getConnection();

        $selectStatement = $connection->prepare("UPDATE favourite_chords
                                                SET user_id = ?, chord_id = ?, deleted = 1
                                                WHERE user_id = ? AND chord_id = ?");

        if ($selectStatement->execute([$favouriteChord->getUserId(), $favouriteChord->getChordId(), $userId, $chordId])) {
            return true;
        }

        throw new BadRequestException('This favourite chord cannot be accessed');
    }

    private static function isFavouriteChordForDeleted($favouriteChord) : bool {
        return $favouriteChord['deleted'] == 1;
    }

    private static function validateFavouriteChordForDeleted($favouriteChord) : void {
        if (self::isFavouriteChordForDeleted($favouriteChord)) {
            throw new ResourceNotFoundException("The resource has already been deleted!");
        } 
    }

    private static function validateFavouriteChordForDeletedObject($favouriteChord) : void {
        if ($favouriteChord->getDeleted()) {
            throw new ResourceNotFoundException("The resource has already been deleted!");
        } 
    }
}