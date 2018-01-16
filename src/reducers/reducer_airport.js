import { GET_AIRPORT_DATA } from '../constants';

export default (state = [], action) => {
    switch (action.type) {
        case GET_AIRPORT_DATA:
            const { AirportData } = action;
            return AirportData;
        default:
            return state;
    }
}