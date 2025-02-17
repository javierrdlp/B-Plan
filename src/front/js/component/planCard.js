import React from 'react'
import "../../styles/reviewCard.css";

const PlanCards = ({title,place, people, imageUrl}) => { 

    return (        
        <div className="card m-4 p-3 custom-shadow-plan d-flex flex-column mb-5" style={{ 
            flex: "0 0 250px", 
            height: "auto"
        }}>
            <h5 className="card-title pt-3 ps-3"><strong>{title}</strong></h5>           
            <div className="card-body d-flex flex-column flex-grow-1">   
                <div className='row'>
                    <div className='col'>
                        <i className="fa-solid fa-location-dot fa-lg mb-3 me-3" style={{color: "#F15B40"}}></i>
                        {place}                        
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