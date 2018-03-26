import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../App.css';
import axios from 'axios';
import * as moment from 'moment';
import ReactTable from 'react-table';
import { Select } from 'antd';
import { OrderASC, getStatus } from './helper';
import 'react-table/react-table.css';


class CurrentBooking extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [{
                BookingId: '',
                airport: '',
                hotel: '',
                createdAt: '',
                TotalCost: 0,
                PickupDate: ''
            }],
            isLoading: false
        }
    }

    componentWillMount() {
        this.GetBookingData()
    }

    async GetBookingData() {
        const { Email } = this.props.user
            let url = `https://el3ceo7dwe.execute-api.us-west-1.amazonaws.com/dev/handler/AirportToHotel-get/${Email}`;
            axios.get(url)
                .then((res) => {
                    if(res.data.result.length > 0){
                        OrderASC(res.data.result, 'date');
                        this.setState({ data: res.data.result, isLoading: true })   
                    }
                }).catch((err) => {
                    console.log(err);
                })

            url = `https://el3ceo7dwe.execute-api.us-west-1.amazonaws.com/dev/handler/AirportToAirport-get/${Email}`;
            axios.get(url)
                .then((res2) => {
                    if(res2.data.result.length > 0){
                        OrderASC(res2.data.result, 'date');
                        for(var i=0;i<res2.data.result.length;i++){
                            this.setState({ data: [...this.state.data, res2.data.result[i]] })    
                        }
                    }      
                }).catch((err) => {
                    console.log(err);
                })
            
            url = `https://el3ceo7dwe.execute-api.us-west-1.amazonaws.com/dev/handler/HotelToAirport-get/${Email}`;
            axios.get(url)
                .then((res3) => {
                    if(res3.data.result.length > 0){
                        OrderASC(res3.data.result, 'date');
                        for(var i=0;i<res3.data.result.length;i++){
                            this.setState({ data: [...this.state.data, res3.data.result[i]] })    
                        }
                    }      
                }).catch((err) => {
                    console.log(err);
                })

            url = `https://el3ceo7dwe.execute-api.us-west-1.amazonaws.com/dev/handler/HotelToHotel-get/${Email}`;
            axios.get(url)
                .then((res4) => {
                    if(res4.data.result.length > 0){
                        OrderASC(res4.data.result, 'date');
                        for(var i=0;i<res4.data.result.length;i++){
                            this.setState({ data: [...this.state.data, res4.data.result[i]] })    
                        }
                    }    
                }).catch((err) => {
                    console.log(err);
                })
    }


    render() {
        const { data, isLoading } = this.state;
        let r = '';
        return(
                <div>
                    {
                        data.map((datas, i) =>  
                            <div style={{ padding: '10px', margin: '0', height: '130px' }} className={i%2==0 ? "row odd" : "row even"}>
                                <div className="col-lg-9">
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="row">
                                                <div className="col-lg-3">
                                                    <span className="rowLabel" style={{ color: '#00a8ec' }}>
                                                        Booking ID :
                                                    </span>
                                                </div>
                                                <div className="col-lg-9">
                                                    <span className="rowLabel">
                                                        { data[i].BookingId }
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="row">
                                                <div className="col-lg-3">
                                                    <span className="rowLabel">
                                                        { data[i].airport }
                                                    </span>
                                                </div>
                                                <div className="col-lg-9">
                                                    <span className="rowLabel">
                                                        { data[i].pickupDate }
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="row">
                                                <div className="col-lg-3">
                                                    <span className="rowLabel">
                                                        { data[i].hotel }
                                                    </span>
                                                </div>
                                                <div className="col-lg-9">
                                                    <span className="rowLabel">
                                                        { data[i].dropoffDate }
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-3" style={{ textAlign: 'center', borderLeft: '1px solid #ccc', display: 'inline-block', verticalAlign: 'middle', lineHeight: '120px'}}>
                                    <span className="rowLabel" style={{ fontSize: 18 }}>
                                        { data[i].status }
                                    </span>
                                </div>
                            </div>
                        )}
                    }
                </div>
        )
    }
}

function mapStateToProps(state) {
    const { user } = state;
    return {
        user
    }
}

export default connect(mapStateToProps, null)(CurrentBooking);