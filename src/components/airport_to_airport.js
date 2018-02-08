import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { PassBookData, GetAirlineData, GetAirportData } from '../actions';
import '../App.css';
import axios from 'axios';
import TimePicker from 'rc-time-picker';
import { OrderASC } from './helper';
import * as moment from 'moment';

import 'rc-time-picker/assets/index.css';

class AirportToAirport extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Email: '',
            PhoneNumber: '',
            dateType: 'text',
            timeType: 'text',
            AirportPickup: '',
            AirlinePickup: '',
            PickupFlightNumber: '',
            PickupDate: '',
            ArrivalTime: '',
            AirportDropoff: '',
            AirlineDropoff: '',
            DropoffFlightNumber: '',
            DepartureTime: '',
            BookingType: 'ATA'
        }

        this.handleChangeArrivalTime = this.handleChangeArrivalTime.bind(this);
        this.handleChangeDepartureTime = this.handleChangeDepartureTime.bind(this);
    }

    handleChangeArrivalTime(time) {
        this.setState({
            ArrivalTime: time
        });
    }

    handleChangeDepartureTime(time) {
        this.setState({
            DepartureTime: time
        });
    }

    validationForm() {
        const {
            AirportPickup,
            AirlinePickup,
            PickupFlightNumber,
            PickupDate,
            ArrivalTime,
            AirportDropoff,
            AirlineDropoff,
            DropoffFlightNumber,
            DepartureTime
        } = this.state;

        return (
            AirportPickup.length > 0 && AirlinePickup.length > 0 && PickupFlightNumber.length > 0 &&
            PickupDate.length > 0 && AirportDropoff.length > 0 &&
            AirlineDropoff.length > 0 && DropoffFlightNumber.length > 0
        )
    }

    buttonSubmit() {
        return (
            <Link to="/addluggage" style={{ color: 'black' }}>
                <button
                    className="btn btn-lg"
                    onClick={() => this.SubmitAirportToAirportData()}
                    type="button"
                    disabled={!this.validationForm()}
                    style={{ backgroundColor: 'yellow', width: '260px' }}>
                    Next
                 </button>
            </Link>
        )
    }

    SubmitAirportToAirportData() {
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
                    <div className="form-inline">
                        <div className="form-group">
                            <form align="center">
                                {/**
                                * Airport A Section
                                */}

                                <select
                                    className="form-control"
                                    style={{ height: '35px', width: '260px' }}
                                    onChange={event => this.setState({ AirportPickup: event.target.value })}>
                                    <option value="" selected disabled>Choose Airport for pickup</option>
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
                                    onChange={event => this.setState({ AirlinePickup: event.target.value })}>
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
                                        onChange={e => this.setState({ PickupFlightNumber: e.target.value })}
                                        placeholder="Flight Number"
                                        className="form-control"
                                        style={{ width: '260px' }}
                                    />
                                </div>
                                <hr />
                                <div className="inner-addon left-addon">
                                    <i className="glyphicon glyphicon-calendar" style={{ color: '#00bfff' }}></i>
                                    <input
                                        type={this.state.dateType}
                                        className="form-control"
                                        placeholder="Pick up Date"
                                        onChange={e => this.setState({ PickupDate: e.target.value })}
                                        onFocus={() => this.setState({ dateType: 'date' })}
                                        onBlur={() => this.setState({ dateType: 'text' })}
                                        style={{ width: '260px' }}
                                    />
                                </div>
                                <hr />
                                <div className="inner-addon left-addon">
                                    <TimePicker
                                        placeholder="Time of Arrival"
                                        showSecond={false}
                                        onChange={this.handleChangeArrivalTime}
                                        style={{ width: '260px' }}
                                        className="form-control" />
                                </div>
                                {/**
                             * Airport B Section
                             */}
                                <hr />
                                <select
                                    className="form-control"
                                    style={{ height: '35px', width: '260px' }}
                                    onChange={event => this.setState({ AirportDropoff: event.target.value })}>
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
                                    onChange={event => this.setState({ AirlineDropoff: event.target.value })}>
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
                                        onChange={e => this.setState({ DropoffFlightNumber: e.target.value })}
                                        placeholder="Flight Number"
                                        className="form-control"
                                        style={{ width: '260px' }}
                                    />
                                </div>
                                <hr />
                                <div className="inner-addon left-addon">
                                    <TimePicker
                                        placeholder="Departure Time"
                                        showSecond={false}
                                        onChange={this.handleChangeDepartureTime}
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
    const { user, AirportData, AirlineData } = state;
    return {
        user,
        AirportData,
        AirlineData
    }
}

export default connect(mapsStateToProps, { PassBookData, GetAirportData, GetAirlineData })(AirportToAirport);

