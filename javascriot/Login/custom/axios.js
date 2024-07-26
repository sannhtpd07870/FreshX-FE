import axios from "axios";
import Cookies from 'js-cookie';

const instance = axios.create({
    baseURL: 'https://freshx-api.azurewebsites.net/api',
});

instance.interceptors.request.use(function (config) {
    const accessToken = Cookies.get('authToken');
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

instance.interceptors.response.use(function (response) {
    return response.data;
}, async function (error) {
    const refreshToken = Cookies.get('refreshToken');
    
    if (error.response && error.response.status === 401 && refreshToken) {
        const originalRequest = error.config;
        try {
            const response = await axios.post('/refresh', { refresh_token: refreshToken });
            const newAccessToken = response.data.authorization.access_token;
            const newRefreshToken = response.data.authorization.refresh_token;
            const expiresInMilliseconds = 600000; // 10 minutes
            Cookies.set('authToken', newAccessToken, {
                expires: new Date(Date.now() + expiresInMilliseconds),
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict'
            });
            Cookies.set('refreshToken', newRefreshToken, {
                expires: new Date(Date.now() + 60 * 1000), // 1 minute
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict'
            });
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axios(originalRequest);
        } catch (refreshError) {
            return Promise.reject(refreshError);
        }
    }
    return Promise.reject(error);
});

export default instance;
