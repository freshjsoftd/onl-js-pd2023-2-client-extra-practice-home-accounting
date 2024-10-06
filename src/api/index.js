import axios from 'axios';

import { BASE_URL } from '../constants';

const api = axios.create({
	baseURL: BASE_URL,
	headers: { 'Content-Type': 'application/json' },
	withCredentials: true,
});

api.interceptors.request.use((config) => {
	const accessToken = localStorage.getItem('accessToken');
	if (!accessToken) {
		console.log('Need to sign up');
	} else {
		config.headers.Authorization = `Bearer ${accessToken}`;
	}
	return config;
});

api.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {
		const originalRequest = error.config;

		console.log('Error is: -----------------', error);
    const accessToken = localStorage.getItem('accessToken');
    if(!accessToken){
      console.log('Need to sign up');
      return null;
    }
		if (error.response.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				const { data } = await api.get('/auth/refresh'/* , {	withCredentials: true,} */);
        console.log('Data is: ---------', data)
        originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`
        localStorage.setItem('accessToken', data.accessToken)
        return api.request(originalRequest)
			} catch (err) {
				console.log('Refresh error is: -------', err);
			}
		}
    // originalRequest._retry = false;
    return Promise.reject(error)
	}
);

export default api;
