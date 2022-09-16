import React from 'react';

class PopupInfo extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={`popup ${this.props.isOpen && 'popup_opened'}`}>
        <div className="popup__container">
          <form className="profile-change" 
                name={this.props.name} 
                noValidate>
            <h3 className="profile-change__title">
              {this.props.title}
            </h3>
          </form>
        </div>
      </div>
    );
  }
} 
export default PopupInfo;