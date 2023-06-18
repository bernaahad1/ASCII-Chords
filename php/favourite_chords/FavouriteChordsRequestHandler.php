<?php
class FavouriteChordsRequestHandler {
    public static function getAllRecordsByUserId(string $userId): array {
        require_once "../db/db_connection.php";
        require_once "./FavouriteChords.php";
        require_once "../../exceptions/BadRequestException.php";
        
        $connection = (new Db())->getConnection();

        $selectStatement = $connection->prepare("SELECT * FROM `favourite_chords` WHERE user_id = ?");
        $selectStatement->execute([$userId]);

        $favourite_chords = [];
        foreach ($selectStatement->fetchAll() as $favourite_chord) {
            self::validateFavouriteChordForDeleted($favourite_chord);
            
            $favourite_chords[] = $favourite_chord;
        }

        return $chords;
    }

    public static function getAllRecordsByChordId(string $chordId): array {
        require_once "../db/db_connection.php";
        require_once "./FavouriteChords.php";
        require_once "../../exceptions/BadRequestException.php";
        
        $connection = (new Db())->getConnection();

        $selectStatement = $connection->prepare("SELECT * FROM `favourite_chords` WHERE chord_id = ?");
        $selectStatement->execute([$chordId]);

        $favourite_chords = [];
        foreach ($selectStatement->fetchAll() as $favourite_chord) {
            self::validateFavouriteChordForDeleted($favourite_chord);

            $favourite_chords[] = $favourite_chord;
        }

        return $chords;
    }

    public static function getFavouriteChordByUserIdAndChordId($userId, $chordId): FavouriteChords {
        require_once "../db/db_connection.php";
        require_once "./FavouriteChords.php";
        require_once "../../exceptions/BadRequestException.php";
        
        $connection = (new Db())->getConnection();

        $selectStatement = $connection->prepare("SELECT * FROM `favourite_chords` WHERE user_id = ? AND chord_id = ?");
        $selectStatement->execute([$userId, $chordId]);

        $favouriteChord = $selectStatement->fetch();
        self::validateFavouriteChordForDeleted($favouriteChord);

        if ($favouriteChord) {
            return FavouriteChords::fromArray($favouriteChord);
        }

        throw new BadRequestException('This chord cannot be accessed');
    }

    public static function addFavouriteChord($userId, $chordId) : void {
        require_once "../db/db_connection.php";
        require_once "./FavouriteChords.php";
        require_once "../../exceptions/BadRequestException.php";

        $db = new Db();

        $conn = $db->getConnection();

        if ($conn->$connect_error) {
            die("Connection failed: " . $conn->$connect_error);
        }

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
    }

    public static function deleteFavouriteChord($userId, $chordId) : bool {
        require_once "../db/db_connection.php";
        require_once "./FavouriteChords.php";
        require_once "../../exceptions/ResourceNotFoundException.php";

        
        $favouriteChord = self::getFavouriteChordByUserIdAndChordId($userId, $chordId);
        self::validateFavouriteChordForDeleted($favouriteChord);

        $connection = (new Db())->getConnection();

        $selectStatement = $connection->prepare("UPDATE users
                                                SET user_id = ?, chord_id = ?, deleted = 1
                                                WHERE user_id = ? AND chord_id = ?");
        
        $selectStatement->execute([$favouriteChord["user_id"], $favouriteChord["chord_id"], $userId, $chordId]);

        $favChordFromDb = $selectStatement->fetch();

        if ($favChordFromDb) {
            return true;
        }

        throw new BadRequestException('This user cannot be accessed');
    }

    private static function validateFavouriteChordForDeleted($favouriteChord) {
        if ($favouriteChord['deleted'] == 1) {
            throw new ResourceNotFoundException("The resource has already been deleted!");
        }
    }
}