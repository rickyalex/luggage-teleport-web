import { PASSING_BOOK_DATA, CLEAR_FORMS } from '../constants';

export default (state = [], action) => {
    switch (action.type) {
        case PASSING_BOOK_DATA:
            const { BookData } = action;
            return BookData;
        case CLEAR_FORMS:
            return [];
        default:
            return state;
    }
}