export function validateUsername(usernameInput, shadowRoot) {
  const value = usernameInput.trim();

  if (value.length < 3) {
    displayError(
      "Username must have at least 3 characters",
      "username",
      shadowRoot
    );
    return false;
  }

  return true;
}

export function validateName(nameInput, shadowRoot) {
  if (nameInput.length === 0) {
    displayError("Name is required", "name");
    return false;
  }

  return true;
}

export function validateFamilyName(familyNameInput, shadowRoot) {
  if (familyNameInput.length === 0) {
    displayError("Family name is required", "family-name", shadowRoot);

    return false;
  }

  return true;
}

export function validateEmail(emailInput, shadowRoot) {
  if (!isValidEmail(emailInput)) {
    displayError("Invalid email format", "email", shadowRoot);
    return false;
  }

  return true;
}

export function validatePassword(passwordInput, shadowRoot) {
  if (passwordInput.length <= 6) {
    displayError("Password have at least 6 characters", "password", shadowRoot);
    return false;
  }

  if (
    !containsUpperCase(passwordInput) ||
    !containsLowerCase(passwordInput) ||
    !containsNumber(passwordInput)
  ) {
    displayError(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      "password",
      shadowRoot
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
}
