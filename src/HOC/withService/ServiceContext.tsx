import React, { useContext }  from "react";
import { Context, createContext } from "react";
import { TypeServiceConfig, TypeServiceNamespace } from "./ElmerService";

export interface IServiceData<T={}> {
    Provider: (props: any) => JSX.Element;
    useConfig: () => TypeServiceConfig<T>;
}

export interface IServiceContext<T={}> {
    name: string;
    data: TypeServiceNamespace<T>
}

export const createServiceConfig = <T={}>(data: TypeServiceConfig<T>): IServiceData<T> => {
    const ConfigContext = createContext<TypeServiceConfig<T>>(data);
    return {
        Provider: (props: any) => (<ConfigContext.Provider value={data}>{props.children}</ConfigContext.Provider>),
        useConfig: () => useContext<TypeServiceConfig<T>>(ConfigContext)
    };
};

export const createService = <T={}>(namespace: string, data: TypeServiceNamespace<T>):Context<IServiceContext<T>> => {
    return createContext<IServiceContext<T>>({
        name: namespace,
        data
    });
};
