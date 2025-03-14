// server/models/Song.js
import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
    genius_id: {
        type: Number,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    artist: {
        type: String,
        required: true,
        trim: true
    },
    album: {
        type: String,
        trim: true
    },
    image_url: String,
    play_count: {
        type: Number,
        default: 0
    },
    last_played: Date
});

export const Song = mongoose.model('Song', songSchema);