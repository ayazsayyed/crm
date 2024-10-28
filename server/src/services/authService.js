// client/src/services/authService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const authService = {
    async login(credentials) {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, credentials);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Login failed' };
        }
    },

    async register(userData) {
        try {
            const response = await axios.post(`${API_URL}/auth/register`, userData);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Registration failed' };
        }
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    },

    getToken() {
        return localStorage.getItem('token');
    },

    async updatePassword(passwordData) {
        const response = await axios.put(
            `${API_URL}/auth/password`,
            passwordData,
            {
                headers: { Authorization: `Bearer ${this.getToken()}` }
            }
        );
        return response.data;
    }
};

export default authService;