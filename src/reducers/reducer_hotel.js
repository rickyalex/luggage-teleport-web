import { GET_HOTEL_DATA, CLEAR_FORMS } from '../constants';

export default (state = [], action) => {
    switch (action.type) {
        case GET_HOTEL_DATA:
            const { HotelData } = action;
            return HotelData;
        case CLEAR_FORMS:
            return [];
        default:
            return state;
    }
}