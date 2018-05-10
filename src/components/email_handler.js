import { Component } from 'react';
import { withRouter  } from 'react-router-dom';

class EmailHandler extends Component {

	constructor(props) {
		super(props);

		this.state = {
			id: ''
		}

        //const queryString = require('query-string');
        //const srch = queryString.parse(this.props.location.search);

        //console.log(srch.trackingNumber);
        //const send = sendEmail(srch.trackingNumber,srch.sequence);
	}        

	componentsDidMount(){

	}

	render(){
		return ('Status Updated !');
	}
}

export default withRouter(EmailHandler);