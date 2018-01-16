import { combineReducers } from 'redux'
import user from './reducer_user';
import BookData from './reducer_book_data';
import payment from './reducer_payment';
import AirportData from './reducer_airport';
import AirlineData from './reducer_airline';
import HotelData from './reducer_hotel';

export default combineReducers({
    user,
    BookData,
    payment,
    AirlineData,
    AirportData,
    HotelData
})