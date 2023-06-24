<?php
include_once "User.php";
include_once "../exceptions/ExceptionObject.php";
include_once "../favourite_chords/FavouriteChordsRequestHandler.php";

class UserRequestHandler extends UserValidator {
    public static function getUserById($userId): User {
        self::validateUserId($userId);

        $connection = (new Db())->getConnection();

        $selectStatement = $connection->prepare("SELECT * FROM `users` WHERE id = ? AND deleted = 0");
        $selectStatement->execute([$userId]);

        $user = $selectStatement->fetch();

        if ($user) {
            return User::fromArray($user);
        }

        ExceptionObject::setResponseCode(400, 'This user cannot be accessed');
    }
    public static function getUserByUsername($username) {
        self::validateUsername($username);

        $connection = (new Db())->getConnection();

        $selectStatement = $connection->prepare("SELECT id FROM `users` WHERE username = ? AND deleted = 0");
        $selectStatement->execute([$username]);

        $userId = $selectStatement->fetch();

        if ($userId) {
            return $userId['id'];
        }

        return null;
    }

    public static function getUserByEmail($userEmail) {
        self::validateEmail($userEmail);

        $connection = (new Db())->getConnection();

        $selectStatement = $connection->prepare("SELECT id FROM `users` WHERE email = ? AND deleted = 0");
        $selectStatement->execute([$userEmail]);

        $userId = $selectStatement->fetch();

        if ($userId) {
            return $userId['id'];
        }

        return null;
    }

    public static function saveNewUser(): bool {
        $userData = json_decode(file_get_contents('php://input'), true);
        self::validateUserData($userData);

        $db = new Db();

        $conn = $db->getConnection();

        $insertStatement = $conn->prepare(
            "INSERT INTO `users` (username, first_name, last_name, email, password, deleted)
             VALUES (:username, :first_name, :last_name, :email, :password, :deleted)"
        );

        $hashedPassword = password_hash($userData['password'], PASSWORD_DEFAULT);

        try {
            $insertResult = $insertStatement->execute([
                'username' => $userData['username'],
                'first_name' => $userData['first_name'],
                'last_name' => $userData['last_name'],
                'email' => $userData['email'],
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
    
                ExceptionObject::setResponseCode(400, $errorMessage);
            }
    
            return true;
        } catch (Exception $e) {
            ExceptionObject::setResponseCode(409, "User already exists!");
        }
        
    }

    public static function login($email, $password): void {
        self::validateEmail($email);

        $db = new Db();

        $conn = $db->getConnection();

        $selectPasswordToEmailStatement = $conn->prepare("SELECT password FROM `users` WHERE email = :email");
        $result = $selectPasswordToEmailStatement->execute(['email' => $email]);

        $dbUser = $selectPasswordToEmailStatement->fetch();

        if (!password_verify($password, $dbUser['password'])) {
            ExceptionObject::setResponseCode(401, "Email and password do not match");
        }
    } 

    public static function updateUserById($userId) : bool {
        self::validateUserId($userId);

        $userdata = json_decode(file_get_contents('php://input'), true);
        if($userdata == null || empty($userdata)) {
            return true;
        }

        $user = self::getUserById($userId);
        $updatedUser = self::updateUserFields($user, $userdata);


        $connection = (new Db())->getConnection();
        $selectStatement = $connection->prepare("UPDATE users
                                                SET username = ?, first_name = ?, last_name = ?, email = ?
                                                WHERE id = ?");
        
        if($selectStatement->execute([$updatedUser->getUsername(), $updatedUser->getFirstName(), 
        $updatedUser->getLastName(), $updatedUser->getEmail(), $userId])) {
            return true;
        }

        ExceptionObject::setResponseCode(400, 'This user cannot be accessed');
    }


    public static function deleteUserById($userId) {
        self::validateUserId($userId);

        $connection = (new Db())->getConnection();

        $selectStatement = $connection->prepare("UPDATE users
                                                SET email = null, deleted = 1
                                                WHERE id = ?");


        if ($selectStatement->execute([$userId])) {
            FavouriteChordsRequestHandler::deleteAllFavouriteChordsByUserId($userId);
            return true;
        } 

        ExceptionObject::setResponseCode(400, 'This user cannot be accessed');
    }


    private static function updateUserFields($user, $userdata) : User {
        if ($userdata["username"] != null && $user->getUsername() != $userdata["username"]) {
            if (self::getUserByUsername($userdata["username"]) == null) {
                $user->setUsername($userdata["username"]);
            } else {
                ExceptionObject::setResponseCode(409, "This username is already taken!");
            }
            
        }

        if ($userdata["first_name"] != null && $user->getFirstName() != $userdata["first_name"]) {
            $user->setFirstName($userdata["first_name"]);
        }

        if ($userdata["last_name"] != null && $user->getLastName() != $userdata["last_name"]) {
            $user->setLastName($userdata["last_name"]);
        }

        if ($userdata["email"] != null && $user->getEmail() != $userdata["email"]) {
            if (self::getUserByEmail($userdata["email"]) == null) {
                $user->setEmail($userdata["email"]);
            } else {
                ExceptionObject::setResponseCode(409, "This email is already taken!");
            }
            
        }

        return $user;
    }

    private static function validateUserData($userData) {
        self::validateUsername($userData['username']);
        self::validateFirstName($userData['first_name']);
        self::validateLastName($userData['last_name']);
        self::validateEmail($userData['email']);
        self::validatePassword($userData['password']);
    }
}