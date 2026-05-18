import * as ActionTypes from "../ActionTypes";

const initialState = {
	scanned: false,
	modalVisible: false,
	qrData: null,
  loading: false,
  error: null,
};

export const scannerReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SET_SCANNED:
      return { ...state, scanned: action.payload };
    case ActionTypes.SET_MODAL_VISIBLE:
      return { ...state, modalVisible: action.payload };
    case ActionTypes.SET_QR_DATA:
      return { ...state, qrData: action.payload };
    case ActionTypes.FETCH_QR_INFO_SUCCESS:
      return { ...state, qrData: action.payload, loading: false, error: null };
    case ActionTypes.FETCH_QR_INFO_FAILED:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
