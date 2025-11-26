import Car from '../models/Car.js';
import Booking from '../models/Booking.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

// @desc    Get all cars with filters
// @route   GET /api/cars
// @access  Public
export const getCars = async (req, res) => {
    try {
        const {
            city,
            type,
            fuelType,
            seats,
            minPrice,
            maxPrice,
            pickupDate,
            dropDate,
            sortBy,
        } = req.query;

        // Build query
        let query = {};

        if (city) query.city = new RegExp(city, 'i');
        if (type) query.type = type;
        if (fuelType) query.fuelType = fuelType;
        if (seats) query.seats = parseInt(seats);
        if (minPrice || maxPrice) {
            query.pricePerDay = {};
            if (minPrice) query.pricePerDay.$gte = parseFloat(minPrice);
            if (maxPrice) query.pricePerDay.$lte = parseFloat(maxPrice);
        }

        // Get cars
        let carsQuery = Car.find(query);

        // Sort
        if (sortBy === 'price-low') {
            carsQuery = carsQuery.sort({ pricePerDay: 1 });
        } else if (sortBy === 'price-high') {
            carsQuery = carsQuery.sort({ pricePerDay: -1 });
        } else {
            carsQuery = carsQuery.sort({ createdAt: -1 });
        }

        let cars = await carsQuery;

        // Filter by availability if dates provided
        if (pickupDate && dropDate) {
            const pickup = new Date(pickupDate);
            const drop = new Date(dropDate);

            // Get all bookings that overlap with requested dates
            const overlappingBookings = await Booking.find({
                status: { $in: ['pending', 'confirmed'] },
                $or: [
                    {
                        pickupDate: { $lte: drop },
                        dropDate: { $gte: pickup },
                    },
                ],
            }).select('car');

            const bookedCarIds = overlappingBookings.map((b) => b.car.toString());

            // Filter out booked cars
            cars = cars.filter((car) => !bookedCarIds.includes(car._id.toString()));
        }

        res.json(cars);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single car
// @route   GET /api/cars/:id
// @access  Public
export const getCarById = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);

        if (car) {
            res.json(car);
        } else {
            res.status(404).json({ message: 'Car not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a car
// @route   POST /api/cars
// @access  Private/Admin
export const createCar = async (req, res) => {
    try {
        const carData = req.body;

        // Handle image uploads if files are present
        if (req.files && req.files.length > 0) {
            const imageUploads = req.files.map(async (file) => {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: 'car-rental',
                });
                // Delete local file after upload
                fs.unlinkSync(file.path);
                return {
                    url: result.secure_url,
                    public_id: result.public_id,
                };
            });

            carData.images = await Promise.all(imageUploads);
        }

        const car = await Car.create(carData);
        res.status(201).json(car);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a car
// @route   PUT /api/cars/:id
// @access  Private/Admin
export const updateCar = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);

        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }

        // Handle new image uploads
        if (req.files && req.files.length > 0) {
            // Delete old images from cloudinary
            if (car.images && car.images.length > 0) {
                await Promise.all(
                    car.images.map((img) => cloudinary.uploader.destroy(img.public_id))
                );
            }

            // Upload new images
            const imageUploads = req.files.map(async (file) => {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: 'car-rental',
                });
                fs.unlinkSync(file.path);
                return {
                    url: result.secure_url,
                    public_id: result.public_id,
                };
            });

            req.body.images = await Promise.all(imageUploads);
        }

        const updatedCar = await Car.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.json(updatedCar);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a car
// @route   DELETE /api/cars/:id
// @access  Private/Admin
export const deleteCar = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);

        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }

        // Delete images from cloudinary
        if (car.images && car.images.length > 0) {
            await Promise.all(
                car.images.map((img) => cloudinary.uploader.destroy(img.public_id))
            );
        }

        await Car.findByIdAndDelete(req.params.id);

        res.json({ message: 'Car removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
