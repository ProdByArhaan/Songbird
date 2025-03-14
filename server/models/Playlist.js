// server/models/Playlist.js
import mongoose from 'mongoose';

const playlistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description: {
        type: String,
        trim: true,
        maxlength: 500
    },
    songs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song'
    }],
    created_at: {
        type: Date,
        default: Date.now
    },
    is_public: {
        type: Boolean,
        default: false
    }
});

export const Playlist = mongoose.model('Playlist', playlistSchema);