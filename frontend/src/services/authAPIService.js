import { APIService } from './APIService.js';

export const authAPIService = () => {
    const API_PATH = 'accounts/'
    const apiService = APIService();

    const register = async (email, password, username, user_object) => {
        const response = await apiService.makeAPICall(`${API_PATH}`, 'POST', {
            email: email,
            password: password,
            username: username,
            user_object: user_object
        });

        if (!response.success) {
            return {
                success: false,
                message: response.data,
            }
        }

        return {
            success: true,
        }
    }

    const login = async (username, password) => {
        const response = await apiService.makeAPICall(`${API_PATH}login/`, 'POST', {
            username: username,
            password: password,
        });

        if (!response.success) {
            return {
                success: false,
                message: response.data,
            }
        }

        sessionStorage.setItem('token', response.data.access); // Store token in local storage
        sessionStorage.setItem('refresh', response.data.refresh);

        return {
            success: true,
        }
    }

    const logout = async () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('refresh');

        return {
            success: true,
        }
    }

    return {
        register,
        login,
        logout,
    }
}