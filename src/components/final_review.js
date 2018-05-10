import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PassBookData, GetLuggageData } from '../actions';
import FixedNavbar from './fixed_navbar';
import '../App.css';
import * as moment from 'moment';
import axios from 'axios';
import { Row, Col, Input, Button } from 'antd';
import SquarePaymentForm from './square_payment_form';
import { SQUARE_APP_ID } from '../config';
import { BookingId } from './helper';

class FinalReview extends Component {
    constructor(props) {
        super(props);

        console.log(this.props);

        this.state = {
            isLoading: false,
            PaymentMethod: '',
            PromoCode: '',
            PromoCodeSuccess: 'promostatus hidden',
            PromoCodeFailed: 'promostatus hidden',
            PromoCodeApplied: false,
            TotalCost: props.LuggageData.TotalCost,
            data: [],
            BookingId: ''
        }

        this.backToAddLuggage = this.backToAddLuggage.bind(this);
        this.Submit = this.Submit.bind(this);
        this.handleNonce = this.handleNonce.bind(this);
        this.applyPromoCode = this.applyPromoCode.bind(this);
        this.loadATH = this.loadATH.bind(this);
        this.loadATA = this.loadATA.bind(this);
        this.loadHTA = this.loadHTA.bind(this);

        if(props.BookData.length > 0){
            this.BookingType = props.BookData[0].BookingType;
            this.Luggage = props.LuggageData.Luggage;    
        }
        else{
            props.history.push('/');
        }
        

    }


    PushData() {
        //const { dispatch } = this.props;
        //dispatch(PassBookData(this.props.BookData));
        this.props.PassBookData(this.props.BookData);
        this.props.GetLuggageData(this.props.LuggageData);
    }
    async backToAddLuggage() {
        this.PushData()
        this.props.history.push('/');
    }
    async Submit() {
        this.paymentForm.generateNonce();
    }

    loadATH(){
        let url = `https://el3ceo7dwe.execute-api.us-west-1.amazonaws.com/dev/handler/AirportToHotel-scan/`;
        axios.get(url)
            .then((res) => {
                this.setState({ data: res.data.result, isLoading: true })   
            }).catch((err) => {
                console.log(err);
            })
    }

    loadATA(){
        let url = `https://el3ceo7dwe.execute-api.us-west-1.amazonaws.com/dev/handler/AirportToAirport-scan/`;
        axios.get(url)
            .then((res2) => {
                for(var i=0;i<res2.data.result.length;i++){
                    this.setState({ data: [...this.state.data, res2.data.result[i]] })    
                }
            }).catch((err) => {
                console.log(err);
            })
    }

    loadHTA(){
        let url = `https://el3ceo7dwe.execute-api.us-west-1.amazonaws.com/dev/handler/HotelToAirport-scan/`;
        axios.get(url)
            .then((res3) => {
                for(var i=0;i<res3.data.result.length;i++){
                    this.setState({ data: [...this.state.data, res3.data.result[i]]})    
                }   
            }).catch((err) => {
                console.log(err);
            })
    }

    applyPromoCode(){
        this.setState({ isLoading: true })

        axios.get('https://el3ceo7dwe.execute-api.us-west-1.amazonaws.com/dev/handler/PromoCode-get/'+String(this.state.PromoCode).toUpperCase())
            .then((res) => {               
                if(typeof res.data.result !== "undefined"){
                    if(String(this.state.PromoCode).toUpperCase() === String(res.data.result.id).toUpperCase()){
                        let percentage = parseInt(res.data.result.PercentageOff,10);
                        let dollar = parseInt(res.data.result.DollarsOff,10);
                        let total = parseInt(this.state.TotalCost,10);
                        let priceCut = (percentage > 0 && dollar <= 0) ? (percentage/100)*total : dollar;

                        this.setState({
                            PromoCodeSuccess: 'promostatus show',
                            PromoCodeFailed: 'promostatus hidden',
                            TotalCost: total-priceCut,
                            PromoCodeApplied: true,
                            isLoading: false
                        })
                    }
                    else{
                        this.setState({
                            PromoCodeSuccess: 'promostatus hidden',
                            PromoCodeFailed: 'promostatus show',
                            isLoading: false
                        })
                    }    
                }
                else{
                    this.setState({
                        PromoCodeSuccess: 'promostatus hidden',
                        PromoCodeFailed: 'promostatus show',
                        isLoading: false
                    })
                }
                
            }).catch((err) => {
                console.log(err)
            })
    }

    async handleNonce(nonce, cardData) {
        const bookingId = BookingId();
        let apiUrl = ""
        let data = ""
        let token = localStorage.getItem('token')
        let config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }
        this.setState({ isLoading: true })

