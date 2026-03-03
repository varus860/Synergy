import axios from 'axios';
import { API_BASE_URL } from './constants';

let appConfig = {
    appName: 'Synergy',
    supportEmail: 'support@synergy.com',
    featureFlags: {},
    enableConsole: false
};

export const fetchConfig = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/config`);
        appConfig = response.data;
        return appConfig;
    } catch (error) {
        console.error('Failed to fetch app configuration:', error);
        return appConfig; // Return defaults on error
    }
};

export const getConfig = () => appConfig;
