import React, { useMemo } from "react";
import I18nApp from "./i18n";
import AdminRouters from "./router";
import ServiceConfig from "./data/serviceConfig";
import { ServiceProvider } from "../HOC/withService";
import { TypeAdminConfig, ConfigContext } from "./hooks";
import { ValidationProvider } from "../components/Validation";
import "./data";
import "./styles/index.module.scss";

type TypeAppProps<T={}> = {[ P in Exclude<keyof T, "initConfig">]?: T[P]};

const App = (props: TypeAppProps<TypeAdminConfig>) => {
    const config = useMemo<TypeAdminConfig>(() => ({
        apiConfig: props.apiConfig,
        i18n: props.i18n || {},
        urlPrefix: props.urlPrefix || "/",
        adminUrlPrefix: props.adminUrlPrefix || "/admin/",
        initConfig: false
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