import React from 'react';
import * as moment from 'moment';

//Random Booking Id
export function BookingId() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 7; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

//For auto complete
export function inputProps(StateHotel, functionOnChange, placeHolder) {
    return inputProps = {
        value: StateHotel,
        onChange: functionOnChange,
        placeholder: placeHolder,
        types: ['establishment']
    }
}

//For Hotel Input Antd Styling
export function cssClasses(){
    const style = {
        input: 'ant-input',
        autocompleteContainer: 'ant-select-selection'
    }

    return style;
}

//Date disabled state, only allowing today and further
export function disabledDate(current) {
  // Can not select days before today and today
  return current && current < moment().startOf('day');
}

//Ordering data Ascending
export function OrderASC(data, dataType) {

    if (dataType == 'string') {
        data.sort(function (a, b) {
            return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
        });
    } else if (dataType == 'date') {
        data.sort(function (a, b) {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
    }
}

//Getting Payment Data
export function GetPayment() {
    const Payment = [
        {
            id: 1,
            name: "Credit Card"
        }
    ]

    return Payment;
}

//Status Update Option
export function getStatus(){
    const Status = [
        {
            id: 1,
            name: "Order being processed"
        },
        {
            id: 2,
            name: "On transit"
        },
        {
            id: 3,
            name: "Arrived at destination"
        }
    ]

    return Status;
}