import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PassBookData } from '../actions';
import Navbar from './navbar';
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
        this.props.history.push('/');
    }
    async Submit() {
        this.paymentForm.generateNonce();
    }

    async handleNonce(nonce, cardData) {
        const { HotelDropoff, HotelDropoffBookingRef, DropoffDate, Email, HotelPickup, HotelPickupBookingRef,
            PickupDate, PhoneNumber, RsvpNameHotelDropoff, RsvpNameHotelPickup, PickupDisplayTime, DropoffDisplayTime } = this.props.BookData[0];
        const { Luggage, TotalCost } = this.props.LuggageData;
        const bookingId = BookingId();

        let data = JSON.stringify({
            BookingId: `HTH${bookingId}`,
            HotelDropoff: HotelDropoff,
            HotelDropoffBookingRef: HotelDropoffBookingRef,
            DropoffDate: moment(DropoffDate).format('Do MMMM YYYY')+' '+DropoffDisplayTime,
            email: Email,
            HotelPickup: HotelPickup,
            HotelPickupBookingRef: HotelPickupBookingRef,
            PickupDate: moment(PickupDate).format('Do MMMM YYYY')+' '+PickupDisplayTime,
            PhoneNumber: PhoneNumber,
            RsvpNameHotelDropoff: RsvpNameHotelDropoff,
            RsvpNameHotelPickup: RsvpNameHotelPickup,
            PaymentWith: 'Credit Card',
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
        const { HotelDropoff, HotelDropoffBookingRef, DropoffDate, Email, HotelPickup, HotelPickupBookingRef,
            PickupDate, OvernightStorage, PhoneNumber, RsvpNameHotelDropoff, RsvpNameHotelPickup, PickupDisplayTime, DropoffDisplayTime } = this.props.BookData[0];
        const { Luggage, TotalCost } = this.props.LuggageData;
        return (
            <div className="bg-image">
                <div>
                  < Navbar />
                </div>
                <div className="review_header">
                    <h3 style={{ color: 'white' }}>Booking Summary</h3>
                    <hr style={{ border: '1px solid #fff' }} />
                </div>
                <div className="containerProgressBar" style={{ marginTop: '1em' }}>
                    <div className="receipt">
                        <div className="row" style={{ lineHeight: '3em' }}>
                            <div className="col-lg-1">
                                <img src="origin_destination_icon.jpg" style={{ paddingTop: '0.5em' }} />
                            </div>
                            <div className="col-lg-11 origin_destination" >
                                {HotelPickup}<br />
                                {HotelDropoff}
                            </div>
                            
                            <br />
                        </div>
                        <div className="row">
                            <div className="col-lg-12" style={{ lineHeight: '2em' }}>
                                <div>
                                    <table className="review_details">
                                        <tr>
                                            <td>
                                                <b>Pick up Date</b>
                                            </td>
                                            <td>
                                                {moment(PickupDate).format('Do MMMM YYYY')} {PickupDisplayTime} 
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <b>Drop off Date</b>
                                            </td>
                                            <td>
                                                {moment(DropoffDate).format('Do MMMM YYYY')} {DropoffDisplayTime}
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <br />
                        <table className="table table-sm review_luggage">
                            <thead>
                                <tr style={{ textAlign: 'center' }}>
                                    <th colspan="8">Luggage</th><th colspan="4">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ textAlign: 'center' }}>
                                    <td colspan="8">{Luggage}</td><td colspan="4"><b>${TotalCost}</b></td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="review_payment">
                            <SquarePaymentForm appId={SQUARE_APP_ID} onNonceGenerated={this.handleNonce} onNonceError={this.handleNonceError} onRef={ref => (this.paymentForm = ref)} />
                        </div>

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