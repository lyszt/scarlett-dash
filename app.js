import express from 'express';
import path from 'path';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import mongoose from 'mongoose';
import findOrCreate from 'mongoose-findorcreate';
import session from 'express-session';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
