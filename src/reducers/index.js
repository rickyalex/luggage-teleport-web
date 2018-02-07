import { combineReducers } from 'redux'
import user from './reducer_user';
import BookData from './reducer_book_data';
import payment from './reducer_payment';
import AirportData from './reducer_airport';
import AirlineData from './reducer_airline';
import HotelData from './reducer_hotel';
import LuggageData from './reducer_add_luggage';

export default combineReducers({
    user,
    BookData,
    payment,
    AirlineData,
    AirportData,
    HotelData,
    LuggageData
})