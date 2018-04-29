import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import '../App.css';
import axios from 'axios';
import FixedNavbar from './fixed_navbar';
import { Button, Icon, Input, Row, Col, Form } from 'antd';
import {
    CognitoUserPool,
    AuthenticationDetails,
    CognitoUser
} from "amazon-cognito-identity-js";
import { MdPerson } from 'react-icons/lib/md';
import { getCurrentUser } from '../aws_cognito';
import { s3 } from '../config';
//import ReactS3 from 'react-s3';
import { Storage } from "aws-amplify";

const FormItem = Form.Item;

class Profile extends Component {

    constructor(props) {
        super(props);

        this.state = {
            firstname: localStorage.getItem('CustName').split(' ')[0],
            lastname: localStorage.getItem('CustName').split(' ')[1],
            phone: localStorage.getItem('PhoneNumber'),
            email: localStorage.getItem('email'),
            password: '',
            img: localStorage.getItem('img') || 'https://s3-us-west-1.amazonaws.com/luggageteleport.net/img/default_img.png',
            tempFile: '',
            isLoading: false,
            isPreview: false
        }

        this.SubmitProfileData = this.SubmitProfileData.bind(this);
        this.readFile = this.readFile.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
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
        // axios.get('https://el3ceo7dwe.execute-api.us-west-1.amazonaws.com/dev/handler/Users-get/'+this.state.email)
        //             .then((res) => {
        //                 //console.log(res.data.result[0].img);
        //                 //localStorage.setItem('img', res.data.result[0].img);
        //                 this.setState({
        //                     img: res.data.result[0].img
        //                 })
        //             }).catch((err) => {
        //                 console.log(err)
        //             })
        
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
            tempFile: reader.result,
            img: file,
            isPreview: true,
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

    onSubmit(e){
        e.preventDefault();
        this.setState({ isLoading: true })

        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var filename = "";
        var publicPath = "";

        for (var i = 0; i < 16; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));

        const file = this.state.img;
        filename = text+'.jpeg';
        publicPath = s3.LINK+filename;

        try{
            Storage.put(filename, file, {
                contentType: 'image/jpeg'
            })
            .then (result => {
                let token = localStorage.getItem('token');
                let email = localStorage.getItem('email');
                let data = {
                    Item: {
                        img: publicPath,
                        email: email
                    }
                };

                let config = {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }

                axios.post('https://el3ceo7dwe.execute-api.us-west-1.amazonaws.com/dev/handler/Users-create', JSON.stringify(data.Item), config)
                .then((res) => {
                    localStorage.setItem('img', publicPath);
                    this.setState({ isLoading: false })
                }).catch((err) => {
                    console.log(err)
                })
            })
            .catch(err => console.log(err));
        }
        catch(e){
            console.log(e); 
        }
        
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
                        <Form onSubmit={(e) => this.onSubmit(e)}>
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="profilePicture">
                                    <FormItem>
                                        <input 
                                        id="myInput"
                                        name="file" 
                                        type="file" 
                                        accept="image/jpeg"
                                        onChange={ this.readFile } 
                                        ref={(ref) => this.fileUpload = ref} 
                                        style={{ display: 'none' }} />
                                    </FormItem>
                                    <img src={(this.state.isPreview) ? this.state.tempFile : this.state.img} onClick={(e) => this.fileUpload.click() } style={{ cursor: 'pointer' }}/>
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
                                                    htmlType="submit"
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
                        </Form>
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
