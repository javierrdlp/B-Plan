import React, { useContext, useEffect, useState, useRef } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { Carousel } from "react-bootstrap";
import "../../styles/home.css";
import "../../styles/profile.css";

export const PlansHistory = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  const [profileImage, setProfileImage] = useState(
    "https://cdn3.iconfinder.com/data/icons/avatars-9/145/Avatar_Dog-512.png"
  );
  const [backgroundImage, setBackgroundImage] = useState(
    "https://plus.unsplash.com/premium_photo-1685082778336-282f52a3a923?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Zm9uZG8lMjBkZSUyMHBhbnRhbGxhJTIwZGElMjBjb2xvcmVzfGVufDB8fDB8fHww"
  );

  const profileFileInputRef = useRef(null);
  const backgroundFileInputRef = useRef(null);

  const handleProfileImageChange = (event) => {
    const archivo = event.target.files[0];
    if (archivo) {
      const reader = new FileReader();
      reader.onload = function (e) {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(archivo);
    }
  };

  const handleBackgroundImageChange = (event) => {
    const archivo = event.target.files[0];
    if (archivo) {
      const reader = new FileReader();
      reader.onload = function (e) {
        setBackgroundImage(e.target.result);
      };
      reader.readAsDataURL(archivo);
    }
  };

  useEffect(() => {
    document.title = "History Plans";
    actions.updatePlanStatus();
    actions.getPlansHistory();
  }, []);

  const handleProfileButtonClick = () => {
    profileFileInputRef.current.click();
  };

  const handleBackgroundButtonClick = () => {
    backgroundFileInputRef.current.click();
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleActivePlansClick = () => {
    navigate("/active-plans");
  };

  const chunkPlans = (plans, chunkSize) => {
    const result = [];
    for (let i = 0; i < plans.length; i += chunkSize) {
      result.push(plans.slice(i, i + chunkSize));
    }
    return result;
  };

  const groupedPlans = chunkPlans(store.plansHistory, 4);

  const handleDeleteUser = async () => {
    try {
      await actions.deleteUser();
      navigate("/");
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
  };

  const handleStatusChange = async (planId) => {
    try {
      await actions.updatePlanStatus(planId);
      console.log('Se cambio el estado del plan');
    } catch (error) {
      console.error('Error al cambiar el estado del plan', error);
    }
  };

  return (
    <div className="container mt-4" style={{ minHeight: "80vh" }}>
      <div
        id="profileBackground"
        className="mb-3 position-relative"
        style={{
          height: "300px",
          backgroundColor: "#ccc",
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
        }}
      >
        <button type="button" class="mt-3 ms-3 border-3 border-dark btn btn-danger" data-bs-toggle="modal" data-bs-target="#Modal">
          Delete Account
        </button>
        <div class="modal fade" id="Modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Are you sure you want to delete the account?</h5>
                <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                With this you confirm that you want to delete your account forever.
              </div>
              <div class="modal-footer">
                <button type="button" class="mt-1 ms-1 border-3 border-dark btn btn-danger" onClick={handleDeleteUser}>Delete Account</button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={handleBackgroundButtonClick}
          className="btnProfile position-absolute"
          style={{
            bottom: "10px",
            right: "10px",
            padding: "10px",
            borderRadius: "50%",
            zIndex: 10,
          }}
        >
          <i className="fa-solid fa-camera-retro"></i>
        </button>
      </div>

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

      <div className="text-center mb-4">
        <h4>{store.user?.name || "User Name"}</h4>
      </div>

      <hr className="my-4" />

      <div className="row text-center mb-4">
        <div className="col">
          <button
            onClick={handleProfileClick}
            className="btnProfile w-100"
          >
            Account
          </button>
        </div>
        <div className="col">
          <button
            onClick={handleActivePlansClick}
            className="btnProfile w-100"
          >
            Active plans
          </button>
        </div>
        <div className="col">
          <button
            className="btnProfile w-100"
          >
            History
          </button>
        </div>
      </div>

      <h4 className="text-center mb-4">History Plans</h4>
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
                      className="col-3"
                      style={{
                        padding: "10px",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        className="card"
                        style={{
                          backgroundColor: "#F15B40",
                          padding: "20px",
                          borderRadius: "8px",
                          width: "100%",
                          boxSizing: "border-box",
                        }}
                      >
                        <h5 className="text-white">{plan.name}</h5>
                        <p className="text-white">Plan Date: {plan.date}</p>
                        <p className="text-white">Time: {plan.start_time} - {plan.end_time}</p>
                        <p className="text-white">Location: {plan.latitude}, {plan.longitude}</p>
                        <p className="text-white">People: {plan.people_active} / {plan.people} people active</p>
                        <div className="d-flex justify-content-between align-items-center mt-3">
                          <p className="text-white">Created by: {plan.creator_name}</p>
                          <span className={`badge ${plan.status === "open" ? "bg-success" : "bg-danger"}`}>
                            {plan.status === "open" ? "Open" : "Closed"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Carousel.Item>
            ))
          ) : (
            <p className="text-center text-white">No history plans found.</p>
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