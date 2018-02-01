import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { PassBookData, GetAirlineData, GetHotelData, GetAirportData } from '../actions';
import '../App.css';
import axios from 'axios';
import TimePicker from 'rc-time-picker';
import * as moment from 'moment';
import PlacesAutocomplete from 'react-places-autocomplete';
import { defaultStyles } from './helper';

import 'rc-time-picker/assets/index.css';

class AirportToHotel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Email: '',
            PhoneNumber: '',
            Airport: '',
            Airline: '',
            Hotel: '',
            FlightNumber: '',
            ArrivalTime: '',
            PickupDate: '',
            DropoffDate: '',
            HotelBookingRef: '',
            NameUnderHotelRsv: localStorage.getItem('CustName'),
            OvernightStorage: false,
            showModal: false,
            BookingType: 'ATH'
        }

        this.handleChangeTime = this.handleChangeTime.bind(this);
        this.onChange = (Airport) => this.setState({ Airport });
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
            Airport.length > 0 && Airline.length > 0 && Hotel.length > 0 && FlightNumber.length > 0 &&
            PickupDate.length > 0 && HotelBookingRef.length > 0 && DropoffDate.length > 0
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
                res.data.Myresult.sort(function (a, b) {
                    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
                });
                this.props.GetAirportData(res.data.Myresult);
            }).catch((err) => {
                console.log(err)
            })

        axios.get('https://el3ceo7dwe.execute-api.us-west-1.amazonaws.com/dev/handler/Airline-scan')
            .then((res) => {
                res.data.Myresult.sort(function (a, b) {
                    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
                });
                this.props.GetAirlineData(res.data.Myresult);
            }).catch((err) => {
                console.log(err);
            })

        axios.get('https://el3ceo7dwe.execute-api.us-west-1.amazonaws.com/dev/handler/Hotel-scan')
            .then((res) => {
                res.data.Myresult.sort(function (a, b) {
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

    handleChangeTime(time) {
        this.setState({
            ArrivalTime: time
        });
    }

    render() {
        const inputProps = {
            value: this.state.Airport,
            onChange: this.onChange,
            placeholder: 'Search Airport',
            types: ['lodging']
        }

        return (
            <div className="polaroid">
                <div className="container">
                    <div className="form-inline">
                        <div className="form-group">
                            <form align="center">
                                {/**
                                * Airport Section
                                */}
                                <PlacesAutocomplete inputProps={inputProps} styles={defaultStyles} />
                                <hr />

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

                                <hr />
                                <div className="inner-addon left-addon">
                                    <i className="glyphicon glyphicon-plane" style={{ color: '#00bfff' }}></i>
                                    <input
                                        type="text"
                                        style={{ width: '260px' }}
                                        type="text"
                                        onChange={event => this.setState({ FlightNumber: event.target.value })}
                                        placeholder="Flight Number"
                                        className="form-control"
                                    />
                                </div>

                                <hr />
                                <div className="inner-addon left-addon">
                                    <i className="glyphicon glyphicon-calendar" style={{ color: '#00bfff' }}></i>
                                    <input
                                        type={this.state.dateType}
                                        className="form-control"
                                        style={{ width: '260px' }}
                                        placeholder="Pick up Date"
                                        onChange={event => this.setState({ PickupDate: event.target.value })}
                                        onFocus={() => this.setState({ dateType: 'date' })}
                                        onBlur={() => this.setState({ dateType: 'text' })}
                                        style={{ width: '260px' }}
                                    />
                                </div>

                                <hr />
                                <div className="inner-addon left-addon">
                                    <TimePicker
                                        defaultValue={moment()}
                                        showSecond={false}
                                        onChange={this.handleChangeTime}
                                        style={{ width: '260px' }}
                                        className="form-control" />
                                </div>

                                {/**
                             * Hotel Section
                             */}
                                <hr />

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

                                <hr />
                                <div className="inner-addon left-addon">
                                    <i className="glyphicon glyphicon-home" style={{ color: '#e6e600' }}></i>
                                    <input
                                        type='text'
                                        onChange={event => this.setState({ HotelBookingRef: event.target.value })}
                                        placeholder="Hotel Booking Reference"
                                        className="form-control"
                                        style={{ width: '260px' }}
                                    />
                                </div>
                                <hr />
                                <div className="inner-addon left-addon">
                                    <i className="glyphicon glyphicon-user" style={{ color: '#e6e600' }}></i>
                                    <input
                                        defaultValue={this.state.NameUnderHotelRsv}
                                        type='text'
                                        placeholder="Name under Hotel Reservation"
                                        className="form-control"
                                        onChange={event => this.setState({ NameUnderHotelRsv: event.target.value })}
                                        style={{ width: '260px' }}
                                    />
                                </div>
                                <hr />
                                <div className="inner-addon left-addon">
                                    <i className="glyphicon glyphicon-calendar" style={{ color: '#e6e600' }}></i>
                                    <input
                                        type={this.state.dateType}
                                        className="form-control"
                                        placeholder="Drop off Date"
                                        onChange={event => this.setState({ DropoffDate: event.target.value })}
                                        onFocus={() => this.setState({ dateType: 'date' })}
                                        onBlur={() => this.setState({ dateType: 'text' })}
                                        style={{ width: '260px' }}
                                    />
                                </div>
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