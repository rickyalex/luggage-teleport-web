import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { PassBookData, GetAirlineData, GetAirportData } from '../actions';
import '../App.css';
import axios from 'axios';
import * as moment from 'moment';
import PlacesAutocomplete from 'react-places-autocomplete';
import { inputProps, OrderASC } from './helper';
import { TimePicker } from 'antd';

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
        this.onChange = (Hotel) => this.setState({ Hotel });
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
            <Link to="/addluggage" style={{ color: 'black' }}>
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
                // res.
                OrderASC(res.data.Myresult, 'string');
                this.props.GetAirportData(res.data.Myresult);
            }).catch((err) => {
                console.log(err)
            })

        axios.get('https://el3ceo7dwe.execute-api.us-west-1.amazonaws.com/dev/handler/Airline-scan')
            .then((res) => {
                OrderASC(res.data.Myresult, 'string');
                this.props.GetAirlineData(res.data.Myresult);
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
        return (
            <div className="polaroid">
                <div className="container">
                    <div className="form-inline">
                        <div className="form-group">
                            <form align="center">
                                {/**
                                * Airport Section
                                */}
                                <select
                                    className="form-control"
                                    style={{ height: '35px', width: '260px' }}
                                    onChange={event => this.setState({ Airport: event.target.value })}>
                                    <option value="" selected disabled>Choose Airport</option>
                                    {
                                        this.props.AirportData.map((airport) => {
                                            return <option key={airport.id} value={airport.name}>{airport.name}</option>
                                        })
                                    }
                                </select>
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

                                <TimePicker
                                    onChange={this.handleChangeTime}
                                    defaultOpenValue={moment()}
                                    style={{ width: '260px' }}
                                    placeholder="Time of Arrival"
                                    format="HH:mm" />

                                {/**
                             * Hotel Section
                             */}
                                <hr />

                                <PlacesAutocomplete
                                    inputProps={inputProps(this.state.Hotel, this.onChange, 'Search Hotel for Drop Off')}
                                />

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
    const { user, AirportData, AirlineData } = state;
    return {
        user,
        AirportData,
        AirlineData
    }
}

export default connect(mapsStateToProps, { PassBookData, GetAirlineData, GetAirportData })(AirportToHotel);