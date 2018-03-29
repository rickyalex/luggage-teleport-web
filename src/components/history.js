import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import '../App.css';
// import Navbar from './navbar';
import FixedNavbar from './fixed_navbar';
import CurrentBooking from './current_booking';
import HTAHistory from './hta_history';
import HTHHistory from './hth_history';
import ATAHistory from './ata_history';

class History extends Component {

    componentDidMount() {
        const token = localStorage.getItem('token');
        
        if (token === null || token === undefined) {
            this.props.history.push('/');
        }
    }

    render() {
        return (
            <div>
                < FixedNavbar />
                <div className="review_header">
                    <h3 style={{ color: 'white' }}>My Bookings</h3>
                    <hr style={{ border: '1px solid #fff' }} />
                </div>
                    <div className="containerHistory">
                        <Tabs>
                            <TabList>
                                <Tab>
                                    <span style={{ color: '#fed400' }}>Current Bookings</span>
                                </Tab>
                                <Tab>
                                    <span style={{ color: '#fed400' }}>Past Bookings</span>
                                </Tab>
                            </TabList>

                            <div>
                                <TabPanel className="currentBookings">
                                    <CurrentBooking />
                                </TabPanel>
                                <TabPanel>
                                    <HTAHistory />
                                </TabPanel>
                            </div>
                        </Tabs>
                    </div>
            </div>
        )
    }
}

export default withRouter(History);