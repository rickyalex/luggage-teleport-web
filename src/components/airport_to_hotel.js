import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { PassBookData, GetAirlineData, GetAirportData, GetLuggageData } from '../actions';
import '../App.css';
import axios from 'axios';
import * as moment from 'moment';
import PlacesAutocomplete from 'react-places-autocomplete';
import { inputProps, OrderASC, cssClasses, disabledDate, disabledHours, disabledDropoffHours } from './helper';
import { TimePicker, Input, Button, Select, Slider, Row, Col, InputNumber, DatePicker, Icon, Switch } from 'antd';
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
            PickupDate: (props.BookData.length > 0) ? (props.BookData[0].BookingType == 'ATH') ? moment(props.BookData[0].PickupDate) : null : null || null,
            DropoffDate: (props.BookData.length > 0) ? (props.BookData[0].BookingType == 'ATH') ? moment(props.BookData[0].DropoffDate) : null : null || null,
            PickupHour: (props.BookData.length > 0) ? (props.BookData[0].BookingType == 'ATH') ? props.BookData[0].PickupHour : 10 : 10 || 10,
            PickupMinute: (props.BookData.length > 0) ? (props.BookData[0].BookingType == 'ATH') ? props.BookData[0].PickupMinute : '00' : '00' || '00',
            DropoffHour: (props.BookData.length > 0) ? (props.BookData[0].BookingType == 'ATH') ? props.BookData[0].DropoffHour : null : null || null,
            DropoffMinute: (props.BookData.length > 0) ? (props.BookData[0].BookingType == 'ATH') ? props.BookData[0].DropoffMinute : null : null || null,
            PickupFormat: (props.BookData.length > 0) ? (props.BookData[0].BookingType == 'ATH') ? props.BookData[0].PickupFormat : "AM" : "AM" || "AM",
            DropoffFormat: (props.BookData.length > 0) ? (props.BookData[0].BookingType == 'ATH') ? props.BookData[0].DropoffFormat : null : null || null,
            restrictMessage: "callout right hidden",
            restrict: true
        }

        this.hourArray = [];
        this.minuteArray = [];

        this.handleAirport = this.handleAirport.bind(this);
        this.handleAirline = this.handleAirline.bind(this);
        this.handlePickupDate = this.handlePickupDate.bind(this);
        this.handleDropoffDate = this.handleDropoffDate.bind(this);
        this.handlePickupHours = this.handlePickupHours.bind(this);
        this.handlePickupMinutes = this.handlePickupMinutes.bind(this);
        this.handleDropoffHours = this.handleDropoffHours.bind(this);
        this.handleDropoffMinutes = this.handleDropoffMinutes.bind(this);
        this.handlePickupFormat = this.handlePickupFormat.bind(this);
        this.handleDropoffFormat = this.handleDropoffFormat.bind(this);
        this.checkRestriction = this.checkRestriction.bind(this);
        this.handleLuggage = this.handleLuggage.bind(this);
        this.onChange = (Hotel) => this.setState({ Hotel });
    }

    ValidationForm() {
        console.log(this.state);

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
            PickupHour,
            PickupMinute,
            PickupFormat,
            DropoffHour,
            DropoffMinute,
            DropoffFormat
        } = this.state;

        return (
            Airport && Airline && Hotel && FlightNumber && PickupDate && PickupHour && PickupMinute && PickupFormat && HotelBookingRef && DropoffDate && DropoffHour && DropoffMinute && DropoffFormat && Luggage
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
                    onClick={(e) => this.SubmitAirportToHotelData(e)}
                    type="primary luggage-yellow">
                    Next
                </Button>
            </Link>
        )
    }

    handleLuggage() {
        //The minimum cost is $35, after more than 2 luggages, each are costed $10
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

    SubmitAirportToHotelData(e){  
        var check = this.checkRestriction();

        if(!check){
            this.setState({ restrictMessage: "callout right hidden", restrict: false });    
            let datas = [];
            datas.push(this.state);
            this.props.PassBookData(datas);  
            this.setState({ TotalCost: this.handleLuggage() }); 
        }
        else{
            e.preventDefault();
            this.setState({ restrictMessage: "callout right show", restrict: true });    
            return false;
        }
    }

    componentWillMount() {
        //load airport data
        axios.get('https://el3ceo7dwe.execute-api.us-west-1.amazonaws.com/dev/handler/Airport-scan')
            .then((res) => {
                console.log(res.data.Myresult)
                OrderASC(res.data.Myresult, 'string');
                this.props.GetAirportData(res.data.Myresult);
            }).catch((err) => {
                console.log(err)
            })
        //load airline data
        axios.get('https://el3ceo7dwe.execute-api.us-west-1.amazonaws.com/dev/handler/Airline-scan')
            .then((res) => {
                OrderASC(res.data.Myresult, 'string');
                this.props.GetAirlineData(res.data.Myresult);
            }).catch((err) => {
                console.log(err);
            })
        //load hour and minute array dropdown
        for(var x=1;x<13;x++){
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
        }

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

    handlePickupHours(value){
        this.setState({
            PickupHour: value
        }) 
    }

    handlePickupMinutes(value){
        this.setState({
            PickupMinute: value
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

    handlePickupFormat(value){
        this.setState({
            PickupFormat: value
        })
    }

    handleDropoffFormat(value){
        this.setState({
            DropoffFormat: value
        })
    }

    checkRestriction(){
        //returns true (restrict) if the minimum range is unmet

        var minimumRange = 4; //in hours

        var pickupMoment = moment(moment(this.state.PickupDate).format("YYYY-MM-DD")+" "+this.state.PickupHour+":"+this.state.PickupMinute+this.state.PickupFormat,"YYYY-MM-DD hh:mma");
        var dropoffMoment = moment(moment(this.state.DropoffDate).format("YYYY-MM-DD")+" "+this.state.DropoffHour+":"+this.state.DropoffMinute+this.state.DropoffFormat,"YYYY-MM-DD hh:mma");
        var expectedDropoff = pickupMoment.add(minimumRange, 'hours');

        if(dropoffMoment.isSameOrAfter(expectedDropoff)){
            return false;
        }
        else return true;
    }

    render() {
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
                            <DatePicker
                                className="dp"
                                format="YYYY-MM-DD"
                                disabledDate={disabledDate}
                                onChange={this.handlePickupDate}
                                value={this.state.PickupDate}
                                defaultValue={(this.state.PickupDate != null) ? this.state.PickupDate : null} 
                                placeholder="Pickup date" />
                    <hr />
                    <Row gutter={12}>
                        <Col span={8} style={{ padding: "0 0 0 6px" }}>
                            {
                                (this.props.BookData.length > 0) ? (this.props.BookData[0].BookingType == 'ATH') ? <Select
                                placeholder="Hours"
                                onChange={this.handlePickupHours}
                                defaultValue={this.state.PickupHour}
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
                                >
                                {
                                    this.hourArray.map((hours)=>{
                                        return <Option key={hours.id} value={hours.value}>{hours.value}</Option>
                                    })
                                }
                            </Select>
                            }
                        </Col>
                        <Col span={8} style={{ padding: "0 0 0 3px" }}>
                            {
                                (this.props.BookData.length > 0) ? (this.props.BookData[0].BookingType == 'ATH') ? <Select
                                placeholder="Minutes"
                                onChange={this.handlePickupMinutes}
                                defaultValue={this.state.PickupMinute}
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
                                >
                                {
                                    this.minuteArray.map((minutes)=>{
                                        return <Option key={minutes.id} value={minutes.value}>{minutes.value}</Option>
                                    })
                                }
                            </Select>
                            }
                        </Col>
                        <Col span={7} style={{ marginLeft: "11px" }}>
                            <Select
                                placeholder="Format"
                                onChange={this.handlePickupFormat}
                                defaultValue={this.state.PickupFormat}
                                >
                                <Option key="AM" value="AM">AM</Option>
                                <Option key="PM" value="PM">PM</Option>
                            </Select>
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
                    <DatePicker
                                className="dp"
                                format="YYYY-MM-DD"
                                disabledDate={disabledDate}
                                onChange={this.handleDropoffDate}
                                value={this.state.DropoffDate}
                                defaultValue={(this.state.DropoffDate != null) ? this.state.DropoffDate : null}
                                placeholder="Delivery date" />
                    <hr />
                    <Row gutter={12}>
                        <Col span={8} style={{ padding: '0 0 0 6px' }}>
                            {
                                (this.props.BookData.length > 0) ? (this.props.BookData[0].BookingType == 'ATH') ? <Select
                                placeholder="Hours"
                                onChange={this.handleDropoffHours}
                                defaultValue={this.state.DropoffHour}
                                value={this.state.DropoffHour}
                                >
                                {
                                    this.hourArray.map((hours)=>{
                                        return <Option key={hours.id} value={hours.value}>{hours.value}</Option>
                                    })
                                }
                            </Select> : <Select
                                placeholder="Hours"
                                onChange={this.handleDropoffHours}
                                >
                                {
                                    this.hourArray.map((hours)=>{
                                        return <Option key={hours.id} value={hours.value}>{hours.value}</Option>
                                    })
                                }
                            </Select> : <Select
                                placeholder="Hours"
                                onChange={this.handleDropoffHours}
                                >
                                {
                                    this.hourArray.map((hours)=>{
                                        return <Option key={hours.id} value={hours.value}>{hours.value}</Option>
                                    })
                                }
                            </Select>
                            }
                        </Col>
                        <Col span={8} style={{ padding: '0 0 0 3px' }}>
                            {
                                (this.props.BookData.length > 0) ? (this.props.BookData[0].BookingType == 'ATH') ? <Select
                                placeholder="Minutes"
                                onChange={this.handleDropoffMinutes}
                                defaultValue={this.state.DropoffMinute}
                                value={this.state.DropoffMinute}
                                >
                                {
                                    this.minuteArray.map((minutes)=>{
                                        return <Option key={minutes.id} value={minutes.value}>{minutes.value}</Option>
                                    })
                                }
                            </Select> : <Select
                                placeholder="Minutes"
                                onChange={this.handleDropoffMinutes}
                                >
                                {
                                    this.minuteArray.map((minutes)=>{
                                        return <Option key={minutes.id} value={minutes.value}>{minutes.value}</Option>
                                    })
                                }
                            </Select> : <Select
                                placeholder="Minutes"
                                onChange={this.handleDropoffMinutes}
                                >
                                {
                                    this.minuteArray.map((minutes)=>{
                                        return <Option key={minutes.id} value={minutes.value}>{minutes.value}</Option>
                                    })
                                }
                            </Select>
                            }
                        </Col>
                        <Col span={7} style={{ marginLeft: '11px' }}>
                            {
                                (this.props.BookData.length > 0) ? (this.props.BookData[0].BookingType == 'ATH') ? <Select
                                    placeholder="AM/PM"
                                    onChange={this.handleDropoffFormat}
                                    defaultValue={this.state.DropoffFormat}
                                    >
                                    <Option key="AM" value="AM">AM</Option>
                                    <Option key="PM" value="PM">PM</Option>
                                </Select> : <Select
                                    placeholder="AM/PM"
                                    onChange={this.handleDropoffFormat}
                                    >
                                    <Option key="AM" value="AM">AM</Option>
                                    <Option key="PM" value="PM">PM</Option>
                                </Select> : <Select
                                    placeholder="AM/PM"
                                    onChange={this.handleDropoffFormat}
                                    >
                                    <Option key="AM" value="AM">AM</Option>
                                    <Option key="PM" value="PM">PM</Option>
                                </Select>
                            }
                            <div className={this.state.restrictMessage}>Dropoff must be at least 4 hours after Pickup</div>
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