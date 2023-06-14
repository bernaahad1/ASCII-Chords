<?php

class User
{
    private $username;
    private $first_name;
    private $last_name;
    private $email;
    private $password;
    private $deleted;

    public function __construct($username, $first_name, $last_name, $email, $password, $deleted)
    {
        $this->username = $username;
        $this->first_name = $first_name;
        $this->last_name = $last_name;
        $this->email = $email;
        $this->password = $password;
        $this->deleted = $deleted;
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
}