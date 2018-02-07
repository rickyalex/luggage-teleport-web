import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormGroup, InputGroup } from 'react-bootstrap';
import { PassBookData, GetLuggageData } from '../actions';


class AddLuggage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            TotalCost: 0,
            Luggage: 0,
            test: 0
        }

        this.handleLuggage = this.handleLuggage.bind(this);
        this.backToMainMenu = this.backToMainMenu.bind(this);
        this.toPaymentMethod = this.toPaymentMethod.bind(this);
    }

    PushData() {
        this.props.PassBookData(this.props.BookData);
    }


    async toPaymentMethod() {
        this.PushData()
        this.props.GetLuggageData(this.state.TotalCost, this.state.Luggage)
        this.props.history.push('/payment')
    }

    async backToMainMenu() {
        this.props.history.push('/home');
    }

    async handleLuggage() {
        const { TotalCost, Luggage } = this.state;
        if (Luggage > 0 && Luggage <= 2) {
            this.setState({ TotalCost: 35 })
        } else if (Luggage > 2) {
            const TotalWithAdditional = 35 + ((Luggage - 2) * 10);
            this.setState({ TotalCost: TotalWithAdditional })
        } else {
            this.setState({ TotalCost: 0 });
        }

    }

    render() {
        return (
            <div>
                <div className="containerProgressBar" style={{ marginTop: '1em' }}>
                    <ul className="progressbar">
                        <li className="active">Booking</li>
                        <li>Add Luggage</li>
                        <li>Payment Method</li>
                        <li>Booking/Payment Review &amp; Submit</li>
                    </ul>
                    <div className="receipt" align="center" style={{ marginTop: '3em' }}>
                        <input
                            onChange={e => this.setState({ Luggage: e.target.value })}
                            placeholder="your luggage quantity"
                            type="number" />
                        <button onClick={this.handleLuggage} style={{ backgroundColor: '#00bfff' }} disabled={!this.state.Luggage}>Add</button>

                        <p><strong>Total = ${this.state.TotalCost}</strong></p>

                        <p><strong>Notes! </strong>
                            <i className="registerNotes">
                                $35 fixed price up to 2 Luggages and $10 per additional</i>
                        </p>
                    </div>
                    <div align="center">
                        <button type="button" class="btn btn-danger btn-lg" style={{ marginRight: '3px' }} onClick={this.backToMainMenu}>Back</button>
                        <button type="button" class="btn btn-primary btn-lg" onClick={this.toPaymentMethod} disabled={!this.state.TotalCost}>Next</button>
                    </div>
                </div>

            </div>
        )
    }

}

function mapStateToProps(state) {
    const { BookData } = state;
    return {
        BookData
    }
}

export default connect(mapStateToProps, { PassBookData, GetLuggageData })(AddLuggage)