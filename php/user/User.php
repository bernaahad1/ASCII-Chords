<?php

include_once "UserValidator.php";

class User extends UserValidator implements JsonSerializable  {
    private $username;
    private $first_name;
    private $last_name;
    private $email;
    private $password;
    private $deleted;

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
        $this->deleted = 0;
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

    public function getDeleted() {
        return $this->deleted;
    }

    public function setUsername($username) {
        self::validateUsername($username);

        $this->username = $username;
    }

    public function setFirstName($first_name) {
        self::validateFirstName($first_name);

        $this->first_name = $first_name;
    }

    public function setLastName($last_name) {
        self::validateLastName($last_name);

        $this->last_name = $last_name;
    }

    public function setEmail($email) {
        self::validateEmail($email);
        
        $this->email = $email;
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
        return new User($userData['username'], $userData['first_name'], $userData['last_name'], $userData['email'], $userData['password'], $userData['deleted']);
    }
}