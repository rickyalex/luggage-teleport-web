import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { PassBookData, GetAirlineData, GetAirportData, GetLuggageData } from '../actions'
import '../App.css';
import axios from 'axios';
import * as moment from 'moment';
import PlacesAutocomplete from 'react-places-autocomplete';
import { inputProps, OrderASC, cssClasses, disabledDate } from './helper';
import { TimePicker, Input, Button, Select, Slider, Row, Col, InputNumber, DatePicker, Icon } from 'antd';
import { MdFlightTakeoff, MdPerson, MdHotel, MdLocalMall } from 'react-icons/lib/md';

const Option = Select.Option;

class HotelToAirport extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Email: this.props.user.Email || '',
            PhoneNumber: this.props.user.PhoneNumber || '',
            Hotel: (this.props.BookData[0].BookingType == 'HTA') ? this.props.BookData[0].Hotel : '' || '',
            Airport: (this.props.BookData[0].BookingType == 'HTA') ? this.props.BookData[0].Airport : '' || '',
            Airline: (this.props.BookData[0].BookingType == 'HTA') ? this.props.BookData[0].Airline : '' || '',
            HotelBookingRef: (this.props.BookData[0].BookingType == 'HTA') ? this.props.BookData[0].Airline : '' || '',
            NameUnderHotelRsv: localStorage.getItem('CustName'),
            PickupTime: (this.props.BookData[0].BookingType == 'HTA') ? this.props.BookData[0].PickupTime : 1 || 1,
            DropoffTime: (this.props.BookData[0].BookingType == 'HTA') ? this.props.BookData[0].DropoffTime : 9 || 9,
            PickupDate: (this.props.BookData[0].BookingType == 'HTA') ? this.props.BookData[0].PickupDate.split('T')[0] : null || null,
            FlightNumber: (this.props.BookData[0].BookingType == 'HTA') ? this.props.BookData[0].FlightNumber : '' || '',
            DropoffDate: (this.props.BookData[0].BookingType == 'HTA') ? this.props.BookData[0].DropoffDate.split('T')[0] : null || null,
            BookingType: 'HTA',
            Luggage: (this.props.BookData[0].BookingType == 'HTA') ? this.props.BookData[0].Luggage : null || null,
            TotalCost: (this.props.BookData[0].BookingType == 'HTA') ? this.props.BookData[0].TotalCost : 0 || 0,
            PickupDisplayTime: (this.props.BookData[0].BookingType == 'HTA') ? this.props.BookData[0].PickupDisplayTime : '00:00' || '00:00',
            DropoffDisplayTime: (this.props.BookData[0].BookingType == 'HTA') ? this.props.BookData[0].DropoffDisplayTime : '04:00' || '04:00'
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
            Hotel,
            HotelBookingRef,
            NameUnderHotelRsv,
            PickupDate,
            Airport,
            Airline,
            FlightNumber,
            DropoffDate,
            Luggage
        } = this.state;

        return (
            Hotel && HotelBookingRef && NameUnderHotelRsv && PickupDate && Airport && Airline && FlightNumber && DropoffDate && Luggage
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

    buttonSubmit() {
        return (
            <Link to="/finalreview" style={{ color: 'black' }}>
                <Button 
                    disabled={!this.ValidationForm()} 
                    onClick={() => this.SubmitHotelToAirportData()}
                    type="primary">
                    Next
                </Button>
            </Link>
        )
    }

    SubmitHotelToAirportData = () => {  
        let datas = [];
        datas.push(this.state);
        this.props.PassBookData(datas);  
        this.setState({ TotalCost: this.handleLuggage() });
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

    handlePickupChangeTime(value) {
        let formattedPickupTime = '';
        let formattedDropoffTime = '';
        let dropoffvalue = value+8;
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
          DropoffTime: dropoffvalue,
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
        this.setState({ Airline: airline })
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
        const dateFormat = 'YYYY-MM-DD';
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
                        defaultValue={this.state.HotelBookingRef}
                        prefix={<MdHotel style={{ fontSize: '1.1em', color: '#1a1aff', paddingRight: '3px' }} />}
                        placeholder="Hotel Booking Reference"
                        onChange={e => this.setState({ HotelBookingRef: e.target.value })}
                    />
                    <hr />
                    <Input
                        prefix={<MdPerson style={{ fontSize: '1.1em', color: '#1a1aff', paddingRight: '3px' }} />}
                        defaultValue={this.state.NameUnderHotelRsv}
                        placeholder="Name Under Hotel Reservation"
                        onChange={e => this.setState({ NameUnderHotelRsv: e.target.value })}
                    />
                    <hr />
                    <Row gutter={12}>
                        <Col span={12}>
                            <DatePicker
                                className="dp"
                                format="YYYY-MM-DD"
                                disabledDate={disabledDate}
                                defaultValue={(this.state.PickupDate != null) ? moment(this.state.PickupDate, dateFormat) : null} format={dateFormat}
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
                            {
                                (this.props.BookData[0].BookingType == 'HTA') ? <Slider step={1} max={48} onChange={this.handlePickupChangeTime} defaultValue={this.state.PickupTime} tipFormatter={null} /> : <Slider step={1} max={48} onChange={this.handlePickupChangeTime} tipFormatter={null} />
                            }
                            
                        </Col>
                        
                    </Row>
                    <hr />
                    {
                        /**
                         * Airport Section
                         */
                    }
                    {
                        (this.props.BookData[0].BookingType == 'HTA') ? <Select
                        placeholder="Choose Airport"
                        onChange={this.handleAirport}
                        defaultValue={this.state.Airport}>
                        {
                            this.props.AirportData.map((airport) => {
                                return (
                                    <Option key={airport.id} value={airport.name} style={{ width: 400 }}>{airport.name}</Option>
                                )
                            })
                        }
                    </Select> : <Select
                        placeholder="Choose Airport"
                        onChange={this.handleAirport}>
                        {
                            this.props.AirportData.map((airport) => {
                                return (
                                    <Option key={airport.id} value={airport.name} style={{ width: 400 }}>{airport.name}</Option>
                                )
                            })
                        }
                    </Select>

                    }
                    
                    <hr />
                    {
                        (this.props.BookData[0].BookingType == 'HTA') ? <Select
                        placeholder="Choose Airline"
                        onChange={this.handleAirline}
                        defaultValue={this.state.Airline}>
                        {
                            this.props.AirlineData.map((airline) => {
                                return (
                                    <Option key={airline.id} value={airline.name} style={{ width: 400 }}>{airline.name}</Option>
                                )
                            })
                        }
                    </Select> : <Select
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
                    }
                    
                    <hr />
                    <Input
                        defaultValue={this.state.FlightNumber}
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
                                defaultValue={(this.state.DropoffDate != null) ? moment(this.state.DropoffDate, dateFormat) : null} format={dateFormat}
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
                            {
                                (this.props.BookData[0].BookingType == 'HTA') ? <Slider step={1} min={1} max={48} defaultValue={this.state.DropoffTime} onChange={this.handleDropoffChangeTime} value={this.state.DropoffTime} tipFormatter={null} /> : <Slider step={1} min={1} max={48} onChange={this.handleDropoffChangeTime} value={this.state.DropoffTime} tipFormatter={null} />
                            }
                        </Col>
                        
                    </Row>
                    <hr />
                    <InputNumber 
                        size="medium" 
                        min={1}  
                        placeholder="Luggage Quantity"
                        defaultValue={this.state.Luggage}
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
    const { user, AirportData, AirlineData, BookData } = state;
    return {
        user,
        AirportData,
        AirlineData,
        BookData
    }
}

export default connect(mapsStateToProps, { PassBookData, GetAirlineData, GetAirportData, GetLuggageData })(HotelToAirport);