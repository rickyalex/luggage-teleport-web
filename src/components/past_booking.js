import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../App.css';
import axios from 'axios';
import * as moment from 'moment';
import ReactTable from 'react-table';
import { Select, Pagination, Button } from 'antd';
import { OrderASC, getStatus } from './helper';
import 'react-table/react-table.css';


class PastBooking extends Component {

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
            res: [],
            isLoading: false
        }

        this.paginate = this.paginate.bind(this);
    }

    componentWillMount() {
        this.GetBookingData()
    }

    async GetBookingData() {
        this.setState({ isLoading: true });

        const { Email } = this.props.user
            let url = `https://el3ceo7dwe.execute-api.us-west-1.amazonaws.com/dev/handler/AirportToHotel-get/${Email}`;
            await axios.get(url)
                .then((res) => {
                    let data = res.data.result
                    if(data.length > 0){
                        for(var i = 0; i < data.length; i++){
                            if(String(data[i].status).toLowerCase() == "completed"){
                                OrderASC(data, 'date');
                                this.setState({ data: [...this.state.data, data[i]] })    
                            }
                        } 
                    }
                }).catch((err) => {
                    console.error(err);
                })

            url = `https://el3ceo7dwe.execute-api.us-west-1.amazonaws.com/dev/handler/AirportToAirport-get/${Email}`;
            await axios.get(url)
                .then((res2) => {
                    let data = res2.data.result
                    if(data.length > 0){
                        for(var i = 0; i < data.length; i++){
                            if(String(data[i].status).toLowerCase() == "completed"){
                                OrderASC(data, 'date');
                                this.setState({ data: [...this.state.data, data[i]] })    
                            }
                        }
                    }      
                }).catch((err) => {
                    console.error(err);
                })
            
            url = `https://el3ceo7dwe.execute-api.us-west-1.amazonaws.com/dev/handler/HotelToAirport-get/${Email}`;
            await axios.get(url)
                .then((res3) => {
                    let data = res3.data.result
                    if(data.length > 0){
                        for(var i = 0; i < data.length; i++){
                            if(String(data[i].status).toLowerCase() == "completed"){
                                OrderASC(data, 'date');
                                this.setState({ data: [...this.state.data, data[i]] })    
                            }
                        }
                    }      
                }).catch((err) => {
                    console.error(err);
                })

            url = `https://el3ceo7dwe.execute-api.us-west-1.amazonaws.com/dev/handler/HotelToHotel-get/${Email}`;
            await axios.get(url)
                .then((res4) => {
                    let data = res4.data.result
                    if(data.length > 0){
                        for(var i = 0; i < data.length; i++){
                            if(String(data[i].status).toLowerCase() == "completed"){
                                OrderASC(data, 'date');
                                this.setState({ data: [...this.state.data, data[i]] })    
                            }
                        }
                    }    
                }).catch((err) => {
                    console.error(err);
                })

            await this.paginate(1,5);
    }

    paginate (page_number, page_size) {
      
      var arr = this.state.data.slice();
      
      
      --page_number;
      console.log(page_number+' '+page_size);
      this.setState({
        res: arr.splice(page_number * page_size, 5)
      },()=>{
        console.log(this.state);
      })
    }


    render() {
        const { res, isLoading } = this.state;
        let r = '';
        return(
                <div>
                    {
                        res.map((datas, i) =>  
                            <div style={{ padding: '10px', margin: '0', height: 'auto' }} className={i%2==0 ? "row odd" : "row even"}>
                                <div className="col-lg-9">
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="row">
                                                <div className="col-lg-4">
                                                    <span className="rowLabel" style={{ color: '#00a8ec' }}>
                                                        Booking ID :
                                                    </span>
                                                </div>
                                                <div className="col-lg-8">
                                                    <span className="rowLabel">
                                                        { res[i].BookingId }
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="row">
                                                <div className="col-lg-4">
                                                    <span className="rowLabel">
                                                        { res[i].airport }
                                                    </span>
                                                </div>
                                                <div className="col-lg-8">
                                                    <span className="rowLabel">
                                                        { res[i].pickupDate }
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="row">
                                                <div className="col-lg-4">
                                                    <span className="rowLabel">
                                                        { res[i].hotel }
                                                    </span>
                                                </div>
                                                <div className="col-lg-8">
                                                    <span className="rowLabel">
                                                        { res[i].dropoffDate }
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/*
                                <div className="col-lg-3" style={{ textAlign: 'center', borderLeft: '1px solid #ccc', display: 'inline-block', verticalAlign: 'middle', lineHeight: '120px'}}>
                                    <Button>Edit</Button>
                                    <Button>Cancel</Button>
                                </div>
                                */}
                                <div className="col-lg-3" style={{ textAlign: 'center', borderLeft: '1px solid #ccc', display: 'inline-block', verticalAlign: 'middle', lineHeight: '120px'}}>
                                    <span className="rowLabel" style={{ fontSize: 18 }}>
                                        { res[i].status }
                                    </span>
                                </div>
                            </div>
                        )
                    }
                    <div style={{ width: '100%' }}>
                        <Pagination simple onChange={this.paginate} defaultCurrent={1} defaultPageSize={5} total={this.state.data.length} style={{ width: '20%', margin: 'auto', padding: '5px' }} />
                    </div>
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

export default connect(mapStateToProps, null)(PastBooking);