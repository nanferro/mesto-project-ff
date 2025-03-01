import '../pages/index.css';
import { initialCards } from './cards';
import avatar from '../images/avatar.jpg';

// аватар

const profileImage = document.querySelector('.profile__image');
profileImage.style.backgroundImage = `url(${avatar})`;

// создание начальных карточек

const cardTemplate = document.querySelector("#card-template").content;
const placesList = document.querySelector(".places__list");

function createCard(cardData, deleteCallback, likeCallback, imageCallback) {
  const cardElement = cardTemplate.cloneNode(true).querySelector(".card");
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");

  cardImage.src = cardData.link;
  cardTitle.textContent = cardData.name;
  cardImage.alt = cardData.name;

  deleteButton.addEventListener("click", () => {
    deleteCallback(cardElement);
  });

  likeButton.addEventListener("click", likeCallback);

  cardImage.addEventListener("click", imageCallback);

  return cardElement;
}

function deleteCard(cardElement) {
  cardElement.remove();
}

initialCards.forEach((cardData) => {
  const cardElement = createCard(cardData, deleteCard, toggleLike, openImagePopup);
  placesList.append(cardElement);
});

// попапы

const editButton = document.querySelector('.profile__edit-button');
const popupEdit = document.querySelector('.popup_type_edit');
const addButton = document.querySelector('.profile__add-button');
const popupAdd = document.querySelector('.popup_type_new-card');

function openPopup(popup) {
  popup.classList.add('popup_is-opened', 'popup_is-animated');
  document.addEventListener('keydown', handleEscClose);
}

editButton.addEventListener('click', () => openPopup(popupEdit));
addButton.addEventListener('click', () => openPopup(popupAdd));

const closeButtons = document.querySelectorAll('.popup__close');

function closePopup(popup) {
  popup.classList.remove('popup_is-opened', 'popup_is-animated');
  document.removeEventListener('keydown', handleEscClose);
}

closeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const popup = button.closest('.popup');
    closePopup(popup);
  });
});

const allPopups = document.querySelectorAll('.popup');

allPopups.forEach((popup) => {
  popup.addEventListener('click', (event) => {
    if (event.target === popup) {
      closePopup(popup);
    }
  });
});

function handleEscClose(event) {
  if (event.key === 'Escape') {
    const openPopup = document.querySelector('.popup_is-opened');
    if (openPopup) {
      closePopup(openPopup);
    }
  }
}

// редактировать профиль

const formElement = document.querySelector('.popup__form[name="edit-profile"]');
const nameInput = formElement.querySelector('.popup__input_type_name');
const jobInput = formElement.querySelector('.popup__input_type_description');

const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

function handleFormSubmit(evt) {
    evt.preventDefault();
    const name = nameInput.value;
    const job = jobInput.value;
    profileTitle.textContent = name;
    profileDescription.textContent = job;
    closePopup(popupEdit);
}

const closeButtonEdit = popupEdit.querySelector('.popup__close');

editButton.addEventListener('click', () => {
    popupEdit.classList.add('popup_is-opened');
    nameInput.value = profileTitle.textContent;
    jobInput.value = profileDescription.textContent;
});

closeButtonEdit.addEventListener('click', () => {
    closePopup(popupEdit);
});

formElement.addEventListener('submit', handleFormSubmit);

// добавляем новые карточки

const formNewCard = document.querySelector(".popup__form[name='new-place']");
const placeInput = formNewCard.querySelector(".popup__input_type_card-name");
const linkInput = formNewCard.querySelector(".popup__input_type_url");

function handleNewCardSubmit(evt) {
  evt.preventDefault();

  const newCardData = {
    name: placeInput.value,
    link: linkInput.value,
  };

  const newCardElement = createCard(newCardData, (card) => card.remove(), toggleLike, openImagePopup);
  placesList.prepend(newCardElement);

  formNewCard.reset();

  closePopup(popupAdd);
}

formNewCard.addEventListener("submit", handleNewCardSubmit);

// Лайк

function toggleLike(event) {
  event.target.classList.toggle("card__like-button_is-active");
}

// Попап с картинкой

const imagePopup = document.querySelector('.popup_type_image');

function openImagePopup(event) {
  const imageUrl = event.target.src;
  const imageAlt = event.target.alt;

  const imageImagePopup = document.querySelector(".popup__image");
  const captionImagePopup = document.querySelector(".popup__caption");

  imageImagePopup.src = imageUrl;
  imageImagePopup.alt = imageAlt;
  captionImagePopup.textContent = imageAlt;

  openPopup(imagePopup);
}

