import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";

const WebcamCapture = () => {
  const webcamRef = useRef(null);
  const [facingMode, setFacingMode] = useState("user");
  const captureInterval = 2000;
  const switchCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  useEffect(() => {
    const captureImages = () => {
      if (webcamRef.current) {
        const imageSrc = webcamRef.current.getScreenshot();
        // if (imageSrc) {
        //   const img = new Image();
        //   img.src = imageSrc;
        //   img.onload = () => {
        //     console.log(
        //       "Captured Image Dimensions:",
        //       img.width,
        //       "x",
        //       img.height
        //     );
        //   };
        // }
        // const base64Data = imageSrc.replace(/^data:image\/\w+;base64,/, "");
        // console.log(imageSrc);
        if (imageSrc) {
          fetch("https://precise-divine-lab.ngrok-free.app/upload_frame", {
            method: "POST",
            body: JSON.stringify({ image: imageSrc }),
            headers: { "Content-Type": "application/json" },
          })
            .then((res) => res.json())
            .then((data) => console.log("Uploaded:", data))
            .catch((err) => console.error("Upload failed:", err));
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
