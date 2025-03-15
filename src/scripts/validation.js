export const popupFormElement = document.querySelector('.popup__form');

const showInputError = (popupFormElement, inputElement, errorMessage) => {
  const errorElement = popupFormElement.querySelector(`#${inputElement.id} + .popup__input-error`);
  if (!errorElement) return;  
  errorElement.classList.add('popup__input_type_error');
  errorElement.textContent = errorMessage;
  errorElement.classList.add('popup__input-error_active');
};

export const hideInputError = (popupFormElement, inputElement) => {
  const errorElement = popupFormElement.querySelector(`#${inputElement.id} + .popup__input-error`);
  if (!errorElement) return;
  errorElement.classList.remove('popup__input_type_error');
  errorElement.classList.remove('popup__input-error_active');
  errorElement.textContent = '';
};

const isValid = (popupFormElement, inputElement) => {
    if (inputElement.validity.valueMissing) {
      showInputError(popupFormElement, inputElement, 'Вы пропустили это поле.');
    } else if (inputElement.validity.typeMismatch && inputElement.type === "url") {
      showInputError(popupFormElement, inputElement, 'Введите адрес сайта.');
    } else if (inputElement.validity.patternMismatch) {
      showInputError(popupFormElement, inputElement, 'Можно использовать только буквы, дефисы и пробелы.');
    } else if (inputElement.validity.tooShort) {
      showInputError(popupFormElement, inputElement, `Минимальное количество символов: ${inputElement.minLength}. Длина текста сейчас: ${inputElement.value.length} символов.`);
    } else {
      hideInputError(popupFormElement, inputElement);
    }
};

export const toggleButtonState = (formList, buttonElement) => {
    const hasInvalidInput = formList.some((input) => !input.validity.valid);
    if (hasInvalidInput) {
        buttonElement.disabled = true;
        buttonElement.classList.add('button_inactive');
  } else {
        buttonElement.disabled = false;
        buttonElement.classList.remove('button_inactive');
  };
}; 

export const setEventListeners = (popupFormElement) => {
    const inputList = Array.from(popupFormElement.querySelectorAll('.popup__input'));
    const buttonElement = popupFormElement.querySelector('.popup__button');
    toggleButtonState(inputList, buttonElement);
    inputList.forEach((inputElement) => {
        inputElement.addEventListener('input', () => {
          isValid(popupFormElement, inputElement);
          toggleButtonState(inputList, buttonElement);
        });
      });
}; 

export const enableValidation = () => {
    const formList = Array.from(document.querySelectorAll('.popup__form'));
    formList.forEach((popupFormElement) => {
      setEventListeners(popupFormElement);
    });
};