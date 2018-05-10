import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { PassBookData, GetLuggageData } from '../actions';
import '../App.css';
import * as moment from 'moment';
import PlacesAutocomplete from 'react-places-autocomplete';
import { inputProps, disabledDate, cssClasses } from './helper';
import { Input, Button, Select, Row, Col, InputNumber, DatePicker } from 'antd';
import { MdPerson, MdHotel } from 'react-icons/lib/md';

const Option = Select.Option;

class HotelToHotel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Email: this.props.user.Email || '',
            PhoneNumber: this.props.user.PhoneNumber || '',
            HotelPickup: (props.BookData.length > 0) ? (props.BookData[0].BookingType === 'HTH') ? props.BookData[0].HotelPickup : '' : '' || '',
            HotelPickupBookingRef: (props.BookData.length > 0) ? (props.BookData[0].BookingType === 'HTH') ? props.BookData[0].HotelPickupBookingRef : '' : '' || '',
            RsvpNameHotelPickup: localStorage.getItem('CustName'),
            HotelDropoff: (props.BookData.length > 0) ? (props.BookData[0].BookingType === 'HTH') ? props.BookData[0].HotelDropoff : '' : '' || '',
            HotelDropoffBookingRef: (props.BookData.length > 0) ? (props.BookData[0].BookingType === 'HTH') ? props.BookData[0].HotelDropoffBookingRef : '' : '' || '',
            RsvpNameHotelDropoff: localStorage.getItem('CustName'),
            BookingType: 'HTH',
            Luggage: (props.BookData.length > 0) ? (props.BookData[0].BookingType === 'HTH') ? props.BookData[0].Luggage : null : null || null,
            TotalCost: (props.BookData.length > 0) ? (props.BookData[0].BookingType === 'HTH') ? props.BookData[0].TotalCost : 0 : 0 || 0,
            PickupDate: (props.BookData.length > 0) ? (props.BookData[0].BookingType === 'HTH') ? moment(props.BookData[0].PickupDate) : null : null || null,
            DropoffDate: (props.BookData.length > 0) ? (props.BookData[0].BookingType === 'HTH') ? moment(props.BookData[0].DropoffDate) : null : null || null,
            PickupHour: (props.BookData.length > 0) ? (props.BookData[0].BookingType === 'HTH') ? props.BookData[0].PickupHour : 10 : 10 || 10,
            PickupMinute: (props.BookData.length > 0) ? (props.BookData[0].BookingType === 'HTH') ? props.BookData[0].PickupMinute : '00' : '00' || '00',
            DropoffHour: (props.BookData.length > 0) ? (props.BookData[0].BookingType === 'HTH') ? props.BookData[0].DropoffHour : null : null || null,
            DropoffMinute: (props.BookData.length > 0) ? (props.BookData[0].BookingType === 'HTH') ? props.BookData[0].DropoffMinute : null : null || null,
            PickupFormat: (props.BookData.length > 0) ? (props.BookData[0].BookingType === 'HTH') ? props.BookData[0].PickupFormat : "AM" : "AM" || "AM",
            DropoffFormat: (props.BookData.length > 0) ? (props.BookData[0].BookingType === 'HTH') ? props.BookData[0].DropoffFormat : null : null || null,
            restrictMessage: "callout right hidden",
            restrict: true
        }

        this.hourArray = [];
        this.minuteArray = [];

        this.onChangePickUpHotel = (HotelPickup) => this.setState({ HotelPickup });
        this.onChangeDropOffHotel = (HotelDropoff) => this.setState({ HotelDropoff });
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
    }

    ValidationForm() {
        const {
            HotelPickup,
            HotelPickupBookingRef,
            RsvpNameHotelPickup,
            HotelDropoff,
            HotelDropoffBookingRef,
            RsvpNameHotelDropoff,
            PickupDate,
            PickupHour,
            PickupMinute,
            PickupFormat,
            DropoffDate,
            DropoffHour,
            DropoffMinute,
            DropoffFormat,
            Luggage } = this.state;

        return (
            HotelPickup && HotelPickupBookingRef && RsvpNameHotelPickup && HotelDropoff && HotelDropoffBookingRef && RsvpNameHotelDropoff &&PickupDate && PickupHour && PickupMinute && PickupFormat && DropoffDate && DropoffHour && DropoffMinute && DropoffFormat && Luggage
        )
    }

    buttonSubmit() {
        return (
            <Link to="/finalreview" style={{ color: 'black' }}>
                <Button 
                    disabled={!this.ValidationForm()} 
                    onClick={(e) => this.SubmitHotelToHotelData(e)}
                    type="primary">
                    Next
                </Button>
            </Link>
        )
    }

    SubmitHotelToHotelData(e){  
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

    handleLuggage() {
        //The minimum cost is $35, after more than 2 luggages, each are costed $10
        const { Luggage } = this.state;
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
                value: (y === 0) ? '00' : ("00" + (y*5)).slice(-2)
            });
        }
    }

    componentDidMount() {
        const { Email, PhoneNumber } = this.props.user;
        this.setState({ Email, PhoneNumber })
    }

    handlePickupDate(value) {
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
                        prefix={<MdPerson className="input-prefix" />}
                        defaultValue={this.state.RsvpNameHotelPickup}
                        placeholder="Guest name"
                        onChange={e => this.setState({ RsvpNameHotelPickup: e.target.value })}
                    />
                    <hr />
                    <Input
                        defaultValue={this.state.HotelPickupBookingRef}
                        prefix={<MdHotel className="input-prefix" />}
                        placeholder="Hotel room number"
                        onChange={e => this.setState({ HotelPickupBookingRef: e.target.value })}
                    />
                    <hr />
                    <DatePicker
                                className="dp"
                                format={dateFormat}
                                disabledDate={disabledDate}
                                onChange={this.handlePickupDate}
                                value={this.state.PickupDate}
                                defaultValue={(this.state.PickupDate != null) ? this.state.PickupDate : null} 
                                placeholder="Pickup date" />
                    <hr />
                    <Row gutter={12}>
                        <Col span={8} style={{ padding: "0 0 0 6px" }}>
                            {
                                (this.props.BookData.length > 0) ? (this.props.BookData[0].BookingType === 'ATH') ? <Select
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
                                (this.props.BookData.length > 0) ? (this.props.BookData[0].BookingType === 'ATH') ? <Select
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
                    <PlacesAutocomplete
                        inputProps={inputProps(this.state.HotelDropoff, this.onChangeDropOffHotel, 'Hotel and city of delivery')}
                        classNames={cssClasses()}
                    />
                    <hr />
                    <Input
                        defaultValue={this.state.HotelDropoffBookingRef}
                        prefix={<MdHotel className="input-prefix" />}
                        placeholder="Hotel confirmation number"
                        onChange={e => this.setState({ HotelDropoffBookingRef: e.target.value })}
                    />
                    <hr />
                    <DatePicker
                                className="dp"
                                format={dateFormat}
                                disabledDate={disabledDate}
                                onChange={this.handleDropoffDate}
                                value={this.state.DropoffDate}
                                defaultValue={(this.state.DropoffDate != null) ? this.state.DropoffDate : null}
                                placeholder="Delivery date" />
                    <hr />
                    <Row gutter={12}>
                        <Col span={8} style={{ padding: '0 0 0 6px' }}>
                            {
                                (this.props.BookData.length > 0) ? (this.props.BookData[0].BookingType === 'HTH') ? <Select
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
                                (this.props.BookData.length > 0) ? (this.props.BookData[0].BookingType === 'HTH') ? <Select
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
                                (this.props.BookData.length > 0) ? (this.props.BookData[0].BookingType === 'HTH') ? <Select
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
    const { user, BookData } = state;
    return {
        user,
        BookData
    }
}

export default connect(mapsStateToProps, { PassBookData, GetLuggageData })(HotelToHotel);