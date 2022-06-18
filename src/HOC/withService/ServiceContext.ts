import { Context, createContext } from "react";
import { TypeServiceConfig, TypeServiceNamespace } from "./ElmerService";

export interface IServiceContext<T={}> {
    name: string;
    data: TypeServiceNamespace<T>
}

export const createServiceConfig = <T={}>(data: TypeServiceConfig<T>): Context<TypeServiceConfig<T>>=> {
    return createContext(data);
};

export const createService = <T={}>(namespace: string, data: TypeServiceNamespace<T>):Context<IServiceContext<T>> => {
    return createContext<IServiceContext<T>>({
        name: namespace,
        data
    });
};
