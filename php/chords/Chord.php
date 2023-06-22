<?php
include_once "../db/db_connection.php";
include_once "ChordsValidator.php";

class Chord extends ChordsValidator implements JsonSerializable {
    private $id;
    private $name;
    private $description;
    private $deleted;

    public function __construct($id, $name, $description) {
        $this->validateName($name);
        $this->validateDescription($description);

        $this->id = $id;
        $this->name = $name;
        $this->description = $description;
        $this->deleted = 0;
    }

    public function getName() {
        return $this->name;
    }

    public function getDescription() {
        return $this->description;
    }

    public function getDeleted() {
        return $this->deleted;
    }

    public function setName($name) {
        self::validateName($name);

        $this->name = $name;
    }
    
    public function setDescription($description) {
        self::validateDescription($description);

        $this->description = $description;
    }

    public function setDeleted($deleted) {
        $this->deleted = $deleted;
    }

    public function jsonSerialize(): array {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
        ];
    }

    public static function fromArray($chordData): Chord {
        return new Chord($chordData['id'], $chordData['name'], $chordData['description']);
    }
}