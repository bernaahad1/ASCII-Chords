<?php

class Chord implements JsonSerializable
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

    public function jsonSerialize(): array {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
        ];
    }

    public static function fromArray(array $chordData): Chord {
        return new Chord($chordData['id'], $chordData['name'], $chordData['description']);
    }

}