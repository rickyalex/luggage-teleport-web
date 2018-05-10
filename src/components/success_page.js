import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import FixedNavbar from './fixed_navbar';
import '../App.css';
import { Icon, Button } from 'antd';

class SuccessPage extends Component {

    buttonHome(){
        return (
            <Link to="/" style={{ color: 'black' }}>
                <Button 
                    style={{ width: 200 }}
                    type="primary">
                    Back to Home
                </Button>
            </Link>
        )
    }

    render() {
        return (
            <div className="bg-image">
                <div>
                  < FixedNavbar />
                </div>
                <div className="containerProgressBar" style={{ marginTop: '1em' }}>
                    <div className="receipt">
                        <div className="row" style={{ marginBottom: '2em' }}>
                            <div className="col-lg-12" style={{ textAlign: 'center' }}>
                                <Icon type="check-circle" style={{ fontSize: 48, color: 'green' }}/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12" style={{ fontSize: 18, textAlign: 'center' }}>
                                Thank you for booking with us, we will process your request immediately
                            </div>
                        </div>
                    </div>
                    <br />
                    <div className="row" style={{ marginBottom: '2em' }}>
                        <div className="col-lg-12" style={{ textAlign: 'center' }}>
                            {this.buttonHome()}
                        </div>
                    </div>
                    
                </div>
            </div>
        )
    }
}

export default SuccessPage;