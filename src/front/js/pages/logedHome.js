import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/logedHome.css";
import PlanCards from "../component/planCard";
import { Carousel } from "react-bootstrap";

export const LogedHome = () => {
    const [backgroundImage, setBackgroundImage] = useState("https://plus.unsplash.com/premium_photo-1685082778336-282f52a3a923?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Zm9uZG8lMjBwYW50YWxsYSUyMGRlJTIwY29sb3Jlc3xlbnwwfHwwfHx8MA==");
    const navigate = useNavigate();

    let planData = [
        
            {
                title: "Watch a movie on the big screen",
                place: "Cines Yelmo",
                people: "5",
                imageUrl: `${backgroundImage}`
            },
            {
                title: "Have a coffee and chat",
                place: "Café Gijón",
                people: "3",
                imageUrl: `${backgroundImage}`
            },
            {
                title: "Enjoy a roast suckling pig",
                place: "Restaurante Sobrino de Botín",
                people: "4",
                imageUrl: `${backgroundImage}`
            },
            {
                title: "Explore classical and modern art",
                place: "Museo del Prado",
                people: "6",
                imageUrl: `${backgroundImage}`
            },
            {
                title: "Boat ride and picnic",
                place: "Parque del Retiro",
                people: "2",
                imageUrl: `${backgroundImage}`
            },
            {
                title: "Try tapas and wine",
                place: "Mercado de San Miguel",
                people: "5",
                imageUrl: `${backgroundImage}`
            },
            {
                title: "Go shopping and enjoy the atmosphere",
                place: "Gran Vía",
                people: "4",
                imageUrl: `${backgroundImage}`
            },
            {
                title: "Watch the sunset with a view",
                place: "Templo de Debod",
                people: "3",
                imageUrl: `${backgroundImage}`
            },
            {
                title: "Have a drink on a terrace",
                place: "Plaza Mayor",
                people: "6",
                imageUrl: `${backgroundImage}`
            },
            {
                title: "Visit exhibitions and cultural events",
                place: "Matadero Madrid",
                people: "2",
                imageUrl: `${backgroundImage}`
            },
            {
                title: "Discover exotic animals",
                place: "Zoo Aquarium de Madrid",
                people: "5",
                imageUrl: `${backgroundImage}`
            },
            {
                title: "Watch a match or visit the Real Madrid museum",
                place: "Santiago Bernabéu",
                people: "3",
                imageUrl: `${backgroundImage}`
            }
            


    ]

    useEffect(() => {
        // Obtener la fecha actual en formato YYYY-MM-DD
        const today = new Date().toISOString().split('T')[0];
        document.getElementById("formGroupExampleInput").setAttribute("min", today);
    }, []); // Se ejecuta solo una vez al montar el componente

    const handleNewPlanClick = () => {
        navigate("/new-plan");
    };

    return (
        <div className="container justify-content-center mt-5">
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
            </div>
            <div className="row justify-content-center mt-5">
                <button id="create-plan-button" type="button" className="btn btn-secondary" onClick={handleNewPlanClick}>
                    Create Plan
                </button>
            </div>
            <div id="plan-finder" className="row justify-content-center mt-5 p-3">
                <div className="text-center">
                    <h1 className="text">
                        Plan finder
                    </h1>
                </div>
                <div className="mt-3 mb-3">
                    <label for="formDate" class="form-label h5">Plan date</label>
                    <input type="date" class="form-control" id="formGroupExampleInput" placeholder="Plan date" />
                    <label for="formPeople" class="form-label mt-3 h5">People</label>
                    <input type="number" class="form-control" id="formGroupExampleInput" min="2" placeholder="People number" />
                </div>
                <div className="text-center">
                    <button id="find-plan-button" type="button" className="btn btn-secondary mt-4 mb-3" onClick={handleNewPlanClick}>
                        Show plans
                    </button>
                </div>
            </div>

            <div id="carousel-div" className="row mt-5">               
                <div className="scroll-container mb-5">
                        {planData.map((value) => (
                             <PlanCards key={value.index} title={value.title} place={value.place} people={value.people} imageUrl={value.imageUrl} />
                        ))}
                </div>
            </div>
        </div>
    );

};