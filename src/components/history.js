import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import '../App.css';

import ATHHistory from './ath_history';
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
                <Link to="/home" style={{ color: 'white', margin: '2em' }}>
                    <button type="button" className="btn btn-danger">
                        Back to Home
                        </button>
                </Link>
                <div align="center">
                    <div>
                        <h1>Booking History</h1>
                    </div>
                    <div>
                        <Tabs>
                            <TabList>
                                <Tab>
                                    <span style={{ color: '#0066ff' }}>Airport</span> - <span style={{ color: '#999900' }}>Hotel</span>
                                </Tab>
                                <Tab>
                                    <span style={{ color: '#0066ff' }}>Hotel</span> - <span style={{ color: '#999900' }}>Airport</span>
                                </Tab>
                                <Tab>
                                    <span style={{ color: '#0066ff' }}>Hotel</span> - <span style={{ color: '#999900' }}>Hotel</span>
                                </Tab>
                                <Tab>
                                    <span style={{ color: '#0066ff' }}>Airport</span> - <span style={{ color: '#999900' }}>Airport</span>
                                </Tab>
                            </TabList>

                            <div className="history-bg-image">
                                <TabPanel>
                                    <ATHHistory />
                                </TabPanel>
                                <TabPanel>
                                    <HTAHistory />
                                </TabPanel>
                                <TabPanel>
                                    <HTHHistory />
                                </TabPanel>
                                <TabPanel>
                                    <ATAHistory />
                                </TabPanel>
                            </div>
                        </Tabs>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(History);