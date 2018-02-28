import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PassBookData } from '../actions';
import '../App.css';
import * as moment from 'moment';
import axios from 'axios';
import SquarePaymentForm from './square_payment_form';
import { SQUARE_APP_ID } from '../config';
import { BookingId, GetPayment } from './helper';
import { Steps } from 'antd';

class ATHFinalReview extends Component {
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
        const { Airline, Airport, ArrivalTime, DropoffDateTime, Email, FlightNumber, Hotel, HotelBookingRef,
            NameUnderHotelRsv, OvernightStorage, PhoneNumber, PickupDateTime } = this.props.BookData[0]
        const { PaymentMethod } = this.state;
        const { TotalCost, Luggage } = this.props.LuggageData;
        const bookingId = BookingId();

        let data = JSON.stringify({
            BookingId: `ATH${bookingId}`,
            flightNumber: FlightNumber,
            hotelReservationName: NameUnderHotelRsv,
            airport: Airport,
            hotel: Hotel,
            pickupDate: PickupDateTime,
            airline: Airline,
            estimatedArrival: moment(ArrivalTime, ["HH:mm"]).format("HH:mm"),
            dropoffDate: DropoffDateTime,
            hotelReference: HotelBookingRef,
            email: Email,
            phone: PhoneNumber,
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

        axios.post('https://el3ceo7dwe.execute-api.us-west-1.amazonaws.com/dev/handler/AirportToHotel-create', data, config)
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
        console.log(this.props)
        const { Airline, Airport, ArrivalTime, DropoffDate, Email, FlightNumber, Hotel, HotelBookingRef,
            NameUnderHotelRsv, OvernightStorage, PhoneNumber, PickupDate } = this.props.BookData[0]
        const { TotalCost, Luggage } = this.props.LuggageData;
        const Step = Steps.Step;
        return (
            <div className="bg-image">
                <div className="containerProgressBar" style={{ marginTop: '1em' }}>
                    <Steps current={2}>
                        <Step title="Booking Data"/>
                        <Step title="Add Luggage"/>
                        <Step title="Review & Payment"/>
                      </Steps>
                    <div className="receipt" style={{ marginTop: '3em' }}>
                        <h3>Contact Info</h3>
                        <p><strong>Email</strong> = {Email}</p>
                        <p><strong>Phone Number</strong> = {PhoneNumber}</p>
                        <hr />

                        <h3>Your Booking</h3>
                        <p><strong>Aiport</strong> = {Airport}</p>
                        <p><strong>Airline</strong> = {Airline}</p>
                        <p><strong>Flight Number</strong> = {FlightNumber}</p>
                        <p><strong>Pick up Date</strong> = {moment(PickupDate).format('Do MMMM YYYY')}</p>
                        <p><strong>Estimated Time of Arrival</strong> = {moment(ArrivalTime, ["HH:mm"]).format("HH:mm")}</p>
                        <hr />

                        <p><strong>Hotel Drop Off</strong> = {Hotel}</p>
                        <p><strong>Hotel Booking Reference</strong> = {HotelBookingRef}</p>
                        <p><strong>Name under Hotel Reservation</strong> = {NameUnderHotelRsv}</p>
                        <p><strong>Drop off Date</strong> = {moment(DropoffDate).format('Do MMMM YYYY')}</p>
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
export default connect(mapStateToProps, null)(ATHFinalReview);