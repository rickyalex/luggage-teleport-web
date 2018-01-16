import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PassBookData } from '../actions';
import '../App.css';
import * as moment from 'moment';
import axios from 'axios';
import SquarePaymentForm from './square_payment_form';
import { SQUARE_APP_ID } from '../config';

class HTHFInalReview extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            TotalCost: 0,
            Luggage: 0
        }

        this.backToPayment = this.backToPayment.bind(this);
        this.Submit = this.Submit.bind(this);
        this.handleNonce = this.handleNonce.bind(this);
        this.handleLuggage = this.handleLuggage.bind(this);
    }

    PushData() {
        const { dispatch } = this.props;
        dispatch(PassBookData(this.props.BookData));
    }
    async backToPayment() {
        this.PushData()
        this.props.history.push('/payment');
    }
    async Submit() {
        this.paymentForm.generateNonce();
    }

    async handleNonce(nonce, cardData) {
        const { HotelDropoff, HotelDropoffBookingRef, HotelDropoffDate, Email, HotelPickup, HotelPickupBookingRef,
            HotelPickupDate, OvernightStorage, PhoneNumber, RsvpNameHotelDropoff, RsvpNameHotelPickup } = this.props.BookData[0];
        const { PaymentMethod } = this.props.payment;
        const { Luggage, TotalCost } = this.state
        let data = JSON.stringify({
            HotelDropoff: HotelDropoff, 
            HotelDropoffBookingRef: HotelDropoffBookingRef, 
            HotelDropoffDate: HotelDropoffDate, 
            email: Email, 
            HotelPickup: HotelPickup, 
            HotelPickupBookingRef: HotelPickupBookingRef,
            HotelPickupDate: HotelPickupDate, 
            PhoneNumber: PhoneNumber, 
            RsvpNameHotelDropoff: RsvpNameHotelDropoff, 
            RsvpNameHotelPickup: RsvpNameHotelPickup,
            PaymentWith: PaymentMethod,
            LuggageQuantity: Luggage,
            TotalCost: TotalCost,
            cardNonce: nonce,
        })

        let token = localStorage.getItem('token')
        // console.log('token', token)
        let config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }
        this.setState({ isLoading: true })

        axios.post('https://el3ceo7dwe.execute-api.us-west-1.amazonaws.com/dev/handler/HotelToHotel-create', data, config)
            .then((response) => {
                // console.log(response);
                alert('success booked!')
                this.props.history.push('/home');
            }, (err) => {
                // console.log(err);
                this.setState({ isLoading: false })
            })
    }
    handleNonceError(errors) {
        console.log('handleNonceError', errors);
        alert(errors[0].message)
    }

    async handleLuggage() {
        const { Luggage, TotalCost } = this.state
        // this.setState({Luggage})
        if (Luggage > 0 && Luggage <= 2) {
            this.setState({ TotalCost: 35 })
        } else if (Luggage > 2) {
            const TotalWithAdditional = 35 + ((Luggage - 2) * 10);
            this.setState({ TotalCost: TotalWithAdditional })
        }

    }

    render() {
        // console.log('this.props', this.props.BookData[0])
        const { HotelDropoff, HotelDropoffBookingRef, HotelDropoffDate, Email, HotelPickup, HotelPickupBookingRef,
            HotelPickupDate, OvernightStorage, PhoneNumber, RsvpNameHotelDropoff, RsvpNameHotelPickup } = this.props.BookData[0];
        const { PaymentMethod } = this.props.payment;
        return (
            <div>
                <div className="containerProgressBar" style={{ marginTop: '1em' }}>
                    <ul className="progressbar">
                        <li className="active">Booking</li>
                        <li className="active">Booking Review</li>
                        <li className="active">Payment Method</li>
                        <li>Booking/Payment Review &amp; Submit</li>
                    </ul>
                    <div className="receipt">
                        <h3>Contact Info</h3>
                        <p><strong>Email</strong> = {Email}</p>
                        <p><strong>Phone Number</strong> = {PhoneNumber}</p>
                        <hr />

                        <h3>Your Booking</h3>
                        <p><strong>Hotel for Pickup</strong> = {HotelPickup}</p>
                        <p><strong>Hotel Booking Reference</strong> = {HotelPickupBookingRef}</p>
                        <p><strong>Name under Hotel Reservation</strong> = {RsvpNameHotelPickup}</p>
                        <p><strong>Pick up Date</strong> = {moment(HotelPickupDate).format('Do MMMM YYYY')}</p>
                        <hr />

                        <p><strong>Hotel for Dropoff</strong> = {HotelDropoff}</p>
                        <p><strong>Hotel Booking Reference</strong> = {HotelDropoffBookingRef}</p>
                        <p><strong>Name under Hotel Reservation</strong> = {RsvpNameHotelDropoff}</p>
                        {/* {
                            OvernightStorage === true ?
                                <p><strong>Overnight Storage</strong> = Yes</p>
                                :
                                <p><strong>Overnight Storage</strong> = No</p>
                        } */}
                        <p><strong>Drop off Date</strong> = {moment(HotelDropoffDate).format('Do MMMM YYYY')}</p>
                        <hr />

                        <h3>Your Luggage(s)</h3>
                        <input onChange={e => this.setState({ Luggage: e.target.value })} placeholder="you luggage quantity" />
                        <button onClick={this.handleLuggage} style={{ backgroundColor: '#00bfff' }} disabled={!this.state.Luggage}>Add</button>
                        <hr />

                        <h3>Payment Details</h3>
                        <p>with {PaymentMethod}</p>
                        <SquarePaymentForm appId={SQUARE_APP_ID} onNonceGenerated={this.handleNonce} onNonceError={this.handleNonceError} onRef={ref => (this.paymentForm = ref)} />
                        <p><strong>Total = ${this.state.TotalCost}</strong></p>

                        <p><strong>Notes! </strong>
                            <i className="registerNotes">
                                $35 fixed price up to 2 Luggages and $10 per additional</i>
                        </p>
                    </div>

                    <div align="center">
                        <button type="button" className="btn btn-danger btn-lg" onClick={this.backToPayment} style={{ width: '160px' }}>Back</button>
                        {
                            !this.state.isLoading ?
                                <button type="button" className="btn btn-primary btn-lg"
                                    onClick={this.Submit}
                                    style={{ width: '160px', marginLeft: '1em' }}
                                    disabled={!this.state.TotalCost}
                                >Submit Data
                                 </button>
                                :
                                <button
                                    className="btn btn-lg btn-primary"
                                    type="button"
                                    style={{ width: '160px', marginLeft: '1em' }}
                                    disabled={true}
                                >
                                    <i className="fa fa-spinner fa-spin"></i> Submitting...
                                </button>
                        }

                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    const { BookData, payment } = state;
    return {
        BookData,
        payment
    }
}

export default connect(mapStateToProps, null)(HTHFInalReview);