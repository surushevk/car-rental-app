import mongoose from 'mongoose';
import City from '../models/City.js';
import dotenv from 'dotenv';

dotenv.config();

const cities = [
    {
        name: 'Mumbai',
        state: 'Maharashtra',
        imageUrl: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=500&q=80' // Gateway of India
    },
    {
        name: 'Delhi',
        state: 'Delhi',
        imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=500&q=80' // India Gate
    },
    {
        name: 'Bangalore',
        state: 'Karnataka',
        imageUrl: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=500&q=80' // Bangalore Palace
    },
    {
        name: 'Hyderabad',
        state: 'Telangana',
        imageUrl: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=500&q=80' // Charminar
    },
    {
        name: 'Chennai',
        state: 'Tamil Nadu',
        imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=500&q=80' // Marina Beach
    },
    {
        name: 'Kolkata',
        state: 'West Bengal',
        imageUrl: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=500&q=80' // Victoria Memorial
    },
    {
        name: 'Pune',
        state: 'Maharashtra',
        imageUrl: 'https://images.unsplash.com/photo-1595436092888-c4c84ff900c0?w=500&q=80' // Shaniwar Wada
    },
    {
        name: 'Ahmedabad',
        state: 'Gujarat',
        imageUrl: 'https://images.unsplash.com/photo-1627916607164-7b20241db935?w=500&q=80' // Sabarmati Ashram
    },
    {
        name: 'Jaipur',
        state: 'Rajasthan',
        imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=500&q=80' // Hawa Mahal
    },
    {
        name: 'Goa',
        state: 'Goa',
        imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=500&q=80' // Goa Beach
    },
    {
        name: 'Udaipur',
        state: 'Rajasthan',
        imageUrl: 'https://images.unsplash.com/photo-1580759748857-3b284285e9e9?w=500&q=80' // City Palace
    },
    {
        name: 'Agra',
        state: 'Uttar Pradesh',
        imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&q=80' // Taj Mahal
    },
    {
        name: 'Varanasi',
        state: 'Uttar Pradesh',
        imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=500&q=80' // Ghats
    },
    {
        name: 'Guwahati',
        state: 'Assam',
        imageUrl: 'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=500&q=80' // Kamakhya Temple
    },
    {
        name: 'Kochi',
        state: 'Kerala',
        imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=500&q=80' // Chinese Fishing Nets
    },
];

const seedCities = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log('Connected to MongoDB');

        // Delete existing cities and reseed with images
        await City.deleteMany({});
        console.log('Cleared existing cities');

        // Insert cities with images
        await City.insertMany(cities);

        console.log('✅ Cities seeded successfully with images!');
        console.log(`📍 Added ${cities.length} cities`);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding cities:', error);
        process.exit(1);
    }
};

seedCities();
