// server/config/passport-setup.js
import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/index.js';

dotenv.config();

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

const callbackURL = process.env.NODE_ENV === 'production'
    ? '/api/auth/google/callback'
    : 'http://localhost:3000/api/auth/google/callback';

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: callbackURL
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // First, try to find user by email
                let user = await User.findOne({ email: profile.emails[0].value });

                if (user) {
                    // Update existing user's last login
                    user.last_login = new Date();
                    await user.save();
                    return done(null, user);
                }

                // If user doesn't exist, create new user with required fields
                user = new User({
                    email: profile.emails[0].value,
                    username: profile.displayName || `user_${profile.id}`, // Ensure username is set
                    googleId: profile.id,
                    created_at: new Date(),
                    last_login: new Date()
                });

                await user.save();
                done(null, user);
            } catch (error) {
                console.error('Error in Google Strategy:', error);
                done(error, null);
            }
        }
    )
);

export default passport;