import React, { Component } from 'react';
import { Route, HashRouter as Router, Redirect } from 'react-router-dom';
import App from './App';
import Login from './components/login';
import Register from './components/register';
import VerifyAccount from './components/verify_account';
import ForgotPassword from './components/forgot_password';
import ConfirmNewPassword from './components/confirm_new_password';
import BookingForm from './components/booking_form';
import EmailHandler from './components/email_handler';
import History from './components/history';
import Profile from './components/profile';
import Admin from './components/admin';
import AddLuggage from './components/add_luggage';
import FinalReview from './components/final_review';
import ATHFinalReview from './components/ath_final_review';
import HTAFinalReview from './components/hta_final_review';
import HTHFinalReview from './components/hth_final_review';
import ATAFinalReview from './components/ata_final_review';
import SuccessPage from './components/success_page';


class Routes extends Component {

    render() {
        const token = localStorage.getItem('token');
        return (
            <div>
                <Router>
                    <div>
                        <Route exact path="/" render={() => (
                            token === null || token === undefined ? (
                                <Login />
                            ) : (
                                <App />
                                )
                        )} />
                        <Route path="/home" component={App} />
                        <Route path="/register" component={Register} />
                        <Route path="/booking" component={BookingForm} />
                        <Route path="/emailhandler" component={EmailHandler} />
                        <Route path="/history" component={History} />
                        <Route path="/profile" component={Profile} />
                        <Route path="/admin" component={Admin} />
                        <Route path="/finalreview" component={FinalReview} />
                        <Route path="/athfinalreview" component={ATHFinalReview} />
                        <Route path="/htafinalreview" component={HTAFinalReview} />
                        <Route path="/hthfinalreview" component={HTHFinalReview} />
                        <Route path="/atafinalreview" component={ATAFinalReview} />
                        <Route path="/addluggage" component={AddLuggage} />
                        <Route path="/verify" component={VerifyAccount} />
                        <Route path="/forgot" component={ForgotPassword} />
                        <Route path="/confirmnewpassword" component={ConfirmNewPassword} />
                        <Route path="/successpage" component={SuccessPage} />
                    </div>
                </Router>
            </div>
        )
    }
}

export default Routes;