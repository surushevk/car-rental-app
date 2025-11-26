import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get all active cities (public)
export const getCities = async () => {
    const response = await axios.get(`${API_URL}/cities`);
    return response.data;
};

// Get all cities including inactive (admin)
export const getAllCities = async (token) => {
    const response = await axios.get(`${API_URL}/cities/all`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Add new city (admin)
export const addCity = async (cityData, token) => {
    const response = await axios.post(`${API_URL}/cities`, cityData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Update city (admin)
export const updateCity = async (id, cityData, token) => {
    const response = await axios.put(`${API_URL}/cities/${id}`, cityData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Delete city (admin)
export const deleteCity = async (id, token) => {
    const response = await axios.delete(`${API_URL}/cities/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};
