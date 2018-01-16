import React, { Component } from 'react';

import ReactTooltip from 'react-tooltip';
import { connect } from 'react-redux';
import Navbar from './components/navbar';
import BookingForm from './components/booking_form';



class App extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    // console.log('this.props', this.props.user);
    return (
      <div>
        <ReactTooltip place="bottom" type="info" effect="solid" />
        <div style={{backgroundColor: 'black'}}>
          < Navbar />
        </div>
        <div>
          <BookingForm />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { user } = state;
  return {
    user
  }
}

export default connect(mapStateToProps, null)(App);
