const config = {
  baseUrl: 'https://nomoreparties.co/v1/wff-cohort-33',
  headers: {
    authorization: 'b3c973c1-fbfb-43f0-906e-5d6a6714e3e0',
    'Content-Type': 'application/json'
  }
};

const checkResponse = (res) => {
  if (res.ok) {
    return res.json();
  }
  return res.json().then(err => Promise.reject(`Ошибка: ${res.status} - ${err.message || err}`));
};

export const getUserInfo = () => {
  return fetch(`${config.baseUrl}/users/me`, {
    headers: config.headers
  })
  .then(checkResponse)
  .catch(err => console.error("Ошибка при загрузке данных пользователя:", err));
};

export const getInitialCards = () => {
  return fetch(`${config.baseUrl}/cards`, {
    headers: config.headers
  })
  .then(checkResponse)
  .catch(err => console.error("Ошибка при загрузке карточек:", err));
};

export const updateUserProfile = (name, about) => {
  return fetch(`${config.baseUrl}/users/me`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({ name, about })
  })
  .then(checkResponse)
  .catch(err => console.error("Ошибка при обновлении профиля:", err));
};

export const updateAvatar = (avatar) => {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({ avatar })
  })
  .then(checkResponse)
  .catch(err => console.error("Ошибка при обновлении аватара:", err));
};

export const addNewCard = (name, link) => {
  return fetch(`${config.baseUrl}/cards`, {
    method: 'POST',
    headers: config.headers,
    body: JSON.stringify({ name, link })
  })
  .then(checkResponse)
  .catch(err => console.error("Ошибка при добавлении карточки:", err));
};

export const deleteCard = (cardId) => {
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: 'DELETE',
    headers: config.headers
  })
  .then(res => res.ok ? Promise.resolve() : checkResponse(res))
  .catch(err => console.error("Ошибка при удалении карточки:", err));
};

export const toggleLike = (cardId, isLiked) => {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: isLiked ? 'DELETE' : 'PUT',
    headers: config.headers
  })
  .then(checkResponse)
  .catch(err => console.error("Ошибка при изменении лайка:", err));
};
