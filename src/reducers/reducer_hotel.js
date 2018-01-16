import { GET_HOTEL_DATA } from '../constants';

export default (state = [], action) => {
    switch (action.type) {
        case GET_HOTEL_DATA:
            const { HotelData } = action;
            return HotelData;
        default:
            return state;
    }
}