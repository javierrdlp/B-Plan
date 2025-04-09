import React, { useContext, useEffect, useState, useRef } from "react";
import { Context, useActions } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { Carousel } from "react-bootstrap";
import "../../styles/home.css";
import "../../styles/profile.css";
import logoFondo from "../../img/logo_fondo.png";


export const ActivePlans = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();


  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("profileImage") || "https://cdn3.iconfinder.com/data/icons/avatars-9/145/Avatar_Dog-512.png"
  );

  const [backgroundImage, setBackgroundImage] = useState(
    localStorage.getItem("backgroundImage") || "https://plus.unsplash.com/premium_photo-1685082778336-282f52a3a923?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Zm9uZG8lMjBwYW50YWxsYSUyMGRlJTIwY29sb3Jlc3xlbnwwfHwwfHx8MA=="
  );

  const profileFileInputRef = useRef(null);
  const backgroundFileInputRef = useRef(null);

  useEffect(() => {
    document.title = "Active Plans";
    actions.updatePlanStatus();
    actions.getActivePlans();
    actions.getProfile();
  }, [actions]);


  const handleProfileImageChange = (event) => {
    const archivo = event.target.files[0];
    if (archivo) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const newProfileImage = e.target.result;
        setProfileImage(newProfileImage);
        localStorage.setItem("profileImage", newProfileImage);
      };
      reader.readAsDataURL(archivo);
    }
  };

  const handleBackgroundImageChange = (event) => {
    const archivo = event.target.files[0];
    if (archivo) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const newBackgroundImage = e.target.result;
        setBackgroundImage(newBackgroundImage);
        localStorage.setItem("backgroundImage", newBackgroundImage);
      };
      reader.readAsDataURL(archivo);
    }
  };

  const handleProfileButtonClick = () => {
    profileFileInputRef.current.click();
  };

  const handleBackgroundButtonClick = () => {
    backgroundFileInputRef.current.click();
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleHistoryClick = () => {
    navigate("/plans-history");
  };


  const activePlans = [
    { date: "2024-07-10", title: "Active Plan A" },
    { date: "2024-08-12", title: "Active Plan B" },
    { date: "2024-09-05", title: "Active Plan C" },
    { date: "2024-10-18", title: "Active Plan D" },
    { date: "2024-11-30", title: "Active Plan E" },
    { date: "2024-12-10", title: "Active Plan F" },
  ];

  const handleDeleteUser = async () => {
    try {
      await actions.deleteUser();
      navigate("/");
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
  };

  const handleDeletePlan = async (planId) => {
    const userId = store.user?.id;
    if (!planId) {
      console.error("Plan ID no válido");
      return;
    }
    try {
      await actions.deletePlan(planId, userId);
    } catch (error) {
      console.error("Error al eliminar el plan:", error);
    }
  };


  const chunkPlans = (plans, chunkSize) => {
    const result = [];
    for (let i = 0; i < plans.length; i += chunkSize) {
      result.push(plans.slice(i, i + chunkSize));
    }
    return result;
  };

  const filteredPlans = store.activePlans.filter(plan => plan.status !== "closed");
  const groupedPlans = chunkPlans(filteredPlans, 4);

  return (
    <div className="container mt-4" style={{ minHeight: "80vh" }}>
      <div
        id="profileBackground"
        className="mb-3 position-relative"
        style={{
          height: "300px",
          backgroundColor: "#ccc",
          backgroundImage: `url(${logoFondo})`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
        }}
      >
        <button type="button" className="mt-3 ms-3 border-3 border-dark btn btn-danger" data-bs-toggle="modal" data-bs-target="#Modal">
          Delete Account
        </button>
        <div className="modal fade" id="Modal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Are you sure you want to delete the account?</h5>
                <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                With this you confirm that you want to delete your account forever.
              </div>
              <div className="modal-footer">
                <button type="button" className="mt-1 ms-1 border-3 border-dark btn btn-danger" onClick={handleDeleteUser}>Delete Account</button>
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de la imagen de perfil */}
      <div className="d-flex justify-content-center mb-4">
        <div className="position-relative">
          {!profileImage ? (
            <div
              className="rounded-circle"
              style={{
                width: "150px",
                height: "150px",
                backgroundColor: "#e9ecef",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "30px",
                color: "#6c757d",
              }}
            ></div>
          ) : (
            <img
              src={profileImage}
              alt="Profile"
              className="rounded-circle border border-black border-5"
              style={{
                width: "150px",
                height: "150px",
                objectFit: "cover",
              }}
            />
          )}
          <button
            onClick={handleProfileButtonClick}
            className="btnProfile position-absolute"
            style={{
              bottom: "0px",
              right: "0px",
              padding: "5px 10px",
              borderRadius: "50%",
              zIndex: 10,
            }}
          >
            <i className="fa-solid fa-camera-retro"></i>
          </button>
        </div>
      </div>

      {/* Nombre del usuario */}
      <div className="text-center mb-4">
        <h4>{store.user?.name || "User Name"}</h4>
      </div>

      <hr className="my-4" />

      {/* Botones de navegación */}
      <div className="row text-center mb-4">
        <div className="col">
          <button onClick={handleProfileClick} className="btnProfile w-100">
            Account
          </button>
        </div>
        <div className="col">
          <button className="btnProfile w-100">Active plans</button>
        </div>
        <div className="col">
          <button onClick={handleHistoryClick} className="btnProfile w-100">
            History
          </button>
        </div>
      </div>
      <h4 className="text-center mb-4">Active Plans</h4>
      <div
        style={{
          backgroundColor: "#67ABB8",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <Carousel interval={5000} indicators={false}>
          {groupedPlans.length > 0 ? (
            groupedPlans.map((group, index) => (
              <Carousel.Item key={index}>
                <div className="row justify-content-center">
                  {group.map((plan, idx) => (
                    <div
                      key={idx}
                      className="col-md-4 col-sm-6"
                      style={{ padding: "10px", display: "flex", justifyContent: "center" }}
                    >
                      <div
                        className="card"
                        style={{
                          backgroundColor: "#F15B40",
                          padding: "20px",
                          borderRadius: "15px",
                          width: "100%",
                          boxSizing: "border-box",
                          transition: "transform 0.3s ease",
                        }}
                      >
                        <div className="card-body text-white">
                          <h5 className="card-title">{plan.name}</h5>
                          <p className="card-text">Date: {plan.date}</p>
                          <p className="card-text">Time: {plan.start_time} - {plan.end_time}</p>
                          <p className="card-text">
                            Location:
                            <a
                              className="ms-2"
                              href={`https://www.google.com/maps?q=${plan.latitude},${plan.longitude}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View Location
                            </a>
                          </p>
                          <p className="card-text">People: {plan.people_active} / {plan.people} people active</p>
                          <div className="d-flex justify-content-between align-items-center mt-3">
                            <p className="text-white">Created by: {plan.creator_name}</p>
                            <span className={`badge ${plan.status === "open" ? "bg-success" : (plan.status === "closed" ? "bg-danger" : "bg-secondary")}`}>
                              {plan.status === "open" ? "Open" : (plan.status === "closed" ? "Closed" : "Full")}
                            </span>
                          </div>
                          <div className="d-flex justify-content-between mt-3">
                            {store.user?.id === plan.creator.id ? (
                              <button
                                className="btn btn-danger border-3 border-dark"
                                style={{ backgroundColor: "#ab051a" }}
                                onClick={() => handleDeletePlan(plan.id)}
                              >
                                Eliminar
                              </button>
                            ) : (
                              <button
                                className="btn btn-warning"
                                onClick={() => actions.leavePlan(plan.id)}
                              >
                                Salir
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Carousel.Item>
            ))
          ) : (
            <p className="text-center text-white">No active plans found.</p>
          )}
        </Carousel>
      </div>
      <input
        type="file"
        ref={profileFileInputRef}
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleProfileImageChange}
      />
      <input
        type="file"
        ref={backgroundFileInputRef}
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleBackgroundImageChange}
      />
    </div>
  );
};