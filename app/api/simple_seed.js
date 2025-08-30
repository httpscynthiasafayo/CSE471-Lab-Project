import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: './abroadease/app/api/.env' });

// Simple visa schema
const visaSchema = new mongoose.Schema({
  country: String,
  visaType: String,
  title: String,
  description: String,
  requirements: [String],
  instructions: [{
    step: Number,
    description: String
  }],
  processingTime: String,
  fees: {
    amount: Number,
    currency: String,
    description: String
  },
  eligibility: [String],
  documents: [{
    name: String,
    required: Boolean,
    description: String
  }],
  applicationUrl: String,
  additionalInfo: String
}, { timestamps: true });

const Visa = mongoose.model('Visa', visaSchema);

const sampleVisas = [
  {
    country: "Australia",
    visaType: "Student",
    title: "Student Visa (Subclass 500)",
    description: "This visa allows you to stay in Australia to study full-time in a registered course.",
    requirements: [
      "Confirmation of Enrolment (CoE) from an Australian education provider",
      "Genuine Temporary Entrant (GTE) statement",
      "English language proficiency test results",
      "Financial evidence showing you can support yourself"
    ],
    instructions: [
      { step: 1, description: "Choose your course and education provider" },
      { step: 2, description: "Apply for and receive your Confirmation of Enrolment (CoE)" },
      { step: 3, description: "Prepare your visa application documents" },
      { step: 4, description: "Submit your online visa application" }
    ],
    processingTime: "4-6 weeks",
    fees: {
      amount: 650,
      currency: "AUD",
      description: "Base application charge"
    },
    eligibility: [
      "Must be enrolled in a registered course",
      "Must have adequate health insurance",
      "Must meet English language requirements"
    ],
    documents: [
      { name: "Confirmation of Enrolment (CoE)", required: true, description: "Official document from your education provider" },
      { name: "Passport", required: true, description: "Valid passport with at least 6 months validity" }
    ],
    applicationUrl: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500",
    additionalInfo: "You can work up to 48 hours per fortnight while studying."
  },
  {
    country: "UK",
    visaType: "Student",
    title: "Student Visa (Tier 4)",
    description: "This visa allows you to study in the UK if you're 16 or over and want to study at a higher education level.",
    requirements: [
      "Confirmation of Acceptance for Studies (CAS) from a licensed sponsor",
      "Proof of English language ability",
      "Proof of financial support",
      "Valid passport or travel document"
    ],
    instructions: [
      { step: 1, description: "Get accepted on a course by a licensed student sponsor" },
      { step: 2, description: "Receive your Confirmation of Acceptance for Studies (CAS)" },
      { step: 3, description: "Prove your knowledge of English" },
      { step: 4, description: "Apply online and pay the visa fee" }
    ],
    processingTime: "3 weeks",
    fees: {
      amount: 363,
      currency: "GBP",
      description: "Standard application fee"
    },
    eligibility: [
      "Must be 16 or over",
      "Must have been offered a place on a course",
      "Must have enough money to support yourself"
    ],
    documents: [
      { name: "Confirmation of Acceptance for Studies (CAS)", required: true, description: "Reference number from your education provider" },
      { name: "Passport", required: true, description: "Valid passport or travel document" }
    ],
    applicationUrl: "https://www.gov.uk/student-visa",
    additionalInfo: "You can work up to 20 hours per week during term time and full-time during holidays."
  },
  {
    country: "Canada",
    visaType: "Student",
    title: "Study Permit",
    description: "A study permit is a document issued by IRCC that allows foreign nationals to study at designated learning institutions (DLI) in Canada.",
    requirements: [
      "Letter of acceptance from a designated learning institution (DLI)",
      "Proof of identity (passport or travel document)",
      "Proof of financial support",
      "Letter of explanation"
    ],
    instructions: [
      { step: 1, description: "Get accepted at a designated learning institution" },
      { step: 2, description: "Gather required documents" },
      { step: 3, description: "Apply online or on paper" },
      { step: 4, description: "Pay your fees" }
    ],
    processingTime: "4-12 weeks",
    fees: {
      amount: 150,
      currency: "CAD",
      description: "Study permit fee"
    },
    eligibility: [
      "Must be accepted by a designated learning institution",
      "Must prove you have enough money for tuition and living expenses",
      "Must be a law-abiding citizen with no criminal record"
    ],
    documents: [
      { name: "Letter of acceptance", required: true, description: "From a designated learning institution in Canada" },
      { name: "Passport", required: true, description: "Valid passport or travel document" }
    ],
    applicationUrl: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit.html",
    additionalInfo: "You may be eligible to work part-time (20 hours per week) during studies and full-time during breaks."
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/abroadease', {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('Connected to MongoDB');

    // Insert sample data
    const result = await Visa.insertMany(sampleVisas);
    console.log(`Inserted ${result.length} visa records`);

    console.log('Visa data seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding visa data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedData();