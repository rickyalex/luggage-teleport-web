import React, { Component } from 'react';
import { Link, withRouter  } from 'react-router-dom';
import axios from 'axios';
import { sendEmail } from './helper';

class EmailHandler extends Component {

	constructor(props) {
		super(props);

		this.state = {
			id: ''
		}

        const queryString = require('query-string');
        const srch = queryString.parse(this.props.location.search);

        //console.log(srch.trackingNumber);
        const send = sendEmail(srch.trackingNumber,srch.sequence);
	}        

	componentsDidMount(){

	}

	render(){
		return ('Status Updated !');
	}
}

function mapsStateToProps(state) {
    const { user } = state;
    return {
        user
    }
}

export default withRouter(EmailHandler);