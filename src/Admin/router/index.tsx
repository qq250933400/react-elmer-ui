import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Entry } from "../pages";

const RouterApp = () => {
    return <BrowserRouter>
        <Routes>
            <Route path="/*" element={<Entry />}/>
        </Routes>
    </BrowserRouter>
};

export default RouterApp;

