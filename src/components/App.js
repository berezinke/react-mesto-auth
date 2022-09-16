import React from 'react';
import '../index.css';
import Header from '../components/Header.js';
import Main from '../components/Main.js';
import Footer from '../components/Footer.js';
import PopupWithForm from '../components/PopupWithForm.js';
import PopupInfo from '../components/PopupInfo.js';
import ImagePopup from '../components/ImagePopup.js';
import EditProfilePopup from '../components/EditProfilePopup.js';
import EditAvatarPopup from '../components/EditAvatarPopup.js';
import AddPlacePopup from '../components/AddPlacePopup.js';
import exApi from '../utils/Api.js';

import {CurrentUserContext} from '../context/CurrentUserContext.js';

function App() {
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = React.useState(false)
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = React.useState(false)
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = React.useState(false)
  const [isInfoOpen, setInfoOpen] = React.useState(false)
  const [selectedCard, setSelectedCard] = React.useState({isOpen:false, cardPicture:'', cardText:''})

  const [currentUser , setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const promiseAuthorInfo = exApi.getAuthorInfo();
  const promiseAllCard = exApi.getInitCards();

  const [isThinking, setIsThinking] = React.useState(false)
    
  React.useEffect(() => {
    Promise.all([promiseAuthorInfo, promiseAllCard])
     .then(([resAuthor, resAllCards]) => {
      setCurrentUser(resAuthor);
      setCards(resAllCards); 
     })
     .catch((err) => {
        console.log('Ошибка. Запрос к серверу не выполнен: ', err)
     })
  }, []);

  // Kusto
  function handleEditProfileClick() {
    setEditProfilePopupOpen(true);
  }
  function handleUpdateUser (authorInfo) {
    setIsThinking(true);
    exApi.setAuthorInfo(authorInfo)
     .then((resAuthor) => {
      setCurrentUser(resAuthor)
      closeAllPopups()
     })
     .catch((err) => {
        console.log('Ошибка. Запрос к серверу не выполнен: ', err)
     })
     .finally(() =>{
      setIsThinking(false);
     })
  };

  // Avatar
  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(true);
  }
  function handleUpdateAvatar (avatarInfo) {
    setIsThinking(true);
    exApi.setAuthorAvatar(avatarInfo)
     .then((resAuthor) => {
      setCurrentUser(resAuthor)
      closeAllPopups()
     })
     .catch((err) => {
        console.log('Ошибка. Запрос к серверу не выполнен: ', err)
     })
     .finally(() =>{
      setIsThinking(false);
     })
  };

  // Card
  function handleAddPlaceClick() {
    setAddPlacePopupOpen(true);
  }
  function handleCardClick(card) {
    setSelectedCard({isOpen:true, cardPicture:card.link, cardText:card.name});
  }
  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    setInfoOpen(true);
    (isLiked ? exApi.putoffLikeFromCard(card._id) : exApi.putLikeToCard(card._id))    
    .then((newCard) => {
      setCards((cards) => cards.map((c) => c._id === card._id ? newCard : c));
    })
    .catch((err) => {
      console.log('Ошибка. Запрос к серверу не выполнен: ', err)
   })
   .finally(() =>{
    setInfoOpen(false);
   });
  }
  function handleCardDelete(card) {
    setInfoOpen(true);
    exApi.deleteCardFromServer(card._id)    
    .then((newCard) => {
      setCards((cards) => cards.filter((c) => {return (c._id != card._id)}))
    })
    .catch((err) => {
      console.log('Ошибка. Запрос к серверу не выполнен: ', err)
   })
   .finally(() =>{
    setInfoOpen(false);
   });
  }
  function handleAddPlaceSubmit (cardInfo) {
    setIsThinking(true);
    exApi.addCardToServer(cardInfo)
     .then((resCard) => {
      setCards([resCard, ...cards]);
      closeAllPopups()
     })
     .catch((err) => {
        console.log('Ошибка. Запрос к серверу не выполнен: ', err)
     })
     .finally(() =>{
      setIsThinking(false);
     })
  };

  // Close
  function closeAllPopups() {
    setEditAvatarPopupOpen(false);
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setSelectedCard({isOpen:false, cardPicture:'', cardText:''});
  }
    
  return (
    <div className="body">
    <div className="page">
    <CurrentUserContext.Provider value={currentUser}>
      <Header />
      <Main 
        cards = {cards}
        onCardLike = {handleCardLike}
        onCardDelete = {handleCardDelete}
        onEditProfile={handleEditProfileClick}
        onAddPlace={handleAddPlaceClick}
        onEditAvatar={handleEditAvatarClick}
        onCardClick={handleCardClick}
        onClose = {closeAllPopups}
      />
      <Footer />

      <EditProfilePopup
        isOpen = {isEditProfilePopupOpen}
        onClose = {closeAllPopups}
        onUpdateUser = {handleUpdateUser}
        isThinking = {isThinking}>
      </EditProfilePopup>

      <AddPlacePopup 
        isOpen = {isAddPlacePopupOpen}
        onClose = {closeAllPopups}
        onAddCard = {handleAddPlaceSubmit}
        isThinking = {isThinking}> 
      </AddPlacePopup>

      <EditAvatarPopup 
        isOpen = {isEditAvatarPopupOpen}
        onClose = {closeAllPopups}
        onUpdateAvatar = {handleUpdateAvatar}
        isThinking = {isThinking}>
      </EditAvatarPopup>

      <PopupInfo 
        isOpen = {isInfoOpen}
        title = "Вношу изменения в базу"
        name = "changeWriting">
      </PopupInfo>

      <PopupWithForm 
        title = "Вы уверены?"
        name = "avatarcardDeleteEdit"
        submit = "Да"
        onClose = {closeAllPopups}>
      </PopupWithForm>

      <ImagePopup 
        picture = {selectedCard.cardPicture}
        text = {selectedCard.cardText}
        isOpen = {selectedCard.isOpen}
        onClose = {closeAllPopups}>
      </ImagePopup>
    </CurrentUserContext.Provider>
    </div>
    </div>
  );
}

export default App;