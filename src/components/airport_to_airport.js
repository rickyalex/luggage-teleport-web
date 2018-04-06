import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { PassBookData, GetAirlineData, GetAirportData, GetLuggageData } from '../actions';
import '../App.css';
import axios from 'axios';
import * as moment from 'moment';
import { inputProps, OrderASC, cssClasses, disabledDate } from './helper';
import { TimePicker, Input, Button, Select, Slider, Row, Col, InputNumber, DatePicker, Icon } from 'antd';
import { MdFlightTakeoff, MdPerson, MdHotel, MdLocalMall } from 'react-icons/lib/md';

const Option = Select.Option;

class AirportToAirport extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Email: '',
            PhoneNumber: '',
            dateType: 'text',
            timeType: 'text',
            AirportPickup: '',
            AirlinePickup: '',
            PickupFlightNumber: '',
            PickupDateTime: '',
            ArrivalTime: '',
            AirportDropoff: '',
            AirlineDropoff: '',
            DropoffFlightNumber: '',
            DropoffDateTime: '',
            BookingType: 'ATA',
            Luggage: null,
            TotalCost: 0,
            PickupDate: null,
            DropoffDate: null,
            PickupDisplayTime: '00:00',
            DropoffDisplayTime: '04:00'
        }

        this.handlePickupAirport = this.handlePickupAirport.bind(this);
        this.handlePickupAirline = this.handlePickupAirline.bind(this);
        this.handleDropoffAirport = this.handleDropoffAirport.bind(this);
        this.handleDropoffAirline = this.handleDropoffAirline.bind(this);
        this.handlePickupChangeTime = this.handlePickupChangeTime.bind(this);
        this.handleDropoffChangeTime = this.handleDropoffChangeTime.bind(this);
        this.handlePickupDate = this.handlePickupDate.bind(this);
        this.handleDropoffDate = this.handleDropoffDate.bind(this);
        this.handleLuggage = this.handleLuggage.bind(this);
    }

    ValidationForm() {
        const {
            AirportPickup,
            AirlinePickup,
            PickupFlightNumber,
            PickupDate,
            ArrivalTime,
            AirportDropoff,
            AirlineDropoff,
            DropoffFlightNumber,
            DepartureTime,
            Luggage
        } = this.state;

        return (
            AirportPickup && AirlinePickup && PickupFlightNumber && PickupDate && AirportDropoff && AirlineDropoff && DropoffFlightNumber && Luggage
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

    buttonSubmit() {
        return (
            <Link to="/finalreview" style={{ color: 'black' }}>
                <Button
                    disabled={!this.ValidationForm()} 
                    onClick={() => this.SubmitAirportToAirportData()}
                    type="primary">
                    Next
                </Button>
            </Link>
        )
    }

    SubmitAirportToAirportData = () => {  
        let datas = [];
        datas.push(this.state);
        this.props.PassBookData(datas);  
        this.setState({ TotalCost: this.handleLuggage() });
    }

    componentWillMount() {
        axios.get('https://el3ceo7dwe.execute-api.us-west-1.amazonaws.com/dev/handler/Airport-scan')
            .then((res) => {
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

    componentDidMount() {
        const { Email, PhoneNumber } = this.props.user;
        this.setState({ Email, PhoneNumber })
    }

    handlePickupChangeTime(value) {
        let formattedPickupTime = '';
        let formattedDropoffTime = '';
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

    handlePickupAirport(airportPickup) {
        this.setState({ AirportPickup: airportPickup })
    }

    handleDropoffAirport(airportDropoff) {
        this.setState({ AirportDropoff: airportDropoff })
    }

    handlePickupAirline(airlinePickup) {
        this.setState({ AirlinePickup: airlinePickup })
    }

    handleDropoffAirline(airlineDropoff) {
        this.setState({ AirlineDropoff: airlineDropoff })
    }

    render() {
        return (
            <div className="polaroid">
                <div className="container">
                    {/**
                        * Airport A Section
                    */}
                    <Select
                        placeholder="Choose Airport for Pick up"
                        onChange={this.handlePickupAirport}>
                        {
                            this.props.AirportData.map((airport) => {
                                return (
                                    <Option key={airport.id} value={airport.name} style={{ width: 400 }}>{airport.name}</Option>
                                )
                            })
                        }
                    </Select>
                    <hr />
                    <Select
                        placeholder="Choose Airline"
                        onChange={this.handlePickupAirline}>
                        {
                            this.props.AirlineData.map((airline) => {
                                return (
                                    <Option key={airline.id} value={airline.name} style={{ width: 400 }}>{airline.name}</Option>
                                )
                            })
                        }
                    </Select>
                    <hr />
                    <Input
                        prefix={<MdFlightTakeoff style={{ fontSize: '1.1em', color: '#1a1aff', paddingRight: '3px' }} />}
                        placeholder="Flight Number"
                        onChange={e => this.setState({ PickupFlightNumber: e.target.value })}
                    />
                    <hr />
                    <Row gutter={12}>
                        <Col span={12}>
                            <DatePicker
                                className="dp"
                                format="YYYY-MM-DD"
                                disabledDate={disabledDate}
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
                            <Slider step={1} max={48} onChange={this.handlePickupChangeTime} value={this.state.PickupTime} tipFormatter={null} />
                        </Col>
                        
                    </Row>
                    <hr />
                    <Select
                        placeholder="Choose Airport for Drop off"
                        onChange={this.handleDropoffAirport}>
                        {
                            this.props.AirportData.map((airport) => {
                                return (
                                    <Option key={airport.id} value={airport.name} style={{ width: 400 }}>{airport.name}</Option>
                                )
                            })
                        }
                    </Select>
                    <hr />
                    <Select
                        placeholder="Choose Airline"
                        onChange={this.handleDropoffAirline}>
                        {
                            this.props.AirlineData.map((airline) => {
                                return (
                                    <Option key={airline.id} value={airline.name} style={{ width: 400 }}>{airline.name}</Option>
                                )
                            })
                        }
                    </Select>
                    <hr />
                    <Input
                        prefix={<MdFlightTakeoff style={{ fontSize: '1.1em', color: '#1a1aff', paddingRight: '3px' }} />}
                        placeholder="Flight Number"
                        onChange={e => this.setState({ DropoffFlightNumber: e.target.value })}
                    />
                    <hr />
                    <Row gutter={12}>
                        <Col span={12}>
                            <DatePicker
                                className="dp"
                                format="YYYY-MM-DD"
                                disabledDate={disabledDate}
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
                            <Slider step={1} min={1} max={48} onChange={this.handleDropoffChangeTime} value={this.state.DropoffTime} tipFormatter={null} />
                        </Col>
                        
                    </Row>
                    <hr />
                    <InputNumber 
                        size="medium" 
                        min={1}  
                        placeholder="Luggage Quantity"
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
    const { user, AirportData, AirlineData } = state;
    return {
        user,
        AirportData,
        AirlineData
    }
}

export default connect(mapsStateToProps, { PassBookData, GetAirportData, GetAirlineData, GetLuggageData })(AirportToAirport);

