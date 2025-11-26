import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const updateAdminCredentials = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const adminEmail = 'vickysurushe9673@gmail.com';
        const adminPassword = 'Carrental@9359';

        // Check if user exists with this email
        const existingUser = await User.findOne({ email: adminEmail });

        if (existingUser) {
            console.log(`Found existing user with email: ${adminEmail}`);
            console.log(`Current role: ${existingUser.isAdmin ? 'Admin' : 'Regular User'}`);

            // Delete the existing user
            await User.deleteOne({ email: adminEmail });
            console.log('✅ Removed existing user');
        }

        // Create new admin user
        const adminUser = await User.create({
            name: 'Vicky Surushe',
            email: adminEmail,
            password: adminPassword,
            phone: '9359000000', // You can change this
            role: 'admin',
            isAdmin: true,
            isSuperAdmin: true, // Making super admin for full access
        });

        console.log('\n✅ Admin account created successfully!');
        console.log('📧 Email:', adminEmail);
        console.log('🔑 Password:', adminPassword);
        console.log('👑 Role: Super Admin');
        console.log('\nYou can now login with these credentials.');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

updateAdminCredentials();
