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
            PickupTime: (props.BookData.length > 0) ? (props.BookData[0].BookingType == 'ATH') ? props.BookData[0].PickupTime : 0 : 0 || 0,
            DropoffTime: (props.BookData.length > 0) ? (props.BookData[0].BookingType == 'ATH') ? props.BookData[0].DropoffTime : 9 : 9 || 9,
            PickupDate: (props.BookData.length > 0) ? (props.BookData[0].BookingType == 'ATH') ? props.BookData[0].PickupDate.split('T')[0] : null : null || null,
            DropoffDate: (props.BookData.length > 0) ? (props.BookData[0].BookingType == 'ATH') ? props.BookData[0].DropoffDate.split('T')[0] : null : null || null,
            PickupDisplayTime: (props.BookData.length > 0) ? (props.BookData[0].BookingType == 'ATH') ? props.BookData[0].PickupDisplayTime : '00:00' : '00:00' || '00:00',
            DropoffDisplayTime: (props.BookData.length > 0) ? (props.BookData[0].BookingType == 'ATH') ? props.BookData[0].DropoffDisplayTime : '04:00' : '04:00' || '04:00'
        }

        console.log(this.state);

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
    }

    handlePickupChangeTime(value) {
        let formattedPickupTime = '';
        let formattedDropoffTime = '';
        let dropoffvalue = value+8;
        if(value%2==1) { 
            formattedPickupTime = Math.floor((value/2)).toString()+':30';
            if(dropoffvalue>48){
                formattedDropoffTime = Math.floor(((value+8-48)/2)).toString()+':30';
            }else{
                formattedDropoffTime = Math.floor(((value+8)/2)).toString()+':30'; 
            } 
        }
        else{ 
            formattedPickupTime = (value/2).toString()+':00';
            if(dropoffvalue>48){
                formattedDropoffTime = ((value+8-48)/2).toString()+':00';
            }
            else{
                formattedDropoffTime = ((value+8)/2).toString()+':00' ;
            }
        }

        this.setState({
          PickupTime: value,
          DropoffTime: (dropoffvalue>48) ? dropoffvalue-48 : dropoffvalue,
          PickupDisplayTime: formattedPickupTime,
          DropoffDisplayTime: formattedDropoffTime,
          PickupDate: this.state.PickupDate || moment(new Date(), "YYYY-MM-DD"),
          DropoffDate: (dropoffvalue>48) ? moment(this.state.PickupDate, "YYYY-MM-DD").add(1, 'days') : moment(new Date(), "YYYY-MM-DD") || moment(new Date(), "YYYY-MM-DD"),
        }, () =>{
            console.log(this.state);
        });

        //===NEW LOGIC START===//
        // let multiplier = 15; //in mins
        // let range = 60/multiplier; //how many multiplier in one hour
        // let minimumpickuphours = 4; //minimum time after pickup (in hours)
        // let minhourrange = range*minimumpickuphours //multiplier in the minimum time after pickup
        // let dropoffvalue = value+minhourrange; //drop off value must at least be 4 hours after pickup
        // let maxdayvalue = 24*range; //the maximum value in 24 hours

        // formattedPickupTime = (value==0 || (value/range)===1) ? Math.floor((value/range)).toString()+':00' : Math.floor((value/range)).toString()+':'+(multiplier*value);
        // if(dropoffvalue>maxdayvalue){
        //     formattedDropoffTime = Math.floor(((value+minhourrange-maxdayvalue)/range)).toString()+':'+(multiplier*value);
        // }else{
        //     formattedDropoffTime = Math.floor(((value+maxdayvalue)/range)).toString()+':'+(multiplier*value); 
        // } 

        // this.setState({
        //   PickupTime: value,
        //   DropoffTime: (dropoffvalue>maxdayvalue) ? dropoffvalue-maxdayvalue : dropoffvalue,
        //   PickupDisplayTime: formattedPickupTime,
        //   DropoffDisplayTime: formattedDropoffTime,
        //   PickupDate: this.state.PickupDate || moment(new Date(), "YYYY-MM-DD"),
        //   DropoffDate: (dropoffvalue>maxdayvalue) ? moment(this.state.PickupDate, "YYYY-MM-DD").add(1, 'days') : moment(new Date(), "YYYY-MM-DD") || moment(new Date(), "YYYY-MM-DD"),
        // }, () =>{
        //     console.log(this.state);
        // });

        //===NEW LOGIC END===//
        
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
        }, () => {});
    }

    handleDropoffDate(value) {
        this.setState({
            DropoffDate: value
        });
    }

    render() {
        const dateFormat = 'YYYY-MM-DD';
        return (
            <div className="polaroid">
                <div className="container">
                    {
                        (this.props.BookData.length > 0) ? (this.props.BookData[0].BookingType == 'ATH') ? <Select
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
                        placeholder="Airline"
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
                                placeholder="Pick up date"/>
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
                                (this.props.BookData.length > 0) ? (this.props.BookData[0].BookingType == 'ATH') ? <Slider step={1} max={48} defaultValue={this.state.PickupTime} onChange={this.handlePickupChangeTime} value={this.state.PickupTime} tipFormatter={null} /> : <Slider step={1} max={48} onChange={this.handlePickupChangeTime} value={this.state.PickupTime} tipFormatter={null} /> : <Slider step={1} max={48} onChange={this.handlePickupChangeTime} value={this.state.PickupTime} tipFormatter={null} />
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
                        <Col span={12} className="timeInput">
                          <Input
                            className="TimeDisplayer"
                            value={this.state.DropoffDisplayTime}
                            onChange={this.handleDropoffChangeTime}
                          />
                        </Col>
                        <Col span={12} className="timeInput">
                            {
                                (this.props.BookData.length > 0) ? (this.props.BookData[0].BookingType == 'ATH') ? <Slider step={1} min={1} max={48} defaultValue={this.state.DropoffTime} onChange={this.handleDropoffChangeTime} value={this.state.DropoffTime} tipFormatter={null} /> : <Slider step={1} min={1} max={48} onChange={this.handleDropoffChangeTime} value={this.state.DropoffTime} tipFormatter={null} /> : <Slider step={1} min={1} max={48} onChange={this.handleDropoffChangeTime} value={this.state.DropoffTime} tipFormatter={null} />
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