import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import '../App.css';
import axios from 'axios';
import FixedNavbar from './fixed_navbar';
import { Button, Icon, Input, Row, Col } from 'antd';
import {
    CognitoUserPool,
    AuthenticationDetails,
    CognitoUser
} from "amazon-cognito-identity-js";
import { MdPerson } from 'react-icons/lib/md';
import { getCurrentUser } from '../aws_cognito';

class Profile extends Component {

    constructor(props) {
        super(props);

        this.state = {
            firstname: getCurrentUser().pool.storage.CustName,
            lastname: '',
            phone: '',
            email: '',
            password: ''
        }

        this.SubmitProfileData = this.SubmitProfileData.bind(this);
    }

    changePassword(){
        // const user = new CognitoUser({ Username: email, Pool: userPool });
        // const authenticationData = { Username: email, Password: password };
        // const authenticationDetails = new AuthenticationDetails(authenticationData);
        // const oldPassword = 
        // user.changePassword(oldPassword, newPassword, function(err, result) {
        //     if (err) {
        //         alert(err);
        //         return;
        //     }
        //     console.log('call result: ' + result);
        // });
    }

    componentWillMount() {
        //this.GetUserData()
        
    }

    // async GetUserData() {
    //     const { Email } = this.props.user
    //         let url = `https://el3ceo7dwe.execute-api.us-west-1.amazonaws.com/dev/handler/Users-get/${Email}`;
    //         axios.get(url)
    //             .then((res) => {
    //                 if(res.data.result.length > 0){
    //                     this.setState({ data: res.data.result })   
    //                 }
    //             }).catch((err) => {
    //                 console.log(err);
    //             })
    // }

    readFile(file){

        console.log(file);
    }

    SubmitProfileData(e){
        e.preventDefault();
        const file = this.fileUpload.files[0];
        console.log(file);
    }


    render() {
        //const currentUser = getCurrentUser();
        return(
                <div>
                    < FixedNavbar />
                    <div className="review_header">
                        <h3 style={{ color: 'white' }}>Profile</h3>
                        <hr style={{ border: '1px solid #fff' }} />
                    </div>
                    <div className="containerProfile">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="profilePicture">
                                    <input 
                                        id="myInput" 
                                        type="file" 
                                        accept="image/*"
                                        onChange={ this.readFile } 
                                        ref={(ref) => this.fileUpload = ref} 
                                        style={{ display: 'none' }} />
                                    <img src="img/founder.png" onClick={(e) => this.fileUpload.click() } style={{ cursor: 'pointer'}}/>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                    <Row gutter={12} style={{ padding: '0.5em 2em' }}>
                                        <Col span={12}>
                                          <Input
                                            prefix={<MdPerson style={{ fontSize: '1.1em', color: '#1a1aff', paddingRight: '3px' }} />}
                                            value={this.state.firstname} />
                                        </Col>
                                        <Col span={12}>
                                            <Input
                                            value={this.state.lastname} />
                                        </Col>
                                    </Row>
                                    <Row gutter={12} style={{ padding: '0.5em 2em' }}>
                                        <Col span={24}>
                                          <Input
                                            prefix={<Icon type="phone" style={{ color: '#1a1aff', }} /> }
                                            value={this.state.phone} />
                                        </Col>
                                    </Row>
                                    <Row gutter={12} style={{ padding: '0.5em 2em' }}>
                                        <Col span={24}>
                                          <Input
                                            prefix={<Icon type="mail" style={{ color: '#1a1aff', }} /> }
                                            value={this.state.email} />
                                        </Col>
                                    </Row>
                                    <Row gutter={12} style={{ padding: '0.5em 2em' }}>
                                        <Col span={24}>
                                          <Input
                                            prefix={<Icon type="lock" style={{ color: '#1a1aff', }} /> }
                                            value={this.state.password} />
                                        </Col>
                                    </Row>
                                    <Link to="/" style={{ color: 'black' }}>
                                        <Button 
                                            onClick={(e) => this.SubmitProfileData(e)}
                                            type="primary" style={{ margin: '20px auto', display: 'block' }}>
                                            Save Profile
                                        </Button>
                                    </Link>
                                    
                            </div>
                        </div>
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

export default connect(mapStateToProps, null)(Profile);