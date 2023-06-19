<?php

require "UserValidator.php";

class User extends UserValidator {
    private $username;
    private $first_name;
    private $last_name;
    private $email;
    private $password;

    public function __construct($username, $first_name, $last_name, $email, $password) {
        $this->validateUsername($username);
        $this->validateFirstName($first_name);
        $this->validateLastName($last_name);
        $this->validateEmail($email);
        $this->validatePassword($password);

        $this->username = $username;
        $this->first_name = $first_name;
        $this->last_name = $last_name;
        $this->email = $email;
        $this->password = $password;
    }

    public function getUsername() {
        return $this->username;
    }

    public function getFirstName() {
        return $this->first_name;
    }

    public function getLastName() {
        return $this->last_name;
    }

    public function getEmail() {
        return $this->email;
    }

    public function getPassword() {
        return $this->password;
    }

    public function setUsername($username) {
        $this->username = $username;
    }

    public function setFirstName($first_name) {
        $this->first_name = $first_name;
    }

    public function setLastName($last_name) {
        $this->last_name = $last_name;
    }

    public function setEmail($email) {
        $this->email = $email;
    }

    public function saveNewUser(): void {
        require_once "../db/db_connection.php";

        $db = new Db();

        $conn = $db->getConnection();

        // TODO do not define deleted here
        $insertStatement = $conn->prepare(
            "INSERT INTO `users` (username, first_name, last_name, email, password, deleted)
             VALUES (:username, :first_name, :last_name, :email, :password, :deleted)"
        );

        $hashedPassword = password_hash($this->password, PASSWORD_DEFAULT);

        $insertResult = $insertStatement->execute([
            'username' => $this->username,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'email' => $this->email,
            'password' => $hashedPassword,
            'deleted' => 0
        ]);

        if (!$insertResult) {
            $errorInfo = $insertStatement->errorInfo();
            $errorMessage = "There was error while saving the user! Please try again!";

            if ($errorInfo[1] == 1062) {
                $errorMessage = "The username is already taken";
            } else {
                $errorMessage = "Request failed, true again later";
            }

            throw new Exception($errorMessage);
        }
    }

    public function login(): void {

        require_once "../db/db_connection.php";

        $db = new Db();

        $conn = $db->getConnection();

        $selectPasswordToEmailStatement = $conn->prepare("SELECT password FROM `users` WHERE email = :email");
        $result = $selectPasswordToEmailStatement->execute(['email' => $this->email]);

        $dbUser = $selectPasswordToEmailStatement->fetch();

        if (!password_verify($this->password, $dbUser['password'])) {
            throw new Exception("Email and password do not match");
        }
    }

    public static function getAll(): iterable {

        require_once "../src/Db.php";

        $db = new Db();

        $conn = $db->getConnection();

        $selectStatement = $conn->prepare("SELECT username, first_name, last_name, email, password, deleted FROM `users`");
        $result = $selectStatement->execute([]);

        return $selectStatement->fetchAll();
    }    
    
    public function jsonSerialize(): array {
        return [
            'username' => $this->username,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'email' => $this->email,
        ];
    }

    public static function fromArray(array $userData): User {
        return new User($userData['username'], $userData['first_name'], $userData['last_name'], $userData['email'], $userData['password']);
    }
}