import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { PassBookData, GetAirlineData, GetAirportData } from '../actions'
import '../App.css';
import axios from 'axios';
import * as moment from 'moment';
import PlacesAutocomplete from 'react-places-autocomplete';
import { inputProps, OrderASC, cssClasses } from './helper';
import { TimePicker, DatePicker, Input, Select } from 'antd';

const Option = Select.Option;

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
            PickupDatetime: null,
            FlightNumber: '',
            DepartureTime: '',
            BookingType: 'HTA'
        }

        this.handleChangeDateTime = this.handleChangeDateTime.bind(this);
        this.handleTime = this.handleTime.bind(this);
        this.handleAiport = this.handleAiport.bind(this);
        this.handleAirline = this.handleAirline.bind(this);
        this.disabledDate = this.disabledDate.bind(this);
        this.onChange = (Hotel) => this.setState({ Hotel });
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

    handleAiport(airport) {
        this.setState({
            Airport: airport
        })
    }

    handleAirline(airline) {
        this.setState({ Airline: airline })
    }

    disabledDate(current) {
        return current && current < moment().endOf('day');
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
            Hotel && Airport && Airline && HotelBookingRef && FlightNumber && DepartureTime && NameUnderHotelRsv && PickupDatetime
        )
    }

    buttonSubmit() {
        return (
            <Link to="/addluggage" style={{ color: 'black' }}>
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
        this.setState({ Email, PhoneNumber })
    }

    render() {
        return (
            <div className="polaroid">
                <div className="container">
                    {/**
                         * Hotel Section
                         */}

                    <PlacesAutocomplete
                        inputProps={inputProps(this.state.Hotel, this.onChange, 'Search Hotel for Pick Up')}
                        classNames={cssClasses()}
                    />
                    <hr />
                    <Input
                        style={{ width: 260 }}
                        placeholder="Hotel Booking Reference"
                        onChange={e => this.setState({ HotelBookingRef: e.target.value })}
                    />
                    <hr />
                    <Input
                        defaultValue={this.state.NameUnderHotelRsv}
                        style={{ width: 260 }}
                        placeholder="Name Under Hotel Reservation"
                        onChange={e => this.setState({ NameUnderHotelRsv: e.target.value })}
                    />
                    <hr />
                    <DatePicker
                        format="YYYY-MM-DD HH:mm"
                        disabledDate={this.disabledDate}
                        onChange={this.handleChangeDateTime}
                        placeholder="Pick up Date and Time"
                        style={{ width: '260px' }}
                        showTime={{ defaultOpenValue: moment() }}
                    />
                    <hr />
                    {
                        /**
                         * Airport Section
                         */
                    }
                    <Select
                        style={{ width: 260 }}
                        placeholder="Choose Airport for Drop off"
                        onChange={this.handleAiport}>
                        {
                            this.props.AirportData.map((airport) => {
                                return (
                                    <Option key={airport.id} value={airport.name} style={{ width: 400 }}>{airport.name}</Option>
                                )
                            })
                        }
                    </Select>
                    <hr />
                    <Select
                        style={{ width: 260 }}
                        placeholder="Choose Airline"
                        onChange={this.handleAirline}>
                        {
                            this.props.AirlineData.map((airline) => {
                                return (
                                    <Option key={airline.id} value={airline.name} style={{ width: 400 }}>{airline.name}</Option>
                                )
                            })
                        }
                    </Select>
                    <hr />
                    <Input
                        style={{ width: 260 }}
                        placeholder="Flight Number"
                        onChange={e => this.setState({ FlightNumber: e.target.value })}
                    />
                    <hr />
                    <TimePicker
                        onChange={this.handleTime}
                        defaultOpenValue={moment()}
                        style={{ width: '260px' }}
                        placeholder="Drop Off Time"
                        format="HH:mm" />
                    {
                        this.buttonSubmit()
                    }
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

export default connect(mapsStateToProps, { PassBookData, GetAirlineData, GetAirportData })(HotelToAirport);