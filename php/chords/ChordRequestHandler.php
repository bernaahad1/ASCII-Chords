<?php
include_once "../db/db_connection.php";
include_once "Chord.php";
include_once "../exceptions/BadRequestException.php";

class ChordRequestHandler extends ChordsValidator {
    public static function getSingleChord($chordId): Chord {
        self::validateChordId($chordId);

        $connection = (new Db())->getConnection();

        $selectStatement = $connection->prepare("SELECT * FROM `chords` WHERE id = ? AND deleted = 0");
        $selectStatement->execute([$chordId]);

        $chord = $selectStatement->fetch();

        if ($chord) {
            return Chord::fromArray($chord);
        }

        throw new BadRequestException('This chord cannot be accessed');
    }

    public static function getAllChordsIDs() {
        $connection = (new Db())->getConnection();

        $selectStatement = $connection->prepare("SELECT * FROM `chords` WHERE deleted = 0");
        $selectStatement->execute();

        $chords = [];
        foreach ($selectStatement->fetchAll() as $chord) {
            $chords[] = $chord;
        }

       return $chords;
    }

    public static function addNewChord(): bool {
        $chordData = json_decode(file_get_contents('php://input'), true);
        self::validateChordData($chordData);

        $db = new Db();

        $conn = $db->getConnection();

        $insertStatement = $conn->prepare(
            "INSERT INTO `chords` (name, description, deleted)
             VALUES (:name, :description, :deleted)"
        );

        try {
            $insertResult = $insertStatement->execute([
                "name" => $chordData['name'],
                "description" => $chordData['description'],
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
    
                throw new Exception($errorMessage);
            }
    
            return true;
        } catch (Exception $e) {
            throw new RuntimeException(message: "There was problem with saving the chord because of ".$e->getMessage()."!");
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

        throw new BadRequestException('This chord cannot be accessed');
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

        throw new BadRequestException('This chord cannot be accessed');
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

    private static function validateChordData($chordData) {
        self::validateName($chordData['name']);
        self::validateDescription($chordData['description']);
    }
}