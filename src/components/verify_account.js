import React, { Component } from 'react';
import '../App.css';
import { verifyUserAccount } from '../aws_cognito';
import { userPool } from '../config';
import { CognitoUser } from "amazon-cognito-identity-js";
import { withRouter } from 'react-router-dom';

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
        const email = localStorage.getItem('EmailRegist');
        event.preventDefault();
        this.setState({ isLoading: true })
        try {
            await this.confirm(email, this.state.pin);
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
                <div align="center" style={{ marginTop: '100px' }}>

                    <h1 style={{ color: 'yellow', marginBottom: '2em' }}>Verify your Account</h1>
                    <form onSubmit={this.handleConfirmationSubmit}>
                        <div className="form-group">
                            <input
                                className="form-control"
                                type="text"
                                onChange={e => this.setState({ pin: e.target.value })}
                                placeholder="Your Pin" required />
                        </div>

                        {
                            !isLoading ?
                                <button
                                    className="btn btn-lg btn-primary"
                                    type="submit"
                                    style={{ width: '160px' }}
                                    disabled={!this.validateForm()}
                                >
                                    Verify
                                </button>
                                :
                                <button
                                    className="btn btn-lg btn-primary"
                                    type="submit"
                                    style={{ width: '160px' }}
                                    disabled={true}
                                >
                                    <i className="fa fa-spinner fa-spin"></i> Verifying...
                                </button>
                        }
                    </form>
                </div>
            </div>
        )
    }

}

export default withRouter(VerifyAccount);