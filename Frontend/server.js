import express from 'express';
import { faker } from '@faker-js/faker';
import cors from 'cors';

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

const meals = ["breakfast", "lunch", "snacks", "dinner"];
const mealTimes = {
  breakfast: { start: "07:30", end: "09:30" },
  lunch: { start: "12:00", end: "14:00" },
  snacks: { start: "17:00", end: "18:00" },
  dinner: { start: "19:30", end: "21:30" },
};

// Function to generate a random meal time (only time in 24-hour format)
const generateRandomMealTime = (mealType) => {
  const mealStart = mealTimes[mealType].start;
  const mealEnd = mealTimes[mealType].end;
  const startTime = new Date(`2025-02-22T${mealStart}:00`);
  const endTime = new Date(`2025-02-22T${mealEnd}:00`);
  
  // Generate random time between meal start and end time
  const randomTime = new Date(startTime.getTime() + Math.random() * (endTime.getTime() - startTime.getTime()));

  // Extract only the time in HH:mm:ss format (24-hour format)
  return randomTime.toLocaleTimeString('en-GB', { hour12: false });
};

// Function to generate random data for people entering the mess for the last 10 days
const generateRandomData = (numRecords) => {
  const records = [];
  const today = new Date();
  
  // Get the last 10 days
  for (let dayOffset = 0; dayOffset < 10; dayOffset++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() - dayOffset);
    const formattedDate = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    for (let i = 0; i < numRecords / 10; i++) { // Distribute 10,000 records across 10 days
      const id = records.length + 1; // Incrementing ID
      const name = faker.person.firstName() + " " + faker.person.lastName(); // Random full name
      const mealType = meals[Math.floor(Math.random() * meals.length)]; // Random meal type
      const time = generateRandomMealTime(mealType); // Generate random time for meal type
      records.push({ id, name, mealType, time, date: formattedDate });
    }
  }

  return records;
};

// Variable to store the current records
let currentRecords = generateRandomData(10000); // Generate 10,000 records for the last 10 days

// Update the data every 5 seconds (5000ms)
setInterval(() => {
  currentRecords = generateRandomData(10000); // Regenerate data every 5 seconds
  console.log("Data updated at:", new Date().toLocaleTimeString());
}, 5000);

// API route to return the data
app.get("/api/mess", (req, res) => {
  res.json(currentRecords); // Return the current records
});

// Start the server
app.listen(port, () => {
  console.log(`Mess Management API running at http://localhost:${port}`);
});
