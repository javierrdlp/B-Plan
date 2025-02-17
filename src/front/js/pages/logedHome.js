import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/logedHome.css";
import PlanCards from "../component/planCard";
import { Context } from '../store/appContext';

export const LogedHome = () => {
    const [backgroundImage, setBackgroundImage] = useState("https://plus.unsplash.com/premium_photo-1685082778336-282f52a3a923?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Zm9uZG8lMjBwYW50YWxsYSUyMGRlJTIwY29sb3Jlc3xlbnwwfHwwfHx8MA==");
    const navigate = useNavigate();
    const { store, actions } = useContext(Context);


    useEffect(() => {
        // Obtener la fecha actual en formato YYYY-MM-DD
        const today = new Date().toISOString().split('T')[0];
        document.getElementById("formDate").setAttribute("min", today);

    }, []);

    const [searchRules, setNewSearchRules] = useState(
        {
            date: "",
            people: 0
        });

    const [filteredPlans, setFilteredPlans] = useState([]);

    const getAddres = async (latitude, longitude) => {
        try {
            const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}%2C${longitude}&key=d0698834246341fe9a58e498380bbb69&language=es&limit=5&countrycode=es&bounds=40.388791,-3.694706|40.675083,-3.271308`)
            const data = await response.json();
            console.log(data);
            if (data.results.length > 0) {
                const result = data.results[0].components;
    
                const placeName = result.attraction || result.hotel || result.building || result.tourism || result.retail || null;
                const street = result.road || result.pedestrian || "Unknown street";
                const number = result.house_number ? `, ${result.house_number}` : "";
    
                if (placeName) {
                    return `${placeName}, ${street}${number}`;
                }  else {
                return "Location not found"
            }
        }

        } catch (error) {
            console.error("Error fetching address:", error);
            return "Unknown location";
        }
    };

    const handleNewPlanClick = async () => {
        navigate("/new-plan");
    };

    const handleShowPlansClick = async () => {
        await actions.getPlans();
        const filtered = store.plans.filter(plan =>
            (plan.date === searchRules.date) &&
            (plan.people >= searchRules.people)
        );

        const planswithAddress = await Promise.all(filtered.map(async (plan) =>{
            const address = await getAddres(plan.latitude, plan.longitude)
            return {...plan, address}
        }));

        setFilteredPlans(planswithAddress);
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
                    <input type="date" class="form-control" id="formDate" placeholder="Plan date" onChange={
                        (e) => {
                            setNewSearchRules(({
                                ...searchRules,
                                date: e.target.value
                            }))
                        }} />
                    <label for="formPeople" class="form-label mt-3 h5">Minimun People</label>
                    <input type="number" class="form-control" id="formPeople" min="2" placeholder="People number" onChange={
                        (e) => {
                            setNewSearchRules(({
                                ...searchRules,
                                people: parseInt(e.target.value) || 2
                            }))
                        }} />
                </div>
                <div className="text-center">
                    <button id="find-plan-button" type="button" className="btn btn-secondary mt-4 mb-3" onClick={handleShowPlansClick} disabled={!searchRules.date || searchRules.people < 2}>
                        Show plans
                    </button>
                </div>
            </div>

            <div id="carousel-div" className="row mt-5">
                <div className="scroll-container mb-5">
                    {filteredPlans.map((value) => (
                        <PlanCards key={value.id} title={value.name} place={value.address} people={value.people} imageUrl={value.image} />
                    ))}
                </div>
            </div>
        </div>
    );
};