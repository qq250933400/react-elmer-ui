import React from "react";


type TypeStoreDispatch = (newData: any, localized?: boolean) => void;

export interface IApplicationContext {
    data: any;
    setData: (key: string, value: any) => void;
}

export interface IWithStore<T={}> {
    name: string;
    initData?: { [P in keyof T]?: T[P] },
    dispatch?: { [ P in keyof T]: (dispatch: TypeStoreDispatch, rootData: any) => (data: T[P]) => void };
}
export type IWithStoreResult<T={}, P={}> = React.ComponentType<P & { initData?: {[K in keyof T]?: T[K]} }> & {
    useData: <Names extends (keyof T)>(keys: Names[]) => {
        data: { [ P in Names] : T[P] };
        action: { [P in Names]: (data?: T[P]) => void };
    };
};
export interface IWithStoreContext {
    rootPath: string;
    rootData: any;
    currentPath: string;
    data: any;
    dispatchs: any;
    parentPatchs: any;
    name: string;
    updateData: (dataKey: string, data: any) => void;
};

export interface IApplication {
    name: string;
    render?: React.ComponentType<any>;
}
