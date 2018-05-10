import React, { Component } from 'react';

import ReactTooltip from 'react-tooltip';
import { withRouter } from 'react-router-dom';
//import Navbar from './components/navbar';
import FixedNavbar from './components/fixed_navbar';
import BookingForm from './components/booking_form';
import './App.css';



class App extends Component {

  componentDidMount(){
    const token = localStorage.getItem('token');

    if(token === null || token === undefined){
      this.props.history.push('/')
    }
  }

  render() {
    return (
      <div className="history-bg-image">
          <ReactTooltip place="bottom" type="info" effect="solid"/>
          <div className="site-container">
            <div>
              < FixedNavbar />
            </div>
            <div>
              <div className="container">
                <BookingForm />
              </div>
            </div>
          </div>
      </div>
    );
  }
}

export default withRouter(App);
