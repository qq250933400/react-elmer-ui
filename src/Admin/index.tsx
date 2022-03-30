import React from "react";
import I18nApp from "./i18n";
import ValidationProvider from "../components/Validation";
import AdminRouters from "./router";
import ServiceConfig from "./data/serviceConfig";
import { ServiceProvider } from "../HOC/withService"
import "./data";
import "./styles/index.module.scss";

const App = () => {
    return (
        <ServiceProvider data={ServiceConfig} env={ENV}>
            <ValidationProvider>
                <I18nApp>
                    <AdminRouters />
                </I18nApp>
            </ValidationProvider>
        </ServiceProvider>
    );
};

export default App;