<?php
require "../db/db_connection.php";
require "./User.php";
require "../../exceptions/BadRequestException.php";

class UserRequestHandler {
    public static function getUserById($userId): User {
        $connection = (new Db())->getConnection();

        $selectStatement = $connection->prepare("SELECT * FROM `users` WHERE id = ?");
        $selectStatement->execute([$userId]);

        $user = $selectStatement->fetch();
        //self::validateUserForDeleted($user);

        if ($user) {
            $userEntity = User::fromArray($user);
            return $userEntity;
        }

        throw new BadRequestException('This user cannot be accessed');
    }

    public static function updateUserById($userId) : User {

        $userdata = json_decode(file_get_contents('php://input'), true);

        $user = self::getUserById($userId);
        //self::validateUserForDeleted($user);

        $updatedUser = self::updateUserFields($user, $userdata);

        $connection = (new Db())->getConnection();

        $selectStatement = $connection->prepare("UPDATE users
                                                SET username = ?, first_name = ?, last_name = ?, email = ?
                                                WHERE id = ?");
        
        $selectStatement->execute([$updatedUser->getUsername(), $updatedUser->getFirstName(), $updatedUser->getLastName(), $updatedUser->getEmail(), $userId]);
        
        // echo $selectStatement->fetch()['email'];
        // $UserFromDb = $selectStatement->fetch();

        // echo $UserFromDb;
        // if ($UserFromDb) {
        //     return User::fromArray($UserFromDb);
        // }

        // throw new BadRequestException('This user cannot be accessed');
    }

    public static function deleteUserById($userId) {
        
        $user = self::getUserById($userId);
        //self::validateUserForDeleted($user);

        $connection = (new Db())->getConnection();

        $selectStatement = $connection->prepare("UPDATE users
                                                SET deleted = 1
                                                WHERE id = ?");
        
        $selectStatement->execute([$userId]);

        // $UserFromDb = $selectStatement->fetch();

        // if ($UserFromDb) {
        //     return User::fromArray($UserFromDb);
        // }

        // throw new BadRequestException('This user cannot be accessed');
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

    // private static function validateUserForDeleted($user) {
    //     if ($user['deleted'] == 1) {
    //         throw new ResourceNotFoundException("The user has already been deleted!");
    //     }
    // }
}