export function validateUsername(usernameInput) {
  const value = usernameInput.value.trim();

  if (value.length < 3 || value.length > 50) {
    displayError("Username must be between 3 and 50 characters", "username");
    return false;
  }

  return true;
}

export function validateName(nameInput) {
  if (value.length === 0) {
    displayError("Name is required", "name");
    return false;
  }

  return true;
}

export function validateFamilyName(familyNameInput) {
  if (value.length === 0) {
    displayError("Family name is required");

    return false;
  }

  return true;
}

export function validateEmail(emailInput) {
  if (!isValidEmail(value)) {
    displayError("Invalid email format", "email");
    return false;
  }

  return true;
}

export function validatePassword(passwordInput) {
  if (value.length < 6) {
    displayError("Password have at least 6 characters", "password");
    return false;
  }
  if (
    !containsUpperCase(value) ||
    !containsLowerCase(value) ||
    !containsNumber(value)
  ) {
    displayError(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      "password"
    );

    return false;
  }

  return true;
}

export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function containsUpperCase(str) {
  return /[A-Z]/.test(str);
}

function containsLowerCase(str) {
  return /[a-z]/.test(str);
}

function containsNumber(str) {
  return /[0-9]/.test(str);
}

export function displayError(errorMessage, inputName, shadowRoot) {
  const errorElement = shadowRoot.getElementById(inputName + "-error");
  console.log(errorElement, inputName);
  if (!errorElement) {
    return;
  }

  errorElement.innerHTML = errorMessage;
  errorElement.classList.add("error");
}

export function clearErrors() {
  const errorElements = document.getElementsByClassName("error");

  Array.from(errorElements).forEach((element) => {
    if (!element) {
      return;
    }

    element.innerHTML = "";
    element.classList.remove("error");
  });

  // successMessage.innerHTML = "";
}
