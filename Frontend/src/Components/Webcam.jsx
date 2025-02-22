import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";

const WebcamCapture = () => {
  const webcamRef = useRef(null);
  const [facingMode, setFacingMode] = useState("user");
  const captureInterval = 20000;
  const switchCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  useEffect(() => {
    const captureImages = () => {
      if (webcamRef.current) {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
          fetch("https://your-server.com/upload", {
            method: "POST",
            body: JSON.stringify({ image: imageSrc }),
            headers: { "Content-Type": "application/json" },
          })
            .then((res) => res.json())
            .then((data) => console.log("Uploaded:", data))
            .catch((err) => console.error("Upload failed:", err));
          console.log(imageSrc);
        }
      }
    };
    const intervalId = setInterval(captureImages, captureInterval);
    return () => clearInterval(intervalId);
  }, []);

  const videoConstraints = {
    facingMode: facingMode,
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        className="rounded-lg shadow-lg"
      />
      <div className="mt-4 flex gap-4">
        <button
          onClick={switchCamera}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
        >
          Switch Camera
        </button>
      </div>
    </div>
  );
};

export default WebcamCapture;
