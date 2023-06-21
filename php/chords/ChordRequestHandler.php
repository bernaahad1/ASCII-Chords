<?php
include_once "../db/db_connection.php";
include_once "Chord.php";
include_once "../exceptions/BadRequestException.php";

class ChordRequestHandler {
    public static function getSingleChord(string $chordId): Chord {
    
        $connection = (new Db())->getConnection();

        $selectStatement = $connection->prepare("SELECT * FROM `chords` WHERE id = ?");
        $selectStatement->execute([$chordId]);

        $chord = $selectStatement->fetch();

        if ($chord) {
            return Chord::fromArray($chord);
        }

        throw new BadRequestException('This chord cannot be accessed');
    }

    public static function getAllChordsIDs() {
        require_once "../db/db_connection.php";
        require_once "./Chord.php";

        $connection = (new Db())->getConnection();

        $selectStatement = $connection->prepare("SELECT * FROM `chords`");
        $selectStatement->execute();

        $chords = [];
        foreach ($selectStatement->fetchAll() as $chord) {
            $chords[] = $chord;
        }

       return $chords;
    }

    public static function addNewChord(): bool {
        $chordData = json_decode(file_get_contents('php://input'), true);

        $db = new Db();

        $conn = $db->getConnection();

        $insertStatement = $conn->prepare(
            "INSERT INTO `chords` (name, description, deleted)
             VALUES (:name, :description, :deleted)"
        );

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
    }

    public static function updateChord($chordId)  {
        $chordData = json_decode(file_get_contents('php://input'), true);

        $chord = self::getSingleChord($chordId);
        self::validateChordForDeleted($chord);

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
        $chord = self::getSingleChord($chordId);
        self::validateChordForDeleted($chord);

        $connection = (new Db())->getConnection();

        $selectStatement = $connection->prepare("UPDATE chords
                                                SET deleted = 1
                                                WHERE id = ?");


        if ($selectStatement->execute([$chordId])) {
            //FavouriteChordsRequestHandler::deleteAllFavouriteChordsByUserId($userId, $connection);
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


    private static function validateChordForDeleted($chord) {
        if ($chord->getDeleted() == 1) {
            throw new ResourceNotFoundException("The chord has already been deleted!");
        }
    }
}