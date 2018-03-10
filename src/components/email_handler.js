import React, { Component } from 'react';
import { Link, withRouter  } from 'react-router-dom';
import axios from 'axios';
import { SENDGRID_API_KEY } from '../config';

class EmailHandler extends Component {

	constructor(props) {
		super(props);

		this.state = {
			id: ''
		}

		const datas = [];

		const queryString = require('query-string');
        const id = queryString.parse(this.props.location.search.id);
        
        let token = localStorage.getItem('token')
        let config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }

        axios.get(`https://el3ceo7dwe.execute-api.us-west-1.amazonaws.com/dev/handler/Corporate-get/${this.id}`, config)
            .then((res) => {
                console.log(res);
                
          //       sgMail.setApiKey(SENDGRID_API_KEY);
		        // const msg = {
		        //   to: 'rickyalex88@gmail.com',
		        //   from: 'no-reply@luggageteleport.com',
		        //   bcc: 'max@luggageteleport.com',
		        //   subject: 'Luggage Teleport Receipt',
		        //   text: params.Item.BookingId,
		        //   html: '<img src="https://s3-us-west-1.amazonaws.com/luggageteleport.net/img/frame01.png"  width="377" height="auto"/>'+'<br><br>'+
		        //         '<strong>Thank You for booking with us !</strong>'+'<br><br>'+
		        //         'Your Booking ID : '+params.Item.BookingId+'<br>'+
		        //         'Booking : Airport to Hotel<br>'+
		        //         'Email : '+params.Item.email+'<br>'+
		        //         'Phone Number : '+params.Item.phone+'<br>'+
		        //         'Number of bags : '+params.Item.LuggageQuantity+'<br>'+
		        //         'Price : $'+params.Item.TotalCost+'<br>'+
		        //         '<strong>Pick Up Point </strong>'+'<br>'+
		        //         'Airport : '+params.Item.AirportPickup+'<br>'+
		        //         'Airline : '+params.Item.AirlinePickup+'<br>'+
		        //         'Arrival Time: '+params.Item.ArrivalTime+'<br>'+
		        //         '<strong>Drop Off Point </strong>'+'<br>'+
		        //         'Airport : '+params.Item.AirportDropoff+'<br>'+
		        //         'Airline : '+params.Item.AirlineDropoff+'<br>'+
		        //         'Departure Time : '+params.Item.DepartureTime+'<br>'+
		        //         '<img src="https://s3-us-west-1.amazonaws.com/luggageteleport.net/img/frame02.png"  width="377" height="auto"/>'
		        // };
		        // sgMail.send(msg);
            }).catch((err) => {
                console.log(err);
            })
        

        
	}        

	componentsDidMount(){
		console.log('wedus');
		

        
        // let token = localStorage.getItem('token')
        // let config = {
        //     headers: {
        //         'Authorization': `Bearer ${token}`,
        //         'Content-Type': 'application/json'
        //     }
        // }



        // const { id } = parsed.id
        // axios.get(`https://el3ceo7dwe.execute-api.us-west-1.amazonaws.com/dev/handler/Corporate-get/${id}`, config)
        //     .then((res) => {
        //         console.log(res);
        //         this.state.res = res;
        //     }).catch((err) => {
        //         console.log(err);
        //     })
	}

	render(){
		return (<div>ID :</div>);
	}
}

function mapsStateToProps(state) {
    const { user } = state;
    return {
        user
    }
}

export default withRouter(EmailHandler);