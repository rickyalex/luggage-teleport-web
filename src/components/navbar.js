import React from "react";
import { withRouter } from 'react-router-dom';
import { LogUser } from '../actions';
import { connect } from 'react-redux';
import { USER_POOL_ID, CLIENT_ID } from '../config';
import { CognitoUserPool } from "amazon-cognito-identity-js";
import { slide as Menu } from 'react-burger-menu';
import { Link } from 'react-router-dom';
import '../App.css'
import AWS from "aws-sdk";
import { getCurrentUser, getUserToken } from '../aws_cognito';


class Navbar extends React.Component {
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
    return (
      <div>
        <nav>
          <div>
            <Menu right>
              {
                !token ? <div></div>
                  :
                  <div>
                    Hi {currentUser.pool.storage.CustName}
                  </div>
              }
              <a id="log" className="menu-item">
                {
                  !token ? this.RenderLoginButton() :
                    this.RenderLogoutButton()
                }
              </a>
              <a id="history" className="menu-item">
                {
                  !token ? <div></div>
                    :
                    <Link to="/history">History</Link>
                }
              </a>
              <a id="admin" className="menu-item">
                {
                  !token ? <div></div>
                    :
                    <Link to="/admin">Admin</Link>
                }
              </a>
              <a target="_blank" id="home" className="menu-item" href="https://www.luggageteleport.com/"><Link to="/home">Home</Link></a>
              <a target="_blank" id="about" className="menu-item" href="https://www.luggageteleport.com/about-us/">About Us</a>
              <a target="_blank" id="service" className="menu-item" href="https://www.luggageteleport.com/our-services/">Our Services</a>
              <a target="_blank" id="cnp" className="menu-item" href="https://www.luggageteleport.com/careers-partnerships/">Careers & Partnerships</a>
              <a target="_blank" id="contact" className="menu-item" href="https://www.luggageteleport.com/contact-us/">Contact Us </a>
              <a target="_blank" id="booking" className="menu-item SideBar" ><Link to="/booking">Booking</Link></a>

            </Menu>
          </div>
          <div className="container">
            <a className="navbar-brand" href="https://www.luggageteleport.com" target="_blank">
              <img
                src="https://www.luggageteleport.com/wp-content/themes/luggage/images/logo.png"
                alt
              />
            </a>
          </div>
        </nav>
      </div>
    );
  }
}

function mapsStateToProps(state) {
  const { user } = state;
  return {
    user
  }
}

export default withRouter(connect(mapsStateToProps, null)(Navbar));
