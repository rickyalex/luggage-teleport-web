import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { LogUser } from '../actions';
import { cognito } from '../config';
import { OrderASC } from './helper';
import {
    CognitoUserPool,
    AuthenticationDetails,
    CognitoUser
} from "amazon-cognito-identity-js";
import { Input, Form, Icon, Button } from 'antd';
import axios from 'axios';
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
            UserPoolId: cognito.USER_POOL_ID,
            ClientId: cognito.CLIENT_ID
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
                    localStorage.setItem('email', `${email}`);
                    localStorage.setItem('PhoneNumber', `${phone_number}`);
                    dispatch(LogUser(email, phone_number));
                    localStorage.setItem('token', `"${jwtToken}"`)

                    axios.get('https://el3ceo7dwe.execute-api.us-west-1.amazonaws.com/dev/handler/Users-get/'+email)
                    .then((res) => {
                        OrderASC(res.data.result, 'date');
                        localStorage.setItem('img', res.data.result[0].img);
                    }).catch((err) => {
                        console.log(err)
                    })
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
            if(this.state.email==="rickyalex88@gmail.com") {
                localStorage.setItem('admin', 'Y');
                this.props.history.push('/admin');
            }
            else this.props.history.push('/home');
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
            <div align="center">
                <Form onSubmit={this.handleSubmit} style={{position: 'relative', top: '100px', margin: 'auto'}}>
                    <div>
                        <img
                            src="https://www.luggageteleport.com/wp-content/themes/luggage/images/logo.png"
                            style={{ padding: '10px', margin: '10px' }}
                            alt="logo"
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
                    </FormItem>
                    {
                            !isLoading ?
                                <Button
                                    type="primary"
                                    disabled={!this.validateForm()}
                                    htmlType="submit"
                                    style={{  }}
                                >
                                    Login
                                </Button>

                                :
                                <Button
                                    type="primary"
                                    disabled={true}
                                >
                                    <i className="fa fa-spinner fa-spin" style={{ textAlign: 'center' }}></i>
                                </Button>
                        }
                        <div style={{ marginTop: '1.2em' }}>
                            <Link to="/register"> <a style={{ color: 'white' }}>Register</a></Link>
                        </div>
                        <Link to="/forgot">
                            <a className="login-form-forgot" style={{ color: 'white' }}>
                                Forgot your Password?
                                </a>
                        </Link>
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