import api from './api';

export const searchCars = async (params) => {
    const response = await api.get('/cars', { params });
    return response.data;
};

export const getCarById = async (id) => {
    const response = await api.get(`/cars/${id}`);
    return response.data;
};

export const createCar = async (formData) => {
    const response = await api.post('/cars', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const updateCar = async (id, formData) => {
    const response = await api.put(`/cars/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const deleteCar = async (id) => {
    const response = await api.delete(`/cars/${id}`);
    return response.data;
};
