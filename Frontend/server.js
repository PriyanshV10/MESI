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

// Function to generate a random meal time
const generateRandomMealTime = (mealType) => {
  const mealStart = mealTimes[mealType].start;
  const mealEnd = mealTimes[mealType].end;
  const startTime = new Date(`2025-02-22T${mealStart}:00`);
  const endTime = new Date(`2025-02-22T${mealEnd}:00`);
  
  // Generate random time between meal start and end time
  const randomTime = new Date(startTime.getTime() + Math.random() * (endTime.getTime() - startTime.getTime()));
  return randomTime.toISOString().slice(0, 19).replace("T", " ");
};

// Function to generate random data for people entering the mess
const generateRandomData = (numRecords) => {
  const records = [];
  for (let i = 0; i < numRecords; i++) {
    const id = i + 1; // Simple increment for id
    const name = faker.name.firstName() + " " + faker.name.lastName(); // Random full name
    const mealType = meals[Math.floor(Math.random() * meals.length)]; // Random meal type
    const time = generateRandomMealTime(mealType); // Generate random time for meal type
    const date = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format
    
    records.push({ id, name, mealType, time, date });
  }
  return records;
};

// API route to return the data
app.get("/api/mess", (req, res) => {
  const records = generateRandomData(1000); // Generate 1000 records
  res.json(records);
});

// Start the server
app.listen(port, () => {
  console.log(`Mess Management API running at http://localhost:${port}`);
});
