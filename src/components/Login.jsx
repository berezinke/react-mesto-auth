import React from 'react';
import { withRouter } from 'react-router-dom';
import IdentificationWithForm from '../components/IdentificationWithForm.js';

function Login(props) {
  const [userEmail, setUserEmail] = React.useState('');
  const [userPassword, setUserPassword] = React.useState('');

  function handleChangeUserEmail(e) {
    setUserEmail(e.target.value);    
  }
  function handleChangeUserPassword(e) {
    setUserPassword(e.target.value);    
  }

  function closePopLogin () {
    props.onClose()
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!userEmail || !userPassword){
      return;
    }
    props.exApi.userAuthorize(userEmail, userPassword)
    .then((data) => {
      if (data.token){
        props.setMessageInfo('messageOk');
        props.setInfoOpen(true);

        localStorage.setItem('jwt', data.token);
        props.setMailUserInfo(userEmail);
        
        setUserEmail('');
        setUserPassword('');
        
        props.handleLogin(true);
        props.history.push('/')
            
      } 
    })
    .catch((err) => {
      props.setMessageInfo('messageUps');
      props.setInfoOpen(true);
      console.log(err)
    })
  }

  return (
    <div className="login">
        <IdentificationWithForm 
          title = "Вход"
          name = "login"
          submit = "Войти"
          isOpen = {props.isOpen}
          onClose = {closePopLogin}
          onSubmit = {handleSubmit}
          isRegisterPopupOpen = {props.isRegisterPopupOpen}
          isThinking = {props.isThinking}>

          <input type="email" 
            className="identification__input" 
            name="username"
            placeholder="Email" 
            value = {userEmail}
            onChange={handleChangeUserEmail}
            required/>
          <input type="password" 
            className="identification__input"
            name="password"
            value = {userPassword}
            onChange={handleChangeUserPassword}
            placeholder="Пароль" required/>
        </IdentificationWithForm>        
    </div>
  )
}

export default withRouter(Login);
/*
<p className="login__welcome">
          Пожалуйста, войдите или зарегистрируйтесь, чтобы получить доступ.
        </p>
        <form onSubmit={handleSubmit} className="login__form">
          <label htmlFor="username">
            Логин:
          </label>
          <input id="username" required name="username" 
                 type="email" value={userEmail} onChange={handleChangeUserEmail} />
          <label htmlFor="password">
            Пароль:
          </label>
          <input id="password" required name="password" 
                 type="password" value={userPassword} onChange={handleChangeUserPassword} />
            <div className="login__button-container">
              <button type="submit" className="login__link">Войти</button>
            </div>
        </form>

<div className="login__signup">
            <p>Ещё не зарегистрированы?</p>
            <Link to="/sign-up" className="signup__link">Зарегистрироваться</Link>
          </div>

*/