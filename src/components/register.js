import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { signUpUser } from '../aws_cognito';
import { USER_POOL_ID, CLIENT_ID } from '../config';
import {
    CognitoUserPool,
    CognitoUserAttribute,
    CognitoIdentityServiceProvider,
    AuthenticationDetails,
    CognitoUser
} from "amazon-cognito-identity-js";
import { Input, Form } from 'antd';
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
            isLoading: false
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
            UserPoolId: USER_POOL_ID,
            ClientId: CLIENT_ID
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
        try {
            const newUser = await this.signup(this.state.name, this.state.email, phoneNumber, this.state.password);
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
            <div className="bg-image" align="center">
                    <Form onSubmit={this.handleSubmit} style={{marginTop: 70}}>
                        <h3 style={{ color: 'yellow'}}>Register your Account</h3>
                        <FormItem style={{ width: '280px' }}>
                            <Input
                                type="text"
                                onChange={e => this.setState({ name: e.target.value })}
                                placeholder="Full Name" />
                        </FormItem>
                        <FormItem style={{ width: '280px' }}>
                            <Input
                                type="email"
                                onChange={e => this.setState({ email: e.target.value })}
                                placeholder="Email" />
                        </FormItem>
                        <FormItem style={{ width: '280px' }}>
                            <Input
                                type="text"
                                onChange={e => this.setState({ phone_number: e.target.value })}
                                placeholder="Phone Number, ex: +1XXXXXXXX" />
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

                        <div>
                            <p><strong>Notes! </strong>
                                <i className="registerNotes">
                                    Password <strong>must</strong> have at least 8 characters</i>
                            </p>
                        </div>
                        {
                            !isLoading ?
                                <button
                                    className="btn btn-lg btn-primary"
                                    type="submit"
                                    style={{ width: '160px' }}
                                    disabled={!this.validateForm()}
                                >
                                    Register
                                </button>
                                :
                                <button
                                    className="btn btn-lg btn-primary"
                                    type="submit"
                                    style={{ width: '160px' }}
                                    disabled={true}
                                >
                                    <i className="fa fa-spinner fa-spin"></i> Submitting...
                                </button>
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