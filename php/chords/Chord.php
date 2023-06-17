<?php

class Chord
{
    private $id;
    private $name;
    private $description;

    public function __construct($id, $name, $description)
    {
        $this->id = $id;
        $this->name = $name;
        $this->description = $description;
    }

    public function addNewChord(): void
    {
        require_once "../db/db_connection.php";

        $db = new Db();

        $conn = $db->getConnection();

        if ($conn->$connect_error) {
            die("Connection failed: " . $conn->$connect_error);
        }

        // TODO do not define deleted here
        $insertStatement = $conn->prepare(
            "INSERT INTO `chords` (name, description, deleted)
             VALUES (:name, :description, :deleted)"
        );

        $insertResult = $insertStatement->execute([
            "name" => $this->name,
            "description" => $this->description,
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
    }

    public static function createFromAssoc(array $assocChord): Chord {
        return new Chord($assocChord['id'], $assocChord['name'], $assocChord['description']);
    }

    public static function getChordById(string $chordId): Chord {

        require_once "../db/db_connection.php";

        $sql   = "SELECT * FROM `chords` WHERE id = :chordId";
        $selectStatement = (new Db())->getConnection()->prepare($sql);

        $selectStatement->execute(['chordId' => $courseId]);

        $courseDbRow = $selectStatement->fetch();

        if (!$courseDbRow) {
            throw new NotFoundException("Course with id $chordId not found");
        }

        return self::createFromAssoc($courseDbRow);
    }

    public static function getAllChords(): array {

        require_once "../db/db_connection.php";

        $sql   = "SELECT * FROM `chords`";
        $selectStatement = (new Db())->getConnection()->prepare($sql);
        $selectStatement->execute();

        $allChords = [];
        foreach ($selectStatement->fetchAll() as $chord) {
            $allChords[] = self::createFromAssoc($chord);
        }

        return $allChords;
    }

}

print_r(Chord::getAllChords());