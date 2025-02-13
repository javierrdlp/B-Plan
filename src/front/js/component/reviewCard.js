import React from 'react'
import five from "../../img/five-stars.png"
import "../../styles/reviewCard.css";

const ReviewCards = ({ title, description, imageUrl}) => {
    return (
        <div className="card m-4 p-3 custom-shadow d-flex flex-column" style={{ 
            flex: "0 0 25%", 
            height: "auto"
        }}>
            <h5 className="card-title">{title}</h5>           
            <div className="card-body d-flex flex-column flex-grow-1">                
                <p className="card-text">{description}</p>
                <img className="five-image " src={five} alt="five stars" />
                <div className='mt-auto'>
                    <img className="card-img" src={imageUrl} alt="review-card" />
                </div>
            </div>
           
        </div>
    )
}

export default ReviewCards