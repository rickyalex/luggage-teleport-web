import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { PassBookData } from '../actions';
import '../App.css';
import axios from 'axios';
import * as moment from 'moment';
import PlacesAutocomplete from 'react-places-autocomplete';
import { inputProps, cssClasses, disabledDate } from './helper';
import { DatePicker, Input } from 'antd';

class HotelToHotel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Email: '',
            PhoneNumber: '',
            dateType: 'text',
            timeType: 'text',
            HotelPickup: '',
            HotelPickupBookingRef: '',
            RsvpNameHotelPickup: localStorage.getItem('CustName'),
            HotelPickupDateTime: '',
            HotelDropoff: '',
            HotelDropoffBookingRef: '',
            RsvpNameHotelDropoff: localStorage.getItem('CustName'),
            OvernightStorage: false,
            HotelDropoffDateTime: '',
            BookingType: 'HTH'
        }
        this.onChangePickUpHotel = (HotelPickup) => this.setState({ HotelPickup });
        this.onChangeDropOffHotel = (HotelDropoff) => this.setState({ HotelDropoff });
        this.handleDropoffDateTime = this.handleDropoffDateTime.bind(this);
        this.handlePickupDateTime = this.handlePickupDateTime.bind(this);
    }

    validationForm() {
        const {
            HotelPickup,
            HotelPickupBookingRef,
            RsvpNameHotelPickup,
            HotelPickupDateTime,
            HotelDropoff,
            HotelDropoffBookingRef,
            RsvpNameHotelDropoff,
            HotelDropoffDateTime } = this.state;

        return (
            HotelPickup && HotelPickupBookingRef && HotelPickupDateTime && HotelDropoff && HotelDropoffBookingRef && HotelDropoffDateTime
        )
    }

    buttonSubmit() {
        return (
            <Link to="/addluggage" style={{ color: 'black' }}>
                <button
                    className="btn btn-lg"
                    onClick={() => this.SubmitHotelToHotelData()}
                    type="button"
                    disabled={!this.validationForm()}
                    style={{ backgroundColor: 'yellow', width: '260px' }}>
                    Next
            </button>
            </Link>
        )
    }

    SubmitHotelToHotelData() {
        let datas = [];
        datas.push(this.state);
        this.props.PassBookData(datas);
    }

    componentDidMount() {
        const { Email, PhoneNumber } = this.props.user;
        this.setState({ Email, PhoneNumber })
    }

    handlePickupDateTime(pickupDate) {
        this.setState({ HotelPickupDateTime: pickupDate })
    }

    handleDropoffDateTime(dropOff) {
        this.setState({ HotelDropoffDateTime: dropOff })
    }

    render() {
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
                        style={{ width: 260 }}
                        placeholder="Hotel Pick up Booking Reference"
                        onChange={e => this.setState({ HotelPickupBookingRef: e.target.value })}
                    />
                    <hr />
                    <Input
                        defaultValue={this.state.RsvpNameHotelPickup}
                        style={{ width: 260 }}
                        placeholder="Name Under Hotel Reservation"
                        onChange={e => this.setState({ RsvpNameHotelPickup: e.target.value })}
                    />
                    <hr />
                    <DatePicker
                        format="YYYY-MM-DD HH:mm"
                        disabledDate={disabledDate}
                        onChange={this.handlePickupDateTime}
                        placeholder="Pick up Date and Time"
                        style={{ width: '260px' }}
                        showTime={{ defaultOpenValue: moment() }}
                    />
                    <hr />
                    {/**
                                * Hotel B Section
                                */}
                    <hr />
                    <PlacesAutocomplete
                        inputProps={inputProps(this.state.HotelDropoff, this.onChangeDropOffHotel, 'Hotel for Drop Off')}
                        classNames={cssClasses()}
                    />
                    <hr />
                    <Input
                        style={{ width: 260 }}
                        placeholder="Hotel Drop off Booking Reference"
                        onChange={e => this.setState({ HotelDropoffBookingRef: e.target.value })}
                    />
                    <hr />
                    <Input
                        defaultValue={this.state.RsvpNameHotelDropoff}
                        style={{ width: 260 }}
                        placeholder="Name Under Hotel Reservation"
                        onChange={e => this.setState({ RsvpNameHotelDropoff: e.target.value })}
                    />
                    <hr />
                    <DatePicker
                        format="YYYY-MM-DD HH:mm"
                        disabledDate={disabledDate}
                        onChange={this.handleDropoffDateTime}
                        placeholder="Drop off Date and Time"
                        style={{ width: '260px' }}
                        showTime={{ defaultOpenValue: moment() }}
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
    const { user } = state;
    return {
        user
    }
}

export default connect(mapsStateToProps, { PassBookData })(HotelToHotel);