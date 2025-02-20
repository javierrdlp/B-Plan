import React, { useState, useEffect, useContext } from "react";
import logoLetras from "../../img/logo_letras.png"
import { Context } from "../store/appContext";

import { Link } from "react-router-dom";


export const Navbar = () => {
	const { actions } = useContext(Context);
	const [profileImage, setProfileImage] = useState("https://cdn3.iconfinder.com/data/icons/avatars-9/145/Avatar_Dog-512.png");
	useEffect(() => {
		const updateProfileImage = () => {
		  const storedProfileImage = localStorage.getItem("profileImage");
		  if (storedProfileImage) {
			setProfileImage(storedProfileImage);
		  }
		};
		updateProfileImage();
		window.addEventListener("storage", updateProfileImage);
		return () => {
		  window.removeEventListener("storage", updateProfileImage);
		};
	  }, []); 

	  const handleLogout = () => {
		localStorage.removeItem("profileImage"); 
		actions.logout();
	  };
	  
	return (
		<nav className="navbar navbar-light" style={{ backgroundColor: "#67ABB8"}}>
			<div className="container">
				<Link to="/">
					<img className="logo-letras-navbar" src={logoLetras} alt="Website Logo" style={{ width: "40%" }} />
				</Link>
				<div className="ml-auto">
					<Link to="/">
						<button className="logout-button btn btn-secondary" style={{ backgroundColor: " #F15B40" }} onClick={handleLogout}>Logout</button>
					</Link>
					<Link to="/profile">
						<img
							src={profileImage}
							alt="Profile"
							className="rounded-circle border border-black border-2 ms-4"
							style={{
								width: "50px",
								height: "50px",
								objectFit: "cover",
							}}
						/>
					</Link>
				</div>
			</div>
		</nav>
	);
};