import { 
    SIGNED_IN, 
    PASSING_BOOK_DATA, 
    GET_PAYMENT_METHOD, 
    GET_AIRLINE_DATA,
    GET_AIRPORT_DATA, 
    GET_HOTEL_DATA } from '../constants';

export function LogUser(Email, PhoneNumber) {
    const action = {
        type: SIGNED_IN,
        Email,
        PhoneNumber
    }
    return action;
}

export function PassBookData(BookData) {
    const action = {
        type: PASSING_BOOK_DATA,
        BookData
    }

    return action;
}

export function GetPaymentMethod(PaymentMethod) {
    const action = {
        type: GET_PAYMENT_METHOD,
        PaymentMethod
    }
    return action;
}

export function GetAirlineData(AirlineData) {
    const action = {
        type: GET_AIRLINE_DATA,
        AirlineData
    }

    return action;
}

export function GetAirportData(AirportData) {
    const action = {
        type: GET_AIRPORT_DATA,
        AirportData
    }

    return action;
}

export function GetHotelData(HotelData) {
    const action = {
        type: GET_HOTEL_DATA,
        HotelData
    }

    return action;
}