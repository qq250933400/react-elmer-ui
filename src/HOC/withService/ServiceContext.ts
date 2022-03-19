import { Context, createContext } from "react";
import { TypeServiceConfig } from "./ElmerService";

export const createServiceConfig = <T={}>(data: TypeServiceConfig<T>): Context<TypeServiceConfig<T>>=> {
    return createContext(data);
};
