import React, { useState, useContext, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "leaflet/dist/leaflet.css";
import "../../styles/showPlan.css";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";


const ShowPlan = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  const [coordinates, setCoordinates] = useState({
    lat: 40.4168,
    lng: -3.7038,
  });

  useEffect(() => {
    if (store.showedPlan) {
      setCoordinates({
        lat: store.showedPlan.latitude || 40.4168,
        lng: store.showedPlan.longitude || -3.7038,
      });
    }
  }, [store.showedPlan]);

  const handleJoinPlanClick = async () => {
    try {
      const result = await actions.joinPlan(store.showedPlan.id);
      console.log("Unido al plan con éxito:", result);
      navigate("/active-plans");

    } catch (error) {
      console.error("Error al unirse al plan:", error.message);
      await alert(error.message)
      navigate("/loged-home");
    }
  }


  return (
    <div className="container mt-5" style={{ minHeight: "80vh" }}>
      <div
        className="newPlanPicture position-relative mb-4"
        style={{
          height: "300px",
          backgroundColor: "#ccc",
          backgroundImage: `url(${store.showedPlan.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
      >
      </div>

      <h1 className="text-center mb-4" style={{
        backgroundColor: "#67ABB8",
        padding: "20px",
        borderRadius: "15px",
        color: "#0f0f0f"
      }}>{store.showedPlan.name}</h1>

      <div className="d-flex flex-row" style={{
        backgroundColor: "#67ABB8",
        padding: "20px",
        borderRadius: "15px"
      }}>
        <div className="flex-column mt-3 ms-3 me-5 p-4" style={{
          height: "400px",
          width: "90%",
          borderRadius: "15px",
          backgroundColor: "white",
          fontSize: "18px",
          overflow: "hidden",
          wordWrap: "break-word",
          wordBreak: "break-word",
        }}>
          <div className='col mb-3'>
            <i className="fa-solid fa-location-dot fa-lg me-2" style={{ color: "#F15B40" }}></i>
            {store.planAddress}
          </div>
          <div className='col mb-3'>
            <i className="fa-solid fa-person fa-xl me-2" style={{ color: "#F15B40" }}></i>
            {store.showedPlan.people_active} / {store.showedPlan.people}
          </div>
          <div className='col mb-4 '>
            <i className="fa-regular fa-calendar fa-lg me-2" style={{ color: "#F15B40" }}></i>
            {store.showedPlan.date}
            <i className="fa-regular fa-clock fa-lg me-2 ms-5" style={{ color: "#F15B40" }}></i>
            {store.showedPlan.start_time} - {store.showedPlan.end_time}
          </div>
          <div className='col mb-3'>
            <div className='col mb-3 newPlanDescription'>
              {store.showedPlan.description}
            </div>

          </div>
        </div>
        <div className="mb-3 mt-3 me-3 newPlanMap">
          <Map
            center={[coordinates.lat, coordinates.lng]}
            zoom={13}
            style={{ height: "100%", width: "100%", borderRadius: "15px" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[coordinates.lat, coordinates.lng]}>
              <Popup></Popup>
            </Marker>
          </Map>
        </div>
      </div>

      <button type="submit" className="btnProfile w-100 mt-3" onClick={handleJoinPlanClick}>Join Plan</button>
      <button type="button" className="btnProfile w-100 mt-3" onClick={() => navigate("/loged-home")} >
        <i className="fa-solid fa-arrow-left me-2"></i>Back
      </button>
    </div>
  );
};

export default ShowPlan;
