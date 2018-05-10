import React, { Component } from 'react';
import '../App.css';
import { userPool } from '../config';
import CognitoUser from "amazon-cognito-identity-js/es/CognitoUser";
import { withRouter } from 'react-router-dom';
import { Input, Form, Button } from 'antd';

const FormItem = Form.Item;

class VerifyAccount extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            pin: '',
            error: {
                message: ''
            },
            isLoading: false
        }
        this.handleConfirmationSubmit = this.handleConfirmationSubmit.bind(this);
        this.email = localStorage.getItem('EmailRegist');
    }

    validateForm() {
        return (
            this.state.pin.length >= 6
        );
    }

    confirm(email, pin) {

        const userData = {
            Username: email,
            Pool: userPool
        }
        const cognitoUser = new CognitoUser(userData)
        return new Promise((resolve, reject) =>

            cognitoUser.confirmRegistration(pin, true, function (err, result) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);

            })
        );
    }

    async handleConfirmationSubmit(event) {
        
        event.preventDefault();
        this.setState({ isLoading: true })
        try {
            await this.confirm(this.email, this.state.pin);
            alert('Email verification success');
            this.props.history.push('/');
            localStorage.removeItem('EmailRegist');
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
            <div className="bg-image">
                <div align="center" >
                    <Form onSubmit={this.handleConfirmationSubmit} style={{ position: 'relative', top: '100px', margin: 'auto', width: '60%' }}>
                        <h2 style={{ color: 'yellow', marginBottom: '1em' }}>Complete your registration</h2>
                        <span>We have sent a verification code to {this.email}. Please check your email to complete your registration</span>
                        <FormItem style={{ marginTop: '10px' }}>
                            <Input
                                type="text"
                                onChange={e => this.setState({ pin: e.target.value })}
                                style={{width: 260}}
                                placeholder="Your Pin"
                            />
                        </FormItem>

                        {
                            !isLoading ?
                                <Button
                                    type="primary"
                                    disabled={!this.validateForm()}
                                    htmlType="submit"
                                    style={{ width: '150px' }}
                                >
                                    Create Account
                                </Button>
                                :
                                <Button
                                    type="primary"
                                    disabled={true}
                                    style={{ width: '150px' }}
                                >
                                    <i className="fa fa-spinner fa-spin" style={{ textAlign: 'center' }}></i>
                                </Button>
                        }
                    </Form>
                </div>
            </div>
        )
    }

}

export default withRouter(VerifyAccount);