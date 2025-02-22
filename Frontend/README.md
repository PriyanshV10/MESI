# AI-Powered Mess Entry Monitoring System - Frontend

This is the frontend for the AI-powered Mess Entry Monitoring System. It provides a dashboard for real-time mess entry tracking and data visualization.

## Features

- Real-time mess entry dashboard
- Responsive design using Tailwind CSS
- Integration with the backend APIs

## Tech Stack

- **React**: Frontend library for building the user interface
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Docker**: Containerization for deployment

## Setup Instructions

1. Clone the repository.
2. Navigate to the `frontend` folder.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm start
   ```

## Docker Instructions

1. Build the Docker image:
   ```bash
   docker build -t mess-frontend .
   ```
2. Run the container:
   ```bash
   docker run -p 80:80 mess-frontend
