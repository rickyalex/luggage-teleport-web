import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { PassBookData, GetAirlineData, GetAirportData } from '../actions';
import '../App.css';
import axios from 'axios';
import * as moment from 'moment';
import PlacesAutocomplete from 'react-places-autocomplete';
import { inputProps, OrderASC, cssClasses, disabledDate } from './helper';
import { TimePicker, Input, Select, DatePicker } from 'antd';

const Option = Select.Option;

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
            PickupDateTime: '',
            DropoffDateTime: '',
            HotelBookingRef: '',
            NameUnderHotelRsv: localStorage.getItem('CustName'),
            OvernightStorage: false,
            showModal: false,
            BookingType: 'ATH'
        }

        this.handleChangeTime = this.handleChangeTime.bind(this);
        this.handleAirport = this.handleAirport.bind(this);
        this.handlePickupDateTime = this.handlePickupDateTime.bind(this);
        this.handleAirline = this.handleAirline.bind(this);
        this.handleDropoffDateTime = this.handleDropoffDateTime.bind(this);
        this.onChange = (Hotel) => this.setState({ Hotel });
    }

    ValidationForm() {
        const {
            Airport,
            Airline,
            Hotel,
            FlightNumber,
            ArrivalTime,
            PickupDateTime,
            DropoffDateTime,
            HotelBookingRef,
            NameUnderHotelRsv,
        } = this.state;

        return (
            Airport && Airline && Hotel && FlightNumber && PickupDateTime && HotelBookingRef && DropoffDateTime
        )
    }

    buttonSubmit() {
        return (
            <Link to="/addluggage" style={{ color: 'black' }}>
                <button
                    className="btn btn-lg"
                    disabled={!this.ValidationForm()}
                    onClick={() => this.SubmitHotelToAirportData()}
                    type="button"
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

    handleAirport(airport) {
        this.setState({
            Airport: airport
        })
    }

    handleAirline(airline) {
        this.setState({ 
            Airline: airline 
        })
        console.log(this.state)
    }

    handlePickupDateTime(dateTime, value) {
        const { PickupDateTime, DropoffDateTime } = this.state;
        this.setState({
            PickupDateTime: value,
            DropoffDateTime: value,
        });
        console.log(this.state)
    }

    handleDropoffDateTime(dateTime) {
        this.setState({
            DropoffDateTime: dateTime
        });
    }

    render() {
        return (
            <div className="polaroid">
                <div className="container">

                    {/**
                        * Airport Section
                    */}

                    <Select
                        style={{ width: 260 }}
                        placeholder="Choose Airport for Pick up"
                        onChange={this.handleAirport}>
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
                    <DatePicker
                        format="YYYY-MM-DD HH:mm"
                        disabledDate={disabledDate}
                        onChange={this.handlePickupDateTime}
                        placeholder="Pick up Date and Time"
                        style={{ width: '260px' }}
                        showTime={{ defaultOpenValue: moment() }} />
                    <hr />
                    {/*<TimePicker
                        onChange={this.handleChangeTime}
                        defaultOpenValue={moment()}
                        style={{ width: '260px' }}
                        placeholder="Time of Arrival"
                        format="HH:mm" />*/}
                    {/**
                             * Hotel Section
                             */}
                    <hr />
                    <PlacesAutocomplete
                        inputProps={inputProps(this.state.Hotel, this.onChange, 'Search Hotel for Drop Off')}
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
                        disabledDate={disabledDate}
                        onChange={this.handleDropoffDateTime}
                        placeholder="Drop Off Date and Time"
                        style={{ width: '260px' }}
                        showTime={{ defaultOpenValue: moment() }} />
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

export default connect(mapsStateToProps, { PassBookData, GetAirlineData, GetAirportData })(AirportToHotel);