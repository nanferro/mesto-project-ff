export function createCard(cardData, deleteCallback, likeCallback, imageCallback) {
  const cardTemplate = document.querySelector("#card-template").content;
  const cardElement = cardTemplate.cloneNode(true).querySelector(".card");
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");
  
  cardImage.src = cardData.link;
  cardTitle.textContent = cardData.name;
  cardImage.alt = cardData.name;
  
  deleteButton.addEventListener("click", () => deleteCallback(cardElement));
  likeButton.addEventListener("click", likeCallback);
  cardImage.addEventListener("click", () => imageCallback(cardData.link, cardData.name));
  
  return cardElement;
}

export function deleteCard(cardElement) {
  cardElement.remove();
}

export function toggleLike(event) {
  event.target.classList.toggle("card__like-button_is-active");
}
  