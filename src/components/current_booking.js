import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../App.css';
import axios from 'axios';
import * as moment from 'moment';
import ReactTable from 'react-table';
import { Input, Select, Button } from 'antd';
import { OrderASC, getStatus } from './helper';
import 'react-table/react-table.css';
import TiArrowLeftThick from 'react-icons/lib/ti/arrow-left-thick';
import TiArrowRightThick from 'react-icons/lib/ti/arrow-right-thick';


class CurrentBooking extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            res: [],
            page: 1,
            page_size: 5,
            isLoading: false
        }

        this.handlePageInput = this.handlePageInput.bind(this);
        this.loadBookingData = this.loadBookingData.bind(this);
        this.paginateDown = this.paginateDown.bind(this);
        this.paginateUp = this.paginateUp.bind(this);
    }

    componentWillMount() {
        this.GetBookingData();
    }

    async GetBookingData() {
        this.setState({ isLoading: true });

        const { Email } = this.props.user
            let url = `https://el3ceo7dwe.execute-api.us-west-1.amazonaws.com/dev/handler/AirportToHotel-get/${Email}`;
            await axios.get(url)
                .then((res) => {
                    if(res.data.result.length > 0){
                        for(var key in res.data.result){
                            if(key !== 'completed'){
                                res.data.result.splice(key,1)
                            }
                        }
                        OrderASC(res.data.result, 'date');
                        console.log(res.data.result)
                        this.setState({ data: res.data.result, isLoading: true })   
                    }
                }).catch((err) => {
                    console.log(err);
                })

            url = `https://el3ceo7dwe.execute-api.us-west-1.amazonaws.com/dev/handler/AirportToAirport-get/${Email}`;
            await axios.get(url)
                .then((res2) => {
                    if(res2.data.result.length > 0){
                        for(var key in res2.data.result){
                            if(key !== 'completed'){
                                res2.data.result.splice(key,1)
                            }
                        }
                        OrderASC(res2.data.result, 'date');
                        for(var i=0;i<res2.data.result.length;i++){
                            this.setState({ data: [...this.state.data, res2.data.result[i]] })    
                        }
                    }      
                }).catch((err) => {
                    console.log(err);
                })
            
            url = `https://el3ceo7dwe.execute-api.us-west-1.amazonaws.com/dev/handler/HotelToAirport-get/${Email}`;
            await axios.get(url)
                .then((res3) => {
                    if(res3.data.result.length > 0){
                        for(var key in res3.data.result){
                            if(key !== 'completed'){
                                res3.data.result.splice(key,1)
                            }
                        }
                        OrderASC(res3.data.result, 'date');
                        for(var i=0;i<res3.data.result.length;i++){
                            this.setState({ data: [...this.state.data, res3.data.result[i]] })    
                        }
                    }      
                }).catch((err) => {
                    console.log(err);
                })

            url = `https://el3ceo7dwe.execute-api.us-west-1.amazonaws.com/dev/handler/HotelToHotel-get/${Email}`;
            await axios.get(url)
                .then((res4) => {
                    if(res4.data.result.length > 0){
                        for(var key in res4.data.result){
                            if(key !== 'completed'){
                                res4.data.result.splice(key,1)
                            }
                        }
                        OrderASC(res4.data.result, 'date');
                        for(var i=0;i<res4.data.result.length;i++){
                            this.setState({ data: [...this.state.data, res4.data.result[i]] })    
                        }
                    }
                    this.setState({ isLoading: false });
                }).catch((err) => {
                    console.log(err);
                })
            await this.loadBookingData(this.state.page);
    }

    handlePageInput = (e) => {
        this.loadBookingData(e.target.value);
    }

    loadBookingData(page){
      this.setState({ isLoading: true });

      var arr = this.state.data.slice();
      var size = this.state.page_size;
      
      --page;
      this.setState({
        res: arr.splice(page * size, size),
      },()=>{
        this.setState({ isLoading: false })
      })
    }

    paginateDown (e) {
      e.preventDefault();
      this.setState({ isLoading: true })

      var arr = this.state.data.slice();
      var page = this.state.page-1;
      var size = this.state.page_size;
      
      --page;
      console.log(page+' '+size);
      this.setState({
        res: arr.splice(page * size, size),
        page: this.state.page-1
      },()=>{
        this.setState({ isLoading: false })
      })
    }

    paginateUp (e) {
      e.preventDefault();
      this.setState({ isLoading: true })

      var arr = this.state.data.slice();
      var page = this.state.page+1;
      var size = this.state.page_size;
      
      --page;
      console.log(page+' '+size);
      this.setState({
        res: arr.splice(page * size, size),
        page: this.state.page+1
      },()=>{
        this.setState({ isLoading: false })
      })
    }

    isFirstPage(){
        return (this.state.page == 1)
    }

    isLastPage(){
        return (this.state.page == Math.ceil(this.state.data.length/this.state.page_size) || this.state.data.length == 0)
    }

    renderPagination(){
        return (
            <div className="paginator" style={{ padding: "10px", width: "20%", position: "relative", margin: "auto" }}>
                <button
                    style={{ border: '0', background: 'none', cursor: 'pointer' }}
                    type="submit"
                    onClick={(e) => this.paginateDown(e)}
                    disabled={this.isFirstPage()} >
                    <TiArrowLeftThick style={{ fontSize: '1.1em', color: '#2a6fb3', margin: '0 10px'}} />
                </button>
                Page 
                <Input 
                    style={{ width: "40px", height: "20px", margin: "0 5px" }} 
                    defaultValue={this.state.page} 
                    value={this.state.page}
                    onChange={this.handlePageInput}
                    disabled={(this.state.data.length == 0)}/> 
                of {Math.ceil(this.state.data.length/this.state.page_size)}
                <button
                    style={{ border: '0', background: 'none', cursor: 'pointer' }}
                    type="submit"
                    onClick={(e) => this.paginateUp(e)}
                    disabled={this.isLastPage()}>
                    <TiArrowRightThick style={{ fontSize: '1.1em', color: '#2a6fb3', margin: '0 10px'}} />
                </button>
            </div>
        )
    }

    render() {
        const { res, isLoading } = this.state;
        let r = '';
        return(
                <div>
                    {
                        (isLoading) ? <i className="fa fa-spinner fa-spin" style={{ display: 'block', position: 'relative', padding: '20px 0', margin: 'auto', textAlign: 'center' }}></i> :
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
                                <div className="col-lg-2" style={{ margin: '18px 0', textAlign: 'center', display: 'inline-block', verticalAlign: 'middle', lineHeight: '120px'}}>
                                    <div className="row">
                                        <Button style={{ margin: '3px' }}>Edit</Button>
                                    </div>
                                    <div className="row">
                                        <Button className="luggage-blue" style={{ margin: '3px' }}>Cancel</Button>
                                    </div>
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
                    {
                        this.renderPagination()
                    }
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

export default connect(mapStateToProps, null)(CurrentBooking);