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

  const plansHistory = [
    { date: "2023-06-20", title: "History Plan A" },
    { date: "2023-07-12", title: "History Plan B" },
    { date: "2023-08-10", title: "History Plan C" },
    { date: "2023-09-15", title: "History Plan D" },
    { date: "2023-10-25", title: "History Plan E" },
    { date: "2023-11-05", title: "History Plan F" },
  ];

  const chunkPlans = (plans, chunkSize) => {
    const result = [];
    for (let i = 0; i < plans.length; i += chunkSize) {
      result.push(plans.slice(i, i + chunkSize));
    }
    return result;
  };

  const groupedPlans = chunkPlans(plansHistory, 4);

  return (
    <div className="container mt-4" style={{ height: "80vh"}}>
      
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
          {groupedPlans.map((group, index) => (
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
                      <h5 className="text-white">{plan.title}</h5>
                      <p className="text-white">Plan Date: {plan.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Carousel.Item>
          ))}
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
