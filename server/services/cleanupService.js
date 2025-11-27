import Booking from '../models/Booking.js';

export const cleanupStaleBookings = async () => {
    try {
        // 10 minutes ago
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

        // Find bookings that are 'pending' and older than 10 minutes
        const result = await Booking.updateMany(
            {
                status: 'pending',
                createdAt: { $lt: tenMinutesAgo }
            },
            {
                $set: {
                    status: 'cancelled',
                    paymentStatus: 'failed'
                }
            }
        );

        if (result.modifiedCount > 0) {
            console.log(`[Cleanup] Cancelled ${result.modifiedCount} stale pending bookings.`);
        }
    } catch (error) {
        console.error('[Cleanup] Error cleaning up stale bookings:', error);
    }
};
