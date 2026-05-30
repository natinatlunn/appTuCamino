import * as ActionTypes from "../ActionTypes";

const initialState = {
	user: null,
	loading: true,
};

export const userReducer = (state = initialState, action) => {
	switch (action.type) {
		case ActionTypes.SET_AUTH_USER:
			return { ...state, user: action.payload };
		case ActionTypes.SET_AUTH_LOADING:
			return { ...state, loading: action.payload };
		default:
			return state;
	}
};
