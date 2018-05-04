import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';
import { sendEmail } from './helper';

class EmailHandler extends Component {

    constructor(props) {
        super(props);

        const queryString = require('query-string');
        const trackingNumber = queryString.parse(this.props.location.search.trackingNumber);
        const sequence = queryString.parse(this.props.location.search.sequence);

        let send = sendEmail(trackingNumber, sequence);
    }

    componentDidMount() {
        
    }

    render() {
        return (
            
        )
    }
}

export default withRouter(EmailHandler);