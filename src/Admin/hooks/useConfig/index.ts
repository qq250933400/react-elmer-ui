import { IPageInfo } from "@MSJApp";
import { createContext, useContext } from "react";
import { TypeServiceConfig } from "../../../HOC/withService/ElmerService";

export type TypeAdminConfig = {
    adminUrlPrefix?: string;
    apiConfig?: TypeServiceConfig;
    i18n?: {};
    initConfig: boolean;
    urlPrefix?: string;
};

export const ConfigContext = createContext<TypeAdminConfig>({
    initConfig: false
});

export const useConfig = () => {
    return useContext(ConfigContext);
};
