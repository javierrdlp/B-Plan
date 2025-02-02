import React, { useContext } from "react";
import { Context } from "../store/appContext";
import madrid from "../../img/madrid.jpg";
import street from "../../img/madrid-calle.jpg"
import cinema from "../../img/cinema-review.jpg"
import cafe from "../../img/cafe-review.jpeg"
import restaurant from "../../img/restaurant-review.jpg"
import "../../styles/home.css";
import ReviewCards from "../component/reviewCard";

export const Home = () => {
	const { store, actions } = useContext(Context);
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

	]

	return (
		<div className="container justify-content-center">
			<div className="row text-center rounded">
				<div className="first-picture col-12 rounded">
					<img className="rounded-3" src={street} />
				</div>
			</div>

			<div className="row rounded mt-5">
				<div className="description col-6 p-5">
					<h1 className="display-6">
						What about B-Plan?:
					</h1>
					<ul className="listToDo list-group list-group-flush">
						<li class="toDo list-group-item border-0">Un elemento</li>
						<li class="toDo list-group-item border-0">Un segundo elemento</li>
						<li class="toDo list-group-item border-0">Un tercer elemento</li>
						<li class="toDo list-group-item border-0">Un cuarto elemento</li>
						<li class="toDo list-group-item border-0">Y un quinto elemento</li>
					</ul>
				</div>
				<div className="rounded col-6 p-3">
					<h1 className="display-6 text-center">
						Cities
					</h1>
					<ul className="list-group list-group-flush mt-5 ps-5">
						<li class="madrid-li list-group-item border-0 shadow rounded">
							<img className="madrid me-5 p-2 rounded" src={madrid} />
							Madrid
						</li>
					</ul>

				</div>
			</div>

			<div className="row rounded mt-5">
				<h1 className="display-6">
					Reviews:
				</h1>
				<h5 className="text-down-review display-6">
					What the people says about B-Plan
				</h5>
			</div>
			<div className="row">
			<div className="col-12 d-flex justify-content-around mt-5">
				{data.map((value, index) => {
					return <ReviewCards key={index} title={value.title} description={value.description} imageUrl={value.imageUrl} />
				})}
			</div>
			</div>


		</div>
	);
};
