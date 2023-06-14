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

    public function saveNewUser(): void {
        require_once "../db/db_connection.php";

        $db = new Db();

        $conn = $db->getConnection();

        // if ($conn->$connect_error) {
        //     die("Connection failed: " . $conn->$connect_error);
        // }

        $username = $this->username;
        $firstname = $this->first_name;
        $lastname = $this->last_name;
        $email = $this->email;
        $hashedPassword = password_hash($this->password, PASSWORD_DEFAULT);

        $insertStatement = $conn->prepare("INSERT INTO users (username, first_name, last_name, email, password, deleted) VALUES (?, ?, ?, ?, ?, ?)");
        $insertStatement->bindParam("sssssi", $username , $firstname, $lastname, $email, $hashedPassword);
        
        $insertResult = $insertStatement->execute();

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
        
        require_once "./db/db_connection.php";

        $db = new Db();
        
        $conn = $db->getConnection();
        
        $selectPasswordToEmailStatement = $conn->prepare("SELECT password FROM `users` WHERE email = :email");
        $result = $selectPasswordToEmailStatement->execute(['email' => $this->email]);
        
        $dbUser = $selectPasswordToEmailStatement->fetch();

        if (!password_verify($this->password, $dbUser['password'])) {
            throw new Exception("Email and password do not match");
        }

    }

    // /**
    //  * Gets all users from the database
    // */
    // public static function getAll(): iterable {
        
    //     require_once "../src/Db.php";

    //     $db = new Db();
        
    //     $conn = $db->getConnection();
        
    //     $selectStatement = $conn->prepare("SELECT id, username, name, registered_on FROM `users`");
    //     $result = $selectStatement->execute([]);
        
    //     return $selectStatement->fetchAll();
    // }
}
