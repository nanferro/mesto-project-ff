import '../pages/index.css';
import avatar from '../images/avatar.jpg';
import { createCard, toggleLike } from './card.js';
import { openModal, closeModal, closeModalOnOverlay } from './modal.js';
import { clearValidationErrors, toggleButtonState, enableValidation } from './validation.js';
import { getUserInfo, getInitialCards, updateUserProfile, updateAvatar as apiUpdateAvatar, addNewCard as apiAddNewCard, deleteCard as apiDeleteCard } from './api.js';

const profileImage = document.querySelector('.profile__image');
profileImage.style.backgroundImage = `url(${avatar})`;

const placesList = document.querySelector(".places__list");
const editButton = document.querySelector('.profile__edit-button');
const modalEdit = document.querySelector('.popup_type_edit');
const addButton = document.querySelector('.profile__add-button');
const modalAdd = document.querySelector('.popup_type_new-card');
const closeButtons = document.querySelectorAll('.popup__close');
const modalImage = document.querySelector('.popup_type_image');
const formElement = document.querySelector('.popup__form[name="edit-profile"]');
const nameInput = formElement.querySelector('.popup__input_type_name');
const jobInput = formElement.querySelector('.popup__input_type_description');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const formNewCard = document.querySelector(".popup__form[name='new-place']");
const placeInput = formNewCard.querySelector(".popup__input_type_card-name");
const linkInput = formNewCard.querySelector(".popup__input_type_url");
const imageModalImage = document.querySelector(".popup__image");
const captionModalImage = document.querySelector(".popup__caption");
const modalAvatar = document.querySelector('.popup_type_avatar');
const formAvatar = document.querySelector(".popup__form[name='edit-avatar']");
const avatarInput = formAvatar.querySelector(".popup__input_type_url");
const modalConfirm = document.querySelector('.popup_type_confirm');
const confirmButton = modalConfirm.querySelector(".popup__button");
let cardToDelete = null;
let userId;

const validationConfig ={
  popupFormElement: '.popup__form',
  popupInput: '.popup__input',
  button: '.popup__button',
  inactiveButton: 'button_inactive',
  inputTypeError: 'popup__input_type_error',
  inputActiveError: 'popup__input-error_active',
  inputError: '.popup__input-error'
};

enableValidation(validationConfig);

function loadData() {
  Promise.all([getUserInfo(), getInitialCards()])
    .then(([userData, cardsData]) => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      profileImage.style.backgroundImage = `url(${userData.avatar})`;
      userId = userData._id;
      renderCards(cardsData, userId);
    })
    .catch(err => console.error("Ошибка загрузки данных:", err));
}

function renderCards(cards, userId) {
  placesList.innerHTML = ""; 
  cards.forEach(cardData => {
    const cardElement = createCard(cardData, openDeleteConfirm, toggleLike, openModalImage, userId);
    placesList.append(cardElement);
  });
}

const updateButtonState = (button, isLoading) => {
  if (isLoading) {
    button.textContent = "Сохранение...";
    button.disabled = true;
  } else {
    button.textContent = "Сохранить";
    button.disabled = false;
  }
};

function editProfile(evt) {
  evt.preventDefault();
  const button = formElement.querySelector(".popup__button");
  updateButtonState(button, true);
  updateUserProfile(nameInput.value, jobInput.value)
    .then((data) => {
      profileTitle.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(modalEdit);
    })
    .catch(err => console.error("Ошибка обновления профиля:", err))
    .finally(() => updateButtonState(button, false));
}

editButton.addEventListener('click', () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent; 
  clearValidationErrors(formElement, validationConfig);
  openModal(modalEdit);
});

formElement.addEventListener('submit', editProfile);

function addNewCard(evt) {
  evt.preventDefault();
  const button = formNewCard.querySelector(".popup__button");
  updateButtonState(button, true);
  apiAddNewCard(placeInput.value.trim(), linkInput.value.trim())
    .then(cardData => {
      const newCardElement = createCard(cardData, openDeleteConfirm, toggleLike, openModalImage, userId); 
      placesList.prepend(newCardElement);
      formNewCard.reset();
      closeModal(modalAdd);
    })
    .catch(err => console.error("Ошибка при добавлении карточки:", err))
    .finally(() => updateButtonState(button, false));
}

addButton.addEventListener('click', () => {
  clearValidationErrors(formNewCard, validationConfig);
  openModal(modalAdd);
  const inputList = Array.from(formNewCard.querySelectorAll('.popup__input'));
  const buttonElement = formNewCard.querySelector('.popup__button');
  toggleButtonState(inputList, buttonElement, validationConfig);
});

formNewCard.addEventListener("submit", addNewCard);

profileImage.addEventListener('click', () => {
  clearValidationErrors(formAvatar, validationConfig);
  openModal(modalAvatar);
});

function updateAvatar(evt) {
  evt.preventDefault();
  const button = formAvatar.querySelector(".popup__button");
  updateButtonState(button, true);
  apiUpdateAvatar(avatarInput.value)
    .then(data => {
      profileImage.style.backgroundImage = `url(${data.avatar})`;
      closeModal(modalAvatar);
      formAvatar.reset();
    })
    .catch(err => console.error("Ошибка обновления аватара:", err))
    .finally(() => updateButtonState(button, false));
}

formAvatar.addEventListener("submit", updateAvatar);

function openDeleteConfirm(cardId, cardElement) {
  cardToDelete = { cardId, cardElement };
  openModal(modalConfirm);
}

confirmButton.addEventListener("click", (evt) => {
  evt.preventDefault();
  if (cardToDelete) {
    apiDeleteCard(cardToDelete.cardId)
      .then(() => {
        cardToDelete.cardElement.remove();
        cardToDelete = null;
        closeModal(modalConfirm);
      })
      .catch(err => console.error("Ошибка при удалении карточки:", err));
  }
});

function openModalImage(link, name) {
  imageModalImage.src = link;
  imageModalImage.alt = name;
  captionModalImage.textContent = name;
  openModal(modalImage);
}

closeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const popup = button.closest('.popup');
    closeModal(popup);
    if (popup === modalAdd) {
      formNewCard.reset();
    };
  });
});

[modalEdit, modalAdd, modalImage, modalAvatar, modalConfirm].forEach(popup => {
  popup.classList.add('popup_is-animated');
});

[modalEdit, modalAdd, modalImage, modalAvatar, modalConfirm].forEach(modal => {
  closeModalOnOverlay(modal);
});

loadData();