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