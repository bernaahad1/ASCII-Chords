<?php
include_once "../db/db_connection.php";
include_once "Chord.php";
include_once "../exceptions/ExceptionObject.php";

class ChordRequestHandler extends ChordsValidator {
    public static function getChordsFavouriteByUserId($userId) : array {
        self::validateUserId($userId);

        $connection = (new Db())->getConnection();

        $selectStatement = $connection->prepare("SELECT DISTINCT c.id, c.name, c.description,
        case f.user_id
            when null then 0
            when ? then 1 
            else 0
        end as is_favourite 
    FROM `chords` c 
    LEFT JOIN (SELECT * 
               FROM `favourite_chords` f
               WHERE f.deleted = 0) f 
        ON c.id = f.chord_id
        WHERE c.deleted = 0");
        $selectStatement->execute([$userId]);

        $chords = [];
        foreach ($selectStatement->fetchAll() as $chord) {
            $chords[] = $chord;
        }

       return $chords;

    }

    public static function getSingleChord($chordId): Chord {
        self::validateChordId($chordId);

        $connection = (new Db())->getConnection();

        $selectStatement = $connection->prepare("SELECT * FROM `chords` WHERE id = ? AND deleted = 0");
        $selectStatement->execute([$chordId]);

        $chord = $selectStatement->fetch();

        if ($chord) {
            return Chord::fromArray($chord);
        }

        ExceptionObject::setResponseCode(400, 'This chord cannot be accessed');
    }

    public static function getAllChordsIDs() : array {
        $connection = (new Db())->getConnection();

        $selectStatement = $connection->prepare("SELECT * FROM `chords` WHERE deleted = 0");
        $selectStatement->execute();

        $chords = [];
        foreach ($selectStatement->fetchAll() as $chord) {
            $chords[] = $chord;
        }

       return $chords;
    }

    public static function addNewChord($name, $description): bool {
        //$chordData = json_decode(file_get_contents('php://input'), true);
        self::validateName($name);
        self::validateDescription($description);

        $db = new Db();

        $conn = $db->getConnection();

        $insertStatement = $conn->prepare(
            "INSERT INTO `chords` (name, description, deleted)
             VALUES (:name, :description, :deleted)"
        );

        try {
            $insertResult = $insertStatement->execute([
                "name" => $name,
                "description" => $description,
                "deleted" => 0,
            ]);
    
            if (!$insertResult) {
                $errorInfo = $insertStatement->errorInfo();
                $errorMessage =
                    "There was error while saving the chord! Please try again!";
    
                if ($errorInfo[1] == 1062) {
                    $errorMessage = "Chord with this name already exists";
                } else {
                    if ($errorInfo[2] == 1062) {
                        $errorMessage =
                            "Chord with this description already exists";
                    } else {
                        $errorMessage = "Request failed, true again later";
                    }
                }
    
                ExceptionObject::setResponseCode(400, $errorMessage);
            }
    
            return true;
        } catch (Exception $e) {
            ExceptionObject::setResponseCode(409, "Chord already exists!");
        }
    }

    public static function updateChord($chordId) : bool  {
        self::validateChordId($chordId);

        $chordData = json_decode(file_get_contents('php://input'), true);
        if($chordData == null || empty($chordData)) {
            return true;
        }

        $chord = self::getSingleChord($chordId);
        $updatedChord = self::updateChordFields($chord, $chordData);

        $connection = (new Db())->getConnection();

        $selectStatement = $connection->prepare("UPDATE chords
                                                SET name = ?, description = ?
                                                WHERE id = ?");
        
        if ($selectStatement->execute([$updatedChord->getName(), $updatedChord->getDescription(), $chordId])) {
            return true;
        }

        ExceptionObject::setResponseCode(400, 'This chord cannot be accessed');
    }

    public static function deleteChord($chordId) {
        self::validateChordId($chordId);

        //$chord = self::getSingleChord($chordId);
        $connection = (new Db())->getConnection();
        $selectStatement = $connection->prepare("UPDATE chords
                                                SET deleted = 1
                                                WHERE id = ?");


        if ($selectStatement->execute([$chordId])) {
            return true;
        } 

        ExceptionObject::setResponseCode(400, 'This chord cannot be accessed');
    }

    private static function updateChordFields($chord, $chordData) : Chord {
        if ($chordData["name"] != null) {
            $chord->setName($chordData["name"]);
        }

        if ($chordData["decription"] != null) {
            $chord->setDescription($chordData["fidecriptionrst_name"]);
        }

        return $chord;
    }
}