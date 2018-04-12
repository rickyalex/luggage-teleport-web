import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { PassBookData, GetLuggageData } from '../actions';
import '../App.css';
import axios from 'axios';
import * as moment from 'moment';
import PlacesAutocomplete from 'react-places-autocomplete';
import { inputProps, cssClasses, disabledDate } from './helper';
import { TimePicker, Input, Button, Select, Slider, Row, Col, InputNumber, DatePicker, Icon } from 'antd';
import { MdFlightTakeoff, MdPerson, MdHotel, MdLocalMall } from 'react-icons/lib/md';

class HotelToHotel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Email: this.props.user.Email || '',
            PhoneNumber: this.props.user.PhoneNumber || '',
            HotelPickup: (this.props.BookData[0].BookingType == 'HTH') ? this.props.BookData[0].HotelPickup : '' || '',
            HotelPickupBookingRef: (this.props.BookData[0].BookingType == 'HTH') ? this.props.BookData[0].HotelPickupBookingRef : '' || '',
            RsvpNameHotelPickup: localStorage.getItem('CustName'),
            HotelDropoff: (this.props.BookData[0].BookingType == 'HTH') ? this.props.BookData[0].HotelDropoff : '' || '',
            HotelDropoffBookingRef: (this.props.BookData[0].BookingType == 'HTH') ? this.props.BookData[0].HotelDropoffBookingRef : '' || '',
            RsvpNameHotelDropoff: localStorage.getItem('CustName'),
            BookingType: 'HTH',
            Luggage: (this.props.BookData[0].BookingType == 'HTH') ? this.props.BookData[0].Luggage : null || null,
            TotalCost: (this.props.BookData[0].BookingType == 'HTH') ? this.props.BookData[0].TotalCost : 0 || 0,
            PickupTime: (this.props.BookData[0].BookingType == 'HTH') ? this.props.BookData[0].PickupTime : 1 || 1,
            DropoffTime: (this.props.BookData[0].BookingType == 'HTH') ? this.props.BookData[0].DropoffTime : 9 || 9,
            PickupDate: (this.props.BookData[0].BookingType == 'HTH') ? this.props.BookData[0].PickupDate.split('T')[0] : null || null,
            DropoffDate: (this.props.BookData[0].BookingType == 'HTH') ? this.props.BookData[0].DropoffDate.split('T')[0] : null || null,
            PickupDisplayTime: (this.props.BookData[0].BookingType == 'HTH') ? this.props.BookData[0].PickupDisplayTime : '00:00' || '00:00',
            DropoffDisplayTime: (this.props.BookData[0].BookingType == 'HTH') ? this.props.BookData[0].DropoffDisplayTime : '04:00' || '04:00',
        }
        this.onChangePickUpHotel = (HotelPickup) => this.setState({ HotelPickup });
        this.onChangeDropOffHotel = (HotelDropoff) => this.setState({ HotelDropoff });
        this.handlePickupChangeTime = this.handlePickupChangeTime.bind(this);
        this.handleDropoffChangeTime = this.handleDropoffChangeTime.bind(this);
        this.handlePickupDate = this.handlePickupDate.bind(this);
        this.handleDropoffDate = this.handleDropoffDate.bind(this);
        this.handleLuggage = this.handleLuggage.bind(this);
    }

    ValidationForm() {
        const {
            HotelPickup,
            HotelPickupBookingRef,
            RsvpNameHotelPickup,
            PickupDate,
            HotelDropoff,
            HotelDropoffBookingRef,
            RsvpNameHotelDropoff,
            DropoffDate,
            Luggage } = this.state;

        return (
            HotelPickup && HotelPickupBookingRef && PickupDate && HotelDropoff && HotelDropoffBookingRef && DropoffDate && Luggage
        )
    }

    buttonSubmit() {
        return (
            <Link to="/finalreview" style={{ color: 'black' }}>
                <Button 
                    disabled={!this.ValidationForm()} 
                    onClick={() => this.SubmitHotelToHotelData()}
                    type="primary">
                    Next
                </Button>
            </Link>
        )
    }

    SubmitHotelToHotelData = () => {  
        let datas = [];
        datas.push(this.state);
        this.props.PassBookData(datas);  
        this.setState({ TotalCost: this.handleLuggage() });
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

    componentDidMount() {
        const { Email, PhoneNumber } = this.props.user;
        this.setState({ Email, PhoneNumber })
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

    render() {
        const dateFormat = 'YYYY-MM-DD';
        return (
            <div className="polaroid">
                <div className="container">
                    {/**
                                * Hotel A Section
                                */}
                    <PlacesAutocomplete
                        inputProps={inputProps(this.state.HotelPickup, this.onChangePickUpHotel, 'Hotel For Pick Up')}
                        classNames={cssClasses()}
                    />
                    <hr />
                    <Input
                        defaultValue={this.state.HotelPickupBookingRef}
                        prefix={<MdHotel style={{ fontSize: '1.1em', color: '#1a1aff', paddingRight: '3px' }} />}
                        placeholder="Hotel Pick up Booking Reference"
                        onChange={e => this.setState({ HotelPickupBookingRef: e.target.value })}
                    />
                    <hr />
                    <Input
                        prefix={<MdPerson style={{ fontSize: '1.1em', color: '#1a1aff', paddingRight: '3px' }} />}
                        defaultValue={this.state.RsvpNameHotelPickup}
                        placeholder="Name Under Hotel Reservation"
                        onChange={e => this.setState({ RsvpNameHotelPickup: e.target.value })}
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
                                (this.props.BookData[0].BookingType == 'HTH') ? <Slider step={1} max={48} defaultValue={this.state.PickupTime} onChange={this.handlePickupChangeTime} value={this.state.PickupTime} tipFormatter={null} /> : <Slider step={1} max={48} onChange={this.handlePickupChangeTime} value={this.state.PickupTime} tipFormatter={null} />
                            }
                        </Col>
                        
                    </Row>
                    <hr />
                    <PlacesAutocomplete
                        inputProps={inputProps(this.state.HotelDropoff, this.onChangeDropOffHotel, 'Hotel for Drop Off')}
                        classNames={cssClasses()}
                    />
                    <hr />
                    <Input
                        defaultValue={this.state.HotelDropoffBookingRef}
                        prefix={<MdHotel style={{ fontSize: '1.1em', color: '#1a1aff', paddingRight: '3px' }} />}
                        placeholder="Hotel Drop off Booking Reference"
                        onChange={e => this.setState({ HotelDropoffBookingRef: e.target.value })}
                    />
                    <hr />
                    <Input
                        defaultValue={this.state.RsvpNameHotelDropoff}
                        prefix={<MdPerson style={{ fontSize: '1.1em', color: '#1a1aff', paddingRight: '3px' }} />}
                        placeholder="Name Under Hotel Reservation"
                        onChange={e => this.setState({ RsvpNameHotelDropoff: e.target.value })}
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
                                (this.props.BookData[0].BookingType == 'HTH') ? <Slider step={1} min={1} max={48} defaultValue={this.state.DropoffTime} onChange={this.handleDropoffChangeTime} value={this.state.DropoffTime} tipFormatter={null} /> : <Slider step={1} min={1} max={48} onChange={this.handleDropoffChangeTime} value={this.state.DropoffTime} tipFormatter={null} />
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
    const { user, BookData } = state;
    return {
        user,
        BookData
    }
}

export default connect(mapsStateToProps, { PassBookData, GetLuggageData })(HotelToHotel);