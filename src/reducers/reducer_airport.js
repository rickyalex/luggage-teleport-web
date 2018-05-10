import { GET_AIRPORT_DATA, CLEAR_FORMS } from '../constants';

export default (state = [], action) => {
    switch (action.type) {
        case GET_AIRPORT_DATA:
            const { AirportData } = action;
            return AirportData;
        case CLEAR_FORMS:
            return [];
        default:
            return state;
    }
}