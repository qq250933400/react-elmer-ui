import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RouterData, { Entry } from "../pages";

const RouterApp = () => {
    const [ routePrefix ] = useState("/admin/");
    return <BrowserRouter>
        <Routes>
            <Route path="/admin/*" element={<Entry />}/>
            {
                RouterData.map((routeInfo, index) => {
                    const RouteComponent = routeInfo.component;
                    return <Route key={`route_${index}`} path={routePrefix + routeInfo.path} element={<RouteComponent />}/>
                })
            }
            <Route path="/*" element={<Entry />}/>
        </Routes>
    </BrowserRouter>
};

export default RouterApp;

