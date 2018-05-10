import { SIGNED_IN } from '../constants';

let user = {
    Email: null,
    PhoneNumber: null
}


export default (state = user, action) => {
    switch (action.type) {
        case SIGNED_IN:
            const { Email, PhoneNumber } = action;

            let newUser = {
                Email,
                PhoneNumber
            }
            return newUser;
        default:
            return state;
    }
}