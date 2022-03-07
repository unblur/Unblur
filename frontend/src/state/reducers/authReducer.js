import { setAuthErrors, setAuthUser, setAuthMessages } from './actions';

const initialState = {
    user: null,
    errors: [],
    messages: []
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case setAuthUser:
            return {
                ...state,
                user: action.payload
            }
        case setAuthErrors:
            return {
                ...state,
                errors: action.payload
            }
        case setAuthMessages:
            return {
                ...state,
                messages: action.payload
            }
        default:
            return state;
    }
}

export default reducer;