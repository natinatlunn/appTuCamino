import * as ActionTypes from "../ActionTypes";

const initialState = {
	scanned: false,
	modalVisible: false,
	qrData: null,
};

export const scannerReducer = (state = initialState, action) => {
	switch (action.type) {
		case ActionTypes.SET_SCANNED:
			return { ...state, scanned: action.payload };
		case ActionTypes.SET_MODAL_VISIBLE:
			return { ...state, modalVisible: action.payload };
		case ActionTypes.SET_QR_DATA:
			return { ...state, qrData: action.payload };
		default:
			return state;
	}
};
