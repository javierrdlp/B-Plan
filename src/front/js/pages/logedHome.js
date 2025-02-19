import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/logedHome.css";
import PlanCards from "../component/planCard";
import { Context } from '../store/appContext';

const LogedHome = () => {
    const [backgroundImage, setBackgroundImage] = useState(
        localStorage.getItem("backgroundImage") || "https://plus.unsplash.com/premium_photo-1685082778336-282f52a3a923?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Zm9uZG8lMjBwYW50YWxsYSUyMGRlJTIwY29sb3Jlc3xlbnwwfHwwfHx8MA=="
    );

    const navigate = useNavigate();
    const { store, actions } = useContext(Context);

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById("formDate").setAttribute("min", today);
    }, []);


    const [searchRules, setNewSearchRules] = useState({ date: "", people: 0 });


    const [filteredPlans, setFilteredPlans] = useState([]);

    const getAddress = async (latitude, longitude) => {
        try {
            const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude},${longitude}&key=d0698834246341fe9a58e498380bbb69&language=es&limit=5&countrycode=es`);
            const data = await response.json();
            if (data.results.length > 0) {
                return data.results[0].formatted.split(", ").slice(0, 3).join(", ") || "Ubicación desconocida";
            } else {
                return "No results from API";

            }
        } catch (error) {
            console.error("Error fetching address:", error);
            return "Unknown location";
        }
    };

    const handleNewPlanClick = () => {
        navigate("/new-plan");
    };

    const handleShowPlansClick = async () => {
        await actions.getPlans();
        
        let filtered = store.plans;
        
        if (searchRules.date) {
            filtered = filtered.filter(plan => plan.date === searchRules.date);
        }
        
        if (searchRules.people > 1) {
            filtered = filtered.filter(plan => plan.people >= searchRules.people);
        }
        
        const plansWithAddress = await Promise.all(filtered.map(async (plan) => {
            const address = await getAddress(plan.latitude, plan.longitude);
            return { ...plan, address };
        }));

        setFilteredPlans(plansWithAddress);
    };

    useEffect(() => {
        const fetchPlans = async () => {
            await handleShowPlansClick();
        };
    
        fetchPlans();
    }, []);

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
        <div className="container justify-content-center mt-5" style={{ minheight: "80vh" }}>
            <div id="profileBackground" className="mb-3 position-relative" style={{
                height: "300px",
                backgroundColor: "#ccc",
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center center",
            }}>
            </div>

            <div className="row justify-content-center mt-5">
                <button id="create-plan-button" type="button" className="btn btn-secondary" onClick={handleNewPlanClick}>
                    Create Plan
                </button>
            </div>

            <div id="plan-finder" className="row justify-content-center mt-5 p-3">
                <div className="text-center">
                    <h1 className="text">Plan finder</h1>
                </div>
                <div className="mt-3 mb-3">
                    <label htmlFor="formDate" className="form-label h5">Plan date</label>
                    <input type="date" className="form-control" id="formDate" placeholder="Plan date" 
                        onChange={(e) => setNewSearchRules({ ...searchRules, date: e.target.value })} />
                    <label htmlFor="formPeople" className="form-label mt-3 h5">Minimum People</label>
                    <input type="number" className="form-control" id="formPeople" min="2" placeholder="People number"
                        onChange={(e) => setNewSearchRules({ ...searchRules, people: parseInt(e.target.value) || 2 })} />
                </div>
                <div className="text-center">
                    <button id="find-plan-button" type="button" className="btn btn-secondary mt-4 mb-3" 
                        onClick={handleShowPlansClick}>
                        Show plans
                    </button>
                </div>
            </div>
            <div id="carousel-div" className="row mt-5">
                <div className="scroll-container mb-5">
                    {filteredPlans.map((value) => (
                        <PlanCards key={value.id} title={value.name} place={value.address} people={value.people} imageUrl={value.image} planId={value.id} date={value.date} />
                    ))}
                </div>
            </div>
           
            <div className="mt-5"
                id="videoContainer"
                style={{
                    height: "300px",  
                    position: "relative",
                    overflow: "hidden",
                    border: "5px solid #262626",  
                    borderRadius: "15px",
                }}
            >
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

export default LogedHome;
