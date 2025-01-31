import React, { useContext } from "react";
import { Context } from "../store/appContext";
import madrid from "../../img/madrid.jpg";
import street from "../../img/madrid-calle.jpg"
import "../../styles/home.css";

export const Home = () => {
	const { store, actions } = useContext(Context);

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
						Que harás aquí:
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
						Ciudades
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
			<div className="row rounded">
				<div className="">

				</div>
			</div>

			
		</div>
	);
};
