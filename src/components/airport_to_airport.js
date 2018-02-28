import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { PassBookData, GetAirlineData, GetAirportData } from '../actions';
import '../App.css';
import axios from 'axios';
import { TimePicker, DatePicker, Input, Select } from 'antd';
import { OrderASC, disabledDate } from './helper';
import * as moment from 'moment';

const Option = Select.Option;

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
        this.handlePickupAirport = this.handlePickupAirport.bind(this);
        this.handlePickupAirline = this.handlePickupAirline.bind(this);
        this.handleDropoffAirport = this.handleDropoffAirport.bind(this);
        this.handleDropoffAirline = this.handleDropoffAirline.bind(this);
        this.handlePickupDate = this.handlePickupDate.bind(this);
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
            AirportPickup && AirlinePickup && PickupFlightNumber && PickupDate && AirportDropoff && AirlineDropoff && DropoffFlightNumber
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

    handlePickupDate(date) {
        this.setState({ PickupDate: date })
    }

    handlePickupAirport(airportPickup) {
        this.setState({ AirportPickup: airportPickup })
    }

    handleDropoffAirport(airportDropoff) {
        this.setState({ AirportDropoff: airportDropoff })
    }

    handlePickupAirline(airlinePickup) {
        this.setState({ AirlinePickup: airlinePickup })
    }

    handleDropoffAirline(airlineDropoff) {
        this.setState({ AirlineDropoff: airlineDropoff })
    }

    render() {
        return (
            <div className="polaroid">
                <div className="container">
                    {/**
                        * Airport A Section
                    */}
                    <Select
                        style={{ width: 260 }}
                        placeholder="Choose Airport for Pick up"
                        onChange={this.handlePickupAirport}>
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
                        onChange={this.handlePickupAirline}>
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
                        onChange={e => this.setState({ PickupFlightNumber: e.target.value })}
                    />
                    <hr />
                    <DatePicker
                        onChange={this.handlePickupDate}
                        placeholder="Pick up Date"
                        style={{ width: 260 }} />
                    <hr />
                    <TimePicker
                        onChange={this.handleChangeArrivalTime}
                        defaultOpenValue={moment()}
                        style={{ width: '260px' }}
                        placeholder="Time of Arrival"
                        format="HH:mm" />
                    {/**
                         * Airport B Section
                    */}
                    <hr />
                    <Select
                        style={{ width: 260 }}
                        placeholder="Choose Airport for Drop off"
                        onChange={this.handleDropoffAirport}>
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
                        onChange={this.handleDropoffAirline}>
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
                        onChange={e => this.setState({ DropoffFlightNumber: e.target.value })}
                    />
                    <hr />
                    <TimePicker
                        onChange={this.handleChangeDepartureTime}
                        defaultOpenValue={moment()}
                        style={{ width: '260px' }}
                        placeholder="Departure Time"
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

export default connect(mapsStateToProps, { PassBookData, GetAirportData, GetAirlineData })(AirportToAirport);

