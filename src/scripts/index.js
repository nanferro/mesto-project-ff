import '../pages/index.css';
import avatar from '../images/avatar.jpg';
import { createCard, deleteCard, toggleLike } from './card.js';
import { openModal, closeModal, closeModalOnOverlay } from './modal.js';
import { initialCards } from './cards'; 
import { hideInputError, toggleButtonState, enableValidation, popupFormElement } from './validation.js';

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

enableValidation();

function renderCards() {
  initialCards.forEach((cardData) => {
    const cardElement = createCard(cardData, deleteCard, toggleLike, openModalImage);
    placesList.append(cardElement);
  });
}

function clearValidationErrors(popupFormElement) {
  const formList = Array.from(popupFormElement.querySelectorAll('.popup__input'));
  formList.forEach((input) => hideInputError(popupFormElement, input));
  toggleButtonState(formList, popupFormElement.querySelector('.popup__button'));
}

editButton.addEventListener('click', () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  clearValidationErrors(popupFormElement);
  openModal(modalEdit);
});

addButton.addEventListener('click', () => {
  clearValidationErrors(popupFormElement);
  openModal(modalAdd);
  const inputList = Array.from(formNewCard.querySelectorAll('.popup__input'));
  const buttonElement = formNewCard.querySelector('.popup__button');
  toggleButtonState(inputList, buttonElement);
});

closeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const popup = button.closest('.popup');
    closeModal(popup);
    if (popup === modalAdd) {
      formNewCard.reset();
    };
  });
});

closeModalOnOverlay(modalEdit);
closeModalOnOverlay(modalAdd);
closeModalOnOverlay(modalImage);

function editProfile(evt) {
  evt.preventDefault();
  const name = nameInput.value;
  const job = jobInput.value;
  profileTitle.textContent = name;
  profileDescription.textContent = job;
  closeModal(modalEdit);
}

formElement.addEventListener('submit', editProfile);

function addNewCard(evt) {
  evt.preventDefault();
  const inputList = Array.from(formNewCard.querySelectorAll('.popup__input'));
  const newCardData = {
    name: placeInput.value,
    link: linkInput.value,
  };
  const newCardElement = createCard(newCardData, deleteCard, toggleLike, openModalImage);
  placesList.prepend(newCardElement);
  formNewCard.reset();
  closeModal(modalAdd);
  const buttonElement = formNewCard.querySelector('.popup__button');
  toggleButtonState(inputList, buttonElement);
}

formNewCard.addEventListener("submit", addNewCard);

formNewCard.addEventListener("reset", () => {
  const inputList = Array.from(formNewCard.querySelectorAll('.popup__input'));
  const buttonElement = formNewCard.querySelector('.popup__button');
  inputList.forEach((inputElement) => hideInputError(formNewCard, inputElement));
  toggleButtonState(inputList, buttonElement);
});

function openModalImage(link, name) {
  imageModalImage.src = link;
  imageModalImage.alt = name;
  captionModalImage.textContent = name;

  openModal(modalImage);
}

renderCards();