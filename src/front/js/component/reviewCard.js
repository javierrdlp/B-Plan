import React from 'react'
import five from "../../img/five-stars.png"
import "../../styles/reviewCard.css";

const ReviewCards = ({ title, description, imageUrl}) => {
    return (
        <div className="card m-4 p-3 custom-shadow" >
            <h5 className="card-title">{title}</h5>           
            <div className="card-body">                
                <p className="card-text">{description}</p>
                <img className="five-image " src={five} alt="five stars" />
            
            <img className="card-img " src={imageUrl} alt="Card image cap" />
            </div>
           
        </div>
    )
}

export default ReviewCards