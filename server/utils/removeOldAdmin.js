import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const removeOldAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const oldAdminEmail = 'admin@carrental.com';

        const user = await User.findOne({ email: oldAdminEmail });

        if (!user) {
            console.log('✅ Old admin account not found (already removed)');
            process.exit(0);
        }

        console.log('\n📋 Found old admin:');
        console.log('Email:', user.email);
        console.log('Name:', user.name);
        console.log('Role:', user.role);
        console.log('\nRemoving...\n');

        await User.deleteOne({ email: oldAdminEmail });

        console.log('✅ Old admin account (admin@carrental.com) removed successfully!');
        console.log('\n📌 Only vickysurushe9673@gmail.com can now access admin panel.');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

removeOldAdmin();
