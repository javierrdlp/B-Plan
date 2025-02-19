import React,  { useContext } from 'react'
import "../../styles/reviewCard.css";
import { useNavigate } from "react-router-dom";
import { Context } from '../store/appContext';

const PlanCards = ({title, place, people, imageUrl, planId, date}) => { 

    const navigate = useNavigate();
    const { store, actions } = useContext(Context);   

    const handlePlanCard = () => {       
        const selectedPlan = store.plans.find(p => p.id === planId);
        if (selectedPlan) {          
          actions.setShowedPlan(selectedPlan);
          actions.setPlanAddress(place); 
          navigate("/show-plan"); 
        }
      };

    return (   
             
        <div className="card m-4 p-3 custom-shadow-plan d-flex flex-column mb-5" style={{ 
            flex: "0 0 250px", 
            height: "auto"
        }} onClick={handlePlanCard}>
            <h5 className="card-title pt-3 ps-3"><strong>{title}</strong></h5>           
            <div className="card-body d-flex flex-column flex-grow-1">   
                <div className='row'>
                    <div className='col'>
                        <i className="fa-regular fa-calendar fa-lg mb-3 me-3" style={{color: "#F15B40"}}></i>
                        {date}                        
                    </div>
                </div>
                <div className='row'>
                    <div className='col'>
                        <i className="fa-solid fa-person fa-xl mb-4 me-3 mt-3" style={{color: "#F15B40"}}></i>
                        {people}                        
                    </div>
                </div>             
                <div className="mt-auto"> 
                    <img id="plan-card-image" className="card-img" src={imageUrl} alt="image-plan"/>  
                </div>       
            </div>           
        </div>  
        
    )
}

export default PlanCards