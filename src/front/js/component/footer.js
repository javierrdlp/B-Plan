import React, { Component } from "react";
import logoLetras from "../../img/logo_letras.png"



export const Footer = () => (
	<footer className="footer mt-5 py-3 text-center" style={{backgroundColor: "#67ABB8"}}>
		<div className="row mb-5">
			<div className="col-4">
				<img className="logo-letras" src={logoLetras} alt="Website Logo" style={{ height: "40%"}} />
			</div>
			<div className="col-4">
			<p className="mt-3 fs-5">Get connected with us on social networks:</p>
			<i className="fa-brands fa-instagram fa-2xl m-2"></i>
			<i className="fa-brands fa-square-facebook fa-2xl m-2"></i>			
			<i className="fa-brands fa-square-twitter fa-2xl m-2"></i>			
			</div>	
			<div className="col-4">
			<p className="mt-3 fs-5">Contact with us:</p>
			<i className="fa-solid fa-envelope fa-2xl"></i>
			</div>	
		</div>
		<div className="row mb-3" style={{marginTop: "-4rem" }}>
			<div className="col-4">
				<p>Álex Pérez</p>	
				<a className="link-dark" href="https://github.com/alex5perez">			
					<i className="fa-brands fa-square-github fa-2xl m-2"></i>
				</a>
			</div>
			<div className="col-4">
				<p>Javier Rodríguez</p>			
				<a className="link-dark" href="https://github.com/javierrdlp" >			
					<i className="fa-brands fa-square-github fa-2xl m-2"></i>
				</a>					
			</div>	
			<div className="col-4">
				<p>José Miguel García</p>
				<a className="link-dark" href="https://github.com/Josemi937">			
					<i className="fa-brands fa-square-github fa-2xl m-2"></i>
				</a>
			</div>	
		</div>
	</footer>
);
