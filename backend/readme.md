# AI-Powered Mess Entry Monitoring System - Backend

This is the backend for the AI-powered Mess Entry Monitoring System. It uses FastAPI to provide APIs for mess entry tracking, facial recognition, and RFID-based authentication.

## Features

- Real-time mess entry tracking
- Facial recognition using DeepFace
- RFID-based authentication
- Duplicate entry prevention
- RESTful APIs for dashboard and data management

## Tech Stack

- **Python**: Core programming language
- **FastAPI**: High-performance API framework
- **SQLite**: Lightweight database for local storage
- **DeepFace**: Facial recognition library
- **Docker**: Containerization for deployment

## Endpoints

### Enrollment Endpoint

- **URL**: `/enroll`
- **Method**: `POST`
- **Description**: Enroll a new person into the system by uploading their image and providing their details.
- **Note**: This endpoint is not implemented in the frontend.

### Other Endpoints

- `/upload_frame`: Upload a frame for real-time recognition.
- `/bulk_data`: Insert bulk mess entry data.
- `/rfid`: Log an entry using RFID.
- `/dashboard`: View all mess entries (admin access required).
- `/known_faces`: Get a list of all enrolled people.
- `/recent_entries`: Get the count of recent entries.
- `/meal_summary`: Get a summary of entries for the current meal.

## Setup Instructions

1. Clone the repository.
2. Navigate to the `backend` folder.
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the application:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```

## Docker Instructions

1. Build the Docker image:
   ```bash
   docker build -t mess-backend .
   ```
2. Run the container:
   ```bash
   docker run -p 8000:8000 -v $(pwd)/faces:/app/faces mess-backend
   ```

## Notes

- The `faces` folder is used to store images for facial recognition. Ensure it is mounted as a volume when running the Docker container.
- The backend is designed to work with the frontend dashboard for real-time mess entry tracking.
