import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { PassBookData, GetAirlineData, GetAirportData, GetLuggageData } from '../actions'
import '../App.css';
import axios from 'axios';
import * as moment from 'moment';
import PlacesAutocomplete from 'react-places-autocomplete';
import { inputProps, OrderASC, cssClasses, disabledDate, disabledHours, disabledDropoffHours } from './helper';
import { TimePicker, Input, Button, Select, Slider, Row, Col, InputNumber, DatePicker, Icon } from 'antd';
import { MdFlightTakeoff, MdPerson, MdHotel, MdLocalMall } from 'react-icons/lib/md';

const Option = Select.Option;

class HotelToAirport extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Email: props.user.Email || '',
            PhoneNumber: props.user.PhoneNumber || '',
            Hotel: (props.BookData.length > 0) ? (props.BookData[0].BookingType == 'HTA') ? props.BookData[0].Hotel : '' : '' || '',
            Airport: (props.BookData.length > 0) ? (props.BookData[0].BookingType == 'HTA') ? props.BookData[0].Airport : '' : '' || '',
            Airline: (props.BookData.length > 0) ? (props.BookData[0].BookingType == 'HTA') ? props.BookData[0].Airline : '' : '' || '',
            HotelBookingRef: (props.BookData.length > 0) ? (props.BookData[0].BookingType == 'HTA') ? props.BookData[0].Airline : '' : '' || '',
            NameUnderHotelRsv: localStorage.getItem('CustName'),
            FlightNumber: (props.BookData.length > 0) ? (props.BookData[0].BookingType == 'HTA') ? props.BookData[0].FlightNumber : '' : '' || '',
            BookingType: 'HTA',
            Luggage: (props.BookData.length > 0) ? (props.BookData[0].BookingType == 'HTA') ? props.BookData[0].Luggage : null : null || null,
            TotalCost: (props.BookData.length > 0) ? (props.BookData[0].BookingType == 'HTA') ? props.BookData[0].TotalCost : 0 : 0 || 0,
            PickupTime: (props.BookData.length > 0) ? (props.BookData[0].BookingType == 'HTA') ? moment(props.BookData[0].PickupTime) : '' : '' || '',
            DropoffTime: (props.BookData.length > 0) ? (props.BookData[0].BookingType == 'HTA') ? moment(props.BookData[0].DropoffTime) : '' : '' || '',
            PickupDate: (props.BookData.length > 0) ? (props.BookData[0].BookingType == 'HTA') ? moment(props.BookData[0].PickupDate) : null : null || null,
            DropoffDate: (props.BookData.length > 0) ? (props.BookData[0].BookingType == 'HTA') ? moment(props.BookData[0].DropoffDate) : null : null || null,
            PickupTimeOpen: false
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

    handleAirport(airport) {
        this.setState({
            Airport: airport
        })
    }

    handleAirline(airline) {
        this.setState({ Airline: airline })
    }

    handlePickupChangeTime(value) {
        let dropoff = moment(value).add(4, 'hours');

        this.setState({
          PickupTime: value,
          DropoffTime: dropoff
        });
    }

    handleDropoffChangeTime(value) {
        this.setState({
          DropoffTime: value
        });
    }

    handlePickupTimeOpenChange = (open) => {
        this.setState({ 
            PickupTimeOpen: open 
        });
    }

    handlePickupClose = () => this.setState({ 
        PickupTimeOpen: false,
        DropoffTime: moment(this.state.PickupTime).add(4,'hours')
    })

    handleDropoffTimeOpenChange = (open) => {
        this.setState({ 
            DropoffTimeOpen: open 
        });
    }

    handleDropoffClose = () => this.setState({ 
        // if(moment(this.state.PickupTime).isBefore(moment(this.state.DropoffTime))){

        // }
        DropoffTimeOpen: false
    })

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
                        inputProps={inputProps(this.state.Hotel, this.onChange, 'Hotel and city of pick Up')}
                        classNames={cssClasses()}
                    />
                    <hr />
                    <Input
                        prefix={<MdPerson style={{ fontSize: '1.1em', color: '#1a1aff', paddingRight: '3px' }} />}
                        defaultValue={this.state.NameUnderHotelRsv}
                        placeholder="Guest name"
                        onChange={e => this.setState({ NameUnderHotelRsv: e.target.value })}
                    />
                    <hr />
                    <Input
                        defaultValue={this.state.HotelBookingRef}
                        prefix={<MdHotel style={{ fontSize: '1.1em', color: '#1a1aff', paddingRight: '3px' }} />}
                        placeholder="Hotel room number"
                        onChange={e => this.setState({ HotelBookingRef: e.target.value })}
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
                                placeholder="Pick up date"/>
                        </Col>
                        <Col span={12} className="timeInput">
                          <TimePicker 
                                use12Hours 
                                disabledHours={disabledHours} 
                                defaultValue={this.state.PickupTime} 
                                format="h:mm A" 
                                minuteStep={15} 
                                onChange={this.handlePickupChangeTime}
                                open={this.state.PickupTimeOpen}
                                onOpenChange={this.handlePickupTimeOpenChange}
                                addon={() => (
                                  <Button type="primary timePickerButton" onClick={this.handlePickupClose}>
                                    Ok
                                  </Button>
                                )}/>
                        </Col>
                        
                    </Row>
                    <hr />
                    {
                        /**
                         * Airport Section
                         */
                    }
                    {
                        (this.props.BookData.length > 0) ? (this.props.BookData[0].BookingType == 'HTA') ? <Select
                        placeholder="Airport of delivery"
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
                        placeholder="Airport of delivery"
                        onChange={this.handleAirport}>
                        {
                            this.props.AirportData.map((airport) => {
                                return (
                                    <Option key={airport.id} value={airport.name} style={{ width: 400 }}>{airport.name}</Option>
                                )
                            })
                        }
                    </Select> : <Select
                        placeholder="Airport of delivery"
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
                        (this.props.BookData.length > 0) ? (this.props.BookData[0].BookingType == 'HTA') ? <Select
                        placeholder="Airline"
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
                        placeholder="Airline"
                        onChange={this.handleAirline}>
                        {
                            this.props.AirlineData.map((airline) => {
                                return (
                                    <Option key={airline.id} value={airline.name} style={{ width: 400 }}>{airline.name}</Option>
                                )
                            })
                        }
                    </Select> : <Select
                        placeholder="Airline"
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
                                placeholder="Delivery date" />
                        </Col>
                        <Col span={12} className="timeInput">
                          <TimePicker 
                                use12Hours 
                                disabledHours={disabledDropoffHours} 
                                defaultValue={this.state.DropoffTime} 
                                format="h:mm A" 
                                minuteStep={15} 
                                onChange={this.handleDropoffChangeTime}
                                open={this.state.DropoffTimeOpen}
                                onOpenChange={this.handleDropoffTimeOpenChange}
                                addon={() => (
                                  <Button type="primary timePickerButton" onClick={this.handleDropoffClose}>
                                    Ok
                                  </Button>
                                )}/>
                        </Col>
                        
                    </Row>
                    <hr />
                    <InputNumber 
                        size="medium" 
                        min={1}  
                        placeholder="Number of luggage"
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