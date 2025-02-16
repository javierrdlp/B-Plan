import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/home";
import { Demo } from "./pages/demo";
import { Single } from "./pages/single";
import injectContext from "./store/appContext";
import { Profile } from "./pages/profile";
import { PlansHistory } from "./pages/plansHistory";
import { ActivePlans } from "./pages/activePlans";
import NewPlan from './pages/newPlan';
import JoinPlan from './pages/joinPlan';
import LogedHome from './pages/logedHome';






import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";


//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL />;
    const [token, setToken] = useState(localStorage.getItem("token"));
    useEffect(() => {
        const updateToken = () => {
            setToken(localStorage.getItem("token"));
        };

        window.addEventListener("storage", updateToken);

        return () => {
            window.removeEventListener("storage", updateToken);
        };
    }, [localStorage.getItem("token")]);

    if (localStorage.getItem("token")) {

        const planData = {
            name: "Visit to the Museum",
            numberOfPeople: 5,
            date: "2025-02-15",
            startTime: "10:00",
            endTime: "13:00",
            location: "Museum of Modern Art",
            category: "Art",
            description: "Join us for a cultural experience at the museum.",
            image: "https://cdn-museabrugge-be.cloud.glue.be/https%3A%2F%2Fwww.museabrugge.be%2Fvolumes%2Fgeneral%2FBezoek-het-Groeningemuseum_Musea-Brugge.jpg?dpr=2&w=1440&h=590&fit=crop&s=3c676338b7222eaf5b274e130e09698e",
            locationCoordinates: { lat: 40.4168, lng: -3.7038 },
        };


        return (
            <div>
                <BrowserRouter basename={basename}>
                    <ScrollToTop>
                        <Navbar />
                        <Routes>
                            <Route element={<Home />} path="/" />
                            <Route element={<Profile />} path="/profile" />
                            <Route path="/plans-history" element={<PlansHistory />} />
                            <Route path="/active-plans" element={<ActivePlans />} />
                            <Route path="/new-plan" element={<NewPlan />} />
                            <Route path="/join-plan" element={<JoinPlan />} />
                            <Route element={<Demo />} path="/demo" />
                            <Route element={<Single />} path="/single/:theid" />
                            <Route element={<h1>Not found!</h1>} />
                        </Routes>
                        <Footer />
                    </ScrollToTop>
                </BrowserRouter>
            </div>
        );
    } else {


        
        
    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<LogedHome />} path="/loged-home" />
                        <Route element={<Profile />} path="/profile" /> 
                        <Route path="/plans-history" element={<PlansHistory />} />
                        <Route path="/active-plans" element={<ActivePlans />} />
                        <Route path="/new-plan" element={<NewPlan />} />
                        <Route path="/join-plan" element={<JoinPlan />} />
                        <Route element={<Demo />} path="/demo" />
                        <Route element={<Single />} path="/single/:theid" />
                        <Route element={<h1>Not found!</h1>} />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );

        
    }
};

export default injectContext(Layout);
