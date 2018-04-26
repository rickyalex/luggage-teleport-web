import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { PassBookData, GetAirlineData, GetAirportData, GetLuggageData } from '../actions';
import '../App.css';
import axios from 'axios';
import * as moment from 'moment';
import PlacesAutocomplete from 'react-places-autocomplete';
import { inputProps, OrderASC, cssClasses, disabledDate, disabledHours, disabledDropoffHours } from './helper';
import { TimePicker, Input, Button, Select, Slider, Row, Col, InputNumber, DatePicker, Icon } from 'antd';
import { MdFlightTakeoff, MdPerson, MdHotel, MdLocalMall } from 'react-icons/lib/md';

const Option = Select.Option;

class AirportToHotel extends Component {

    constructor(props) {
        super(props);

        console.log(this.state);

        this.state = {
            Email: props.user.Email || '',
            PhoneNumber: props.user.PhoneNumber || '',
            Airport: (props.BookData.length > 0) ? (props.BookData[0].BookingType == 'ATH') ? props.BookData[0].Airport : '' : '' || '',
            Airline: (props.BookData.length > 0) ? (props.BookData[0].BookingType == 'ATH') ? props.BookData[0].Airline : '' : '' || '',
            Hotel: (props.BookData.length > 0) ? (props.BookData[0].BookingType == 'ATH') ? props.BookData[0].Hotel : '' : '' || '',
            FlightNumber: (props.BookData.length > 0) ? (props.BookData[0].BookingType == 'ATH') ? props.BookData[0].FlightNumber : '' : ''  || '',
            HotelBookingRef: (props.BookData.length > 0) ? (props.BookData[0].BookingType == 'ATH') ? props.BookData[0].HotelBookingRef : '' : '' || '',
            NameUnderHotelRsv: localStorage.getItem('CustName'),
            BookingType: 'ATH',
            Luggage: (props.BookData.length > 0) ? (props.BookData[0].BookingType == 'ATH') ? props.BookData[0].Luggage : null : null || null,
            TotalCost: (props.BookData.length > 0) ? (props.BookData[0].BookingType == 'ATH') ? props.BookData[0].TotalCost : 0 : 0 || 0,
            PickupTime: (props.BookData.length > 0) ? (props.BookData[0].BookingType == 'ATH') ? moment(props.BookData[0].PickupTime) : '' : '' || '',
            DropoffTime: (props.BookData.length > 0) ? (props.BookData[0].BookingType == 'ATH') ? moment(props.BookData[0].DropoffTime) : '' : '' || '',
            PickupDate: (props.BookData.length > 0) ? (props.BookData[0].BookingType == 'ATH') ? moment(props.BookData[0].PickupDate) : null : null || null,
            DropoffDate: (props.BookData.length > 0) ? (props.BookData[0].BookingType == 'ATH') ? moment(props.BookData[0].DropoffDate) : null : null || null,
            PickupHour: (props.BookData.length > 0) ? (props.BookData[0].BookingType == 'ATH') ? props.BookData[0].PickupHour : 10 : 10 || 10,
            PickupMinute: (props.BookData.length > 0) ? (props.BookData[0].BookingType == 'ATH') ? props.BookData[0].PickupMinute : '00' : '00' || '00',
            DropoffHour: (props.BookData.length > 0) ? (props.BookData[0].BookingType == 'ATH') ? props.BookData[0].DropoffHour : 14 : 14 || 14,
            DropoffMinute: (props.BookData.length > 0) ? (props.BookData[0].BookingType == 'ATH') ? props.BookData[0].DropoffMinute : '00' : '00' || '00',
        }

        console.log(this.state);

        this.hourArray = [];
        this.hourDropoffArray = [];
        this.minuteArray = [];
        this.minuteDropoffArray = [];

        this.handleAirport = this.handleAirport.bind(this);
        this.handleAirline = this.handleAirline.bind(this);
        this.handlePickupChangeTime = this.handlePickupChangeTime.bind(this);
        this.handleDropoffChangeTime = this.handleDropoffChangeTime.bind(this);
        this.handlePickupDate = this.handlePickupDate.bind(this);
        this.handleDropoffDate = this.handleDropoffDate.bind(this);
        this.handlePickupHours = this.handlePickupHours.bind(this);
        this.handlePickupMinutes = this.handlePickupMinutes.bind(this);
        this.handleDropoffHours = this.handleDropoffHours.bind(this);
        this.handleDropoffMinutes = this.handleDropoffMinutes.bind(this);
        this.handleLuggage = this.handleLuggage.bind(this);
        this.onChange = (Hotel) => this.setState({ Hotel });
    }

