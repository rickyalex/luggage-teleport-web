import { GET_AIRLINE_DATA } from '../constants';

export default (state = [], action) => {
    switch (action.type) {
        case GET_AIRLINE_DATA:
            const { AirlineData } = action;
            return AirlineData;
        default:
            return state;
    }
}