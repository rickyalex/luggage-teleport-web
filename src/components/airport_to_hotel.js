import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FormGroup, InputGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import { PassBookData, GetAirlineData, GetHotelData, GetAirportData } from '../actions';

import FaPlane from 'react-icons/lib/fa/plane';
import FaClockO from 'react-icons/lib/fa/clock-o';
import FaCalendar from 'react-icons/lib/fa/calendar';
import MdHotel from 'react-icons/lib/md/hotel';
import FaUser from 'react-icons/lib/fa/user';
import '../App.css';

import axios from 'axios';

class AirportToHotel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Email: '',
            PhoneNumber: '',
            dateType: 'text',
            timeType: 'text',
            Airport: '',
            Airline: '',
            Hotel: '',
            FlightNumber: '',
            ArrivalTime: '',
            PickupDate: '',
            DropoffDate: '',
            HotelBookingRef: '',
            NameUnderHotelRsv: '',
            OvernightStorage: false,
            showModal: false,
            BookingType: 'ATH'
        }

    }

    ValidationForm() {
        const {
            Airport,
            Airline,
            Hotel,
            FlightNumber,
            ArrivalTime,
            PickupDate,
            DropoffDate,
            HotelBookingRef,
            NameUnderHotelRsv,
        } = this.state;

        return (
            Airport.length > 0 && Airline.length > 0 && Hotel.length > 0
            && FlightNumber.length > 0 && ArrivalTime.length > 0 && PickupDate.length > 0
            && HotelBookingRef.length > 0 && NameUnderHotelRsv.length > 0 && DropoffDate.length > 0
        )
    }

    buttonSubmit() {
        return (
            <Link to="/athreview" style={{ color: 'black' }}>
                <button
                    className="btn btn-lg"
                    onClick={() => this.SubmitHotelToAirportData()}
                    type="button"
                    disabled={!this.ValidationForm()}
                    style={{ backgroundColor: 'yellow', width: '260px' }}>
                    Next
            </button>
            </Link>
        )
    }



    SubmitHotelToAirportData() {
        let datas = [];
        datas.push(this.state);
        this.props.PassBookData(datas);
    }

    componentWillMount() {
        axios.get('https://el3ceo7dwe.execute-api.us-west-1.amazonaws.com/dev/handler/Airport-scan')
            .then((res) => {
                res.data.Myresult.sort(function(a,b){
                    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
                });
                this.props.GetAirportData(res.data.Myresult);
            }).catch((err) => {
                console.log(err)
            })

        axios.get('https://el3ceo7dwe.execute-api.us-west-1.amazonaws.com/dev/handler/Airline-scan')
            .then((res) => {
                res.data.Myresult.sort(function(a,b){
                    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
                });
                this.props.GetAirlineData(res.data.Myresult);
            }).catch((err) => {
                console.log(err);
            })

        axios.get('https://el3ceo7dwe.execute-api.us-west-1.amazonaws.com/dev/handler/Hotel-scan')
            .then((res) => {
                res.data.Myresult.sort(function(a,b){
                    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
                });
                this.props.GetHotelData(res.data.Myresult);
            }).catch((err) => {
                console.log(err);
            })
    }

    componentDidMount() {
        const { Email, PhoneNumber } = this.props.user;
        this.setState({
            Email,
            PhoneNumber
        })
    }

    render() {
        return (
            <div className="polaroid">
                <div className="container">
                    <div className="form-inline">
                        <div className="form-group">
                            <form align="center">
                                {/**
                                * Airport Section
                                */}
                                <FormGroup>
                                    <InputGroup>
                                        <select
                                            className="form-control"
                                            style={{ height: '35px', width: '260px' }}
                                            onChange={event => this.setState({ Airport: event.target.value })}>
                                            <option value="" selected disabled>Choose Airport for pickup</option>
                                            {
                                                this.props.AirportData.map((airport) => {
                                                    return <option key={airport.id} value={airport.name}>{airport.name}</option>
                                                })
                                            }
                                        </select>
                                    </InputGroup>
                                </FormGroup>
                                <hr />
                                <FormGroup>
                                    <InputGroup>
                                        <select
                                            className="form-control"
                                            style={{ height: '35px', width: '260px' }}
                                            onChange={event => this.setState({ Airline: event.target.value })}>
                                            <option value="" selected disabled>Airline</option>
                                            {
                                                this.props.AirlineData.map((airline) => {
                                                    return <option key={airline.id} value={airline.name}>{airline.name}</option>
                                                })
                                            }
                                        </select>
                                    </InputGroup>
                                </FormGroup>
                                <hr />
                                <FormGroup>
                                    <InputGroup>
                                        <InputGroup.Addon style={{ backgroundColor: 'white' }}><FaPlane style={{ color: '#00bfff' }} /></InputGroup.Addon>
                                        <input
                                            type="text"
                                            onChange={event => this.setState({ FlightNumber: event.target.value })}
                                            placeholder="Flight Number"
                                            className="form-control"
                                            style={{ width: '220px' }}
                                        />
                                    </InputGroup>
                                </FormGroup>
                                <hr />
                                <FormGroup>
                                    <InputGroup>
                                        <InputGroup.Addon style={{ backgroundColor: 'white' }}><FaCalendar style={{ color: '#00bfff' }} /></InputGroup.Addon>
                                        <input
                                            type={this.state.dateType}
                                            className="form-control"
                                            placeholder="Pick up Date"
                                            onChange={event => this.setState({ PickupDate: event.target.value })}
                                            onFocus={() => this.setState({ dateType: 'date' })}
                                            onBlur={() => this.setState({ dateType: 'text' })}
                                            style={{ width: '220px' }}
                                        />
                                    </InputGroup>
                                </FormGroup>
                                <hr />
                                <FormGroup>
                                    <InputGroup>
                                        <InputGroup.Addon style={{ backgroundColor: 'white' }}><FaClockO style={{ color: '#00bfff' }} /></InputGroup.Addon>
                                        <input
                                            type={this.state.timeType}
                                            placeholder="Estimated Time of Arrival"
                                            className="form-control"
                                            onChange={event => this.setState({ ArrivalTime: event.target.value })}
                                            onFocus={() => this.setState({ timeType: 'time' })}
                                            onBlur={() => this.setState({ timeType: 'text' })}
                                            style={{ width: '220px' }}
                                        />
                                    </InputGroup>
                                </FormGroup>
                                {/**
                             * Hotel Section
                             */}
                                <hr />
                                <FormGroup>
                                    <InputGroup>
                                        <select
                                            className="form-control"
                                            style={{ height: '35px', width: '260px' }}
                                            onChange={event => this.setState({ Hotel: event.target.value })}>
                                            <option value="" selected disabled>Hotel for Drop off</option>
                                            {
                                                this.props.HotelData.map((hotel) => {
                                                    return <option key={hotel.id} value={hotel.name}>{hotel.name}</option>
                                                })
                                            }
                                        </select>
                                    </InputGroup>
                                </FormGroup>
                                <hr />
                                <FormGroup>
                                    <InputGroup>
                                        <InputGroup.Addon style={{ backgroundColor: 'white' }}><MdHotel style={{ color: '#e6e600' }} /></InputGroup.Addon>
                                        <input
                                            type='text'
                                            onChange={event => this.setState({ HotelBookingRef: event.target.value })}
                                            placeholder="Hotel Booking Reference"
                                            className="form-control"
                                            style={{ width: '220px' }}
                                        />
                                    </InputGroup>
                                </FormGroup>
                                <hr />
                                <FormGroup>
                                    <InputGroup>
                                        <InputGroup.Addon style={{ backgroundColor: 'white' }}><FaUser style={{ color: '#e6e600' }} /></InputGroup.Addon>
                                        <input
                                            type='text'
                                            placeholder="Name under Hotel Reservation"
                                            className="form-control"
                                            onChange={event => this.setState({ NameUnderHotelRsv: event.target.value })}
                                            style={{ width: '220px' }}
                                        />
                                    </InputGroup>
                                </FormGroup>
                                <hr />
                                {/* <div>
                                    Overnight Storage
                                    <input type="radio" name="optradio" onChange={e => this.setState({ OvernightStorage: true })} />Yes
                                    <input type="radio" name="optradio" onChange={e => this.setState({ OvernightStorage: false })} />No
                                </div>
                                <hr /> */}
                                <FormGroup>
                                    <InputGroup>
                                        <InputGroup.Addon style={{ backgroundColor: 'white' }}><FaCalendar style={{ color: '#e6e600' }} /></InputGroup.Addon>
                                        <input
                                            type={this.state.dateType}
                                            className="form-control"
                                            placeholder="Drop off Date"
                                            onChange={event => this.setState({ DropoffDate: event.target.value })}
                                            onFocus={() => this.setState({ dateType: 'date' })}
                                            onBlur={() => this.setState({ dateType: 'text' })}
                                            style={{ width: '220px' }}
                                        />
                                    </InputGroup>
                                </FormGroup>
                                <hr />

                                {
                                    this.buttonSubmit()
                                }

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapsStateToProps(state) {
    const { user, AirportData, AirlineData, HotelData } = state;
    return {
        user,
        AirportData,
        AirlineData,
        HotelData
    }
}

export default connect(mapsStateToProps, { PassBookData, GetAirlineData, GetAirportData, GetHotelData })(AirportToHotel);