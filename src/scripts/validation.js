export const enableValidation = (config) => {
  const formList = Array.from(document.querySelectorAll(config.popupFormElement));
  formList.forEach((formElement) => {
    setEventListeners(formElement, config);
  });
};

const setEventListeners = (formElement, config) => {
  const inputList = Array.from(formElement.querySelectorAll(config.popupInput));
  const buttonElement = formElement.querySelector(config.button);
  toggleButtonState(inputList, buttonElement, config);
  inputList.forEach((inputElement) => {
      inputElement.addEventListener('input', () => {
        isValid(inputElement, config);
        toggleButtonState(inputList, buttonElement, config);
      });
  });
};

const isValid = (inputElement, config) => {
  if (inputElement.validity.valueMissing) {
      showInputError(inputElement, 'Вы пропустили это поле.', config);
  } else if (inputElement.validity.typeMismatch && inputElement.type === "url") {
      showInputError(inputElement, 'Введите адрес сайта.', config);
  } else if (inputElement.validity.patternMismatch) {
      showInputError(inputElement, 'Можно использовать только буквы, дефисы и пробелы.', config);
  } else if (inputElement.validity.tooShort) {
      showInputError(inputElement, `Минимальное количество символов: ${inputElement.minLength}. Длина текста сейчас: ${inputElement.value.length} символов.`, config);
  } else {
      hideInputError(inputElement, config);
  }
};

const showInputError = (inputElement, errorMessage, config) => {
  const errorElement = inputElement.closest(config.popupFormElement).querySelector(`#${inputElement.id} + ${config.inputError}`);
  if (!errorElement) return;  
  errorElement.classList.add(config.inputTypeError);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(config.inputActiveError);
};

export const hideInputError = (inputElement, config) => {
  const errorElement = inputElement.closest(config.popupFormElement).querySelector(`#${inputElement.id} + ${config.inputError}`);
  if (!errorElement) return;
  errorElement.classList.remove(config.inputTypeError);
  errorElement.classList.remove(config.inputActiveError);
  errorElement.textContent = '';
};

export const toggleButtonState = (inputList, buttonElement, config) => {
  const hasInvalidInput = inputList.some((input) => !input.validity.valid);
  if (hasInvalidInput) {
      buttonElement.disabled = true;
      buttonElement.classList.add(config.inactiveButton);
  } else {
      buttonElement.disabled = false;
      buttonElement.classList.remove(config.inactiveButton);
  }
};

export function clearValidationErrors(formElement, config) {
  const inputList = Array.from(formElement.querySelectorAll(config.popupInput));
  inputList.forEach((input) => hideInputError(input, config));
  toggleButtonState(inputList, formElement.querySelector(config.button), config);
}
