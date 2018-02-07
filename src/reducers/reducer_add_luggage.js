import { GET_LUGGAGE_DATA } from '../constants';

let LuggageData = {
    TotalCost: 0,
    Luggage: 0
}

export default (state = LuggageData, action) => {
    switch (action.type) {
        case GET_LUGGAGE_DATA:
            const { TotalCost, Luggage } = action;
            LuggageData = {
                TotalCost,
                Luggage
            }
            return LuggageData;
        default:
            return state;
    }
}