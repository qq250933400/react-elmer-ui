import type { TypeUseApi } from "./IUseApi";

interface ILocation {
    pathname: string;
    state?: any;
}

interface IStore {
    getData: <T={}>(key?: string) => T;
    setData: <T={}>(data: Partial<T>) => void;
}

export interface ICapabilityProps<ExProps={}> {
    api: TypeUseApi;
    store: IStore;
    location: ILocation;
    props: ExProps,
}

export interface IFunction {
    moduleId: string;
    id: string;
    callbackId: string;
}

export interface IPageData {
    id: string;
    path: string;
    external?: boolean;
    moduleId?: string;
    host?: string;
    sourceId?: string;
    children?: IPageData[];
    functions?: IFunction[];
}