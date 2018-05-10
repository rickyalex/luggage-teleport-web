import { GET_AIRLINE_DATA, CLEAR_FORMS } from '../constants';

export default (state = [], action) => {
    switch (action.type) {
        case GET_AIRLINE_DATA:
            const { AirlineData } = action;
            return AirlineData;
        case CLEAR_FORMS:
            return [];
        default:
            return state;
    }
}