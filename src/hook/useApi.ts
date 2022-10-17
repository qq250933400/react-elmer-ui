import { useContext, createContext, useMemo } from "react";
import type { IApi, IUseApi, IApiEvent } from "../types/IUseApi";

export const ApiContext = createContext({});

export const useApi = <T={}, Event={}>(): IApi<IUseApi & T, Event & IApiEvent> & T & IUseApi => {
    const contextData:any = useContext(ApiContext);
    return useMemo<any>(() => {
        const { externalApi, internalApi } = contextData;
        Object.keys(internalApi).forEach((name: string) => {
            const api = internalApi[name];
            externalApi[name] = api;
        });
        return externalApi;
    }, [contextData]);
};