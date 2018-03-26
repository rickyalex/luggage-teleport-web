import React from "react";
import { withRouter } from 'react-router-dom';
import { LogUser } from '../actions';
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
  }

  signOutUser() {
    const currentUser = getCurrentUser();
    if (currentUser !== null) {
      currentUser.signOut();
    }
    localStorage.removeItem('state')
    localStorage.removeItem('token')
    localStorage.removeItem('CustName')
    if (AWS.config.credentials) {
      AWS.config.credentials.clearCachedId();
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({});
    }
    this.props.history.push('/')
    window.location.reload();

  }

  handleClick = (e) => {
    console.log('click ', e);
    if(e.key==1){ this.props.history.push('/') }
    else if(e.key==2){ this.props.history.push('/history') }
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
      <header className="header">
         
        <a href="https://www.luggageteleport.com" target="_blank" className="header__logo">
          <img src="https://www.luggageteleport.com/wp-content/themes/luggage/images/logo.png" width="200" height="auto" alt/>
        </a>
        <a href="#" class="header__icon" id="header__icon"></a>
        
        <nav class="menu">
          <a href="#">Book</a>|
          <a href="#">My Bookings</a>|
          <a href="#">LuggageTeleport.com</a>|
          <a href="#">Contact Us</a>
          <a href="#" className="profile_link">Hi {currentUser.pool.storage.CustName}</a>
        </nav>
        
      </header>
    );
  }
}

function mapsStateToProps(state) {
  const { user } = state;
  return {
    user
  }
}

export default withRouter(connect(mapsStateToProps, null)(FixedNavbar));
