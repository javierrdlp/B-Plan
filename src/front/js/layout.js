import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom"; 
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

import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";

const Layout = () => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    
    useEffect(() => {        
        const updateToken = () => {
          setToken(localStorage.getItem("token"));
        };    
        
        window.addEventListener("storage", updateToken);
    
        return () => {
          window.removeEventListener("storage", updateToken);
        };
    }, []);

    
    const location = useLocation();
    
    
    const isHomePage = location.pathname === "/";

    if(localStorage.getItem("token")){  
        return (
            <div>
                
                <ScrollToTop>
                    
                    {!isHomePage && <Navbar />}
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
            </div>
        );
    } else {
        return (
            <div>
                <ScrollToTop> 
                    
                    {!isHomePage && <Navbar />}
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
            </div>
        );
    }
};


const App = () => (
    <BrowserRouter>
        <Layout />
    </BrowserRouter>
);

export default injectContext(App);
