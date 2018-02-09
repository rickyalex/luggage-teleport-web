import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PassBookData } from '../actions';
import '../App.css';
import * as moment from 'moment';
import axios from 'axios';
import SquarePaymentForm from './square_payment_form';
import { SQUARE_APP_ID } from '../config';
import { BookingId, GetPayment } from './helper';

class HTHFInalReview extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            PaymentMethod: ''
        }

        this.backToAddLuggage = this.backToAddLuggage.bind(this);
        this.Submit = this.Submit.bind(this);
        this.handleNonce = this.handleNonce.bind(this);
    }

    PushData() {
        const { dispatch } = this.props;
        dispatch(PassBookData(this.props.BookData));
    }
    async backToAddLuggage() {
        this.PushData()
        this.props.history.push('/addluggage');
    }
    async Submit() {
        this.paymentForm.generateNonce();
    }

    async handleNonce(nonce, cardData) {
        const { HotelDropoff, HotelDropoffBookingRef, HotelDropoffDate, Email, HotelPickup, HotelPickupBookingRef,
            HotelPickupDate, OvernightStorage, PhoneNumber, RsvpNameHotelDropoff, RsvpNameHotelPickup } = this.props.BookData[0];
        const { PaymentMethod } = this.state;
        const { Luggage, TotalCost } = this.props.LuggageData;
        const bookingId = BookingId();

        let data = JSON.stringify({
            BookingId: `HTH${bookingId}`,
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
        let config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }
        this.setState({ isLoading: true })

        axios.post('https://el3ceo7dwe.execute-api.us-west-1.amazonaws.com/dev/handler/HotelToHotel-create', data, config)
            .then((response) => {
                alert('success booked!')
                this.props.history.push('/home');
            }, (err) => {
                this.setState({ isLoading: false })
            })
    }
    handleNonceError(errors) {
        console.log('handleNonceError', errors);
        alert(errors[0].message)
    }

    render() {
        const { HotelDropoff, HotelDropoffBookingRef, HotelDropoffDate, Email, HotelPickup, HotelPickupBookingRef,
            HotelPickupDate, OvernightStorage, PhoneNumber, RsvpNameHotelDropoff, RsvpNameHotelPickup } = this.props.BookData[0];
        const { Luggage, TotalCost } = this.props.LuggageData;
        return (
            <div>
                <div className="containerProgressBar" style={{ marginTop: '1em' }}>
                    <ul className="progressbar">
                        <li className="active">Booking</li>
                        <li className="active">Add Luggage</li>
                        <li>Booking/Payment Review &amp; Submit</li>
                    </ul>
                    <div className="receipt" style={{ marginTop: '30px' }}>
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
                        <p><strong>Drop off Date</strong> = {moment(HotelDropoffDate).format('Do MMMM YYYY')}</p>
                        <hr />

                        <h3>Total Payment</h3>
                        <p><strong>Luggage = </strong> {Luggage} item(s)</p>
                        <p><strong>Total =</strong> ${TotalCost}</p>
                        <hr />
                        <h3>Payment Method</h3>
                        <select
                            className="form-control"
                            style={{ width: '200px', height: '30px' }}
                            onChange={event => this.setState({ PaymentMethod: event.target.value })}>
                            <option value="" selected disabled>Choose Your Payment</option>
                            {
                                GetPayment().map((payment) => {
                                    return <option key={payment.id} value={payment.name}>{payment.name}</option>
                                })
                            }
                        </select>

                        {
                            this.state.PaymentMethod ?
                                <div>
                                    <hr style={{ marginTop: '10px' }} />
                                    <SquarePaymentForm appId={SQUARE_APP_ID} onNonceGenerated={this.handleNonce} onNonceError={this.handleNonceError} onRef={ref => (this.paymentForm = ref)} />
                                </div>
                                :
                                <div></div>
                        }
                    </div>

                    <div align="center">
                        <button
                            disabled={this.state.isLoading}
                            type="button"
                            className="btn btn-danger btn-lg"
                            onClick={this.backToAddLuggage}
                            style={{ width: '160px' }}>Back</button>
                        {
                            !this.state.isLoading ?
                                <button
                                    type="button"
                                    className="btn btn-primary btn-lg"
                                    onClick={this.Submit}
                                    disabled={!this.state.PaymentMethod}
                                    style={{ width: '160px', marginLeft: '1em' }}
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
    const { BookData, LuggageData } = state;
    return {
        BookData,
        LuggageData
    }
}

export default connect(mapStateToProps, null)(HTHFInalReview);