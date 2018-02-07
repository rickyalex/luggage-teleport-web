import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PassBookData, GetPaymentMethod, GetLuggageData } from '../actions';
import { FormGroup, InputGroup } from 'react-bootstrap';
import '../App.css';


class PaymentMethod extends Component {

    constructor(props) {
        super(props);

        this.state = {
            PaymentMethod: ''
        }

        this.backToReview = this.backToReview.bind(this);
        this.toFinalReview = this.toFinalReview.bind(this);
    }

    PushData() {
        this.props.PassBookData(this.props.BookData);
    }

    setPayment() {
        this.props.GetPaymentMethod(this.state.PaymentMethod);
        this.props.GetLuggageData(this.props.LuggageData.TotalCost, this.props.LuggageData.Luggage);
    }

    async backToReview() {
        this.PushData()
        this.props.history.push('/addluggage');
    }


    async toFinalReview() {
        this.PushData()
        this.setPayment()
        const { BookingType } = this.props.BookData[0];
        if (BookingType === 'ATH') {
            this.props.history.push('/athfinalreview')
        } else if (BookingType === 'HTA') {
            this.props.history.push('/htafinalreview')
        } else if (BookingType === 'HTH') {
            this.props.history.push('/hthfinalreview');
        } else if (BookingType === 'ATA') {
            this.props.history.push('/atafinalreview');
        } else {
            alert('Ooops Something wrong :(')
        }

    }

    GetPayment() {
        const Payment = [
            {
                id: 1,
                name: "Credit Card"
            }
        ]

        return Payment;
    }

    ValidatePayment() {
        return (this.state.PaymentMethod.length > 0)
    }

    render() {
        return (
            <div>
                <div className="containerProgressBar" style={{ marginTop: '1em' }}>
                    <ul className="progressbar">
                        <li className="active">Booking</li>
                        <li className="active">Add Luggage</li>
                        <li>Payment Method</li>
                        <li>Booking/Payment Review &amp; Submit</li>
                    </ul>

                    <div className="receipt">
                        <div className="form-inline">
                            <div className="form-group">
                                <form align="center">
                                    <FormGroup>
                                        <InputGroup>
                                            <select
                                                className="form-control"
                                                style={{ height: '35px', width: '260px', marginTop: '4em', marginLeft: "-28em" }}
                                                onChange={event => this.setState({ PaymentMethod: event.target.value })}>
                                                <option value="" selected disabled>Choose Your Payment</option>
                                                {
                                                    this.GetPayment().map((payment) => {
                                                        return <option key={payment.id} value={payment.name}>{payment.name}</option>
                                                    })
                                                }
                                            </select>
                                        </InputGroup>
                                    </FormGroup>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div align="center">
                        <button type="button" class="btn btn-danger btn-lg" style={{ marginRight: '3px' }} onClick={this.backToReview}>Back</button>
                        <button type="button" class="btn btn-primary btn-lg" onClick={this.toFinalReview} disabled={!this.ValidatePayment()}>Next</button>
                    </div>
                </div>
            </div>
        )
    }
}



function mapStateToProps(state) {
    const { BookData, LuggageData } = state;
    return {
        BookData,
        LuggageData
    }
}

export default connect(mapStateToProps, { PassBookData, GetPaymentMethod, GetLuggageData })(PaymentMethod)