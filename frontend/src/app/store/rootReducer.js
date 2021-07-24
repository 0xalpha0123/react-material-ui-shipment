import { combineReducers } from '@reduxjs/toolkit';
import auth from 'app/auth/store';
import shipment from 'app/main/shipment/store'
import fuse from './fuse';
import i18n from './i18nSlice';

const createReducer = asyncReducers =>
	combineReducers({
		shipment,
		auth,
		fuse,
		i18n,
		...asyncReducers
	});

export default createReducer;
