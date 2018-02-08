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
        this.toFinalReview = this.toFinalReview.bind(this);
    }

    PushData() {
        this.props.PassBookData(this.props.BookData);
    }


    async toFinalReview() {
        this.PushData()
        this.props.GetLuggageData(this.state.TotalCost, this.state.Luggage)
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
                        <button type="button" class="btn btn-primary btn-lg" onClick={this.toFinalReview} disabled={!this.state.TotalCost}>Next</button>
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