<?php
abstract class UserValidator {
    public function validateUsername($username): void {
        $this->validateStringValue($username, 'username');
    }

    public function validateFirstName($first_name): void {
        $this->validateStringValue($first_name, 'first name');
    }

    public function validateLastName($last_name): void {
        $this->validateStringValue($last_name, 'last name');
    }

    public function validateEmail($email): void {
        $this->validateStringValue($email, 'email');
    }

    public function validatePassword($password): void {
        $this->validateStringValue($password, 'password');
    }

    public function validateStringValue($value, $text) : void {
        // if ($value == null || empty($value)) {
        //     throw new InvalidArgumentException('The constructor accepts only string values for '.$text.'!');
        // }
    }
}