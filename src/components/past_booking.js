import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../App.css';
import axios from 'axios';
import { Input } from 'antd';
import { OrderASC } from './helper';
import 'react-table/react-table.css';
import TiArrowLeftThick from 'react-icons/lib/ti/arrow-left-thick';
import TiArrowRightThick from 'react-icons/lib/ti/arrow-right-thick';

class PastBooking extends Component {

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
                            if(String(data[i].status).toLowerCase() === "order being processed"){
                                console.log(i);
                                data.splice(i,1);
                            }
                        } 
                        OrderASC(data, 'date');
                        this.setState({ data: data })    
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
                            if(String(data[i].status).toLowerCase() !== "completed"){
                                console.log(data[i]);
                                data.splice(i,1);
                            }
                        }
                        OrderASC(data, 'date');
                        for(var i=0;i<data.length;i++){
                            this.setState({ data: [...this.state.data, data[i]] })    
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
                            if(String(data[i].status).toLowerCase() !== "completed"){
                                console.log(data[i]);
                                data.splice(i,1);
                            }
                        }
                        OrderASC(data, 'date');
                        for(var i=0;i<data.length;i++){
                            this.setState({ data: [...this.state.data, data[i]] })    
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
                            if(String(data[i].status).toLowerCase() !== "completed"){
                                console.log(data[i]);
                                data.splice(i,1);
                            }
                        }
                        OrderASC(data, 'date');
                        for(var i=0;i<data.length;i++){
                            this.setState({ data: [...this.state.data, data[i]] })    
                        }
                    }   
                    this.setState({ isLoading: false },()=>{
                        console.log(this.state.data)
                    }); 
                }).catch((err) => {
                    console.error(err);
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
        this.setState({ isLoading: false });
      })
    }

    paginateDown (e) {
      e.preventDefault();
      this.setState({ isLoading: true });

      var arr = this.state.data.slice();
      var page = this.state.page-1;
      var size = this.state.page_size;
      
      --page;
      console.log(page+' '+size);
      this.setState({
        res: arr.splice(page * size, size),
        page: this.state.page-1
      },()=>{
        this.setState({ isLoading: false });
      })
    }

    paginateUp (e) {
      e.preventDefault();
      this.setState({ isLoading: true });

      var arr = this.state.data.slice();
      var page = this.state.page+1;
      var size = this.state.page_size;
      
      --page;
      console.log(page+' '+size);
      this.setState({
        res: arr.splice(page * size, size),
        page: this.state.page+1
      },()=>{
        this.setState({ isLoading: false });
      })
    }

    isFirstPage(){
        return (this.state.page === 1)
    }

    isLastPage(){
        return (this.state.page === Math.ceil(this.state.data.length/this.state.page_size) || this.state.data.length === 0)
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
                    disabled={(this.state.data.length === 0)}/> 
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
        return(
                <div>
                    {
                        (isLoading) ? <i className="fa fa-spinner fa-spin" style={{ display: 'block', position: 'relative', padding: '20px 0', margin: 'auto', textAlign: 'center' }}></i> :
                        res.map((datas, i) =>  
                            <div style={{ padding: '10px', margin: '0', height: 'auto' }} className={i%2===0 ? "row odd" : "row even"}>
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
                                                        { 
                                                            (res[i].bookingType==="ATH") ? res[i].airport : 
                                                            (res[i].bookingType==="ATA") ? res[i].AirportPickup : 
                                                            (res[i].bookingType==="HTA") ? res[i].hotel : 
                                                            (res[i].bookingType==="HTH") ? res[i].HotelPickup : <span></span>
                                                        }
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
                                                        { 
                                                            (res[i].bookingType==="ATH") ? res[i].hotel : 
                                                            (res[i].bookingType==="ATA") ? res[i].AirportDropoff : 
                                                            (res[i].bookingType==="HTA") ? res[i].airport : 
                                                            (res[i].bookingType==="HTH") ? res[i].HotelDropoff : <span></span>
                                                        }
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

export default connect(mapStateToProps, null)(PastBooking);