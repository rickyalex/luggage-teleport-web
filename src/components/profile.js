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
            firstname: localStorage.getItem('CustName').split(' ')[0],
            lastname: localStorage.getItem('CustName').split(' ')[1],
            phone: localStorage.getItem('PhoneNumber'),
            email: localStorage.getItem('email'),
            password: '',
            img: 'https://s3-us-west-1.amazonaws.com/luggageteleport.net/img/default_picture.png',
            isLoading: false
        }

        this.SubmitProfileData = this.SubmitProfileData.bind(this);
        this.readFile = this.readFile.bind(this);
        console.log(this.state)
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

    readFile(e){
        this.setState({ isLoading: true })

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
          this.setState({
            file: e,
            img: reader.result,
            isLoading: false
          });
        }

        reader.readAsDataURL(file)
    }

    SubmitProfileData(e){
        e.preventDefault();
        const file = this.fileUpload.files[0];
        console.log(file);
    }

    onSubmit(e) {
        e.preventDefault();

        fetch("https://luggageteleport.net.s3.amazonaws.com", {
            headers: {
                'Accept': 'application/text',
                'Content-Type': 'application/text'
            },
            body: JSON.stringify({description: this.state.description})
        });

        this.setState({description: ''});
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
                        <form action="https://luggageteleport.net.s3.amazonaws.com" method="post" enctype="multipart/form-data">
                        <div className="row">
                            <div className="col-lg-12">
                                
                                <input type="hidden" name="Content-Type" value="image/png" />
                                  <input type="hidden" name="AWSAccessKeyId" value="" />
                                  <input type="hidden" name="acl" value="public-read" />
                                  <input type="hidden" name="success_action_status" value="201" />
                                  <input type="hidden" name="policy" value="" />
                                  <input type="hidden" name="signature" value="" />
                                <div className="profilePicture">
                                    <input 
                                        id="myInput"
                                        name="file" 
                                        type="file" 
                                        accept="image/*"
                                        onChange={ this.readFile } 
                                        ref={(ref) => this.fileUpload = ref} 
                                        style={{ display: 'none' }} />
                                    <img src={this.state.img} onClick={(e) => this.fileUpload.click() } style={{ cursor: 'pointer' }}/>
                                </div>
                                
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                    <Row gutter={12} style={{ padding: '0.5em 2em' }}>
                                        <Col span={12}>
                                          <Input
                                            disabled={true}
                                            addonBefore={<Icon type="user" style={{ color: 'white', }} /> }
                                            value={this.state.firstname} />
                                        </Col>
                                        <Col span={12}>
                                            <Input
                                            disabled={true}
                                            value={this.state.lastname} />
                                        </Col>
                                    </Row>
                                    <Row gutter={12} style={{ padding: '0.5em 2em' }}>
                                        <Col span={24}>
                                          <Input
                                            disabled={true}
                                            addonBefore={<Icon type="phone" style={{ color: 'white', }} /> }
                                            value={this.state.phone} 
                                            suffix={<Icon type="edit" style={{ color: '#1a1aff', }} /> }
                                            />
                                        </Col>
                                    </Row>
                                    <Row gutter={12} style={{ padding: '0.5em 2em' }}>
                                        <Col span={24}>
                                          <Input
                                            disabled={true}
                                            addonBefore={<Icon type="mail" style={{ color: 'white', }} /> }
                                            value={this.state.email} 
                                            suffix={<Icon type="edit" style={{ color: '#1a1aff', }} /> }
                                            />
                                        </Col>
                                    </Row>
                                    <Row gutter={12} style={{ padding: '0.5em 2em' }}>
                                        <Col span={24}>
                                          <Input
                                            disabled={true}
                                            addonBefore={<Icon type="lock" style={{ color: 'white', }} /> }
                                            value={this.state.password} 
                                            type="password"
                                            value="wedus"
                                            suffix={<Icon type="edit" style={{ color: '#1a1aff', }} /> }
                                            />
                                        </Col>
                                    </Row>
                                    
                                        {
                                            !this.state.isLoading ?
                                                <Button 
                                                    type="primary" style={{ margin: '20px auto', display: 'block' }}>
                                                    Save Profile
                                                </Button>

                                                :
                                                <Button 
                                                    type="primary" style={{ margin: '20px auto', display: 'block' }}
                                                    disabled={true}
                                                >
                                                    <i className="fa fa-spinner fa-spin" style={{ textAlign: 'center' }}></i>
                                                </Button>
                                        }
                                    
                                
                            </div>
                        </div>
                        </form>
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
