import React, { useMemo } from "react";
import I18nApp from "./i18n";
import ValidationProvider from "../components/Validation";
import AdminRouters from "./router";
import ServiceConfig from "./data/serviceConfig";
import { ServiceProvider } from "../HOC/withService";
import { TypeAdminConfig, ConfigContext } from "./hooks";
import "./data";
import "./styles/index.module.scss";

const App = (props: TypeAdminConfig) => {
    const config = useMemo<TypeAdminConfig>(() => ({
        apiConfig: props.apiConfig,
        i18n: props.i18n || {},
        urlPrefix: props.urlPrefix || ""
    }), [props]);
    return (
        <ConfigContext.Provider value={config}>
            <ServiceProvider data={ServiceConfig} env={ENV}>
                <ValidationProvider>
                    <I18nApp>
                        <AdminRouters />
                    </I18nApp>
                </ValidationProvider>
            </ServiceProvider>
        </ConfigContext.Provider>
    );
};

export default App;