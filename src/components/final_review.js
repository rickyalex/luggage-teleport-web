import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PassBookData, GetLuggageData } from '../actions';
import FixedNavbar from './fixed_navbar';
import '../App.css';
import * as moment from 'moment';
import axios from 'axios';
import { Row, Col, Input, Button, Alert } from 'antd';
import SquarePaymentForm from './square_payment_form';
import { SQUARE_APP_ID } from '../config';
import { BookingId, GetPayment } from './helper';

class FinalReview extends Component {
    constructor(props) {
        super(props);

        console.log(this.props);

        this.state = {
            isLoading: false,
            PaymentMethod: '',
            PromoCode: '',
            PromoCodeSuccess: 'hidden',
            PromoCodeFailed: 'hidden',
            PromoCodeApplied: false,
            TotalCost: props.LuggageData.TotalCost,
            data: [],
            BookingId: ''
        }

        this.backToAddLuggage = this.backToAddLuggage.bind(this);
        this.Submit = this.Submit.bind(this);
        this.handleNonce = this.handleNonce.bind(this);
        this.applyPromoCode = this.applyPromoCode.bind(this);

        this.BookingType = this.props.BookData[0].BookingType;
        this.Luggage = this.props.LuggageData.Luggage;

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

    GenerateBookingID(){
        let text = "";
        let sf = "san fransisco";
        let lv = "las vegas";
        let sfcounter = 0;
        let lvcounter = 0;
        let total = 0;
        let url = `https://el3ceo7dwe.execute-api.us-west-1.amazonaws.com/dev/handler/AirportToHotel-scan/`;
        axios.get(url)
            .then((res) => {
                this.setState({ data: res.data.result, isLoading: true }, () =>{
                    url = `https://el3ceo7dwe.execute-api.us-west-1.amazonaws.com/dev/handler/AirportToAirport-scan/`;
                    axios.get(url)
                        .then((res2) => {
                            for(var i=0;i<res2.data.result.length;i++){
                                this.setState({ data: [...this.state.data, res2.data.result[i]] }, () =>{
                                            url = `https://el3ceo7dwe.execute-api.us-west-1.amazonaws.com/dev/handler/HotelToAirport-scan/`;
                                            axios.get(url)
                                                .then((res3) => {
                                                    for(var i=0;i<res3.data.result.length;i++){
                                                        this.setState({ data: [...this.state.data, res3.data.result[i]] }, ()=>{
                                                            this.state.data.map((item)=>{
                                                                if(String(item.Airport).toLowerCase().includes(sf)){
                                                                    sfcounter++;
                                                                }
                                                                else if(String(item.Airport).toLowerCase().includes(lv)){
                                                                    lvcounter++;
                                                                }
                                                                total++;
                                                            })

                                                            this.setState({ BookingId: (String(this.props.BookData[0].Airport).toLowerCase().includes(sf)) ? "SF"+" "+("0000" + sfcounter).slice(-4)+" "+("00000" + total).slice(-5) : "LV"+" "+("0000" + lvcounter).slice(-4)+" "+("00000" + total).slice(-5) });
                                                            console.log(this.state);
                                                        })    
                                                    }   
                                                }).catch((err) => {
                                                    console.log(err);
                                                })
                                })    
                            }
                        }).catch((err) => {
                            console.log(err);
                        })
                })   
            }).catch((err) => {
                console.log(err);
            })
        
    }

    applyPromoCode(){
        console.log(this.state);
        axios.get('https://el3ceo7dwe.execute-api.us-west-1.amazonaws.com/dev/handler/PromoCode-get/'+String(this.state.PromoCode).toUpperCase())
            .then((res) => {               
                if(typeof res.data.result != "undefined"){
                    if(String(this.state.PromoCode).toUpperCase() == String(res.data.result.id).toUpperCase()){
                        let percentage = parseInt(res.data.result.PercentageOff);
                        let dollar = parseInt(res.data.result.DollarsOff);
                        let total = parseInt(this.state.TotalCost);
                        let priceCut = (percentage > 0 && dollar <= 0) ? (percentage/100)*total : dollar;

                        this.setState({
                            PromoCodeSuccess: 'show',
                            PromoCodeFailed: 'hidden',
                            TotalCost: total-priceCut,
                            PromoCodeApplied: true
                        }, () => {
                            console.log(this.state);
                        })
                    }
                    else{
                        this.setState({
                            PromoCodeSuccess: 'hidden',
                            PromoCodeFailed: 'show',
                        })
                    }    
                }
                else{
                    this.setState({
                        PromoCodeSuccess: 'hidden',
                        PromoCodeFailed: 'show',
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

        if(this.BookingType == "ATH"){
            apiUrl = "AirportToHotel-create"
            let { Airline, Airport, DropoffDate, DropoffDisplayTime, Email, FlightNumber, Hotel, HotelBookingRef,
                NameUnderHotelRsv, PhoneNumber, PickupDate, PickupDisplayTime } = this.props.BookData[0]
            

            data = JSON.stringify({
                BookingId: `ATH${bookingId}`,
                flightNumber: FlightNumber,
                hotelReservationName: NameUnderHotelRsv,
                airport: Airport,
                hotel: Hotel,
                pickupDate: moment(PickupDate).format('Do MMMM YYYY')+' '+PickupDisplayTime,
                airline: Airline,
                dropoffDate: moment(DropoffDate).format('Do MMMM YYYY')+' '+DropoffDisplayTime,
                hotelReference: HotelBookingRef,
                email: Email,
                phone: PhoneNumber,
                PaymentWith: 'Credit Card',
                LuggageQuantity: this.Luggage,
                TotalCost: this.state.TotalCost,
                cardNonce: nonce,
            })

        }
        else if(this.BookingType == "ATA"){
            apiUrl = "AirportToAirport-create"
            let { AirlineDropoff, AirlinePickup, AirportDropoff, AirportPickup, PickupDisplayTime, DropoffDisplayTime,
                    DropoffFlightNumber, PickupFlightNumber, Email, PhoneNumber, PickupDate, DropoffDate } = this.props.BookData[0];

            data = JSON.stringify({
                BookingId: `ATA${bookingId}`,
                AirlineDropoff: AirlineDropoff,
                AirlinePickup: AirlinePickup,
                AirportDropoff: AirportDropoff,
                AirportPickup: AirportPickup,
                pickupDate: moment(PickupDate).format('Do MMMM YYYY')+' '+PickupDisplayTime,
                dropoffDate: moment(DropoffDate).format('Do MMMM YYYY')+' '+DropoffDisplayTime,
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
        else if(this.BookingType == "HTA"){
            apiUrl = "HotelToAirport-create"
            const { Airline, Airport, DepartureTime, Email, FlightNumber, Hotel, HotelBookingRef, NameUnderHotelRsv,
                    PhoneNumber, PickupDate, DropoffDate, PickupDisplayTime, DropoffDisplayTime } = this.props.BookData[0];

            data = JSON.stringify({
                BookingId: `HTA${bookingId}`,
                airport: Airport,
                airline: Airline,
                flightNumber: FlightNumber,
                pickupDate: moment(PickupDate).format('Do MMMM YYYY')+' '+PickupDisplayTime,
                dropoffDate: moment(DropoffDate).format('Do MMMM YYYY')+' '+DropoffDisplayTime,
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
        else if(this.BookingType == "HTH"){
            apiUrl = "HotelToHotel-create"
            const { HotelDropoff, HotelDropoffBookingRef, DropoffDate, Email, HotelPickup, HotelPickupBookingRef,
                    PickupDate, PhoneNumber, RsvpNameHotelDropoff, RsvpNameHotelPickup, PickupDisplayTime, DropoffDisplayTime } = this.props.BookData[0];

            data = JSON.stringify({
                BookingId: `HTH${bookingId}`,
                HotelDropoff: HotelDropoff,
                HotelDropoffBookingRef: HotelDropoffBookingRef,
                DropoffDate: moment(DropoffDate).format('Do MMMM YYYY')+' '+DropoffDisplayTime,
                email: Email,
                HotelPickup: HotelPickup,
                HotelPickupBookingRef: HotelPickupBookingRef,
                PickupDate: moment(PickupDate).format('Do MMMM YYYY')+' '+PickupDisplayTime,
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

        // console.log(data);
        // console.log(this.state.data);
        
    }
    handleNonceError(errors) {
        console.log('handleNonceError', errors);
        alert(errors[0].message)
    }

    render() {
        //console.log(this.props.BookData[0])
        let token = localStorage.getItem('token')
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
                            <div className="col-lg-1">
                                <img src="origin_destination_icon.jpg" style={{ paddingTop: '0.5em' }} />
                            </div>
                            <div className="col-lg-11 origin_destination" >
                                { (this.BookingType == 'ATH') ? data.Airport : (this.BookingType == 'ATA') ? data.AirportPickup : (this.BookingType == 'HTA') ? data.Hotel : (this.BookingType == 'HTH') ? data.HotelPickup : '' }<br />
                                { (this.BookingType == 'ATH') ? data.Hotel : (this.BookingType == 'ATA') ? data.AirportDropoff : (this.BookingType == 'HTA') ? data.Airport : (this.BookingType == 'HTH') ? data.HotelDropoff : '' }<br />
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
                                                {moment(data.PickupDate).format('Do MMMM YYYY')} {data.PickupDisplayTime} 
                                            </td>
                                        </tr>
                                        { /* (this.BookingType == 'ATH') ? 
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
                                                {moment(data.DropoffDate).format('Do MMMM YYYY')} {data.DropoffDisplayTime}
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
                                <Button disabled={this.state.PromoCodeApplied} type="primary" style={{ margin: 0 }} onClick={this.applyPromoCode}>Apply</Button>
                            </Col>
                        </Row>
                        <br />
                        <Alert closable className={this.state.PromoCodeSuccess} message="Promo Code Successfully Applied" type="success" showIcon />
                        <Alert closable className={this.state.PromoCodeFailed} message="Sorry that Promo Code doesn't exist" type="error" showIcon />
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