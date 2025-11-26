import api from './api';

export const createCoupon = async (couponData) => {
    const response = await api.post('/coupons', couponData);
    return response.data;
};

export const getAllCoupons = async () => {
    const response = await api.get('/coupons');
    return response.data;
};

export const updateCoupon = async (id, couponData) => {
    const response = await api.put(`/coupons/${id}`, couponData);
    return response.data;
};

export const deleteCoupon = async (id) => {
    const response = await api.delete(`/coupons/${id}`);
    return response.data;
};

export const validateCoupon = async (code, bookingAmount, carType) => {
    const response = await api.post('/coupons/validate', {
        code,
        bookingAmount,
        carType,
    });
    return response.data;
};

export const getActiveCoupons = async () => {
    const response = await api.get('/coupons/active');
    return response.data;
};
