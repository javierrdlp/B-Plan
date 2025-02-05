import React, { Component } from "react";
import logoLetras from "../../img/logo_letras.png"
import "../../styles/footer.css";


export const Footer = () => (
	<footer className="footer mt-5 py-3 text-center">
		<div className="row">
			<div className="col-4">
				<img className="logo-letras" src={logoLetras} alt="Website Logo" />
			</div>
			<div className="col-4">
			<p className="mt-3 fs-5">Get connected with us on social networks:</p>
			<i className="fa-brands fa-instagram fa-2xl m-2"></i>
			<i className="fa-brands fa-square-facebook fa-2xl m-2"></i>
			<i className="fa-brands fa-square-github fa-2xl m-2"></i>
			<i className="fa-brands fa-square-twitter fa-2xl m-2"></i>			
			</div>	
			<div className="col-4">
			<p className="mt-3 fs-5">Contact with us:</p>
			<i className="fa-solid fa-envelope fa-2xl"></i>
			</div>	
		</div>		
	</footer>
);
