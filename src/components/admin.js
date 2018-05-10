import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import '../App.css';

class Admin extends Component {

    componentDidMount() {
        const token = localStorage.getItem('token');
        
        if (token === null || token === undefined) {
            this.props.history.push('/');
        }
        else if(localStorage.admin !== "Y"){
            alert('You are not authorized to view this page');
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
                        <h1>Admin</h1>
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
                                    
                                </TabPanel>
                                <TabPanel>
                                    
                                </TabPanel>
                                <TabPanel>
                                    
                                </TabPanel>
                                <TabPanel>
                                    
                                </TabPanel>
                            </div>
                        </Tabs>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Admin);