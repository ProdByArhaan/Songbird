// server/models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    last_login: {
        type: Date
    }
});

// Pre-save middleware to ensure username meets minimum length
userSchema.pre('save', function(next) {
    if (this.username && this.username.length < 3) {
        this.username = this.username.padEnd(3, '_');
    }
    next();
});

export const User = mongoose.model('User', userSchema);