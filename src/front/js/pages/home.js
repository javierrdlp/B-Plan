import React, { useContext, useState, useEffect, useRef } from "react";
import { Context } from "../store/appContext";
import madrid from "../../img/madrid.jpg";
import street from "../../img/madrid-calle.jpg";
import logoLetras from "../../img/logo_letras.png";
import cinema from "../../img/cinema-review.jpg";
import cafe from "../../img/cafe-review.jpeg";
import restaurant from "../../img/restaurant-review.jpg";
import "../../styles/home.css";
import { Link, useNavigate } from "react-router-dom";  
import ReviewCards from "../component/reviewCard";

export const Home = () => {
  const { store, actions } = useContext(Context);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();  

  let data = [
    {
      title: "It was very easy to meet with new people!",
      description: "It's a user-friendly website to make plans and to meet new friends.",
      imageUrl: cinema
    },
    {
      title: "Plans in an instant",
      description: "Perfect for those looking for spontaneous company without hassle or commitments.",
      imageUrl: cafe
    },
    {
      title: "New plan, new people",
      description: "An intuitive app to make plans with strangers who quickly feel like friends.",
      imageUrl: restaurant
    }
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");  
    if (token) {
      setIsLoggedIn(true);  
    } else {
      setIsLoggedIn(false);  
    }
  }, []);
  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await actions.login(email, password);
      localStorage.setItem("token", store.token);  
      setShowLoginPopup(false);
      setIsLoggedIn(true);  
      navigate('/loged-home');
    } catch (error) {
      console.error('Error al intentar iniciar sesión', error);
    }
  };
  

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await actions.signup(name, email, password);
      setShowRegisterPopup(false);
      setIsLoggedIn(true);  
      navigate('/profile');  
    } catch (error) {
      console.error('Error al intentar registrarse', error);
    }
  };

  
  const videoUrls = [
    "https://videos.pexels.com/video-files/852122/852122-hd_1920_1080_30fps.mp4",
    "https://videos.pexels.com/video-files/1692701/1692701-uhd_2560_1440_30fps.mp4",
    "https://videos.pexels.com/video-files/2894895/2894895-uhd_2560_1440_24fps.mp4",
    "https://videos.pexels.com/video-files/852038/852038-hd_1920_1080_30fps.mp4",
    "https://videos.pexels.com/video-files/3205451/3205451-uhd_2560_1440_30fps.mp4"
  ];

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef(null);

  
  useEffect(() => {
    const nextVideoUrl = videoUrls[(currentVideoIndex + 1) % videoUrls.length];
    const videoElement = document.createElement('video');
    videoElement.src = nextVideoUrl;
    videoElement.load(); 
  }, [currentVideoIndex]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentVideoIndex(prevIndex => (prevIndex + 1) % videoUrls.length);
    }, 5000);  

    return () => clearInterval(intervalId); 
  }, []);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement) {
      videoElement.play();  
      videoElement.currentTime = 0;  
    }
  }, [currentVideoIndex]); 

  return (
    <div className="container justify-content-center mt-5">
      <div className="first-box row text-center rounded position-relative">
        <div className="top-right-elements d-flex justify-content-end w-100 p-2">
          {!isLoggedIn ? (
            <>
              <button className="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#loginModal">Login</button>
              <button className="register-button btn btn-secondary" data-bs-toggle="modal" data-bs-target="#registroModal">Sign up</button>
            </>
          ) : (
            <button className="btn btn-secondary">Logged In</button>
          )}
        </div>

        <div className="first-picture rounded">
          <img className="logo-letras" src={logoLetras} alt="Website Logo" />
          <br />
          {!isLoggedIn && (
            <button className="start-button btn btn-secondary mb-5" data-bs-toggle="modal" data-bs-target="#registroModal">Start now!</button>
          )}
        </div>
      </div>

      <div className="row rounded mt-5">
        <div className="description col-6 p-5">
          <h1 className="display-6 b"><strong>
            What about B-Plan?
          </strong></h1>
          <ul className="listToDo list-group list-group-flush">
            <li className="toDo list-group-item border-0">- Meet new people and make plans instantly</li>
            <li className="toDo list-group-item border-0">- Find company for every occasion</li>
            <li className="toDo list-group-item border-0">- Spontaneous plans, real connections</li>
            <li className="toDo list-group-item border-0">- Never be without someone to go out with again</li>
          </ul>
        </div>
        <div className="rounded col-6 p-3">
          <h1 className="display-6 text-center">
            Cities
          </h1>
          <ul className="list-group list-group-flush mt-5 ps-5">
            <li className="madrid-li list-group-item border-0 shadow rounded">
              <img className="madrid me-5 p-2 rounded" src={madrid} />
              Madrid
            </li>
          </ul>
        </div>
      </div>

      <div className="row rounded mt-5">
        <p className="display-6">
          Reviews:
        </p>
        <p className="text-down-review display-6">
          What the people says about B-Plan
        </p>
      </div>
      <div className="row ">
        <div className="col-12 d-flex justify-content-around">
          {data.map((value, index) => {
            return <ReviewCards key={index} title={value.title} description={value.description} imageUrl={value.imageUrl} />
          })}
        </div>
      </div>

      <div className="modal fade" id="registroModal" tabindex="-1" aria-labelledby="registerModal" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <img className="logo-modal" src={logoLetras} alt="Website Logo" />
            <div className="modal-header">
              <h1 className="modal-title fs-3" id="registerModal">Create an account</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label htmlFor="text-name" className="col-form-label">Profile name:</label>
                  <input type="text" className="form-control" id="register-name" onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label htmlFor="text-email" className="col-form-label">Email:</label>
                  <input type="email" className="form-control" id="register-email" onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label htmlFor="text-password" className="col-form-label">Password:</label>
                  <input type="password" className="form-control" id="register-password" onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="d-flex justify-content-center">
                  <button type="submit" data-bs-dismiss="modal" className="ok-register-button btn btn-secondary">Register</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="loginModal" tabindex="-1" aria-labelledby="loginModal" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <img className="logo-modal" src={logoLetras} alt="Website Logo" />
            <div className="modal-header">
              <h1 className="modal-title fs-3" id="registerModal">Login</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="text-email" className="col-form-label">Email:</label>
                  <input type="email" className="form-control" id="login-email" onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label htmlFor="text-password" className="col-form-label">Password:</label>
                  <input type="password" className="form-control" id="login-password" onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="d-flex justify-content-center">
                  {isLoggedIn ? (<Link to={"/loged-home"}>   <button type="submit" data-bs-dismiss="modal" className="ok-register-button btn btn-secondary">Login</button></Link>) : (<button type="submit" data-bs-dismiss="modal" className="ok-register-button btn btn-secondary">Login</button>)}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      
      <div className="mt-5" id="videoContainer" style={{
        height: "300px",  
        position: "relative",
        overflow: "hidden",
        border: "5px solid #262626",  
        borderRadius: "15px",
      }}>
        <video
          ref={videoRef} 
          src={videoUrls[currentVideoIndex]}
          type="video/mp4"
          autoPlay
          muted
          loop  
          style={{
            objectFit: "cover", 
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />
      </div>

    
    </div>
  );
};
