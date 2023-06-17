<?php

class ChordRequestHandler {

    public static function getSingleChord(string $chordId): Chord {
        require_once "../db/db_connection.php";
        require_once "./Chord.php";
        require_once "../../exceptions/BadRequestException.php";
        
        $connection = (new Db())->getConnection();

        $selectStatement = $connection->prepare("SELECT * FROM `chords` WHERE id = ?");
        $selectStatement->execute([$chordId]);

        $chord = $selectStatement->fetch();

        if ($chord) {
            return Chord::fromArray($chord);
        }

        throw new BadRequestException('This chord cannot be accessed');
    }

    public static function getAllChords(): array {
        require_once "../db/db_connection.php";
        require_once "./Chord.php";

        $connection = (new Db())->getConnection();

        $selectStatement = $connection->prepare("SELECT * FROM `chords`");
        $selectStatement->execute();

        $chords = [];
        foreach ($selectStatement->fetchAll() as $chord) {
            $chords[] = Chord::fromArray($chord);
        }

        return $chords;
    }
}   