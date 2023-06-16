<?php

class Chord
{
    private $name;
    private $description;

    public function __construct($name, $description)
    {
        $this->name = $name;
        $this->description = $description;
    }

    public function saveNewUser(): void
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

    public static function getAll(): iterable {
        
        require_once "../db/db_connection.php";

        $db = new Db();
        
        $conn = $db->getConnection();
        
        $selectStatement = $conn->prepare("SELECT id, name, description, deleted FROM `chords`");
        $result = $selectStatement->execute([]);
        
        return $selectStatement->fetchAll();
    }
}
