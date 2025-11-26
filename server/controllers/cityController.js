import City from '../models/City.js';

// @desc    Get all active cities
// @route   GET /api/cities
// @access  Public
export const getCities = async (req, res) => {
    try {
        const cities = await City.find({ isActive: true })
            .select('name state imageUrl')
            .sort({ name: 1 });

        res.json(cities);
    } catch (error) {
        console.error('Error fetching cities:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all cities (including inactive) - Admin only
// @route   GET /api/cities/all
// @access  Private/Admin
export const getAllCities = async (req, res) => {
    try {
        const cities = await City.find()
            .select('name state imageUrl isActive createdAt')
            .sort({ name: 1 });

        res.json(cities);
    } catch (error) {
        console.error('Error fetching all cities:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Add new city
// @route   POST /api/cities
// @access  Private/Admin
export const addCity = async (req, res) => {
    try {
        const { name, state } = req.body;

        // Check if city already exists
        const existingCity = await City.findOne({ name: name.trim() });
        if (existingCity) {
            return res.status(400).json({ message: 'City already exists' });
        }

        const city = await City.create({
            name: name.trim(),
            state: state.trim(),
            createdBy: req.user._id,
        });

        res.status(201).json(city);
    } catch (error) {
        console.error('Error adding city:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update city
// @route   PUT /api/cities/:id
// @access  Private/Admin
export const updateCity = async (req, res) => {
    try {
        const { name, state, imageUrl, isActive } = req.body;

        const city = await City.findById(req.params.id);

        if (!city) {
            return res.status(404).json({ message: 'City not found' });
        }

        // Check if new name conflicts with existing city
        if (name && name !== city.name) {
            const existingCity = await City.findOne({ name: name.trim() });
            if (existingCity) {
                return res.status(400).json({ message: 'City name already exists' });
            }
        }

        city.name = name?.trim() || city.name;
        city.state = state?.trim() || city.state;
        city.imageUrl = imageUrl || city.imageUrl;
        if (typeof isActive !== 'undefined') {
            city.isActive = isActive;
        }

        await city.save();

        res.json(city);
    } catch (error) {
        console.error('Error updating city:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete city (soft delete)
// @route   DELETE /api/cities/:id
// @access  Private/Admin
export const deleteCity = async (req, res) => {
    try {
        const city = await City.findById(req.params.id);

        if (!city) {
            return res.status(404).json({ message: 'City not found' });
        }

        city.isActive = false;
        await city.save();

        res.json({ message: 'City deleted successfully' });
    } catch (error) {
        console.error('Error deleting city:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
