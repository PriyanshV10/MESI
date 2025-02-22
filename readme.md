# AI-Powered Mess Entry Monitoring System

This project is a fully integrated solution to monitor and log mess hall entries using AI-powered computer vision. It automatically counts individuals entering the mess, handles occlusions, filters out non-human objects, and maintains real-time updates. Optional features include facial recognition (with a dedicated enrollment endpoint) and RFID-based identity verification for secure entry logging.

> **Note:** While the backend provides an `/enroll` endpoint for adding new faces, the enrollment functionality has not yet been implemented on the frontend. The dashboard, however, is fully functional.

---

## Problem Statement

In a 30-hour hackathon, this project was built to address the critical need for an automated mess entry monitoring system. The primary goals include:

- **Accurate Detection & Tracking:** Utilize computer vision (OpenCV, DeepFace) to detect and track individuals.
- **Non-Human Object Filtering:** Eliminate false counts from non-human objects.
- **Handling Occlusions:** Ensure correct processing even when multiple entries occur simultaneously.
- **Real-Time Updates:** Stream live data to the dashboard for immediate analysis.
- **Dual-Mode Verification:** Combine facial recognition with RFID to prevent duplicate counting and maintain authentic records.

---

## Technology Stack

- **Backend:**  
  - Python, FastAPI, SQLAlchemy, Uvicorn  
  - OpenCV and DeepFace for image processing and facial recognition  
  - SQLite for lightweight storage  
  - Docker for containerization  

- **Frontend:**  
  - React with Tailwind CSS for a modern, responsive UI  
  - Docker (multi-stage build) with Nginx for serving the production build  

---

## Project Structure

```
project-root/
│
├── backend/
│   ├── config.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   ├── routes.py
│   ├── schemas.py
│   ├── utils.py
│   ├── requirements.txt
│   └── Dockerfile
│
└── frontend/
    ├── src/
    ├── public/
    ├── package.json
    └── Dockerfile
```

---

## Deployment Instructions

### Prerequisites

- Ensure [Docker](https://www.docker.com/) is installed.
- (Optional) Install [Docker Compose](https://docs.docker.com/compose/) if you prefer orchestration.

---

### Backend Deployment

1. **Navigate to the backend directory:**

   ```bash
   cd backend
   ```

2. **Build the Docker image:**

   ```bash
   docker build -t mess-entry-backend .
   ```

3. **Run the Docker container:**

   To allow dynamic management of facial images, make sure you have a local folder (e.g., `faces`) that you want to use for storing face images. Mount this folder as a volume:

   ```bash
   docker run -d -p 8000:8000 -v $(pwd)/faces:/app/faces mess-entry-backend
   ```

   The backend API is now available at [http://localhost:8000](http://localhost:8000).

   - **Endpoints Overview:**
     - `/upload_frame`: Process video frames (images) and log a mess entry.
     - `/enroll`: Enroll a new face along with personal details (currently not linked from the frontend).
     - `/dashboard`: Retrieve mess entry logs for real-time monitoring.
     - Additional endpoints support RFID entry, bulk data insertion, recent entries check, etc.

---

### Frontend Deployment

1. **Navigate to the frontend directory:**

   ```bash
   cd frontend
   ```

2. **Build the Docker image:**

   ```bash
   docker build -t mess-entry-frontend .
   ```

3. **Run the Docker container:**

   ```bash
   docker run -d -p 80:80 mess-entry-frontend
   ```

   The frontend dashboard is accessible at [http://localhost](http://localhost).

   > **Tip:** This multi-stage Docker build first compiles the React app and then serves the production build using Nginx.

---

## Additional Information

- **Faces Directory:**  
  The backend uses a `faces` directory to store images used for facial recognition. For smooth operation, mount your local `faces` folder to the container (as shown above) so that images can be added/updated dynamically.

- **Enrollment Functionality:**  
  Although the backend exposes an `/enroll` endpoint to add new face entries, the frontend does not yet have a corresponding UI for enrollment. Future updates may include a dedicated enrollment interface.

- **Dashboard & Analytics:**  
  The dashboard retrieves real-time mess entry data and logs every entry with details such as name, category, meal type, and entry time. Administrative authentication is done via HTTP Basic (credentials provided in the source).

- **Local Development:**  
  If you prefer running the project without Docker:
  - For the **backend**, install dependencies using:
    ```bash
    pip install -r backend/requirements.txt
    ```
    Then run the backend with:
    ```bash
    uvicorn backend.main:app --host 0.0.0.0 --port 8000
    ```
  - For the **frontend**, navigate to the frontend folder, install dependencies, and start the development server:
    ```bash
    cd frontend
    npm install
    npm start
    ```

---

## Conclusion

This AI-powered Mess Entry Monitoring System provides an end-to-end solution for real-time tracking of mess entries using advanced computer vision techniques. Follow the instructions above to deploy both the backend and frontend using Docker. Enjoy the streamlined deployment experience and the powerful dashboard that simplifies mess management!

Happy deploying!