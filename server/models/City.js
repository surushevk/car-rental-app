import mongoose from 'mongoose';

const citySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'City name is required'],
            unique: true,
            trim: true,
        },
        state: {
            type: String,
            required: [true, 'State is required'],
            trim: true,
        },
        imageUrl: {
            type: String,
            default: '',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
citySchema.index({ isActive: 1 });
citySchema.index({ name: 1 });

export default mongoose.model('City', citySchema);
