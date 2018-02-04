import React from 'react';

export function NullBookingData() {
    return (
        <div>
            <h1 style={{ color: 'white', marginTop: '30px' }}> No Booking Data</h1>
        </div>
    )
}

export function BookingId() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 7; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

export function inputProps(StateHotel, functionOnChange, placeHolder) {
    return inputProps = {
        value: StateHotel,
        onChange: functionOnChange,
        placeholder: placeHolder,
        types: ['lodging']
    }
}