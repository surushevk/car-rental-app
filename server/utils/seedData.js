import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Car from '../models/Car.js';

dotenv.config();

connectDB();

const users = [
    {
        name: 'Admin User',
        email: 'admin@carrental.com',
        password: 'admin123',
        phone: '+91 9876543210',
        role: 'admin',
        isSuperAdmin: true, // Super admin can create other admins
    },
    {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        phone: '+91 9876543211',
        role: 'user',
    },
];

const cars = [
    {
        name: 'Honda City',
        brand: 'Honda',
        type: 'Sedan',
        fuelType: 'Petrol',
        seats: 5,
        pricePerDay: 2500,
        city: 'Mumbai',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800',
                public_id: 'sample1',
            },
        ],
        features: ['AC', 'Power Steering', 'ABS', 'Airbags', 'Music System'],
        specifications: {
            transmission: 'Manual',
            mileage: '17 km/l',
            engineCapacity: '1498 cc',
            color: 'White',
            year: 2023,
        },
        availability: true,
        ratings: {
            average: 4.5,
            count: 120,
        },
    },
    {
        name: 'Hyundai Creta',
        brand: 'Hyundai',
        type: 'SUV',
        fuelType: 'Diesel',
        seats: 5,
        pricePerDay: 3500,
        city: 'Delhi',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',
                public_id: 'sample2',
            },
        ],
        features: ['AC', 'Power Steering', 'ABS', 'Airbags', 'Sunroof', 'Cruise Control'],
        specifications: {
            transmission: 'Automatic',
            mileage: '16 km/l',
            engineCapacity: '1493 cc',
            color: 'Black',
            year: 2023,
        },
        availability: true,
        ratings: {
            average: 4.7,
            count: 95,
        },
    },
    {
        name: 'Maruti Swift',
        brand: 'Maruti',
        type: 'Hatchback',
        fuelType: 'Petrol',
        seats: 5,
        pricePerDay: 1800,
        city: 'Bangalore',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
                public_id: 'sample3',
            },
        ],
        features: ['AC', 'Power Steering', 'ABS', 'Airbags'],
        specifications: {
            transmission: 'Manual',
            mileage: '22 km/l',
            engineCapacity: '1197 cc',
            color: 'Red',
            year: 2023,
        },
        availability: true,
        ratings: {
            average: 4.3,
            count: 150,
        },
    },
    {
        name: 'Toyota Fortuner',
        brand: 'Toyota',
        type: 'SUV',
        fuelType: 'Diesel',
        seats: 7,
        pricePerDay: 5500,
        city: 'Mumbai',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
                public_id: 'sample4',
            },
        ],
        features: ['AC', 'Power Steering', 'ABS', 'Airbags', '4WD', 'Leather Seats', 'Sunroof'],
        specifications: {
            transmission: 'Automatic',
            mileage: '14 km/l',
            engineCapacity: '2755 cc',
            color: 'Silver',
            year: 2023,
        },
        availability: true,
        ratings: {
            average: 4.8,
            count: 80,
        },
    },
    {
        name: 'BMW 3 Series',
        brand: 'BMW',
        type: 'Luxury',
        fuelType: 'Petrol',
        seats: 5,
        pricePerDay: 8500,
        city: 'Delhi',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
                public_id: 'sample5',
            },
        ],
        features: ['AC', 'Power Steering', 'ABS', 'Airbags', 'Sunroof', 'Cruise Control', 'Premium Sound'],
        specifications: {
            transmission: 'Automatic',
            mileage: '13 km/l',
            engineCapacity: '1998 cc',
            color: 'Blue',
            year: 2023,
        },
        availability: true,
        ratings: {
            average: 4.9,
            count: 45,
        },
    },
    {
        name: 'Tata Nexon EV',
        brand: 'Tata',
        type: 'Electric',
        fuelType: 'Electric',
        seats: 5,
        pricePerDay: 3000,
        city: 'Pune',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800',
                public_id: 'sample6',
            },
        ],
        features: ['AC', 'Power Steering', 'ABS', 'Airbags', 'Regenerative Braking'],
        specifications: {
            transmission: 'Automatic',
            mileage: '312 km range',
            engineCapacity: 'Electric',
            color: 'White',
            year: 2023,
        },
        availability: true,
        ratings: {
            average: 4.6,
            count: 70,
        },
    },
    {
        name: 'Mahindra Thar',
        brand: 'Mahindra',
        type: 'SUV',
        fuelType: 'Diesel',
        seats: 4,
        pricePerDay: 4000,
        city: 'Jaipur',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
                public_id: 'sample7',
            },
        ],
        features: ['AC', 'Power Steering', 'ABS', 'Airbags', '4WD', 'Off-road Capability'],
        specifications: {
            transmission: 'Manual',
            mileage: '15 km/l',
            engineCapacity: '2184 cc',
            color: 'Green',
            year: 2023,
        },
        availability: true,
        ratings: {
            average: 4.7,
            count: 110,
        },
    },
    {
        name: 'Kia Seltos',
        brand: 'Kia',
        type: 'SUV',
        fuelType: 'Petrol',
        seats: 5,
        pricePerDay: 3200,
        city: 'Hyderabad',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=800',
                public_id: 'sample8',
            },
        ],
        features: ['AC', 'Power Steering', 'ABS', 'Airbags', 'Sunroof', 'Wireless Charging'],
        specifications: {
            transmission: 'Automatic',
            mileage: '16 km/l',
            engineCapacity: '1497 cc',
            color: 'Orange',
            year: 2023,
        },
        availability: true,
        ratings: {
            average: 4.6,
            count: 88,
        },
    },
];

const importData = async () => {
    try {
        await User.deleteMany();
        await Car.deleteMany();

        // Create users one by one to trigger password hashing
        const createdUsers = [];
        for (const userData of users) {
            const user = new User(userData);
            await user.save();
            createdUsers.push(user);
        }

        const createdCars = await Car.insertMany(cars);

        console.log('Data Imported!'.green.inverse);
        console.log(`Created ${createdUsers.length} users`.cyan);
        console.log(`Created ${createdCars.length} cars`.cyan);
        console.log('\nAdmin Credentials:'.yellow.bold);
        console.log('Email: admin@carrental.com'.yellow);
        console.log('Password: admin123'.yellow);
        console.log('\nUser Credentials:'.yellow.bold);
        console.log('Email: john@example.com'.yellow);
        console.log('Password: password123'.yellow);
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`.red);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await User.deleteMany();
        await Car.deleteMany();

        console.log('Data Destroyed!'.red.inverse);
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`.red);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