    ValidationForm() {
        const {
            Airport,
            Airline,
            FlightNumber,
            PickupDate,
            Hotel,
            NameUnderHotelRsv,
            HotelBookingRef,
            DropoffDate,
            Luggage,
            PickupDisplayTime,
            DropoffDisplayTime
        } = this.state;

        return (
            Airport && Airline && Hotel && FlightNumber && PickupDate && PickupDisplayTime && HotelBookingRef && DropoffDate && DropoffDisplayTime && Luggage
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
            <Link to="/finalreview" style={{ color: 'black' }}>
                <Button 
                    disabled={!this.ValidationForm()}
                    onClick={() => this.SubmitAirportToHotelData()}
                    type="primary luggage-yellow">
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

        for(var x=0;x<24;x++){
            this.hourArray.push({
                    id: x,
                    value: x
                });
        }

        for(var y=0;y<12;y++){
            this.minuteArray.push({
                    id: y,
                    value: (y == 0) ? '00' : ("00" + (y*5)).slice(-2)
                });

            this.minuteDropoffArray.push({
                    id: y,
                    value: (y == 0) ? '00' : ("00" + (y*5)).slice(-2)
                });
        }
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
        }, () => {
            console.log(this.state)
        });
    }

    handleDropoffDate(value) {
        this.setState({
            DropoffDate: value
        });
    }

    handlePickupHours = (value) =>{
        this.hourDropoffArray = [];

        for(var x=0;x<24;x++){
            this.hourDropoffArray.push({
                id: x,
                value: x,
                disabled: (x<value+4) ? true : false
            });
        }

        //if the dropoff is above 24 hour
        if(value+4 < 24){
            this.setState({
                PickupHour: value,
                DropoffHour: value+4,
            })    
        }
        else{
            this.setState({
                PickupHour: value,
                DropoffHour: (value+4)-24,
                DropoffDate: moment(this.state.PickupDate).add(1, 'days')
            })
        }
        
    }

    handlePickupMinutes(value){
        this.minuteDropoffArray = [];

        if((this.state.DropoffHour - this.state.PickupHour) <= 4){
            for(var y=0;y<12;y++){
                this.minuteDropoffArray.push({
                    id: y,
                    value: (y == 0) ? '00' : ("00" + (y*5)).slice(-2),
                    disabled: (y<parseInt(value/5)) ? true : false
                });
            }    
        }
        else{
            for(var y=0;y<12;y++){
                this.minuteDropoffArray.push({
                    id: y,
                    value: (y == 0) ? '00' : ("00" + (y*5)).slice(-2)
                });
            }
        }       

        this.setState({
            PickupMinute: value,
            DropoffMinute: value
        })
    }

    handleDropoffHours(value){
        this.setState({
            DropoffHour: value
        })
    }

    handleDropoffMinutes(value){
        this.setState({
            DropoffMinute: value
        })
    }

    render() {
        const dateFormat = 'YYYY-MM-DD';
        return (
            <div className="polaroid">
                <div className="container">
                    {       
                        (this.props.BookData.length > 0) ? (this.props.BookData[0].BookingType == 'ATH') ? <Select
                        prefix={<MdFlightTakeoff style={{ fontSize: '1.1em', color: '#1a1aff', paddingRight: '3px' }} />}
                        placeholder="Airport for pick up"
                        onChange={this.handleAirport}
                        defaultValue={this.state.Airport}
                        >
                        {
                            this.props.AirportData.map((airport) => {
                                return (
                                    <Option key={airport.id} value={airport.name} style={{ width: 400 }}>{airport.name}</Option>
                                )
                            })
                        }
                    </Select> : <Select
                        prefix={<MdFlightTakeoff style={{ fontSize: '1.1em', color: '#1a1aff', paddingRight: '3px' }} />}
                        placeholder="Airport for pick up"
                        onChange={this.handleAirport}
                        >
                        {
                            this.props.AirportData.map((airport) => {
                                return (
                                    <Option key={airport.id} value={airport.name} style={{ width: 400 }}>{airport.name}</Option>
                                )
                            })
                        }
                    </Select> : <Select
                        prefix={<MdFlightTakeoff style={{ fontSize: '1.1em', color: '#1a1aff', paddingRight: '3px' }} />}
                        placeholder="Airport for pick up"
                        onChange={this.handleAirport}
                        >
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
                        (this.props.BookData.length > 0) ? (this.props.BookData[0].BookingType == 'ATH') ? <Select
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
                        prefix={<MdFlightTakeoff style={{ fontSize: '1.1em', color: '#1a1aff', paddingRight: '3px' }} />}
                        placeholder="Flight number"
                        onChange={e => this.setState({ FlightNumber: e.target.value })}
                        defaultValue={this.state.FlightNumber}
                    />
                    <hr />
                    <Row gutter={12}>
                        <Col span={12}>
                            <DatePicker
                                className="dp"
                                format="YYYY-MM-DD"
                                disabledDate={disabledDate}
                                onChange={this.handlePickupDate}
                                value={this.state.PickupDate}
                                defaultValue={(this.state.PickupDate != null) ? moment(this.state.PickupDate, dateFormat) : null} format={dateFormat}
                                placeholder="Pickup date" />
                        </Col>
                        <Col span={12}>
                            {
                                (this.props.BookData.length > 0) ? (this.props.BookData[0].BookingType == 'ATH') ? <Select
                                placeholder="Hours"
                                onChange={this.handlePickupHours}
                                defaultValue={this.state.PickupHour}
                                style={{ width: '50%' }}
                                >
                                {
                                    this.hourArray.map((hours)=>{
                                        return <Option key={hours.id} value={hours.value}>{hours.value}</Option>
                                    })
                                }
                            </Select> : <Select
                                placeholder="Hours"
                                onChange={this.handlePickupHours}
                                defaultValue={this.state.PickupHour}
                                style={{ width: '50%' }}
                                >
                                {
                                    this.hourArray.map((hours)=>{
                                        return <Option key={hours.id} value={hours.value}>{hours.value}</Option>
                                    })
                                }
                            </Select> : <Select
                                placeholder="Hours"
                                onChange={this.handlePickupHours}
                                defaultValue={this.state.PickupHour}
                                style={{ width: '50%' }}
                                >
                                {
                                    this.hourArray.map((hours)=>{
                                        return <Option key={hours.id} value={hours.value}>{hours.value}</Option>
                                    })
                                }
                            </Select>
                            }
                            {
                                (this.props.BookData.length > 0) ? (this.props.BookData[0].BookingType == 'ATH') ? <Select
                                placeholder="Minutes"
                                onChange={this.handlePickupMinutes}
                                defaultValue={this.state.PickupMinute}
                                style={{ width: '50%' }}
                                >
                                {
                                    this.minuteArray.map((minutes)=>{
                                        return <Option key={minutes.id} value={minutes.value}>{minutes.value}</Option>
                                    })
                                }
                            </Select> : <Select
                                placeholder="Minutes"
                                onChange={this.handlePickupMinutes}
                                defaultValue={this.state.PickupMinute}
                                style={{ width: '50%' }}
                                >
                                {
                                    this.minuteArray.map((minutes)=>{
                                        return <Option key={minutes.id} value={minutes.value}>{minutes.value}</Option>
                                    })
                                }
                            </Select> : <Select
                                placeholder="Minutes"
                                onChange={this.handlePickupMinutes}
                                defaultValue={this.state.PickupMinute}
                                style={{ width: '50%' }}
                                >
                                {
                                    this.minuteArray.map((minutes)=>{
                                        return <Option key={minutes.id} value={minutes.value}>{minutes.value}</Option>
                                    })
                                }
                            </Select>
                            }
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
                        inputProps={inputProps(this.state.Hotel, this.onChange, 'Hotel of delivery')}
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
                        prefix={<MdHotel style={{ fontSize: '1.1em', color: '#1a1aff', paddingRight: '3px' }} />}
                        defaultValue={this.state.HotelBookingRef}
                        placeholder="Hotel confirmation number"
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
                                value={this.state.DropoffDate}
                                defaultValue={(this.state.DropoffDate != null) ? moment(this.state.DropoffDate, dateFormat) : null} format={dateFormat}
                                placeholder="Delivery date" />
                        </Col>
                        <Col span={12}>
                            {
                                (this.props.BookData.length > 0) ? (this.props.BookData[0].BookingType == 'ATH') ? <Select
                                placeholder="Hours"
                                onChange={this.handleDropoffHours}
                                defaultValue={this.state.DropoffHour}
                                value={this.state.DropoffHour}
                                style={{ width: '50%' }}
                                >
                                {
                                    this.hourDropoffArray.map((hours)=>{
                                        var opt = (hours.disabled) ? <Option key={hours.id} value={hours.value} disabled>{hours.value}</Option> : <Option key={hours.id} value={hours.value}>{hours.value}</Option>
                                        return opt
                                    })
                                }
                            </Select> : <Select
                                placeholder="Hours"
                                onChange={this.handleDropoffHours}
                                defaultValue={this.state.DropoffHour}
                                value={this.state.DropoffHour}
                                style={{ width: '50%' }}
                                >
                                {
                                    this.hourDropoffArray.map((hours)=>{
                                        var opt = (hours.disabled) ? <Option key={hours.id} value={hours.value} disabled>{hours.value}</Option> : <Option key={hours.id} value={hours.value}>{hours.value}</Option>
                                        return opt
                                    })
                                }
                            </Select> : <Select
                                placeholder="Hours"
                                onChange={this.handleDropoffHours}
                                defaultValue={this.state.DropoffHour}
                                value={this.state.DropoffHour}
                                style={{ width: '50%' }}
                                >
                                {
                                    this.hourDropoffArray.map((hours)=>{
                                        var opt = (hours.disabled) ? <Option key={hours.id} value={hours.value} disabled>{hours.value}</Option> : <Option key={hours.id} value={hours.value}>{hours.value}</Option>
                                        return opt
                                    })
                                }
                            </Select>
                            }
                            {
                                (this.props.BookData.length > 0) ? (this.props.BookData[0].BookingType == 'ATH') ? <Select
                                placeholder="Minutes"
                                onChange={this.handleDropoffMinutes}
                                defaultValue={this.state.DropoffMinute}
                                value={this.state.DropoffMinute}
                                style={{ width: '50%' }}
                                >
                                {
                                    this.minuteDropoffArray.map((minutes)=>{
                                        var opt = (minutes.disabled) ? <Option key={minutes.id} value={minutes.value} disabled>{minutes.value}</Option> : <Option key={minutes.id} value={minutes.value}>{minutes.value}</Option>
                                        return opt
                                    })
                                }
                            </Select> : <Select
                                placeholder="Minutes"
                                onChange={this.handleDropoffMinutes}
                                defaultValue={this.state.DropoffMinute}
                                value={this.state.DropoffMinute}
                                style={{ width: '50%' }}
                                >
                                {
                                    this.minuteDropoffArray.map((minutes)=>{
                                        var opt = (minutes.disabled) ? <Option key={minutes.id} value={minutes.value} disabled>{minutes.value}</Option> : <Option key={minutes.id} value={minutes.value}>{minutes.value}</Option>
                                        return opt
                                    })
                                }
                            </Select> : <Select
                                placeholder="Minutes"
                                onChange={this.handleDropoffMinutes}
                                defaultValue={this.state.DropoffMinute}
                                value={this.state.DropoffMinute}
                                style={{ width: '50%' }}
                                >
                                {
                                    this.minuteDropoffArray.map((minutes)=>{
                                        var opt = (minutes.disabled) ? <Option key={minutes.id} value={minutes.value} disabled>{minutes.value}</Option> : <Option key={minutes.id} value={minutes.value}>{minutes.value}</Option>
                                        return opt
                                    })
                                }
                            </Select>
                            }
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

export default connect(mapsStateToProps, { PassBookData, GetAirlineData, GetAirportData, GetLuggageData })(AirportToHotel);