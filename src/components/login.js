import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { LogUser } from '../actions';
import { USER_POOL_ID, CLIENT_ID } from '../config';
import {
    CognitoUserPool,
    AuthenticationDetails,
    CognitoUser
} from "amazon-cognito-identity-js";
import '../App.css';

class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
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
            this.state.password.length > 0
        );
    }

    Login(email, password) {
        let { dispatch } = this.props
        const userPool = new CognitoUserPool({
            UserPoolId: USER_POOL_ID,
            ClientId: CLIENT_ID
        });
        const user = new CognitoUser({ Username: email, Pool: userPool });
        const authenticationData = { Username: email, Password: password };
        const authenticationDetails = new AuthenticationDetails(authenticationData);

        return new Promise((resolve, reject) =>
            user.authenticateUser(authenticationDetails, {
                onSuccess: result => {
                    resolve()
                    const { jwtToken } = result.idToken;
                    const { email, phone_number, name } = result.idToken.payload;
                    localStorage.setItem('CustName', `${name}`);
                    dispatch(LogUser(email, phone_number));
                    localStorage.setItem('token', `"${jwtToken}"`)
                },
                onFailure: err => {
                    reject(err)
                }

            })
        );
    }

    async handleSubmit(event) {
        event.preventDefault();
        this.setState({ isLoading: true })

        try {
            await this.Login(this.state.email, this.state.password);
            this.props.history.push('/home');
        } catch (e) {
            this.setState({
                isLoading: false,
                error: e
            })
            alert(this.state.error.message)
        }
    }


    render() {
        const { isLoading } = this.state;
        return (
            <div className="bg-image">
                <div align="center" style={{ marginTop: '100px' }}>
                    <img
                        src="https://www.luggageteleport.com/wp-content/themes/luggage/images/logo.png"
                        style={{ padding: '10px', margin: '20px' }}
                    />
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <input
                                className="form-control"
                                type="text"
                                onChange={e => this.setState({ email: e.target.value })}
                                placeholder="Email" required />
                        </div>

                        <div className="form-group">
                            <input
                                className="form-control"
                                type="password"
                                onChange={e => this.setState({ password: e.target.value })}
                                placeholder="password"
                                style={{ marginTop: '10px' }} required />
                        </div>

                        {
                            !isLoading ?
                                <button
                                    className="btn btn-lg"
                                    type="submit"
                                    disabled={!this.validateForm()}
                                    style={{ color: '#00bfff', backgroundColor: 'white', width: '140px' }}
                                >
                                    Login
                            </button>

                                :
                                <button
                                    className="btn btn-lg"
                                    type="submit"
                                    disabled={true}
                                    style={{ color: '#00bfff', backgroundColor: 'white', width: '140px' }}
                                >
                                    <i className="fa fa-spinner fa-spin"></i> Loggedin...
                            </button>
                        }



                        <div style={{ marginTop: '3em' }}>
                            <p><strong>Do not have an Account yet?</strong>
                                <Link to="/register"> <a style={{ color: 'white' }}>Let's Register!</a></Link></p>
                            <p><strong>Or</strong></p>

                            <p> <Link to="/forgot"> <a style={{ color: 'white' }}>Forgot your Password?</a></Link></p>

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
export default withRouter(connect(mapStateToProps, null)(Login));