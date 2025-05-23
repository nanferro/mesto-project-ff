export function createCard(cardData, deleteCallback, likeCallback, imageCallback, userId) {
  const cardTemplate = document.querySelector("#card-template").content;
  const cardElement = cardTemplate.cloneNode(true).querySelector(".card");
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");
  const likeCount = cardElement.querySelector(".card__like-count");

  cardImage.src = cardData.link;
  cardTitle.textContent = cardData.name;
  cardImage.alt = cardData.name;
  likeCount.textContent = cardData.likes.length;

  if (cardData.likes.some(like => like._id === userId)) {
    likeButton.classList.add("card__like-button_is-active");
  }

  if (cardData.owner._id !== userId) {
    deleteButton.remove();
  } else {
    deleteButton.addEventListener("click", () => deleteCallback(cardData._id, cardElement));
  }
  
  likeButton.addEventListener("click", () => likeCallback(cardData._id, likeButton, likeCount));
  cardImage.addEventListener("click", () => imageCallback(cardData.link, cardData.name));

  return cardElement;
}

export function checkLikeStatus(likeButton) {
  return likeButton.classList.contains("card__like-button_is-active");
}

export function updateLikeButton(likeButton, likeCount, updatedLikes) {
  likeCount.textContent = updatedLikes.length;
  likeButton.classList.toggle("card__like-button_is-active");
}
