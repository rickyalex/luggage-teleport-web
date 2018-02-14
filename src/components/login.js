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
import { Input, Form, Icon } from 'antd';
import '../App.css';

const FormItem = Form.Item;

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
                <Form onSubmit={this.handleSubmit} className="login-form form-auth">
                    <div>
                        <img
                            src="https://www.luggageteleport.com/wp-content/themes/luggage/images/logo.png"
                            style={{ padding: '10px', margin: '10px' }}
                        />
                    </div>
                    <FormItem style={{ width: '280px' }}>
                        <Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)', }} />} placeholder="Email"
                            onChange={e => this.setState({ email: e.target.value })}
                        />
                    </FormItem>
                    <FormItem style={{ width: '280px' }}>
                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password"
                            onChange={e => this.setState({ password: e.target.value })}
                        />
                        <Link to="/forgot">
                            <a className="login-form-forgot" style={{ color: 'white' }}>
                                Forgot your Password?
                                </a>
                        </Link>
                    </FormItem>
                    <FormItem>
                        {
                            !isLoading ?
                                <button
                                    className="btn btn-lg"
                                    type="submit"
                                    disabled={!this.validateForm()}
                                    style={{ color: '#00bfff', backgroundColor: 'white', width: '280px', marginTop: '1px' }}
                                >
                                    Login
                                    </button>

                                :
                                <button
                                    className="btn btn-lg"
                                    type="submit"
                                    disabled={true}
                                    style={{ color: '#00bfff', backgroundColor: 'white', width: '280px', marginTop: '1px' }}
                                >
                                    <i className="fa fa-spinner fa-spin"></i> Loggedin...
                                    </button>
                        }
                        <div style={{ marginTop: '1.2em' }}>
                            <p><strong>Do not have an Account yet?</strong>
                                <Link to="/register"> <a style={{ color: 'white' }}>Let's Register!</a></Link></p>
                        </div>
                    </FormItem>
                </Form>
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