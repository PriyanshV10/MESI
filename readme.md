# MESI - Mess Entry System with Intelligence 

## Overview
MESI (Mess Entry System with Intelligence) is an AI-powered mess entry monitoring system designed to streamline and automate mess entry tracking. This repository contains the frontend for the MESI system, providing a real-time dashboard with data visualization.

## Features
- **Real-time Mess Entry Dashboard**: Live tracking of mess entries with an intuitive UI.
- **Responsive Design**: Built with Tailwind CSS for seamless experience across all devices.
- **Backend API Integration**: Communicates with the backend for real-time data processing.
- **Containerized Deployment**: Easily deployable using Docker.

## Tech Stack
- **React**: JavaScript library for building the user interface.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Docker**: Containerization for easy deployment and scalability.

## Setup Instructions
Follow these steps to set up and run the MESI frontend locally:

1. Clone the repository:
   ```sh
   git clone <repository_url>
   ```
2. Navigate to the frontend folder:
   ```sh
   cd mesi-frontend
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Start the development server:
   ```sh
   npm start
   ```

## Docker Instructions
To containerize and deploy the MESI frontend using Docker:

1. Build the Docker image:
   ```sh
   docker build -t mesi-frontend .
   ```
2. Run the container:
   ```sh
   docker run -p 80:80 mesi-frontend
   ```

## Contribution
We welcome contributions! Feel free to open issues, submit pull requests, or suggest enhancements.



