import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import history from '@history';
import _ from '@lodash';
import { setInitialSettings } from 'app/store/fuse/settingsSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import jwtService from 'app/services/jwtService';
import Axios from 'axios';

const server_url = "http://localhost:3500";

export const setUserData = user => async (dispatch, getState) => {
	/*
        You can redirect the logged-in user to a specific route depending on his role
         */
	// console.log("welcome", history.location)
	/*
    Set User Settings
     */
	// dispatch(setDefaultSettings(user.data.settings));
	dispatch(setUser(user));
	if(history.location.pathname == "/auth/login")
		history.push('/dashboard')
	// history.push("/dashboard");
};

export const updateUserSettings = settings => async (dispatch, getState) => {
	const oldUser = getState().auth.user;
	const user = _.merge({}, oldUser, { data: { settings } });

	dispatch(updateUserData(user));

	return dispatch(setUserData(user));
};

export const updateUserShortcuts = shortcuts => async (dispatch, getState) => {
	const { user } = getState().auth;
	const newUser = {
		...user,
		data: {
			...user.data,
		}
	};

	dispatch(updateUserData(user));

	return dispatch(setUserData(newUser));
};

export const logoutUser = () => async (dispatch, getState) => {
	const { user } = getState().auth;

	if (!user.role || user.role.length === 0) {
		// is guest
		return null;
	}

	history.push({
		pathname: '/'
	});
	jwtService.logout();
	dispatch(setInitialSettings());
	dispatch(userLoggedOut());
};

export const updateUserData = user => async (dispatch, getState) => {
	jwtService
		.updateUserData(user)
		.then(() => {
			dispatch(showMessage({ message: 'User data saved with api' }));
		})
		.catch(error => {
			dispatch(showMessage({ message: "Email Address incorrect!" }));
		});
};
export const getUsers = createAsyncThunk('autht/user/getUsers', async () => {
	const response = await Axios.get(`${server_url}/api/getusers`);
	const data = await response.data;

	return { data };
});

// export const getAllUsers = () => async (dispatch, getState) => {
// 	return new Promise((resolve, reject) => {
// 		Axios
// 		.get(`${server_url}/api/getusers`)
// 		.then((response) => {
// 			dispatch(getUsers(response.data));
// 			resolve(response.data);
// 		})
// 		.catch(error => {
// 			dispatch(showMessage({ message: error.message }));
// 			reject(error.message);
// 		})
// 	})
// }
export const removeUser = (user) => async (dispatch, getState) => {
	return new Promise((resolve, reject) => {
		Axios
		.post(`${server_url}/api/removeuser`, {user})
		.then((response) => {
			dispatch(getUsers());
			resolve(response.data);
		})
		.catch(error => {
			dispatch(showMessage({ message: error.message }));
			reject(error.message);
		})
	})
}
export const initPassword = (user) => async (dispatch, getState) => {
	return new Promise((resolve, reject) => {
		Axios
		.post(`${server_url}/api/initpassword`, {user})
		.then((response) => {
			dispatch(showMessage({ message: response.data }));
			dispatch(getUsers());
			resolve(response.data);
		})
		.catch(error => {
			dispatch(showMessage({ message: error.message + "hello" }));
			reject(error.message);
		})
	})
}

const initialState = {
	role: [], // guest
	// data: {
	// 	email: 'johndoe@withinpixels.com',
	// },
	users: [],
};

const userSlice = createSlice({
	name: 'auth/user',
	initialState,
	reducers: {
		setUser: (state, action) => action.payload,
		userLoggedOut: (state, action) => initialState,
		// getUsers: (state, action) => _.merge({state}, { users: action.payload }),
	},
	extraReducers: {
		[getUsers.fulfilled]: (state, action) => {
			state.users = action.payload.data
		}
	}
});

export const { setUser, userLoggedOut } = userSlice.actions;

export default userSlice.reducer;
