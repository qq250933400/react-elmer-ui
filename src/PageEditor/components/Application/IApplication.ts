import React from "react";

export interface IApplicationContext {
    data: any;
    setData: (key: string, value: any) => void;
}

export interface IWithStore<T={}> {
    name: string;
    dispatch?: { [ P in keyof T]: (dispatch: Function, rootData: any) => (data: T[P]) => void };
}
export type IWithStoreResult<T={}, P={}> = React.ComponentType<P> & {
    useData: <Names extends (keyof T)>(keys: Names[]) => {
        data: { [ P in Names] : T[P] };
        action: { [P in Names]: (data: T[P]) => void };
    };
};
export interface IWithStoreContext {
    rootPath: string;
    rootData: any;
    data: any;
    dispatchs: any;
    updateData: (dataKey: string, data: any) => void;
};

export interface IApplication {
    name: string;
    render?: React.ComponentType<any>;
}
