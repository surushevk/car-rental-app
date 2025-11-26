import api from './api';

export const createPaymentOrder = async (bookingId) => {
    const response = await api.post('/payments/create', { bookingId });
    return response.data;
};

export const verifyPayment = async (paymentData) => {
    const response = await api.post('/payments/verify', paymentData);
    return response.data;
};

export const getPaymentByBooking = async (bookingId) => {
    const response = await api.get(`/payments/booking/${bookingId}`);
    return response.data;
};
