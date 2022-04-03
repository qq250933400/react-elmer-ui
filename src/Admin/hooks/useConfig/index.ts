import { createContext, useContext } from "react";
import { TypeServiceConfig } from "../../../HOC/withService/ElmerService";

export type TypeAdminConfig = {
    apiConfig?: TypeServiceConfig;
    i18n?: {};
    urlPrefix?: string;
    adminUrlPrefix?: string;
    initConfig: boolean;
};

export const ConfigContext = createContext<TypeAdminConfig>({
    initConfig: false
});

export const useConfig = () => {
    return useContext(ConfigContext);
};
