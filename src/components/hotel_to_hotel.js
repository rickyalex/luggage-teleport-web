import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { PassBookData, GetLuggageData } from '../actions';
import '../App.css';
import axios from 'axios';
import * as moment from 'moment';
import PlacesAutocomplete from 'react-places-autocomplete';
import { inputProps, cssClasses, disabledDate, disabledHours, disabledDropoffHours } from './helper';
import { TimePicker, Input, Button, Select, Slider, Row, Col, InputNumber, DatePicker, Icon } from 'antd';
import { MdFlightTakeoff, MdPerson, MdHotel, MdLocalMall } from 'react-icons/lib/md';

class HotelToHotel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Email: this.props.user.Email || '',
            PhoneNumber: this.props.user.PhoneNumber || '',
            HotelPickup: (props.BookData.length > 0) ? (props.BookData[0].BookingType == 'HTH') ? props.BookData[0].HotelPickup : '' : '' || '',
            HotelPickupBookingRef: (props.BookData.length > 0) ? (props.BookData[0].BookingType == 'HTH') ? props.BookData[0].HotelPickupBookingRef : '' : '' || '',
            RsvpNameHotelPickup: localStorage.getItem('CustName'),
            HotelDropoff: (props.BookData.length > 0) ? (props.BookData[0].BookingType == 'HTH') ? props.BookData[0].HotelDropoff : '' : '' || '',
            HotelDropoffBookingRef: (props.BookData.length > 0) ? (props.BookData[0].BookingType == 'HTH') ? props.BookData[0].HotelDropoffBookingRef : '' : '' || '',
            RsvpNameHotelDropoff: localStorage.getItem('CustName'),
            BookingType: 'HTH',
            Luggage: (props.BookData.length > 0) ? (props.BookData[0].BookingType == 'HTH') ? props.BookData[0].Luggage : null : null || null,
            TotalCost: (props.BookData.length > 0) ? (props.BookData[0].BookingType == 'HTH') ? props.BookData[0].TotalCost : 0 : 0 || 0,
            PickupTime: (props.BookData.length > 0) ? (props.BookData[0].BookingType == 'HTH') ? moment(props.BookData[0].PickupTime) : '' : '' || '',
            DropoffTime: (props.BookData.length > 0) ? (props.BookData[0].BookingType == 'HTH') ? moment(props.BookData[0].DropoffTime) : '' : '' || '',
            PickupDate: (props.BookData.length > 0) ? (props.BookData[0].BookingType == 'HTH') ? moment(props.BookData[0].PickupDate) : null : null || null,
            DropoffDate: (props.BookData.length > 0) ? (props.BookData[0].BookingType == 'HTH') ? moment(props.BookData[0].DropoffDate) : null : null || null,
            PickupTimeOpen: false
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

    render() {
        const dateFormat = 'YYYY-MM-DD';
        return (
            <div className="polaroid">
                <div className="container">
                    {/**
                                * Hotel A Section
                                */}
                    <PlacesAutocomplete
                        inputProps={inputProps(this.state.HotelPickup, this.onChangePickUpHotel, 'Hotel and city of pick Up')}
                        classNames={cssClasses()}
                    />
                    <hr />
                    <Input
                        prefix={<MdPerson style={{ fontSize: '1.1em', color: '#1a1aff', paddingRight: '3px' }} />}
                        defaultValue={this.state.RsvpNameHotelPickup}
                        placeholder="Guest name"
                        onChange={e => this.setState({ RsvpNameHotelPickup: e.target.value })}
                    />
                    <hr />
                    <Input
                        defaultValue={this.state.HotelPickupBookingRef}
                        prefix={<MdHotel style={{ fontSize: '1.1em', color: '#1a1aff', paddingRight: '3px' }} />}
                        placeholder="Hotel room number"
                        onChange={e => this.setState({ HotelPickupBookingRef: e.target.value })}
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
                    <PlacesAutocomplete
                        inputProps={inputProps(this.state.HotelDropoff, this.onChangeDropOffHotel, 'Hotel and city of delivery')}
                        classNames={cssClasses()}
                    />
                    <hr />
                    <Input
                        defaultValue={this.state.HotelDropoffBookingRef}
                        prefix={<MdHotel style={{ fontSize: '1.1em', color: '#1a1aff', paddingRight: '3px' }} />}
                        placeholder="Hotel confirmation number"
                        onChange={e => this.setState({ HotelDropoffBookingRef: e.target.value })}
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
    const { user, BookData } = state;
    return {
        user,
        BookData
    }
}

export default connect(mapsStateToProps, { PassBookData, GetLuggageData })(HotelToHotel);