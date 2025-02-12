import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "leaflet/dist/leaflet.css";
import "../../styles/newPlan.css";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom"; 

const JoinPlan = () => {
  
  const formData = {
    name: "Visit to the Museum",
    numberOfPeople: 5,
    date: "2025-02-15",
    startTime: "10:00",
    endTime: "13:00",
    location: "Museum of Modern Art",
    category: "Art",
    description: "Join us for a cultural experience at the museum.",
  };

  const coordinates = { lat: 40.4168, lng: -3.7038 }; 

  const navigate = useNavigate(); 

  
  const handleJoinPlan = () => {
    navigate("/"); 
  };

  return (
    <div className="container mt-4">
      <div
        className="newPlanPicture position-relative mb-4"
        style={{
          height: "600px",
          backgroundColor: "#ccc",
          backgroundImage: `url(https://cdn-museabrugge-be.cloud.glue.be/https%3A%2F%2Fwww.museabrugge.be%2Fvolumes%2Fgeneral%2FBezoek-het-Groeningemuseum_Musea-Brugge.jpg?dpr=2&w=1440&h=590&fit=crop&s=3c676338b7222eaf5b274e130e09698e)`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
      ></div>

      <h4 className="text-center mb-4">Plan Details</h4>

      <div style={{ backgroundColor: "#67ABB8", padding: "20px", borderRadius: "10px" }}>
        <div className="mt-4">
          <div className="mb-3">
            <strong>Name: </strong>
            <span>{formData.name}</span>
          </div>

          <div className="mb-3">
            <strong>Number of People: </strong>
            <span>{formData.numberOfPeople}</span>
          </div>

          <div className="mb-3">
            <strong>Date: </strong>
            <span>{formData.date}</span>
          </div>

          <div className="mb-3">
            <strong>Start Time: </strong>
            <span>{formData.startTime}</span>
          </div>

          <div className="mb-3">
            <strong>End Time: </strong>
            <span>{formData.endTime}</span>
          </div>

          <div className="mb-3">
            <strong>Location: </strong>
            <span>{formData.location}</span>
          </div>

          <div className="mb-3">
            <strong>Description: </strong>
            <p>{formData.description}</p>
          </div>

          <div className="mb-3 joinPlanMap" style={{ height: "300px" }}>
            <Map center={[coordinates.lat, coordinates.lng]} zoom={13} style={{ height: "100%", width: "100%" }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[coordinates.lat, coordinates.lng]}>
                <Popup>{formData.location}</Popup>
              </Marker>
            </Map>
          </div>
        </div>
      </div>

      <button type="button" className="btnProfile w-100 mt-3" onClick={handleJoinPlan}>
        Join Plan
      </button>
    </div>
  );
};

export default JoinPlan;
