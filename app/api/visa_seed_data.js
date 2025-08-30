// Visa seed data for Australia, UK, and Canada
const visaSeedData = [
  // Australia Student Visa
  {
    country: "Australia",
    visaType: "Student",
    title: "Student Visa (Subclass 500)",
    description: "This visa allows you to stay in Australia to study full-time in a registered course.",
    requirements: [
      "Confirmation of Enrolment (CoE) from an Australian education provider",
      "Genuine Temporary Entrant (GTE) statement",
      "English language proficiency test results",
      "Financial evidence showing you can support yourself",
      "Health insurance (OSHC)",
      "Health examinations (if required)",
      "Character requirements"
    ],
    instructions: [
      { step: 1, description: "Choose your course and education provider" },
      { step: 2, description: "Apply for and receive your Confirmation of Enrolment (CoE)" },
      { step: 3, description: "Prepare your visa application documents" },
      { step: 4, description: "Submit your online visa application" },
      { step: 5, description: "Attend health examinations if required" },
      { step: 6, description: "Wait for visa decision" }
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
      "Must meet English language requirements",
      "Must have sufficient funds"
    ],
    documents: [
      { name: "Confirmation of Enrolment (CoE)", required: true, description: "Official document from your education provider" },
      { name: "Passport", required: true, description: "Valid passport with at least 6 months validity" },
      { name: "English test results", required: true, description: "IELTS, TOEFL, or other accepted English tests" },
      { name: "Financial documents", required: true, description: "Bank statements, scholarship letters, or financial guarantee" }
    ],
    applicationUrl: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500",
    additionalInfo: "You can work up to 48 hours per fortnight while studying."
  },

  // UK Student Visa
  {
    country: "UK",
    visaType: "Student",
    title: "Student Visa (Tier 4)",
    description: "This visa allows you to study in the UK if you're 16 or over and want to study at a higher education level.",
    requirements: [
      "Confirmation of Acceptance for Studies (CAS) from a licensed sponsor",
      "Proof of English language ability",
      "Proof of financial support",
      "Valid passport or travel document",
      "Tuberculosis test results (if from certain countries)",
      "Academic Technology Approval Scheme (ATAS) certificate (if required)"
    ],
    instructions: [
      { step: 1, description: "Get accepted on a course by a licensed student sponsor" },
      { step: 2, description: "Receive your Confirmation of Acceptance for Studies (CAS)" },
      { step: 3, description: "Prove your knowledge of English" },
      { step: 4, description: "Show you have enough money to support yourself" },
      { step: 5, description: "Apply online and pay the visa fee" },
      { step: 6, description: "Attend your visa appointment" }
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
      "Must have enough money to support yourself",
      "Must be able to speak, read, write and understand English"
    ],
    documents: [
      { name: "Confirmation of Acceptance for Studies (CAS)", required: true, description: "Reference number from your education provider" },
      { name: "Passport", required: true, description: "Valid passport or travel document" },
      { name: "Financial evidence", required: true, description: "Bank statements or financial sponsorship letter" },
      { name: "English language certificate", required: true, description: "IELTS, TOEFL, or other accepted qualifications" }
    ],
    applicationUrl: "https://www.gov.uk/student-visa",
    additionalInfo: "You can work up to 20 hours per week during term time and full-time during holidays."
  },

  // Canada Student Visa
  {
    country: "Canada",
    visaType: "Student",
    title: "Study Permit",
    description: "A study permit is a document issued by IRCC that allows foreign nationals to study at designated learning institutions (DLI) in Canada.",
    requirements: [
      "Letter of acceptance from a designated learning institution (DLI)",
      "Proof of identity (passport or travel document)",
      "Proof of financial support",
      "Letter of explanation",
      "Medical exam (if required)",
      "Police certificate (if required)",
      "Custodianship declaration (if under 17)"
    ],
    instructions: [
      { step: 1, description: "Get accepted at a designated learning institution" },
      { step: 2, description: "Gather required documents" },
      { step: 3, description: "Apply online or on paper" },
      { step: 4, description: "Pay your fees" },
      { step: 5, description: "Give biometrics (if required)" },
      { step: 6, description: "Wait for processing" }
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
      "Must be a law-abiding citizen with no criminal record",
      "Must be in good health"
    ],
    documents: [
      { name: "Letter of acceptance", required: true, description: "From a designated learning institution in Canada" },
      { name: "Passport", required: true, description: "Valid passport or travel document" },
      { name: "Proof of financial support", required: true, description: "Bank statements, GIC, or scholarship letter" },
      { name: "Statement of purpose", required: true, description: "Letter explaining your study plans" }
    ],
    applicationUrl: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit.html",
    additionalInfo: "You may be eligible to work part-time (20 hours per week) during studies and full-time during breaks."
  },

  // Australia Tourist Visa
  {
    country: "Australia",
    visaType: "Tourist",
    title: "Visitor Visa (Subclass 600)",
    description: "This visa allows you to visit Australia for tourism, business visitor activities or to see family and friends.",
    requirements: [
      "Valid passport",
      "Proof of funds to support your stay",
      "Health insurance (recommended)",
      "Character requirements",
      "Health requirements (if applicable)",
      "Return ticket or proof of onward travel"
    ],
    instructions: [
      { step: 1, description: "Check if you need a visa" },
      { step: 2, description: "Gather required documents" },
      { step: 3, description: "Apply online" },
      { step: 4, description: "Pay the application fee" },
      { step: 5, description: "Wait for visa decision" },
      { step: 6, description: "Check visa conditions before travel" }
    ],
    processingTime: "15-30 days",
    fees: {
      amount: 145,
      currency: "AUD",
      description: "Tourist stream application charge"
    },
    eligibility: [
      "Must be outside Australia when applying",
      "Must have genuine intention to visit temporarily",
      "Must have sufficient funds",
      "Must meet health and character requirements"
    ],
    documents: [
      { name: "Passport", required: true, description: "Valid passport with at least 6 months validity" },
      { name: "Financial documents", required: true, description: "Bank statements showing sufficient funds" },
      { name: "Travel itinerary", required: false, description: "Flight bookings and accommodation details" },
      { name: "Travel insurance", required: false, description: "Comprehensive travel insurance policy" }
    ],
    applicationUrl: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/visitor-600",
    additionalInfo: "You cannot work on this visa. Stay is typically allowed for up to 3, 6 or 12 months."
  },

  // UK Tourist Visa
  {
    country: "UK",
    visaType: "Tourist",
    title: "Standard Visitor Visa",
    description: "You can visit the UK as a Standard Visitor for tourism, business, study (courses up to 6 months) or other permitted activities.",
    requirements: [
      "Valid passport or travel document",
      "Proof you can support yourself during your trip",
      "Proof you have arranged accommodation",
      "Proof of your travel plans",
      "Details of your employment or education",
      "Criminal record certificate (if required)"
    ],
    instructions: [
      { step: 1, description: "Check if you need a visa" },
      { step: 2, description: "Apply online" },
      { step: 3, description: "Book and attend your appointment" },
      { step: 4, description: "Pay the visa fee" },
      { step: 5, description: "Provide biometric information" },
      { step: 6, description: "Wait for a decision" }
    ],
    processingTime: "3 weeks",
    fees: {
      amount: 100,
      currency: "GBP",
      description: "6-month visa fee"
    },
    eligibility: [
      "Must be outside the UK when applying",
      "Must have enough money to support yourself",
      "Must be able to show you'll leave the UK at the end of your visit",
      "Must meet English language requirements (if applicable)"
    ],
    documents: [
      { name: "Passport", required: true, description: "Valid passport or travel document" },
      { name: "Financial evidence", required: true, description: "Bank statements for the last 6 months" },
      { name: "Accommodation proof", required: true, description: "Hotel bookings or invitation letter" },
      { name: "Travel itinerary", required: true, description: "Flight bookings and travel plans" }
    ],
    applicationUrl: "https://www.gov.uk/standard-visitor-visa",
    additionalInfo: "You can usually stay for up to 6 months. You cannot work, study for more than 30 days, or get public funds."
  },

  // Canada Tourist Visa
  {
    country: "Canada",
    visaType: "Tourist",
    title: "Visitor Visa (Temporary Resident Visa)",
    description: "A visitor visa (also called a temporary resident visa) is an official document that shows you meet the requirements needed to enter Canada.",
    requirements: [
      "Valid travel document (passport)",
      "Good health",
      "No criminal or immigration-related convictions",
      "Convince an immigration officer that you have ties to your home country",
      "Convince an immigration officer that you will leave Canada at the end of your visit",
      "Have enough money for your stay"
    ],
    instructions: [
      { step: 1, description: "Check if you need a visitor visa" },
      { step: 2, description: "Gather your documents" },
      { step: 3, description: "Apply online or on paper" },
      { step: 4, description: "Pay your fees" },
      { step: 5, description: "Give biometrics" },
      { step: 6, description: "Wait for processing" }
    ],
    processingTime: "2-4 weeks",
    fees: {
      amount: 100,
      currency: "CAD",
      description: "Visitor visa fee"
    },
    eligibility: [
      "Must have a valid travel document",
      "Must be in good health",
      "Must have no criminal or immigration-related convictions",
      "Must convince officer you'll leave Canada after your visit",
      "Must have enough money for your visit"
    ],
    documents: [
      { name: "Passport", required: true, description: "Valid passport or travel document" },
      { name: "Financial support proof", required: true, description: "Bank statements, pay stubs, or letter from employer" },
      { name: "Purpose of visit", required: true, description: "Letter explaining why you want to visit Canada" },
      { name: "Invitation letter", required: false, description: "If visiting friends or family in Canada" }
    ],
    applicationUrl: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/visitor-visa.html",
    additionalInfo: "You can usually stay for up to 6 months. You cannot work or study without proper permits."
  }
];

export default visaSeedData;