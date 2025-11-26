import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const checkAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const adminEmail = 'vickysurushe9673@gmail.com';

        const user = await User.findOne({ email: adminEmail });

        if (!user) {
            console.log('❌ User not found!');
            process.exit(1);
        }

        console.log('\n📋 User Details:');
        console.log('Email:', user.email);
        console.log('Name:', user.name);
        console.log('Role:', user.role);
        console.log('isAdmin:', user.role === 'admin');
        console.log('isSuperAdmin:', user.isSuperAdmin);
        console.log('\n');

        if (user.role !== 'admin') {
            console.log('⚠️  ISSUE FOUND: User role is not "admin"');
            console.log('Fixing now...\n');

            user.role = 'admin';
            user.isSuperAdmin = true;
            await user.save();

            console.log('✅ Fixed! User is now an admin.');
        } else {
            console.log('✅ User is already an admin!');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

checkAdmin();
