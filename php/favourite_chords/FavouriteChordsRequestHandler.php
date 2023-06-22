<?php
include_once "../db/db_connection.php";
include_once "FavouriteChords.php";
include_once "../chords/ChordRequestHandler.php";

class FavouriteChordsRequestHandler extends FavouriteChordsValidator {
    
    public static function getAllRecordsByUserId($userId): array {
        self::validateUserId($userId);

        $connection = (new Db())->getConnection();

        $selectStatement = $connection->prepare("SELECT * FROM `favourite_chords` WHERE user_id = ? AND deleted = 0");
        $selectStatement->execute([$userId]);

        $favourite_chords = [];
        foreach ($selectStatement->fetchAll() as $favourite_chord) {
            $favourite_chords[] = ChordRequestHandler::getSingleChord(FavouriteChords::fromArray($favourite_chord)->getChordId())->jsonSerialize();
        }

        return $favourite_chords;
    }

    public static function getAllRecordsByChordId($chordId): array {
        self::validateChordId($chordId);

        $connection = (new Db())->getConnection();
        $selectStatement = $connection->prepare("SELECT * FROM `favourite_chords` WHERE chord_id = ? AND deleted = 0");
        $selectStatement->execute([$chordId]);

        $favourite_chords = [];
        foreach ($selectStatement->fetchAll() as $favourite_chord) {
            $favourite_chords[] = FavouriteChords::fromArray($favourite_chord)->jsonSerialize();
        }
        
        if ($favourite_chords) {
            return $favourite_chords;
        }
             
        ExceptionObject::setResponseCode(400, 'This favourite chords cannot be accessed');
    }

    public static function getFavouriteChordByUserIdAndChordId($userId, $chordId) {
        self::validateUserId($userId);
        self::validateChordId($chordId);

        $connection = (new Db())->getConnection();
        $selectStatement = $connection->prepare("SELECT * FROM `favourite_chords` WHERE user_id = ? AND chord_id = ? AND deleted = 0");
        $selectStatement->execute([$userId, $chordId]);

        $favouriteChordFromDB = $selectStatement->fetch();
        
        if ($favouriteChordFromDB) {
            return FavouriteChords::fromArray($favouriteChordFromDB);
        } 

        return null;
    }

    public static function addFavouriteChord($userId, $chordId) : bool {
        self::validateUserId($userId);
        self::validateChordId($chordId);
        self::validateForExsiting($userId, $chordId);

        $connection = (new Db())->getConnection();
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
                 
            ExceptionObject::setResponseCode(400, $errorMessage);
        }

        return true;
    }

    public static function deleteAllFavouriteChordsByUserId($userId) {
        self::validateUserId($userId);
        
        $connection = (new Db())->getConnection();

        $selectStatement = $connection->prepare("UPDATE favourite_chords
                                                SET deleted = 1
                                                WHERE user_id = ?");

        if ($selectStatement->execute([$userId])) {
            return true;
        }
             
        ExceptionObject::setResponseCode(400, 'This favourite chord cannot be accessed');
    }

    public static function deleteFavouriteChord($userId, $chordId) {
        self::validateUserId($userId);
        self::validateChordId($chordId);

        $favouriteChord = self::getFavouriteChordByUserIdAndChordId($userId, $chordId);
        $connection = (new Db())->getConnection();

        $selectStatement = $connection->prepare("UPDATE favourite_chords
                                                SET user_id = ?, chord_id = ?, deleted = 1
                                                WHERE user_id = ? AND chord_id = ?");

        if ($selectStatement->execute([$favouriteChord->getUserId(), $favouriteChord->getChordId(), $userId, $chordId])) {
            return true;
        }
             
        ExceptionObject::setResponseCode(400, 'This favourite chord cannot be accessed');
    }

    private static function validateForExsiting($userId, $chordId) {
        if (self::getFavouriteChordByUserIdAndChordId($userId, $chordId) != null) {
            ExceptionObject::setResponseCode(409, "There is already such record!");
        }
    }
}