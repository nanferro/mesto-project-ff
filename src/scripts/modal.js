export function openModal(popup) {
  popup.classList.add('popup_is-opened', 'popup_is-animated');
  document.addEventListener('keydown', closeOnEsc);
}
  
export function closeModal(popup) {
  popup.classList.remove('popup_is-opened', 'popup_is-animated');
  document.removeEventListener('keydown', closeOnEsc);
}

function closeOnEsc(event) {
  if (event.key === 'Escape') {
    const openPopup = document.querySelector('.popup_is-opened');
    if (openPopup) {
      closeModal(openPopup);
    }
  }
}
  
export function closeModalOnOverlay(popup) {
  popup.addEventListener('click', (event) => {
    if (event.target === popup) {
      closeModal(popup);
      const form = popup.querySelector('.popup__form');
      if (form) {
        form.reset();
      }
    }
  });
}