import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import '../App.css';
import { Link } from 'react-router-dom';

import AirportToHotel from './airport_to_hotel';
import HotelToAirport from './hotel_to_airport';
import HotelToHotel from './hotel_to_hotel';
import AirportToAirport from './airport_to_airport';

import MdLocalAirport from 'react-icons/lib/md/local-airport';
import MdHotel from 'react-icons/lib/md/hotel';
import GoArrowSmallRight from 'react-icons/lib/go/arrow-small-right';

class BookingForm extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div align="center">

                <div>

                    <Tabs>
                        <TabList>
                            <Tab data-tip="Airport - Hotel">
                                <MdLocalAirport style={{ fontSize: '1.1em', color: '#2a6fb3' }} />
                                <GoArrowSmallRight />
                                <MdHotel style={{ fontSize: '1.1em', color: '#f1cf46' }} />
                            </Tab>
                            <Tab data-tip="Hotel - Airport">
                                <MdHotel style={{ fontSize: '1.1em', color: '#2a6fb3' }} />
                                <GoArrowSmallRight />
                                <MdLocalAirport style={{ fontSize: '1.1em', color: '#f1cf46' }} />
                            </Tab>
                            <Tab data-tip="Hotel - Hotel">
                                <MdHotel style={{ fontSize: '1.1em', color: '#2a6fb3' }} />
                                <GoArrowSmallRight />
                                <MdHotel style={{ fontSize: '1.1em', color: '#f1cf46' }} />
                            </Tab>
                            <Tab data-tip="Airport - Airport">
                                <MdLocalAirport style={{ fontSize: '1.1em', color: '#2a6fb3' }} />
                                <GoArrowSmallRight />
                                <MdLocalAirport style={{ fontSize: '1.1em', color: '#f1cf46' }} />
                            </Tab>
                        </TabList>

                        <div>
                            <center>
                                <TabPanel>
                                    <AirportToHotel />
                                </TabPanel>
                                <TabPanel>
                                    <HotelToAirport />
                                </TabPanel>
                                <TabPanel>
                                    <HotelToHotel />
                                </TabPanel>
                                <TabPanel>
                                    <AirportToAirport />
                                </TabPanel>
                            </center>
                        </div>
                    </Tabs>
                </div>
            </div>
        )
    }

}

export default BookingForm;