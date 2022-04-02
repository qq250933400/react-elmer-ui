import { createContext, useContext } from "react";
import { TypeServiceConfig } from "../../../HOC/withService/ElmerService";

export type TypeAdminConfig = {
    apiConfig?: TypeServiceConfig;
    i18n?: {};
    urlPrefix?: string;
};

export const ConfigContext = createContext<TypeAdminConfig>({});

export const useConfig = () => {
    return useContext(ConfigContext);
};
