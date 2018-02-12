import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { PassBookData, GetAirlineData, GetAirportData } from '../actions';
import '../App.css';
import axios from 'axios';
import * as moment from 'moment';
import PlacesAutocomplete from 'react-places-autocomplete';
import { inputProps, OrderASC, cssClasses } from './helper';
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
            PickupDate: '',
            DropoffDate: '',
            HotelBookingRef: '',
            NameUnderHotelRsv: localStorage.getItem('CustName'),
            OvernightStorage: false,
            showModal: false,
            BookingType: 'ATH'
        }

        this.handleChangeTime = this.handleChangeTime.bind(this);
        this.handleAiport = this.handleAiport.bind(this);
        this.handlePickupDate = this.handlePickupDate.bind(this);
        this.handleAirline = this.handleAirline.bind(this);
        this.handleDropoffDate = this.handleDropoffDate.bind(this);
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
            Airport && Airline && Hotel && FlightNumber && PickupDate && HotelBookingRef && DropoffDate
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

    handleAiport(airport) {
        this.setState({
            Airport: airport
        })
    }

    handlePickupDate(date) {
        this.setState({ PickupDate: date })
    }

    handleAirline(airline) {
        this.setState({ Airline: airline })
    }

    handleDropoffDate(DropoffDate) {
        this.setState({ DropoffDate: DropoffDate })
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
                    <DatePicker
                        onChange={this.handlePickupDate}
                        placeholder="Pick up Date"
                        style={{ width: 260 }} />
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
                        onChange={this.handleDropoffDate}
                        placeholder="Drop off Date"
                        style={{ width: 260 }} />
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