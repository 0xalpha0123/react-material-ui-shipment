import { combineReducers } from '@reduxjs/toolkit';
import shipments from './shipmentsSlice';

const reducer = combineReducers({
	shipments,
});

export default reducer;
