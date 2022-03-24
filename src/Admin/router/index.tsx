import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RouterData from "../pages";

const RouterApp = () => {
    return <BrowserRouter>
        <Routes>
            {
                RouterData.map((routeInfo, index) => {
                    const RouteComponent = routeInfo.component;
                    return <Route key={`route_${index}`} path={routeInfo.path} element={<RouteComponent />}/>
                })
            }
        </Routes>
    </BrowserRouter>
};

export default RouterApp;

