import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { FormGroup, InputGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import { PassBookData, GetHotelData } from '../actions';

import FaCalendar from 'react-icons/lib/fa/calendar';
import MdHotel from 'react-icons/lib/md/hotel';
import FaUser from 'react-icons/lib/fa/user';
import '../App.css';

import axios from 'axios';

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
            RsvpNameHotelPickup: '',
            HotelPickupDate: '',
            HotelDropoff: '',
            HotelDropoffBookingRef: '',
            RsvpNameHotelDropoff: '',
            OvernightStorage: false,
            HotelDropoffDate: '',
            BookingType: 'HTH'
        }
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
            HotelPickup.length > 0 && HotelPickupBookingRef.length > 0 && RsvpNameHotelPickup.length > 0 &&
            HotelPickupDate.length > 0 && HotelDropoff.length > 0 && HotelDropoffBookingRef.length > 0 &&
            RsvpNameHotelDropoff.length > 0 && HotelDropoffDate.length > 0
        )
    }

    buttonSubmit() {
        return (
            <Link to="/hthreview" style={{ color: 'black' }}>
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

    componentWillMount() {
        axios.get('https://el3ceo7dwe.execute-api.us-west-1.amazonaws.com/dev/handler/Hotel-scan')
            .then((res) => {
                res.data.Myresult.sort(function(a,b){
                    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
                });
                this.props.GetHotelData(res.data.Myresult);
            }).catch((err) => {
                console.log(err);
            })
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
                                <FormGroup>
                                    <InputGroup>
                                        <select
                                            className="form-control"
                                            style={{ height: '35px', width: '260px' }}
                                            onChange={event => this.setState({ HotelPickup: event.target.value })}>
                                            <option value="" selected disabled>Hotel for Pick up</option>
                                            {
                                                this.props.HotelData.map((hotel) => {
                                                    return <option key={hotel.id} value={hotel.name}>{hotel.name}</option>
                                                })
                                            }
                                        </select>
                                    </InputGroup>
                                </FormGroup>
                                <hr />
                                <FormGroup>
                                    <InputGroup>
                                        <InputGroup.Addon style={{ backgroundColor: 'white' }}><MdHotel style={{ color: '#00bfff' }} /></InputGroup.Addon>
                                        <input
                                            type='text'
                                            onChange={e => this.setState({ HotelPickupBookingRef: e.target.value })}
                                            placeholder="Hotel Booking Reference"
                                            className="form-control"
                                            style={{ width: '220px' }}
                                        />
                                    </InputGroup>
                                </FormGroup>
                                <hr />
                                <FormGroup>
                                    <InputGroup>
                                        <InputGroup.Addon style={{ backgroundColor: 'white' }}><FaUser style={{ color: '#00bfff' }} /></InputGroup.Addon>
                                        <input
                                            defaultValue={CustomerName}
                                            type='text'
                                            onChange={e => this.setState({ RsvpNameHotelPickup: e.target.value })}
                                            placeholder="Name under Hotel Reservation"
                                            className="form-control"
                                            style={{ width: '220px' }}
                                        />
                                    </InputGroup>
                                </FormGroup>
                                <hr />
                                <FormGroup>
                                    <InputGroup>
                                        <InputGroup.Addon style={{ backgroundColor: 'white' }}><FaCalendar style={{ color: '#00bfff' }} /></InputGroup.Addon>
                                        <input
                                            type={this.state.dateType}
                                            className="form-control"
                                            placeholder="Pick up Date"
                                            onChange={e => this.setState({ HotelPickupDate: e.target.value })}
                                            onFocus={() => this.setState({ dateType: 'date' })}
                                            onBlur={() => this.setState({ dateType: 'text' })}
                                            style={{ width: '220px' }}
                                        />
                                    </InputGroup>
                                </FormGroup>
                                {/**
                                * Hotel B Section
                                */}
                                <hr />
                                <FormGroup>
                                    <InputGroup>
                                        <select
                                            className="form-control"
                                            style={{ height: '35px', width: '260px' }}
                                            onChange={event => this.setState({ HotelDropoff: event.target.value })}>
                                            <option value="" selected disabled>Hotel for Drop off</option>
                                            {
                                                this.props.HotelData.map((hotel) => {
                                                    return <option key={hotel.id} value={hotel.name}>{hotel.name}</option>
                                                })
                                            }
                                        </select>
                                    </InputGroup>
                                </FormGroup>
                                <hr />
                                <FormGroup>
                                    <InputGroup>
                                        <InputGroup.Addon style={{ backgroundColor: 'white' }}><MdHotel style={{ color: '#e6e600' }} /></InputGroup.Addon>
                                        <input
                                            type='text'
                                            onChange={e => this.setState({ HotelDropoffBookingRef: e.target.value })}
                                            placeholder="Hotel Booking Reference"
                                            className="form-control"
                                            style={{ width: '220px' }}
                                        />
                                    </InputGroup>
                                </FormGroup>
                                <hr />
                                <FormGroup>
                                    <InputGroup>
                                        <InputGroup.Addon style={{ backgroundColor: 'white' }}><FaUser style={{ color: '#e6e600' }} /></InputGroup.Addon>
                                        <input
                                            defaultValue={CustomerName}
                                            type='text'
                                            onChange={e => this.setState({ RsvpNameHotelDropoff: e.target.value })}
                                            placeholder="Name under Hotel Reservation"
                                            className="form-control"
                                            style={{ width: '220px' }}
                                        />
                                    </InputGroup>
                                </FormGroup>
                                <hr />
                                {/* <div>
                                    Overnight Storage
                                    <input type="radio" name="optradio" onChange={e => this.setState({ OvernightStorage: true })} />Yes
                                    <input type="radio" name="optradio" onChange={e => this.setState({ OvernightStorage: false })} />No
                                </div>
                                <hr /> */}
                                <FormGroup>
                                    <InputGroup>
                                        <InputGroup.Addon style={{ backgroundColor: 'white' }}><FaCalendar style={{ color: '#e6e600' }} /></InputGroup.Addon>
                                        <input
                                            type={this.state.dateType}
                                            className="form-control"
                                            placeholder="Drop off Date"
                                            onChange={e => this.setState({ HotelDropoffDate: e.target.value })}
                                            onFocus={() => this.setState({ dateType: 'date' })}
                                            onBlur={() => this.setState({ dateType: 'text' })}
                                            style={{ width: '220px' }}
                                        />
                                    </InputGroup>
                                </FormGroup>
                                <hr />
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
    const { user, HotelData } = state;
    return {
        user,
        HotelData
    }
}

export default connect(mapsStateToProps, { PassBookData, GetHotelData })(HotelToHotel);