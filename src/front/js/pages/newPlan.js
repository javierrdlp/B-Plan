import React, { useState, useContext, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "leaflet/dist/leaflet.css";
import "../../styles/newPlan.css";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

const NewPlan = () => {
  const { store, actions } = useContext(Context);
  const [selectedImg, setSelectedImg] = useState(
    "https://i0.wp.com/eltiempolatino.com/wp-content/uploads/2022/08/cine.jpg?fit=1200%2C613&ssl=1"
  );
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    numberOfPeople: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    category: 1,
    description: "",
  });

  useEffect(() => {
    actions.getCategories();
  }, []);

  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [coordinates, setCoordinates] = useState({
    lat: 40.4168,
    lng: -3.7038,
  });
  const [isEditing, setIsEditing] = useState({
    name: false,
    numberOfPeople: false,
    date: false,
    startTime: false,
    endTime: false,
    location: false,
    category: false,
    description: false,
  });
  const navigate = useNavigate();
  const toggleEdit = (field) => {
    setIsEditing((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageSelect = (category) => {
    switch (category) {
      case "Shows":
        setSelectedImg(
          "https://i0.wp.com/eltiempolatino.com/wp-content/uploads/2022/08/cine.jpg?fit=1200%2C613&ssl=1"
        );
        setFormData((prevData) => ({
          ...prevData,
          ["category"]: 1,
        }));
        break;
      case "Restaurants":
        setSelectedImg(
          "https://www.clarin.com/2015/03/20/rkfYDQ027l_1200x0.jpg"
        );
        setFormData((prevData) => ({
          ...prevData,
          ["category"]: 2,
        }));
        break;
      case "Outdoors":
        setSelectedImg(
          "https://cdn.businessinsider.es/sites/navi.axelspringer.es/public/media/image/2022/08/amigos-piscina-verano-2777265.jpg?tf=3840x"
        );
        setFormData((prevData) => ({
          ...prevData,
          ["category"]: 3,
        }));
        break;
      case "Sports":
        setSelectedImg(
          "https://mongooseagency.com/files/3415/9620/1413/Return_of_Sports.jpg"
        );
        setFormData((prevData) => ({
          ...prevData,
          ["category"]: 4,
        }));
        break;
      case "Art":
        setSelectedImg(
          "https://cdn-museabrugge-be.cloud.glue.be/https%3A%2F%2Fwww.museabrugge.be%2Fvolumes%2Fgeneral%2FBezoek-het-Groeningemuseum_Musea-Brugge.jpg?dpr=2&w=1440&h=590&fit=crop&s=3c676338b7222eaf5b274e130e09698e"
        );
        setFormData((prevData) => ({
          ...prevData,
          ["category"]: 5,
        }));
        break;
      default:
        break;
    }
    setShowImageOptions(false);
  };

  const handleLocationChange = async (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      location: value,
    }));

    if (value.length > 3) {
      try {
        const response = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${value}&key=d0698834246341fe9a58e498380bbb69&language=es&limit=5&countrycode=es&bounds=40.388791,-3.694706|40.675083,-3.271308`
        );
        const data = await response.json();

        const madridResults = data.results.filter(result => {
          const { lat, lng } = result.geometry;
          return lat >= 40.388791 && lat <= 40.675083 && lng >= -3.694706 && lng <= -3.271308;
        });

        setLocationSuggestions(madridResults);
        if (madridResults.length > 0) {
          setCoordinates({
            lat: madridResults[0].geometry.lat,
            lng: madridResults[0].geometry.lng,
          });
        }
      } catch (error) {
        console.error("Error fetching location data: ", error);
      }
    } else {
      setLocationSuggestions([]);
    }
  };
  const handleSaveChanges = async () => {
    const planData = {
      name: formData.name,
      people: formData.numberOfPeople,
      date: formData.date,
      start_time: formData.startTime,
      end_time: formData.endTime,
      latitude: coordinates.lat,
      longitude: coordinates.lng,
      category_id: formData.category,
      image: selectedImg,
    };

    try {
      await actions.createPlan(planData);
      navigate("/");
    } catch (error) {
      console.error("Error al crear el plan:", error);
    }
  };
  return (
    <div className="container mt-4">
      <div
        className="newPlanPicture position-relative mb-4"
        style={{
          height: "600px",
          backgroundColor: "#ccc",
          backgroundImage: `url(${selectedImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <button
          className="btnSwap position-absolute"
          style={{
            bottom: "10px",
            right: "10px",
            padding: "10px 20px",
            borderRadius: "50%",
            zIndex: 10,
          }}
          onClick={() => setShowImageOptions(!showImageOptions)}
        >
          <i className="fa-solid fa-arrows-rotate"></i>
        </button>

        {showImageOptions && (
          <div
            className="boxOptions position-absolute bottom-0 end-0 m-3 p-3 rounded"
            style={{
              maxWidth: "200px",
            }}
          >
            <div className="d-flex flex-column">
            
              <button
                className="btnOptions mb-2"
                onClick={() => handleImageSelect("Shows")}
              >
                Shows
              </button>
              <button
                className="btnOptions mb-2"
                onClick={() => handleImageSelect("Restaurants")}
              >
                Restaurants
              </button>
              <button
                className="btnOptions mb-2"
                onClick={() => handleImageSelect("Outdoors")}
              >
                Outdoors
              </button>
              <button
                className="btnOptions mb-2"
                onClick={() => handleImageSelect("Sports")}
              >
                Sports
              </button>
              <button
                className="btnOptions mb-2"
                onClick={() => handleImageSelect("Art")}
              >
                Art
              </button>
            </div>
          </div>
        )}
      </div>

      <h4 className="text-center mb-4">Create a New Plan</h4>

      <div style={{ backgroundColor: "#67ABB8", padding: "20px", borderRadius: "10px" }}>
        <form className="form mt-4">

          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!isEditing.name}
                placeholder="Your plan name"
              />
              <span
                className="input-group-text"
                onClick={() => toggleEdit("name")}
                style={{ cursor: "pointer" }}
              >
                <i className="fa-solid fa-pencil"></i>
              </span>
            </div>
          </div>


          <div className="mb-3">
            <label htmlFor="numberOfPeople" className="form-label">
              Number of People
            </label>
            <div className="input-group">
              <input
                type="number"
                className="form-control"
                id="numberOfPeople"
                name="numberOfPeople"
                value={formData.numberOfPeople}
                onChange={handleInputChange}
                disabled={!isEditing.numberOfPeople}
                placeholder="Number of people"
              />
              <span
                className="input-group-text"
                onClick={() => toggleEdit("numberOfPeople")}
                style={{ cursor: "pointer" }}
              >
                <i className="fa-solid fa-pencil"></i>
              </span>
            </div>
          </div>


          <div className="mb-3">
            <label htmlFor="date" className="form-label">
              Date
            </label>
            <div className="input-group">
              <input
                type="date"
                className="form-control"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                disabled={!isEditing.date}
              />
              <span
                className="input-group-text"
                onClick={() => toggleEdit("date")}
                style={{ cursor: "pointer" }}
              >
                <i className="fa-solid fa-pencil"></i>
              </span>
            </div>
          </div>


          <div className="mb-3">
            <label htmlFor="startTime" className="form-label">
              Start Time
            </label>
            <div className="input-group">
              <input
                type="time"
                className="form-control"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                disabled={!isEditing.startTime}
              />
              <span
                className="input-group-text"
                onClick={() => toggleEdit("startTime")}
                style={{ cursor: "pointer" }}
              >
                <i className="fa-solid fa-pencil"></i>
              </span>
            </div>
          </div>


          <div className="mb-3">
            <label htmlFor="endTime" className="form-label">
              End Time
            </label>
            <div className="input-group">
              <input
                type="time"
                className="form-control"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                disabled={!isEditing.endTime}
              />
              <span
                className="input-group-text"
                onClick={() => toggleEdit("endTime")}
                style={{ cursor: "pointer" }}
              >
                <i className="fa-solid fa-pencil"></i>
              </span>
            </div>
          </div>


          <div className="mb-3">
            <label htmlFor="location" className="form-label">
              Location
            </label>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleLocationChange}
                disabled={!isEditing.location}
                placeholder="Enter location"
              />
              <span
                className="input-group-text"
                onClick={() => toggleEdit("location")}
                style={{ cursor: "pointer" }}
              >
                <i className="fa-solid fa-pencil"></i>
              </span>
            </div>
            <ul className="list-group mt-2">
              {locationSuggestions.map((suggestion) => (
                <li
                  className="list-group-item"
                  key={suggestion.formatted}
                  onClick={() => {
                    setFormData({ ...formData, location: suggestion.formatted });
                    setCoordinates({
                      lat: suggestion.geometry.lat,
                      lng: suggestion.geometry.lng,
                    });
                    setLocationSuggestions([]);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {suggestion.formatted}
                </li>
              ))}
            </ul>
          </div>


          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <div className="input-group">
              <textarea
                className="form-control"
                id="description"
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleInputChange}
                disabled={!isEditing.description}
                placeholder="Describe your plan"
              />
              <span
                className="input-group-text"
                onClick={() => toggleEdit("description")}
                style={{ cursor: "pointer" }}
              >
                <i className="fa-solid fa-pencil"></i>
              </span>
            </div>
          </div>


          <div className="mb-3 newPlanMap">
            <Map
              center={[coordinates.lat, coordinates.lng]}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[coordinates.lat, coordinates.lng]}>
                <Popup>{formData.location}</Popup>
              </Marker>
            </Map>
          </div>
        </form>
      </div>
      <button type="submit" className="btnProfile w-100 mt-3" onClick={handleSaveChanges}>Save Changes</button>
    </div>
  );
};

export default NewPlan;
