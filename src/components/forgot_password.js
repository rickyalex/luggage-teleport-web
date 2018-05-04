import React, { Component } from 'react';
import { userPool } from '../config';
import { CognitoUser } from "amazon-cognito-identity-js";
import { withRouter } from 'react-router-dom';
import { Form, Input } from 'antd';
import '../App.css';

const FormItem = Form.Item;

class ForgotPassword extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            isLoading: false,
            error: {
                message: ''
            }
        }

        this.handleConfirmationSubmit = this.handleConfirmationSubmit.bind(this);
    }

    ForgottenPassword(email) {

        const userData = {
            Username: email,
            Pool: userPool
        }
        const cognitoUser = new CognitoUser(userData);

        return new Promise((resolve, reject) =>
            cognitoUser.forgotPassword({
                onSuccess: function (result) {
                    console.log(result)

                },
                onFailure: function (err) {
                    reject(err)
                },

                inputVerificationCode: function (data) {
                    resolve({
                        cognitoUser: cognitoUser,
                        thirdArg: this
                    })
                }
            })
        );
    }

    async handleConfirmationSubmit(event) {
        event.preventDefault();
        this.setState({ isLoading: true })
        try {
            localStorage.setItem('EmailForgot', `${this.state.email}`)
            await this.ForgottenPassword(this.state.email);
            alert('Please check your Email for Get the PIN');
            this.props.history.push('/confirmnewpassword');
        } catch (e) {
            this.setState({
                error: e,
                isLoading: false
            })
            alert(this.state.error.message);
        }
    }


    render() {

        const { email, isLoading } = this.state;
        return (
            <div>
                <div className="bg-image">
                    <div align="center" style={{ marginTop: '100px' }}>
                        <Form onSubmit={this.handleConfirmationSubmit}>
                            <h3 style={{ color: 'yellow', marginBottom: '2em' }}>Forgot Password</h3>
                            {/* <div className="form-group">
                                <input
                                    className="form-control"
                                    type="text"
                                    onChange={e => this.setState({ email: e.target.value })}
                                    placeholder="Your Email" required />
                            </div> */}
                            <FormItem>
                                <Input
                                    onChange={e => this.setState({ email: e.target.value })}
                                    placeholder="Your Email"
                                    style={{ width: 300 }}
                                />
                            </FormItem>

                            {
                                !isLoading ?
                                    <button
                                        className="btn btn-lg btn-primary"
                                        type="submit"
                                        disabled={!email}
                                        style={{ width: '160px' }}
                                    >
                                        Send Pin
                                </button>
                                    :
                                    <button
                                        className="btn btn-lg btn-primary"
                                        type="submit"
                                        style={{ width: '160px' }}
                                        disabled={true}
                                    >
                                        <i className="fa fa-spinner fa-spin"></i> Sending...
                                </button>
                            }
                        </Form>
                    </div>
                </div>
            </div>
        )
    }

}

export default withRouter(ForgotPassword);