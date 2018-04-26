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

const Option = Select.Option;

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
            PickupHour: (props.BookData.length > 0) ? (props.BookData[0].BookingType == 'HTA') ? props.BookData[0].PickupHour : 10 : 10 || 10,
            PickupMinute: (props.BookData.length > 0) ? (props.BookData[0].BookingType == 'HTA') ? props.BookData[0].PickupMinute : '00' : '00' || '00',
            DropoffHour: (props.BookData.length > 0) ? (props.BookData[0].BookingType == 'HTA') ? props.BookData[0].DropoffHour : 14 : 14 || 14,
            DropoffMinute: (props.BookData.length > 0) ? (props.BookData[0].BookingType == 'HTA') ? props.BookData[0].DropoffMinute : '00' : '00' || '00',
        }

        this.hourArray = [];
        this.hourDropoffArray = [];
        this.minuteArray = [];
        this.minuteDropoffArray = [];

        this.onChangePickUpHotel = (HotelPickup) => this.setState({ HotelPickup });
        this.onChangeDropOffHotel = (HotelDropoff) => this.setState({ HotelDropoff });
        this.handlePickupDate = this.handlePickupDate.bind(this);
        this.handleDropoffDate = this.handleDropoffDate.bind(this);
        this.handlePickupHours = this.handlePickupHours.bind(this);
        this.handlePickupMinutes = this.handlePickupMinutes.bind(this);
        this.handleDropoffHours = this.handleDropoffHours.bind(this);
        this.handleDropoffMinutes = this.handleDropoffMinutes.bind(this);
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

    componentWillMount(){
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
    const { user, BookData } = state;
    return {
        user,
        BookData
    }
}

export default connect(mapsStateToProps, { PassBookData, GetLuggageData })(HotelToHotel);