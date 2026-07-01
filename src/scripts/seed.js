const mongoose = require('mongoose');
const Vault = require('../models/Vault');
require('dotenv').config({ path: '../../.env' });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart_vault';

const seedVaults = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected for Seeding');

    // Clear existing vaults
    await Vault.deleteMany({});
    console.log('Cleared existing vaults');

    // Create demo lockers
    const vaults = [
      {
        lockerNo: 'L001',
        status: 'available',
        price: 50,
        location: 'Ground Floor, North Wing',
        slotDate: new Date().toISOString().split('T')[0],
        timeSlot: '24 Hours'
      },
      {
        lockerNo: 'L002',
        status: 'available',
        price: 75,
        location: 'Ground Floor, South Wing',
        slotDate: new Date().toISOString().split('T')[0],
        timeSlot: '24 Hours'
      },
      {
        lockerNo: 'L003',
        status: 'available',
        price: 100,
        location: 'First Floor, VIP Lounge',
        slotDate: new Date().toISOString().split('T')[0],
        timeSlot: '24 Hours'
      },
      {
        lockerNo: 'L004',
        status: 'booked',
        price: 50,
        location: 'Ground Floor, North Wing',
        slotDate: new Date().toISOString().split('T')[0],
        timeSlot: '24 Hours'
      }
    ];

    await Vault.insertMany(vaults);
    console.log(`Successfully seeded ${vaults.length} vaults`);

    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
};

seedVaults();
