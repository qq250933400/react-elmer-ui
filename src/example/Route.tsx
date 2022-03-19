import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App";

const Login = () => {
    return <div><label>Hello Login</label></div>
}

const RouteComponent = () => {
    return <Router >
        <Routes>
            <Route path="/admin/login" element={<Login />}/>
            <Route path="/" element={<App />} />
        </Routes>
    </Router>
};

export default RouteComponent;
