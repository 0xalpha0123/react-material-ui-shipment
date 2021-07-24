import FuseUtils from '@fuse/utils/FuseUtils';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { authRoles } from 'app/auth';
import history from '@history';

/* eslint-disable camelcase */
const server_url = "http://localhost:3500";

class JwtService extends FuseUtils.EventEmitter {
	init() {
		this.setInterceptors();
		this.handleAuthentication();
	}

	setInterceptors = () => {
		axios.interceptors.response.use(
			response => {
				return response;
			},
			err => {
				return new Promise((resolve, reject) => {
					if (err.response.status === 401 && err.config && !err.config.__isRetryRequest) {
						// if you ever get an unauthorized response, logout the user
						this.emit('onAutoLogout', 'Invalid access_token');
						this.setSession(null);
					}
					throw err;
				});
			}
		);
	};

	handleAuthentication = () => {
		const access_token = this.getAccessToken();
		if (!access_token) {
			this.emit('onNoAccessToken');
			return;
		}
		this.setSession(access_token);
		this.emit('onAutoLogin', true);
	};

	createUser = data => {
		return new Promise((resolve, reject) => {
			const user = {username: data.email, password: data.password}
			axios.post(`${server_url}/api/signup`, {user})
			.then(response => {
				if (response.data.user) {
					this.setSession(response.data.token);
					history.push('/dashboard');
					resolve(response.data.user);
				} else {
					reject(response.data.error);
				}
			});
		});
	};

	signInWithEmailAndPassword = (username, password) => {
		return new Promise((resolve, reject) => {
			axios
				.post(`${server_url}/api/signin`, {
					username, password
				})
				.then(response => {
					if (response.data.user) {
						const user = {
							uuid: response.data.user._id,
							password: password,
							role: response.data.user.role,
							data: {
								email: response.data.user.username,
							}
						}
						localStorage.setItem('username', user.data.email);
						localStorage.setItem('password', password);
						localStorage.setItem('role', user.role);
						this.setSession(response.data.token);
						history.push('/dashboard');
						resolve(user);
					} else {
						reject(response.data.error);
					}
				});
		});
	};

	signInWithToken = () => {
		return new Promise((resolve, reject) => {
			if (this.getAccessToken()) {
				const token = this.getAccessToken();
				this.setSession(token);
				const user = {
					username : localStorage.getItem("username"),
					password : localStorage.getItem("password"),
					role : localStorage.getItem("role")
				}
				if(history.location.pathname == "/auth/login" || history.location.pathname == "/auth/register" )
					history.push('/dashboard')
				resolve(user);
			} else {
				this.logout();
				reject(new Error('Failed to login with token.'));
			}
		});
	};

	updateUserData = data => {
		return new Promise((resolve, reject) => {
			const user = {
				username : data.email,
				password : data.password
			}
			if(data.email != localStorage.getItem('username'))
				reject("Email is incorrect!");
			else
				axios
					.post(`${server_url}/api/passwordchange`, {
						user
					})
					.then(response => {
						if (response) {
							console.log("aaa", response.data)
							localStorage.setItem('password', user.password);
							history.goBack();
							resolve();
						} else {
							reject();
						}
					});
		});
	};

	setSession = access_token => {
		if (access_token) {
			localStorage.setItem('jwt_access_token', access_token);
			axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
		} else {
			localStorage.removeItem('jwt_access_token');
			localStorage.removeItem('username');
			localStorage.removeItem('password');
			localStorage.removeItem('role');
			delete axios.defaults.headers.common.Authorization;
		}
	};

	logout = () => {
		this.setSession(null);
	};

	isAuthTokenValid = access_token => {
		if (!access_token) {
			return false;
		}
		const decoded = jwtDecode(access_token);
		console.log("decoded", decoded)
		const currentTime = Date.now() / 1000;
		if (decoded.exp < currentTime) {
			console.warn('access token expired');
			return false;
		}

		return true;
	};

	getAccessToken = () => {
		return window.localStorage.getItem('jwt_access_token');
	};
}

const instance = new JwtService();

export default instance;
