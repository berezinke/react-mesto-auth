import logo  from '../images/header-logo.svg';
import React from 'react';
import {objAuth} from '../utils/Utils.js';
import { useLocation } from 'react-router-dom';

function Header(props) {
  const location = useLocation();

  if (location.pathname == '/') {
    props.setArrAuth(objAuth.authExit);
  } else if (location.pathname == '/sign-in'){
    props.setArrAuth(objAuth.authReg);
  } else {
    props.setArrAuth(objAuth.authEnter);
  }
  
  /*React.useEffect(() => {
    if (props.loggedIn) {
      props.setArrAuth(objAuth.authExit);
    } else {
      props.setArrAuth(objAuth.authReg);
    }    
  }, [props.loggedIn])*/

  function changeFormAuth() {
    if (!props.loggedIn) {
      if (props.arrAuth[0] === 'sign-in') {
        props.setArrAuth(objAuth.authReg)
        props.setRegisterPopupOpen(false)
      } else {
        props.setArrAuth(objAuth.authEnter)
        props.setRegisterPopupOpen(true)
      }
    } else {
      localStorage.removeItem('jwt');
      props.setMailUserInfo('');
      props.setLoggedIn(false);
      props.setArrAuth(objAuth.authEnter);
    }
    props.history.push(props.arrAuth[0]);
  }

  return (
    <header className="header">
      <img src={logo} alt="Лого Место" className="logo"/>
      <button type="button" 
              style={{backgroundColor: `black`, color: `#ffffff`, width: `250px`, 
                      display: 'flex', justifyContent: 'space-between'}} 
              onClick={changeFormAuth}>
        <p>
          {props.mailUserInfo}
        </p>
        <p>
          {props.arrAuth[1]}
        </p>
      </button>
    </header>
  );
}

export default Header;

// , width: `300px`, display: 'flex', justifyContent: 'space-between'}