import React, { useContext, createContext, useState, useMemo } from "react";
import { Observe } from "elmer-common";

const ApiContext = createContext({});

type TypeProtectApi = "registe" | "registeEx" | "unRegiste" | "unRegisteEx";

export interface IApi<IExternalAPI={}, IExternalEvent={}> {
    registe: <Name extends keyof IExternalAPI>(name: Name, callback: (api: Omit<IApi & IExternalAPI, TypeProtectApi>) => IExternalAPI[Name]) => void;
    registeEx: <ExAPI extends Omit<IApi & IExternalAPI, TypeProtectApi>>(api: {[P in keyof ExAPI]?: (api: Omit<IApi & IExternalAPI, TypeProtectApi>) => ExAPI[P]}) => void;
    unRegiste: (name: keyof Omit<IApi & IExternalAPI, TypeProtectApi>) => void;
    unRegisteEx: <Name extends keyof Omit<IApi & IExternalAPI, TypeProtectApi>>(name: Name[]) => void;
    on: <EventName extends keyof IExternalEvent>(eventName: EventName, callback: IExternalEvent[EventName]) => void;
    emit: <EventName extends keyof IExternalEvent>(eventName: EventName, ...args: any[]) => any;
}

export const ApiProvider = (props: any) => {
    const [ api ] = useState<any>({});
    const [ eventObj ] = useState(() => new Observe<any>());
    const [ apiState ] = useState({
        registe: (name: string, fn: Function): void => {
            if(!api[name]) {
                api[name] = fn(api);
            } else {
                console.error(`重复定义Api.${name}`);
            }
        },
        registeEx: (regData: any): void => {
            Object.keys(regData).forEach((regKey: string) => {
                if(!api[regKey]) {
                    const fn: Function = regData[regKey];
                    api[regKey] = fn(api);
                }
            })
        },
        unRegiste: (name: string): void => {
            delete api[name];
        },
        unRegisteEx: (name: string[]): void => {
            if(name) {
                name.forEach((delName: string) => {
                    delete api[delName];
                });
            }
        },
        on: (name: any, callback: any) => eventObj.on(name, callback),
        emit: (name: any, ...args: any) => eventObj.emit(name, ...args)
    });
    const apiData = useMemo(() => ({
        internalApi: apiState,
        externalApi: api
    }), [apiState, api]);
    return (
        <ApiContext.Provider value={apiData}>
            {props.children}
        </ApiContext.Provider>
    );
};

export const useApi = <T={}, Event={}>(): IApi<T, Event> & T => {
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