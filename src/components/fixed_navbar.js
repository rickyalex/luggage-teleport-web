import React from "react";
import { withRouter } from 'react-router-dom';
import { LogUser, ToggleSB } from '../actions';
import { connect } from 'react-redux';
import { USER_POOL_ID, CLIENT_ID } from '../config';
import { CognitoUserPool } from "amazon-cognito-identity-js";
// import { slide as Menu } from 'react-burger-menu';
import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import '../App.css'
import AWS from "aws-sdk";
import { getCurrentUser, getUserToken } from '../aws_cognito';


class FixedNavbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sbState: 'menu',
      navState: 'home',
      img: localStorage.getItem('img') || 'https://s3-us-west-1.amazonaws.com/luggageteleport.net/img/default_img.png',
    }

    //this.setNavState = this.setNavState.bind(this);
    this.RenderLogoutButton = this.RenderLogoutButton.bind(this);
  }

  signOutUser = () => {
    const currentUser = getCurrentUser();
    if (currentUser !== null) {
      currentUser.signOut();
    }
    localStorage.removeItem('state');
    localStorage.removeItem('token');
    localStorage.removeItem('CustName');
    if (AWS.config.credentials) {
      AWS.config.credentials.clearCachedId();
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({});
    }
    this.props.history.push('/');
    window.location.reload();
  }

  handleClick = (e) => {
    console.log('click ', e);
    if(e.key==1){ this.props.history.push('/') }
    else if(e.key==2){ this.props.history.push('/history') }
  }

  setNavState(value){
    console.log(value)
  }

  toggleSidebar(e){
    e.preventDefault();
    const { sbState } = this.state;
    var css = (this.state.sbState === "menu") ? "menu show" : "menu";
    this.setState({"sbState":css});
  }

  RenderLoginButton() {
    return (
      <button
        style={{ backgroundColor: 'transparent', outline: 'none', border: 'none', color: '#115fdd' }}
        onClick={() => this.Login()}>
        <strong>Login</strong>
      </button>
    )
  }

  RenderLogoutButton() {
    return (
      <button
        style={{ backgroundColor: 'transparent', outline: 'none', border: 'none', color: '#115fdd' }}
        onClick={() => this.signOutUser()}>
        <strong>Logout</strong>
      </button>
    )
  }

  Login() {
    this.props.history.push('/');
  }

  render() {
    const token = localStorage.getItem('token')
    const currentUser = getCurrentUser();
    const {Header} = Layout;
    return (
<nav className="navbar navbar-expand-lg navbar-dark luggage-blue">
          <a className="navbar-brand" href="https://www.luggageteleport.com" target="_blank">
            <img src="https://www.luggageteleport.com/wp-content/themes/luggage/images/logo.png" width="200" height="auto" alt/>
          </a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto ml-auto">
              <li className="nav-item" >
                <Link className="nav-link" to="/home">Home</Link>
              </li>
              <li className="nav-item" >
                <Link className="nav-link" to="/history">My Bookings</Link>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="https://www.luggageteleport.com">LuggageTeleport.com</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="https://www.luggageteleport.com/contact-us/">Contact Us</a>
              </li>
            </ul>
            <span className="navbar-text" style={{ width: '140px'}} >
              <ul className="navbar-nav">
                <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <div className="minipic" style={{ float: 'left', margin: '3px 15px 0 0', cursor: 'pointer', backgroundImage: `url(${this.state.img})` }}></div>
                      {
                        (!token) ? <Link to="/login">Login</Link> : "Hi "+currentUser.pool.storage.CustName
                      }
                    </a>
                    <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                      <Link className="dropdown-item" style={{ color: 'rgba(255,255,255,.5)' }} to="/profile">Profile</Link>
                      <a className="dropdown-item" href="#" onClick={this.signOutUser}>Logout</a>
                    </div>
                  </li>
              </ul>
            </span>
            {/*<div className="form-inline " style={{ width: '100px', marginLeft: '100px' }}>}
            
              (!token) ? <Link style={{ color: 'rgba(255,255,255,.5)' }} to="/login">Login</Link> : <Link style={{ color: 'rgba(255,255,255,.5)' }} to="/profile">Hi {currentUser.pool.storage.CustName}</Link>
            
            </div> */}
          </div>
        </nav>
        
      
    );
  }
}

function mapsStateToProps(state) {
  const { user } = state;
  return {
    user
  }
}

export default withRouter(connect(mapsStateToProps, { ToggleSB })(FixedNavbar));
