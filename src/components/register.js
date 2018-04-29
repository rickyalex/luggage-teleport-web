import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { signUpUser } from '../aws_cognito';
import { cognito } from '../config';
import {
    CognitoUserPool,
    CognitoUserAttribute,
    CognitoIdentityServiceProvider,
    AuthenticationDetails,
    CognitoUser
} from "amazon-cognito-identity-js";
import { Input, Form, Row, Col, Button } from 'antd';
import '../App.css';

const FormItem = Form.Item;

class Register extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            email: '',
            phone_number: '',
            password: '',
            confirmPassword: '',
            newUser: null,
            error: {
                message: ''
            },
            isLoading: false,
            FirstName: '',
            LastName: '',
            countryCode: ''
        }

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    validateForm() {
        return (
            this.state.email.length > 0 &&
            this.state.password.length >= 8 &&
            this.state.password === this.state.confirmPassword
        );
    }

    signup(name, email, phone_number, password) {
        const userPool = new CognitoUserPool({
            UserPoolId: cognito.USER_POOL_ID,
            ClientId: cognito.CLIENT_ID
        });
        const attributeList = []
        const dataEmail = {
            Name: 'email',
            Value: email
        }
        const dataName = {
            Name: 'name',
            Value: name
        }
        const dataPhoneNumber = {
            Name: 'phone_number',
            Value: phone_number
        }

        const attributeEmail = new CognitoUserAttribute(dataEmail);
        const attributeName = new CognitoUserAttribute(dataName);
        const attributePhoneNumber = new CognitoUserAttribute(dataPhoneNumber);
        attributeList.push(attributeEmail, attributeName, attributePhoneNumber);

        return new Promise((resolve, reject) =>
            userPool.signUp(email, password, attributeList, null, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result.user);
            })
        );
    }

    async handleSubmit(event) {
        event.preventDefault();
        this.setState({ isLoading: true })
        const phoneNumber = this.state.phone_number.replace(/\s/g, '')
        localStorage.setItem('EmailRegist', `${this.state.email}`);
        let name = this.state.FirstName+' '+this.state.LastName;
        let phone = this.state.countryCode+phoneNumber;
        try {
            const newUser = await this.signup(name, this.state.email, phone, this.state.password);
            alert('Thank you for the registration. We have sent a verification email to your email address')
            this.props.history.push('/verify');
        } catch (e) {
            this.setState({
                error: e,
                isLoading: false
            })
            alert(this.state.error.message);
        }

    }

    render() {
        const { isLoading } = this.state;
        return (
            <div align="center">
                    <Form onSubmit={this.handleSubmit} style={{position: 'relative', top: "100px", margin: 'auto'}}>
                        <h3 style={{ color: 'yellow'}}>Register your Account</h3>
                        <FormItem style={{ width: '280px' }}>
                            <Input
                                type="text"
                                onChange={e => this.setState({ FirstName: e.target.value })}
                                placeholder="First Name" />
                        </FormItem>
                        <FormItem style={{ width: '280px' }}>
                            <Input
                                type="text"
                                onChange={e => this.setState({ LastName: e.target.value })}
                                placeholder="Last Name" />
                        </FormItem>
                        <FormItem style={{ width: '280px' }}>
                            <Input
                                type="email"
                                onChange={e => this.setState({ email: e.target.value })}
                                placeholder="Email" />
                        </FormItem>
                                <FormItem style={{ display: 'inline-block', width: '50px', marginRight: '5px' }}>
                                    <Input
                                        type="text"
                                        onChange={e => this.setState({ countryCode: e.target.value })}
                                        placeholder="+1" />
                                </FormItem>
                                <FormItem style={{ display: 'inline-block', width: '225px' }}>
                                    <Input
                                        type="text"
                                        onChange={e => this.setState({ phone_number: e.target.value })}
                                        placeholder="Phone Number" />
                                </FormItem>
                        
                        <FormItem style={{ width: '280px' }}>
                            <Input
                                type="password"
                                onChange={e => this.setState({ password: e.target.value })}
                                placeholder="Password" />
                        </FormItem>
                        <FormItem style={{ width: '280px' }}>
                            <Input
                                type="password"
                                onChange={e => this.setState({ confirmPassword: e.target.value })}
                                placeholder="Confirm Password" />
                        </FormItem>
                        {
                            !isLoading ?
                                <Button
                                    type="primary"
                                    disabled={!this.validateForm()}
                                    htmlType="submit"
                                >
                                    Register
                                </Button>
                                :
                                <Button
                                    type="primary"
                                    disabled={true}
                                >
                                    <i className="fa fa-spinner fa-spin" style={{ textAlign: 'center' }}></i>
                                </Button>
                        }
                        <div style={{ marginTop: '1em' }}>
                            <p><strong>Already Have an Account?</strong><Link to="/"> <a style={{ color: 'white' }}>Sign In</a></Link></p>
                        </div>
                    </Form>
            </div>
        )
    }
}

export default Register;