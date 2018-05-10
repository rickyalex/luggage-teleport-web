import React, { Component } from 'react';
import { userPool } from '../config';
import CognitoUser from "amazon-cognito-identity-js/es/CognitoUser";
import { withRouter } from 'react-router-dom';
import '../App.css';
import { Form, Input } from 'antd';

const FormItem = Form.Item;

class ConfirmNewPassword extends Component {

    constructor(props) {
        super(props);

        this.state = {
            newPassword: '',
            pin: '',
            isLoading: false,
            error: {
                message: ''
            },
            errorMessage: ''
        }
        this.handleConfirmationSubmit = this.handleConfirmationSubmit.bind(this);
    }

    validateForm() {
        return (
            this.state.pin.length > 0 && this.state.newPassword.length > 0
        )
    }

    ConfirmNewPassword(email, pin, newPassword) {

        const userData = {
            Username: email,
            Pool: userPool
        }
        const cognitoUser = new CognitoUser(userData);

        return new Promise((resolve, reject) =>
            cognitoUser.confirmPassword(pin, newPassword, {
                onSuccess: result => {
                    resolve()
                },
                onFailure: err => {
                    reject(err);
                }
            })
        )
    }

    async handleConfirmationSubmit(event) {
        const email = localStorage.getItem('EmailForgot');
        var message = "";
        event.preventDefault();
        this.setState({ isLoading: true })
        try {
            await this.ConfirmNewPassword(email, this.state.pin, this.state.newPassword);
            alert('Change password successful !');
            localStorage.removeItem('EmailForgot');
            this.props.history.push('/');
        } catch (e) {
            //console.log(e.code);
            if(e.code==="InvalidParameterException" || e.code==="InvalidPasswordException"){
                message = "Password must be at least 8 characters";
            }
            else if(e.code==="CodeMismatchException"){
                message = "Invalid verification code provided, please try again";
            }
            else if(e.code==="ExpiredCodeException"){
                message = "PIN expired, please retry the forgot password"
            }

            this.setState({
                error: e,
                isLoading: false,
                errorMessage: message
            })
            alert(this.state.errorMessage);
        }
    }

    render() {
        const { isLoading } = this.state;
        return (
            <div>
                <div className="bg-image">
                    <div align="center" style={{ marginTop: '100px' }}>
                        <Form onSubmit={this.handleConfirmationSubmit}>
                            <h3 style={{ color: 'yellow', marginBottom: '2em' }}>Change Password</h3>
                            <FormItem>
                                <Input
                                    onChange={e => this.setState({ pin: e.target.value })}
                                    placeholder="Your Pin"
                                    type="text"
                                    style={{ width: 280 }}
                                />
                            </FormItem>
                            <FormItem>
                                <Input
                                    onChange={e => this.setState({ newPassword: e.target.value })}
                                    placeholder="Your New Password"
                                    type="password"
                                    style={{ width: 280 }}
                                />
                            </FormItem>
                            {
                                !isLoading ?
                                    <button
                                        className="btn btn-lg btn-primary"
                                        type="submit"
                                        style={{ width: '160px' }}
                                        disabled={!this.validateForm()}
                                    >
                                        Submit
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
                        </Form>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(ConfirmNewPassword);