<?php
//include_once "../db/db_connection.php";
include_once "User.php";
include_once "../exceptions/BadRequestException.php";
include_once "../favourite_chords/FavouriteChordsRequestHandler.php";

class UserRequestHandler {
    public static function getUserById($userId): User {
        $connection = (new Db())->getConnection();

        $selectStatement = $connection->prepare("SELECT * FROM `users` WHERE id = ?");
        $selectStatement->execute([$userId]);

        $user = $selectStatement->fetch();

        if ($user) {
            $userEntity = User::fromArray($user);
            self::validateUserForDeleted($userEntity);

            return $userEntity;
        }

        throw new BadRequestException('This user cannot be accessed');
    }

    public static function getUserByEmail($userEmail) : int {
        $connection = (new Db())->getConnection();

        $selectStatement = $connection->prepare("SELECT id FROM `users` WHERE email = ?");
        $selectStatement->execute([$userEmail]);

        $userId = $selectStatement->fetch();

        if ($userId) {
            return $userId['id'];
        }

        throw new BadRequestException('This user cannot be accessed');
    }


    public static function updateUserById($userId)  {
        $userdata = json_decode(file_get_contents('php://input'), true);

        $user = self::getUserById($userId);
        self::validateUserForDeleted($user);

        $updatedUser = self::updateUserFields($user, $userdata);

        $connection = (new Db())->getConnection();

        $selectStatement = $connection->prepare("UPDATE users
                                                SET username = ?, first_name = ?, last_name = ?, email = ?
                                                WHERE id = ?");
        
        if($selectStatement->execute([$updatedUser->getUsername(), $updatedUser->getFirstName(), 
        $updatedUser->getLastName(), $updatedUser->getEmail(), $userId])) {
            return true;
        }

        throw new BadRequestException('This user cannot be accessed');
    }


    public static function deleteUserById($userId) {
        $user = self::getUserById($userId);
        self::validateUserForDeleted($user);

        $connection = (new Db())->getConnection();

        $selectStatement = $connection->prepare("UPDATE users
                                                SET email = null, deleted = 1
                                                WHERE id = ?");


        if ($selectStatement->execute([$userId])) {
            //FavouriteChordsRequestHandler::deleteAllFavouriteChordsByUserId($userId, $connection);
            return true;
        } 

        throw new BadRequestException('This user cannot be accessed');
    }


    private static function updateUserFields($user, $userdata) : User {
        if ($userdata["username"] != null) {
            $user->setUsername($userdata["username"]);
        }

        if ($userdata["first_name"] != null) {
            $user->setFirstName($userdata["first_name"]);
        }

        if ($userdata["last_name"] != null) {
            $user->setLastName($userdata["last_name"]);
        }

        if ($userdata["email"] != null) {
            $user->setEmail($userdata["email"]);
        }

        return $user;
    }


    private static function validateUserForDeleted($user) {
        if ($user->getDeleted() == 1) {
            throw new ResourceNotFoundException("The user has already been deleted!");
        }
    }
}