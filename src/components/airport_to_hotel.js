import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { PassBookData, GetAirlineData, GetAirportData, GetLuggageData } from '../actions';
import '../App.css';
import axios from 'axios';
import * as moment from 'moment';
import PlacesAutocomplete from 'react-places-autocomplete';
import { inputProps, OrderASC, cssClasses, disabledDate } from './helper';
import { TimePicker, Input, Button, Select, Slider, Row, Col, InputNumber, DatePicker, Icon } from 'antd';
import { MdFlightTakeoff, MdPerson, MdHotel, MdLocalMall } from 'react-icons/lib/md';

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
            HotelBookingRef: '',
            NameUnderHotelRsv: localStorage.getItem('CustName'),
            BookingType: 'ATH',
            Luggage: 1,
            TotalCost: 0,
            PickupTime: 1,
            DropoffTime: 1,
            PickupDate: '',
            DropoffDate: '',
            PickupDisplayTime: '00:00',
            DropoffDisplayTime: '00:00'
        }

        this.handleAirport = this.handleAirport.bind(this);
        this.handleAirline = this.handleAirline.bind(this);
        this.handlePickupChangeTime = this.handlePickupChangeTime.bind(this);
        this.handleDropoffChangeTime = this.handleDropoffChangeTime.bind(this);
        this.handlePickupDate = this.handlePickupDate.bind(this);
        this.handleDropoffDate = this.handleDropoffDate.bind(this);
        this.handleLuggage = this.handleLuggage.bind(this);
        this.onChange = (Hotel) => this.setState({ Hotel });
    }

    ValidationForm() {
        const {
            Airport,
            Airline,
            Hotel,
            FlightNumber,
            PickupDate,
            DropoffDate,
            HotelBookingRef,
            NameUnderHotelRsv,
            Luggage,
            TotalCost,
            PickupDisplayTime,
            DropoffDisplayTime
        } = this.state;

        return (
            Airport && Airline && Hotel && FlightNumber && PickupDate && PickupDisplayTime && HotelBookingRef && DropoffDate && DropoffDisplayTime && Luggage && TotalCost
        )
    }

    componentDidMount() {
        const { Email, PhoneNumber } = this.props.user;
        this.setState({
            Email,
            PhoneNumber
        })
    }

    buttonSubmit() {
        return (
            <Link to="/athfinalreview" style={{ color: 'black' }}>
                <Button 
                    onClick={() => this.SubmitAirportToHotelData()}
                    type="primary">
                    Next
                </Button>
            </Link>
        )
    }

    handleLuggage() {
        const { TotalCost, Luggage } = this.state;
        let Total = 0;
        if (Luggage > 0 && Luggage <= 2) {
            Total = 35;
        } else if (Luggage > 2) {
            Total = 35 + ((Luggage - 2) * 10);
        } else {
            Total = 0;
        }
        this.props.GetLuggageData(Total, Luggage);

        return Total;
    }

    SubmitAirportToHotelData = () => {  
        let datas = [];
        datas.push(this.state);
        this.props.PassBookData(datas);  
        this.setState({ TotalCost: this.handleLuggage() });
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

    handlePickupChangeTime(value) {
        let formattedPickupTime = '';
        let formattedDropoffTime = '';
        if(value%2==1) { 
            formattedPickupTime = Math.floor((value/2)).toString()+':30';
            formattedDropoffTime = ((value+8)>48) ? Math.floor(((value+8-48)/2)).toString()+':30' : Math.floor(((value+8)/2)).toString()+':30';  
        }
        else{ 
            formattedPickupTime = (value/2).toString()+':00';
            formattedDropoffTime = ((value+8)>48) ? ((value+8-48)/2).toString()+':00' : ((value+8)/2).toString()+':00' ;
        }
        this.setState({
          PickupTime: value,
          PickupDisplayTime: formattedPickupTime,
          DropoffDisplayTime: formattedDropoffTime
        });
    }

    handleDropoffChangeTime(value) {

        let formattedDropoffTime = '';
        if(value%2==1) { 
            formattedDropoffTime = Math.floor((value/2)).toString()+':30';
        }
        else{ 
            formattedDropoffTime = (value/2).toString()+':00';
        }
        this.setState({
          DropoffTime: value,
          DropoffDisplayTime: formattedDropoffTime
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
    }

    handlePickupDate(value) {
        const { PickupDate, DropoffDate } = this.state;
        this.setState({
            PickupDate: value,
            DropoffDate: value
        });
    }

    handleDropoffDate(value) {
        this.setState({
            DropoffDate: value
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
                        prefix={<MdFlightTakeoff style={{ fontSize: '1.1em', color: '#1a1aff', paddingRight: '3px' }} />}
                        placeholder="Flight Number"
                        onChange={e => this.setState({ FlightNumber: e.target.value })}
                    />
                    <hr />
                    <Row gutter={12}>
                        <Col span={12}>
                            <DatePicker
                                className="dp"
                                format="YYYY-MM-DD"
                                disabledDate={disabledDate}
                                onChange={this.handlePickupDate}
                                placeholder="Pick up Date"/>
                        </Col>
                        <Col span={12} className="timeInput">
                          <Input
                            className="TimeDisplayer"
                            value={this.state.PickupDisplayTime}
                            onChange={this.handlePickupChangeTime}
                          />
                        </Col>
                        <Col span={12} className="timeInput">
                            <Slider step={1} max={48} onChange={this.handlePickupChangeTime} value={this.state.PickupTime} tipFormatter={null} />
                        </Col>
                        
                    </Row>
                    <hr />
                    {/*<TimePicker
                        onChange={this.handlePickupChangeTime}
                        defaultOpenValue={moment()}
                        style={{ width: '260px' }}
                        placeholder="Time of Arrival"
                        format="HH:mm" />*/}
                    {/**
                             * Hotel Section
                             */}
                    <PlacesAutocomplete
                        inputProps={inputProps(this.state.Hotel, this.onChange, 'Search Hotel for Drop Off')}
                        classNames={cssClasses()}
                    />
                    <hr />
                    <Input
                        prefix={<MdPerson style={{ fontSize: '1.1em', color: '#1a1aff', paddingRight: '3px' }} />}
                        defaultValue={this.state.NameUnderHotelRsv}
                        placeholder="Name Under Hotel Reservation"
                        onChange={e => this.setState({ NameUnderHotelRsv: e.target.value })}
                    />
                    <hr />
                    <Input
                        prefix={<MdHotel style={{ fontSize: '1.1em', color: '#1a1aff', paddingRight: '3px' }} />}
                        placeholder="Hotel Booking Reference"
                        onChange={e => this.setState({ HotelBookingRef: e.target.value })}
                    />
                    <hr />
                    <Row gutter={12}>
                        <Col span={12}>
                            <DatePicker
                                className="dp"
                                format="YYYY-MM-DD"
                                disabledDate={disabledDate}
                                onChange={this.handleDropoffDate}
                                placeholder="Drop Off Date" />
                        </Col>
                        <Col span={12} className="timeInput">
                          <Input
                            className="TimeDisplayer"
                            value={this.state.DropoffDisplayTime}
                            onChange={this.handleDropoffChangeTime}
                          />
                        </Col>
                        <Col span={12} className="timeInput">
                            <Slider step={1} min={1} max={48} onChange={this.handleDropoffChangeTime} value={this.state.DropoffTime} tipFormatter={null} />
                        </Col>
                        
                    </Row>
                    <hr />
                    <InputNumber 
                        size="medium" 
                        min={1}  
                        placeholder="Luggage Quantity"
                        onChange={e => this.setState({ Luggage: e })} 
                    />
                    <hr />
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

export default connect(mapsStateToProps, { PassBookData, GetAirlineData, GetAirportData, GetLuggageData })(AirportToHotel);