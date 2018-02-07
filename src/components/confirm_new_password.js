import React, { Component } from 'react';
import { userPool } from '../config';
import { CognitoUser } from "amazon-cognito-identity-js";
import { withRouter } from 'react-router-dom';

import '../App.css';

class ConfirmNewPassword extends Component {

    constructor(props) {
        super(props);

        this.state = {
            newPassword: '',
            pin: '',
            isLoading: false,
            error: {
                message: ''
            }
        }
        this.handleConfirmationSubmit = this.handleConfirmationSubmit.bind(this);
    }

    validateForm() {
        return(
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
        event.preventDefault();
        this.setState({ isLoading: true })
        try {
            await this.ConfirmNewPassword(email, this.state.pin, this.state.newPassword);
            alert('success change password!');
            localStorage.removeItem('EmailForgot');
            this.props.history.push('/');
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
            <div>
                <div className="bg-image">
                    <div align="center" style={{ marginTop: '100px' }}>

                        <h1 style={{ color: 'yellow', marginBottom: '2em' }}>Change Password</h1>
                        <form onSubmit={this.handleConfirmationSubmit}>
                            <div className="form-group">
                                <input
                                    className="form-control"
                                    type="text"
                                    onChange={e => this.setState({ pin: e.target.value })}
                                    placeholder="Your Pin" required />
                            </div>
                            <div className="form-group">
                                <input
                                    className="form-control"
                                    type="password"
                                    onChange={e => this.setState({ newPassword: e.target.value })}
                                    placeholder="Your New Password" required />
                            </div>

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

                            <div>
                                <p><strong>Notes! </strong>
                                    <i className="registerNotes">
                                        Password <strong>must</strong> contain Lowercase, Uppercase,
                                    and Special Character
                                    and minimum length of Password is 8 character</i>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(ConfirmNewPassword);