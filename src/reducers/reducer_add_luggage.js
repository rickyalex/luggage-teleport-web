import { GET_LUGGAGE_DATA, CLEAR_FORMS } from '../constants';

let LuggageData = {
    TotalCost: 0,
    Luggage: 0
}

export default (state = LuggageData, action) => {
    switch (action.type) {
        case GET_LUGGAGE_DATA:
            const { TotalCost, Luggage } = action;
            let newLuggageData = {
                TotalCost,
                Luggage
            }
            return newLuggageData;
        case CLEAR_FORMS:
            return LuggageData;
        default:
            return state;
    }
}