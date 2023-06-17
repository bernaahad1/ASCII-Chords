<?php
class UserRequestHandler {
    public static function getUserById(string $useId): User {
        require_once "../db/db_connection.php";
        require_once "./User.php";
        require_once "../../exceptions/BadRequestException.php";
        
        $connection = (new Db())->getConnection();

        $selectStatement = $connection->prepare("SELECT * FROM `users` WHERE id = ?");
        $selectStatement->execute([$userId]);

        $user = $selectStatement->fetch();

        if ($user) {
            return User::fromArray($user);
        }

        throw new BadRequestException('This user cannot be accessed');
    }

   public static function updateUserById(string $userId, array $userdata) : User {
        require_once "../db/db_connection.php";
        require_once "./User.php";
        require_once "../../exceptions/BadRequestException.php";

        $user = self::getUserById($userId);
        $updatedUser = self::updateUserFields($user, $userdata);

        $connection = (new Db())->getConnection();

        $selectStatement = $connection->prepare("UPDATE users
                                                SET usename = ?, first_name = ?, last_name = ?, email = ?, password = ?, deleted = 0
                                                WHERE id = ?");
        
        $selectStatement->execute([$updatedUser["username"], $updatedUser["first_name"], $updatedUser["last_name"],
         $updatedUser["email"], $updatedUser["password"], $userId]);

        $UserFromDb = $selectStatement->fetch();

        if ($UserFromDb) {
            return User::fromArray($UserFromDb);
        }

        throw new BadRequestException('This user cannot be accessed');
   }

   public static function deleteUserById(string $userId) {
        require_once "../db/db_connection.php";
        require_once "./User.php";
        require_once "../../exceptions/BadRequestException.php";
        
        $user = self::getUserById($userId);

        $connection = (new Db())->getConnection();

        $selectStatement = $connection->prepare("UPDATE users
                                                SET usename = ?, first_name = ?, last_name = ?, email = ?, password = ?, deleted = 1
                                                WHERE id = ?");
        
        $selectStatement->execute([$user["username"], $user["first_name"], $user["last_name"], $user["email"], $user["password"], $userId]);

        $UserFromDb = $selectStatement->fetch();

        if ($UserFromDb) {
            return User::fromArray($UserFromDb);
        }

        throw new BadRequestException('This user cannot be accessed');
   }

   private static function updateUserFields(User $user, array $userdata) : User {
        if ($userdata["username"] != null) {
            $user["username"] = $userdata["username"];
        }

        if ($userdata["first_name"] != null) {
            $user["first_name"] = $userdata["first_name"];
        }

        if ($userdata["last_name"] != null) {
            $user["last_name"] = $userdata["last_name"];
        }

        if ($userdata["email"] != null) {
            $user["email"] = $userdata["email"];
        }

        return $user;
   }
}
