import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Visa from './abroadease/app/api/models/Visa.js';
import visaSeedData from './visa_seed_data.js';

dotenv.config({ path: './abroadease/app/api/.env' });

const seedVisaData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/abroadease');
    console.log('Connected to MongoDB');

    // Clear existing visa data
    await Visa.deleteMany({});
    console.log('Cleared existing visa data');

    // Insert seed data
    const insertedVisas = await Visa.insertMany(visaSeedData);
    console.log(`Inserted ${insertedVisas.length} visa records`);

    // Display inserted data summary
    const visasByCountry = await Visa.aggregate([
      {
        $group: {
          _id: '$country',
          count: { $sum: 1 },
          visaTypes: { $addToSet: '$visaType' }
        }
      }
    ]);

    console.log('\nVisa data summary:');
    visasByCountry.forEach(country => {
      console.log(`${country._id}: ${country.count} visa types - ${country.visaTypes.join(', ')}`);
    });

    console.log('\nVisa data seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding visa data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedVisaData();