import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { PassBookData, GetAirlineData, GetHotelData, GetAirportData } from '../actions'
import '../App.css';
import axios from 'axios';
import TimePicker from 'rc-time-picker';
import DatePicker from 'react-datepicker';
import * as moment from 'moment';

import 'rc-time-picker/assets/index.css';
import 'react-datepicker/dist/react-datepicker.css';

class HotelToAirport extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Email: '',
            PhoneNumber: '',
            Hotel: '',
            Airport: '',
            Airline: '',
            HotelBookingRef: '',
            NameUnderHotelRsv: localStorage.getItem('CustName'),
            PickupDatetime: moment(),
            FlightNumber: '',
            DepartureTime: '',
            BookingType: 'HTA'
        }

        this.handleChangeDateTime = this.handleChangeDateTime.bind(this);
        this.handleTime = this.handleTime.bind(this);
    }

    handleChangeDateTime(dateTime) {
        this.setState({
            PickupDatetime: dateTime
        });
    }

    handleTime(time) {
        this.setState({
            DepartureTime: time
        });
    }

    ValidationForm() {
        const {
            Hotel,
            Airport,
            Airline,
            HotelBookingRef,
            NameUnderHotelRsv,
            PickupDatetime,
            FlightNumber,
            DepartureTime,
        } = this.state

        return (
            Hotel.length > 0 && Airport.length > 0 &&
            Airline.length > 0 && HotelBookingRef.length > 0 && NameUnderHotelRsv.length > 0 &&
            FlightNumber.length > 0
        )
    }

    buttonSubmit() {
        return (
            <Link to="/htareview" style={{ color: 'black' }}>
                <button
                    className="btn btn-lg"
                    onClick={() => this.SubmitHotelToAirportData()}
                    type="button"
                    style={{ backgroundColor: 'yellow', width: '260px' }}
                    disabled={!this.ValidationForm()}
                >
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
        this.setState({ Email, PhoneNumber })
    }

    render() {
        const CustomerName = localStorage.getItem('CustName');
        return (
            <div className="polaroid">
                <div className="container">
                    <div className="form-inline">
                        <div className="form-group">
                            {/**
                         * Hotel Section
                         */}
                            <form align="center">

                                <select
                                    className="form-control"
                                    style={{ height: '35px', width: '260px' }}
                                    onChange={event => this.setState({ Hotel: event.target.value })}>
                                    <option value="" selected disabled>Hotel for Pick up</option>
                                    {
                                        this.props.HotelData.map((hotel) => {
                                            return <option key={hotel.id} value={hotel.name}>{hotel.name}</option>
                                        })
                                    }
                                </select>

                                <hr />
                                <div className="inner-addon left-addon">
                                    <i className="glyphicon glyphicon-home" style={{ color: '#00bfff' }}></i>
                                    <input
                                        type='text'
                                        onChange={e => this.setState({ HotelBookingRef: e.target.value })}
                                        placeholder="Hotel Booking Reference"
                                        className="form-control"
                                        style={{ width: '260px' }}
                                    />
                                </div>
                                <hr />
                                <div className="inner-addon left-addon">
                                    <i className="glyphicon glyphicon-user" style={{ color: '#00bfff' }}></i>
                                    <input
                                        defaultValue={CustomerName}
                                        type='text'
                                        onChange={e => this.setState({ NameUnderHotelRsv: e.target.value })}
                                        placeholder="Name under Hotel Reservation"
                                        className="form-control"
                                        style={{ width: '260px' }}
                                    />
                                </div>
                                <hr />
                                <div className="inner-addon left-addon">
                                    <DatePicker
                                        selected={this.state.PickupDatetime}
                                        onChange={this.handleChangeDateTime}
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        timeIntervals={15}
                                        dateFormat="MM/DD/YYYY HH:mm"
                                        className="form-control"
                                        style={{ width: '260px' }}
                                    />
                                </div>
                                <hr />
                                {
                                    /**
                                     * Airport Section
                                     */
                                }

                                <select
                                    className="form-control"
                                    style={{ height: '35px', width: '260px' }}
                                    onChange={event => this.setState({ Airport: event.target.value })}>
                                    <option value="" selected disabled>Choose Airport for Drop off</option>
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
                                    <i className="glyphicon glyphicon-plane" style={{ color: '#e6e600' }}></i>
                                    <input
                                        type="text"
                                        onChange={e => this.setState({ FlightNumber: e.target.value })}
                                        placeholder="Flight Number"
                                        className="form-control"
                                        style={{ width: '260px' }}
                                    />
                                </div>
                                <hr />
                                <div className="inner-addon left-addon">
                                    <TimePicker
                                        defaultValue={moment()}
                                        showSecond={false}
                                        onChange={this.handleTime}
                                        style={{ width: '260px' }}
                                        className="form-control" />
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

export default connect(mapsStateToProps, { PassBookData, GetAirlineData, GetAirportData, GetHotelData })(HotelToAirport);