        if(this.BookingType === "ATH"){
            apiUrl = "AirportToHotel-create"
            let { Airline, Airport, DropoffDate, DropoffHour, DropoffMinute, DropoffFormat, Email, FlightNumber, Hotel, HotelBookingRef,
                NameUnderHotelRsv, PhoneNumber, PickupDate, PickupHour, PickupMinute, PickupFormat } = this.props.BookData[0]

            data = JSON.stringify({
                BookingId: `ATH${bookingId}`,
                flightNumber: FlightNumber,
                hotelReservationName: NameUnderHotelRsv,
                airport: Airport,
                hotel: Hotel,
                pickupDate: moment(PickupDate).format('Do MMMM YYYY')+' '+PickupHour+":"+PickupMinute+PickupFormat,
                airline: Airline,
                dropoffDate: moment(DropoffDate).format('Do MMMM YYYY')+' '+DropoffHour+":"+DropoffMinute+DropoffFormat,
                hotelReference: HotelBookingRef,
                email: Email,
                phone: PhoneNumber,
                PaymentWith: 'Credit Card',
                LuggageQuantity: this.Luggage,
                TotalCost: this.state.TotalCost,
                cardNonce: nonce,
            })

        }
        else if(this.BookingType === "ATA"){
            apiUrl = "AirportToAirport-create"
            let { AirlineDropoff, AirlinePickup, AirportDropoff, AirportPickup, DropoffFlightNumber, PickupFlightNumber, Email, PhoneNumber, 
                PickupDate, PickupHour, PickupMinute, PickupFormat, DropoffDate, DropoffHour, DropoffMinute, DropoffFormat } = this.props.BookData[0];

            data = JSON.stringify({
                BookingId: `ATA${bookingId}`,
                AirlineDropoff: AirlineDropoff,
                AirlinePickup: AirlinePickup,
                AirportDropoff: AirportDropoff,
                AirportPickup: AirportPickup,
                pickupDate: moment(PickupDate).format('Do MMMM YYYY')+' '+PickupHour+":"+PickupMinute+PickupFormat,
                dropoffDate: moment(DropoffDate).format('Do MMMM YYYY')+' '+DropoffHour+":"+DropoffMinute+DropoffFormat,
                DropoffFlightNumber: DropoffFlightNumber,
                PickupFlightNumber: PickupFlightNumber,
                email: Email,
                phone: PhoneNumber,
                PaymentWith: 'Credit Card',
                LuggageQuantity: this.Luggage,
                TotalCost: this.state.TotalCost,
                cardNonce: nonce,
            })
        }
        else if(this.BookingType === "HTA"){
            apiUrl = "HotelToAirport-create"
            const { Airline, Airport, Email, FlightNumber, Hotel, HotelBookingRef, NameUnderHotelRsv, PhoneNumber, 
                PickupDate, PickupHour, PickupMinute, PickupFormat, DropoffDate, DropoffHour, DropoffMinute, DropoffFormat } = this.props.BookData[0];

            data = JSON.stringify({
                BookingId: `HTA${bookingId}`,
                airport: Airport,
                airline: Airline,
                flightNumber: FlightNumber,
                pickupDate: moment(PickupDate).format('Do MMMM YYYY')+' '+PickupHour+":"+PickupMinute+PickupFormat,
                dropoffDate: moment(DropoffDate).format('Do MMMM YYYY')+' '+DropoffHour+":"+DropoffMinute+DropoffFormat,
                hotel: Hotel,
                hotelReference: HotelBookingRef,
                hotelReservationName: NameUnderHotelRsv,
                email: Email,
                phone: PhoneNumber,
                PaymentWith: 'Credit Card',
                LuggageQuantity: this.Luggage,
                TotalCost: this.state.TotalCost,
                cardNonce: nonce,
            })
        }
        else if(this.BookingType === "HTH"){
            apiUrl = "HotelToHotel-create"
            const { HotelDropoff, HotelDropoffBookingRef, DropoffDate, DropoffHour, DropoffMinute, DropoffFormat, Email, HotelPickup, HotelPickupBookingRef,
                    PickupDate, PickupHour, PickupMinute, PickupFormat, PhoneNumber, RsvpNameHotelDropoff, RsvpNameHotelPickup } = this.props.BookData[0];

            data = JSON.stringify({
                BookingId: `HTH${bookingId}`,
                HotelDropoff: HotelDropoff,
                HotelDropoffBookingRef: HotelDropoffBookingRef,
                dropoffDate: moment(DropoffDate).format('Do MMMM YYYY')+' '+DropoffHour+":"+DropoffMinute+DropoffFormat,
                email: Email,
                HotelPickup: HotelPickup,
                HotelPickupBookingRef: HotelPickupBookingRef,
                pickupDate: moment(PickupDate).format('Do MMMM YYYY')+' '+PickupHour+":"+PickupMinute+PickupFormat,
                phone: PhoneNumber,
                RsvpNameHotelDropoff: RsvpNameHotelDropoff,
                RsvpNameHotelPickup: RsvpNameHotelPickup,
                PaymentWith: 'Credit Card',
                LuggageQuantity: this.Luggage,
                TotalCost: this.state.TotalCost,
                cardNonce: nonce,
            })
        }

