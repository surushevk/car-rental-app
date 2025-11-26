import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create a review
export const createReview = async (reviewData, token) => {
    const response = await axios.post(`${API_URL}/reviews`, reviewData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Get reviews for a car
export const getCarReviews = async (carId) => {
    const response = await axios.get(`${API_URL}/reviews/${carId}`);
    return response.data;
};
