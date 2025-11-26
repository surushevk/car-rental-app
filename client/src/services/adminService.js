import api from './api';

export const createAdmin = async (adminData) => {
    const response = await api.post('/auth/create-admin', adminData);
    return response.data;
};

export const getAllAdmins = async () => {
    const response = await api.get('/auth/admins');
    return response.data;
};

export const deleteAdmin = async (adminId) => {
    const response = await api.delete(`/auth/admins/${adminId}`);
    return response.data;
};
