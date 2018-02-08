import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../App.css';
import axios from 'axios';
import * as moment from 'moment';
import ReactTable from 'react-table';
import { OrderASC } from './helper';
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
    }

    componentWillMount() {
        this.GetATHData()
    }

    GetATHData() {
        const { Email } = this.props.user
        axios.get(`https://el3ceo7dwe.execute-api.us-west-1.amazonaws.com/dev/handler/AirportToHotel-get/${Email}`)
            .then((res) => {
                OrderASC(res.data.result, 'date');
                this.setState({ data: res.data.result, isLoading: true })
            }).catch((err) => {
                console.log(err);
            })
    }

    handleLoading() {
        if (this.state.data.length === 0) {
            this.setState({isLoading: true})
        } else if (this.state.data.length > 0) {
            this.setState({isLoading: false})
        }
    }


    render() {
        const { data, isLoading } = this.state;
        return (
            <div>
                <ReactTable
                    data={data}
                    noDataText="No Booking Data"
                    columns={[{
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
                    }, {
                        id: 'createdAt',
                        Header: 'Booked At',
                        accessor: d => moment(d.createdAt).format('DD MMM YYYY, HH:mm')
                    },
                    {
                        id: 'TotalCost',
                        Header: 'Total Cost',
                        accessor: d => `${'$'}${d.TotalCost}`
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