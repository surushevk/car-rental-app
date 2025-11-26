import axios from 'axios';

const API_URL = 'http://localhost:5000/api/reviews';

// Create a review
export const createReview = async (reviewData) => {
    const response = await axios.post(API_URL, reviewData, {
        withCredentials: true,
    });
    return response.data;
};

// Get reviews for a car
export const getCarReviews = async (carId) => {
    const response = await axios.get(`${API_URL}/${carId}`);
    return response.data;
};
