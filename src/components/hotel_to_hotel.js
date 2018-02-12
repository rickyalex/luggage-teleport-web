import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { PassBookData } from '../actions';
import '../App.css';
import axios from 'axios';
import PlacesAutocomplete from 'react-places-autocomplete';
import { defaultStyles, inputProps } from './helper';
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
            HotelPickupDate: '',
            HotelDropoff: '',
            HotelDropoffBookingRef: '',
            RsvpNameHotelDropoff: localStorage.getItem('CustName'),
            OvernightStorage: false,
            HotelDropoffDate: '',
            BookingType: 'HTH'
        }
        this.onChangePickUpHotel = (HotelPickup) => this.setState({ HotelPickup });
        this.onChangeDropOffHotel = (HotelDropoff) => this.setState({ HotelDropoff });
        this.handleDropoffDate = this.handleDropoffDate.bind(this);
        this.handlePickupDate = this.handlePickupDate.bind(this);
    }

    validationForm() {
        const {
            HotelPickup,
            HotelPickupBookingRef,
            RsvpNameHotelPickup,
            HotelPickupDate,
            HotelDropoff,
            HotelDropoffBookingRef,
            RsvpNameHotelDropoff,
            HotelDropoffDate } = this.state;

        return (
            HotelPickup && HotelPickupBookingRef && HotelPickupDate && HotelDropoff && HotelDropoffBookingRef && HotelDropoffDate
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

    handlePickupDate(pickupDate) {
        this.setState({ HotelPickupDate: pickupDate })
    }

    handleDropoffDate(dropOff) {
        this.setState({ HotelDropoffDate: dropOff })
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
                        onChange={this.handlePickupDate}
                        placeholder="Pick up Date"
                        style={{ width: 260 }} />
                    {/**
                                * Hotel B Section
                                */}
                    <hr />
                    <PlacesAutocomplete
                        inputProps={inputProps(this.state.HotelDropoff, this.onChangeDropOffHotel, 'Hotel for Drop Off')}
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
                        onChange={this.handleDropoffDate}
                        placeholder="Drop off Date"
                        style={{ width: 260 }} />
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