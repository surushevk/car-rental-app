import mongoose from 'mongoose';

const carSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide car name'],
            trim: true,
        },
        brand: {
            type: String,
            required: [true, 'Please provide car brand'],
        },
        type: {
            type: String,
            required: [true, 'Please provide car type'],
            enum: ['Sedan', 'SUV', 'Hatchback', 'Luxury', 'Sports', 'Electric'],
        },
        fuelType: {
            type: String,
            required: [true, 'Please provide fuel type'],
            enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'],
        },
        seats: {
            type: Number,
            required: [true, 'Please provide number of seats'],
            min: 2,
            max: 8,
        },
        pricePerDay: {
            type: Number,
            required: [true, 'Please provide price per day'],
            min: 0,
        },
        city: {
            type: String,
            required: [true, 'Please provide city'],
        },
        images: [
            {
                url: String,
                public_id: String,
            },
        ],
        features: [String],
        specifications: {
            transmission: {
                type: String,
                enum: ['Manual', 'Automatic'],
                default: 'Manual',
            },
            mileage: String,
            engineCapacity: String,
            color: String,
            year: Number,
        },
        availability: {
            type: Boolean,
            default: true,
        },
        ratings: {
            average: {
                type: Number,
                default: 0,
                min: 0,
                max: 5,
            },
            count: {
                type: Number,
                default: 0,
            },
        },
    },
    {
        timestamps: true,
    }
);

// Index for search optimization
carSchema.index({ city: 1, type: 1, pricePerDay: 1 });

const Car = mongoose.model('Car', carSchema);

export default Car;