        axios.post('https://el3ceo7dwe.execute-api.us-west-1.amazonaws.com/dev/handler/'+apiUrl, data, config)
            .then((response) => {
                this.props.history.push('/successpage');
            }, (err) => {
                this.setState({ isLoading: false })
            })
        
    }
    handleNonceError(errors) {
        console.log('handleNonceError', errors);
        alert(errors[0].message)
    }

    render() {
        const data = this.props.BookData[0]
        return (
            <div>
                <div>
                  < FixedNavbar />
                </div>
                <div className="review_header">
                    <h3 style={{ color: 'white' }}>Booking Summary</h3>
                    <hr style={{ border: '1px solid #fff' }} />
                </div>
                <div className="containerProgressBar" style={{ marginTop: '1em' }}>
                    <div className="receipt">
                        <div className="row" style={{ lineHeight: '3em' }}>
                            <div className="col-lg-1 col-md-1 col-sm-1">
                                <img src="origin_destination_icon.jpg" alt="origin_destination" style={{ paddingTop: '0.5em' }} />
                            </div>
                            <div className="col-lg-10 col-md-10 col-sm-10 origin_destination" >
                                <span style={{ display: 'block' }}>{ (this.BookingType === 'ATH') ? data.Airport : (this.BookingType === 'ATA') ? data.AirportPickup : (this.BookingType === 'HTA') ? data.Hotel : (this.BookingType === 'HTH') ? data.HotelPickup : '' }</span>
                                <span style={{ display: 'block' }}>{ (this.BookingType === 'ATH') ? data.Hotel : (this.BookingType === 'ATA') ? data.AirportDropoff : (this.BookingType === 'HTA') ? data.Airport : (this.BookingType === 'HTH') ? data.HotelDropoff : '' }</span>
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
                                                {moment(data.PickupDate).format('Do MMMM YYYY')} {data.PickupHour+":"+data.PickupMinute+data.PickupFormat} 
                                            </td>
                                        </tr>
                                        { /* (this.BookingType === 'ATH') ? 
                                        <tr>
                                            <td>
                                                <b>Airline</b>
                                            </td>
                                            <td>
                                                {data.Airline}
                                            </td>
                                        </tr>
                                        : '' */ }
                                        <tr>
                                            <td>
                                                <b>Drop off Date</b>
                                            </td>
                                            <td>
                                                {moment(data.DropoffDate).format('Do MMMM YYYY')} {data.DropoffHour+":"+data.DropoffMinute+data.DropoffFormat} 
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <Row gutter={12}>
                            <Col span={16}>
                                <Input
                                    placeholder="Promotional Code"
                                    onChange={e => this.setState({ PromoCode: e.target.value })}
                                />
                            </Col>
                            <Col span={6}>
                                {
                                    this.state.isLoading ? 
                                    <Button type="primary" style={{ margin: 0 }} disabled={true}>
                                        <i className="fa fa-spinner fa-spin" style={{ textAlign: 'center' }}></i>
                                    </Button> : 
                                    <Button disabled={this.state.PromoCodeApplied} type="primary" style={{ margin: 0 }} onClick={this.applyPromoCode}>
                                        Apply
                                    </Button>
                                }
                            </Col>
                        </Row>
                        <span className={this.state.PromoCodeSuccess}>Your promo code has been successfully applied</span>
                        <span className={this.state.PromoCodeFailed} style={{ color: 'red' }}>Your promo code is invalid</span>
                        <div style={{ clear: 'both' }}></div>
                        <table className="table table-sm review_luggage">
                            <thead>
                                <tr style={{ textAlign: 'center' }}>
                                    <th colspan="8">Luggage</th><th colspan="4">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ textAlign: 'center' }}>
                                    <td colspan="8">{this.Luggage}</td><td colspan="4"><b>${this.state.TotalCost}</b></td>
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
export default connect(mapStateToProps, {PassBookData, GetLuggageData})(FinalReview);