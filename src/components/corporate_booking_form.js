import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import '../App.css';
import { Link } from 'react-router-dom';

import CorporateForm from './corporate_form';

import MdLocalAirport from 'react-icons/lib/md/local-airport';
import MdHotel from 'react-icons/lib/md/hotel';
import GoArrowSmallRight from 'react-icons/lib/go/arrow-small-right';

class CorporateBookingForm extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div align="center">

                <div>

                    <Tabs>
                        <TabList>
                            <Tab data-tip="Hotel - Hotel">
                                <MdHotel style={{ fontSize: '1.1em', color: '#1a1aff' }} />
                                <GoArrowSmallRight />
                                <MdHotel style={{ fontSize: '1.1em', color: '#e6e600' }} />
                            </Tab>
                        </TabList>

                        <div>
                            <center>
                                <TabPanel>
                                    <CorporateForm />
                                </TabPanel>
                            </center>
                        </div>
                    </Tabs>
                </div>
            </div>
        )
    }

}

export default CorporateBookingForm;