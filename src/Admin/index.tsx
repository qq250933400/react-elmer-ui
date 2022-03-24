import React from "react";
import I18nApp from "./i18n";
import ValidationProvider from "../components/Validation";
import AdminRouters from "./router";
import "./data";
import "./styles/index.module.scss";

const App = () => {
    return (
        <ValidationProvider>
            <I18nApp>
                <AdminRouters />
            </I18nApp>
        </ValidationProvider>
    );
};

export default App;