<?php

include_once "../exceptions/ExceptionObject.php";

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
        self::validatePasswordCharacters($password);
    }

    public static function validatePasswordCharacters($password): void {
        if (!(preg_match('/^.{6,}$/', $password) 
            && preg_match('/[A-Z]+/', $password) 
            && preg_match('/[a-z]+/', $password) 
            && preg_match('/[0-9]+/', $password))) {
                ExceptionObject::setResponseCode(400, 'Password should contain one small letter, one capital letter, one digit and at least 6 characters in total!');
            }
    }

    public static function validateUserId($userId): void {
        if ($userId <= 0) {
            ExceptionObject::setResponseCode(400, 'The user id must be positive!');
        }
    }

    public static function validateStringValue($value, $text) : void {
        if ($value == null || empty($value)) {
            ExceptionObject::setResponseCode(400, 'The ' . $text . ' cannot be null, empty or blank!');
        }
    }
}

// Test validatePassword method
// echo UserValidator::validatePassword("12Aaaaa3") ? 'true' : 'false';
