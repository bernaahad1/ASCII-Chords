<?php
abstract class UserValidator {
    public static function validateUsername($username): void {
        self::validateStringValue($username, 'username');
    }

    public static function validateFirstName($first_name): void {
        self::validateStringValue($first_name, 'first name');
    }

    public static function validateLastName($last_name): void {
        self::validateStringValue($last_name, 'last name');
    }

    public static function validateEmail($email): void {
        self::validateStringValue($email, 'email');
    }

    public static function validatePassword($password): void {
        self::validateStringValue($password, 'password');
    }

    public static function validateUserId($userId): void {
        if ($userId <= 0) {
            throw new InvalidArgumentException('The user id must be positive!');
        }
    }

    public static function validateStringValue($value, $text) : void {
        if ($value == null || empty($value)) {
            throw new InvalidArgumentException('The '.$text.' cannot be null, empty or blank!');
        }
    }
}