import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { PassBookData } from '../actions';
import '../App.css';
import axios from 'axios';
import PlacesAutocomplete from 'react-places-autocomplete';
import { defaultStyles, inputProps } from './helper';

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
            HotelPickup.length > 0 && HotelPickupBookingRef.length > 0 && HotelPickupDate.length > 0 &&
            HotelDropoff.length > 0 && HotelDropoffBookingRef.length > 0 && HotelDropoffDate.length > 0
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

    render() {
        const CustomerName = localStorage.getItem('CustName');
        return (
            <div className="polaroid">
                <div className="container">
                    <div className="form-inline">
                        <div className="form-group">
                            <form align="center">
                                {/**
                                * Hotel A Section
                                */}
                                <PlacesAutocomplete
                                    inputProps={inputProps(this.state.HotelPickup, this.onChangePickUpHotel, 'Hotel For Pick Up')}
                                />
                                <hr />
                                <div className="inner-addon left-addon">
                                    <i className="glyphicon glyphicon-home" style={{ color: '#00bfff' }}></i>
                                    <input
                                        type='text'
                                        onChange={e => this.setState({ HotelPickupBookingRef: e.target.value })}
                                        placeholder="Hotel Booking Reference"
                                        className="form-control"
                                        style={{ width: '260px' }}
                                    />
                                </div>
                                <hr />
                                <div className="inner-addon left-addon">
                                    <i className="glyphicon glyphicon-user" style={{ color: '#00bfff' }}></i>
                                    <input
                                        defaultValue={CustomerName}
                                        type='text'
                                        onChange={e => this.setState({ RsvpNameHotelPickup: e.target.value })}
                                        placeholder="Name under Hotel Reservation"
                                        className="form-control"
                                        style={{ width: '260px' }}
                                    />
                                </div>
                                <hr />
                                <div className="inner-addon left-addon">
                                    <i className="glyphicon glyphicon-calendar" style={{ color: '#00bfff' }}></i>
                                    <input
                                        type={this.state.dateType}
                                        className="form-control"
                                        placeholder="Pick up Date"
                                        onChange={e => this.setState({ HotelPickupDate: e.target.value })}
                                        onFocus={() => this.setState({ dateType: 'date' })}
                                        onBlur={() => this.setState({ dateType: 'text' })}
                                        style={{ width: '260px' }}
                                    />
                                </div>
                                {/**
                                * Hotel B Section
                                */}
                                <hr />

                                <PlacesAutocomplete
                                    inputProps={inputProps(this.state.HotelDropoff, this.onChangeDropOffHotel, 'Hotel for Drop Off')}
                                />
                                <hr />
                                <div className="inner-addon left-addon">
                                    <i className="glyphicon glyphicon-home" style={{ color: '#e6e600' }}></i>
                                    <input
                                        type='text'
                                        onChange={e => this.setState({ HotelDropoffBookingRef: e.target.value })}
                                        placeholder="Hotel Booking Reference"
                                        className="form-control"
                                        style={{ width: '260px' }}
                                    />
                                </div>
                                <hr />
                                <div className="inner-addon left-addon">
                                    <i className="glyphicon glyphicon-user" style={{ color: '#e6e600' }}></i>
                                    <input
                                        defaultValue={CustomerName}
                                        type='text'
                                        onChange={e => this.setState({ RsvpNameHotelDropoff: e.target.value })}
                                        placeholder="Name under Hotel Reservation"
                                        className="form-control"
                                        style={{ width: '260px' }}
                                    />
                                </div>
                                <hr />
                                <div className="inner-addon left-addon">
                                    <i className="glyphicon glyphicon-calendar" style={{ color: '#e6e600' }}></i>
                                    <input
                                        type={this.state.dateType}
                                        className="form-control"
                                        placeholder="Drop off Date"
                                        onChange={e => this.setState({ HotelDropoffDate: e.target.value })}
                                        onFocus={() => this.setState({ dateType: 'date' })}
                                        onBlur={() => this.setState({ dateType: 'text' })}
                                        style={{ width: '260px' }}
                                    />
                                </div>
                                {
                                    this.buttonSubmit()
                                }
                            </form>
                        </div>
                    </div>
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