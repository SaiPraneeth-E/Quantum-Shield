/**
 * Seed one admin user. Run: node scripts/seedAdmin.js
 * Requires: MONGODB_URI and optionally ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME in .env
 */
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/phishing-detection';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin';

async function seed() {
  await mongoose.connect(MONGODB_URI);
  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    await User.updateOne({ email: ADMIN_EMAIL }, { role: 'admin' });
    console.log('Updated existing user to admin:', ADMIN_EMAIL);
  } else {
    await User.create({ name: ADMIN_NAME, email: ADMIN_EMAIL, password: ADMIN_PASSWORD, role: 'admin' });
    console.log('Created admin user:', ADMIN_EMAIL);
  }
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
