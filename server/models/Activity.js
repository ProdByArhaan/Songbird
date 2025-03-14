// server/models/Activity.js
import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['search', 'view']
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    query: String,
    songTitle: String,
    artistName: String,
    albumCover: String
});

// Index for efficient querying
activitySchema.index({ user_id: 1, timestamp: -1 });

export const Activity = mongoose.model('Activity', activitySchema);