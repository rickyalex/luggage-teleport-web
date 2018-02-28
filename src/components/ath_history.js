import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../App.css';
import axios from 'axios';
import * as moment from 'moment';
import ReactTable from 'react-table';
import { Select } from 'antd';
import { OrderASC, getStatus } from './helper';
import 'react-table/react-table.css';


class ATHHistory extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [{
                BookingId: '',
                airport: '',
                hotel: '',
                createdAt: '',
                TotalCost: 0
            }],
            isLoading: false
        }

        this.handleAction = this.handleAction.bind(this);
    }

    componentWillMount() {
        this.GetATHData()
    }

    GetATHData() {
        if(localStorage.admin !== 'Y') {
            const { Email } = this.props.user
            let url = `https://el3ceo7dwe.execute-api.us-west-1.amazonaws.com/dev/handler/AirportToHotel-get/${Email}`;
            axios.get(url)
                .then((res) => {
                    OrderASC(res.data.result, 'date');
                    this.setState({ data: res.data.result, isLoading: true })
                }).catch((err) => {
                    console.log(err);
                })
        }
        else{
            let url = `https://el3ceo7dwe.execute-api.us-west-1.amazonaws.com/dev/handler/AirportToHotel-scan`
            axios.get(url)
                .then((res) => {
                    OrderASC(res.data.result, 'date');
                    this.setState({ data: res.data.result, isLoading: true })
                }).catch((err) => {
                    console.log(err);
                })
        }
    }

    handleLoading() {
        if (this.state.data.length === 0) {
            this.setState({isLoading: true})
        } else if (this.state.data.length > 0) {
            this.setState({isLoading: false})
        }
    }

    handleAction(row, value) {
        let token = localStorage.getItem('token')
        let config = {
            headers: {
                'Authorization': `AWS4-HMAC-SHA256 Credential=AKIAJE6XVHDQZ2RWFHDA/20180228/us-west-1/execute-api/aws4_request, SignedHeaders=content-length;content-type;host;x-amz-date, Signature=72fb1b462d06ce362291e8ce23292f8eb902c9650d466c0e7361090b65335e22`,
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Amz-Date': '20180228T053921Z'
            }
        }
        let id = row.original.id
        let currentStatus = value
        let url = `https://el3ceo7dwe.execute-api.us-west-1.amazonaws.com/dev/handler/AirportToHotel-update/${id}?status=${currentStatus}`;
        this.setState({ isLoading: true })

        axios.put(url, null, config)
            .then((response) => {
                alert('successfully updated!')
            }, (err) => {
                console.log(err)
                this.setState({ isLoading: false })
            })
    }

    handleAiport(airport) {
        this.setState({
            Airport: airport
        })
    }


    render() {
        const { data, isLoading } = this.state;
        const Option = Select.Option;
        return (
            <div>
                <ReactTable
                    data={data}
                    noDataText="No Booking Data"
                    columns={[{
                        Header: 'Id',
                        accessor: 'id'
                    },
                    {
                        Header: 'Booking Id',
                        accessor: 'BookingId'
                    },
                    {
                        Header: 'Airport',
                        accessor: 'airport'
                    },
                    {
                        Header: 'Hotel',
                        accessor: 'hotel'
                    }, 
                    {
                        id: 'createdAt',
                        Header: 'Booked At',
                        accessor: d => moment(d.createdAt).format('DD MMM YYYY, HH:mm')
                    },
                    {
                        id: 'TotalCost',
                        Header: 'Total Cost',
                        accessor: d => `${'$'}${d.TotalCost}`
                    },
                    {
                        Header: 'Status',
                        accessor: 'status'

                    },
                    {
                        Header: 'Action',
                        Cell: row => (<Select
                            style={{ width: 260 }}
                            placeholder="Choose Status to Update"
                            onChange={(e) => this.handleAction(row, e)}>
                            {
                                getStatus().map((status) => {
                                    return <Option key={status.id} style={{ width: 260 }} value={status.name}>{status.name}</Option>
                                })
                            }
                            </Select>)
                    }]}
                    defaultPageSize={10}
                    className="-striped -highlight"
                    style={{ backgroundColor: 'white' }}
                />
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

export default connect(mapStateToProps, null)(ATHHistory);