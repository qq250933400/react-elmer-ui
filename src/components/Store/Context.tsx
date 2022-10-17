import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { utils } from "elmer-common";

export interface IStoreApi<T={}> {
    setData: <KeyName extends keyof T>(key: KeyName, data: Partial<T[KeyName]>) => void;
    getData: <Data={}>(key?: string) => Data;
}

interface IStoreContext extends IStoreApi {
    state: any;
}
interface IStoreState {
    initState?: any;
    children?: any;
}



const StoreContext = createContext<IStoreContext>({
    state: {},
    getData: ((key: string) => ({})) as any,
    setData: (data: any) => {}
});

export const Store = (props: IStoreState) => {
    const [ storeData ] = useState(props.initState || {});
    const setData = useCallback((key: string, data?: any) => {
        utils.setValue(storeData, key, data);
    }, [ storeData ]);
    const getData = useCallback(<T={}>(key?: string): T => {
        return key && !utils.isEmpty(key) ? utils.getValue(storeData, key) : storeData;
    }, [ storeData ]);
    const storeState = useMemo(() => {
        return {
            state: storeData,
            setData,
            getData
        };
    }, [setData, getData, storeData]);
    return (<StoreContext.Provider value={storeState}>
        {props.children}
    </StoreContext.Provider>)
};

export const useStore = <T={}>(): T & IStoreApi<T> => {
    const storeContext = useContext(StoreContext);
    return useMemo(() => {
        return {
            ...storeContext.state,
            getData: storeContext.getData,
            setData: storeContext.setData,
        };
    }, [storeContext]);
};

export const createStore = <T={}> (initState: T) => {
    return {
        Store: (props: any) => {
            return (<Store initState={initState || {}} {...props} />);
        },
        useStore: (): T & IStoreApi<T> => {
            return useStore<T>();
        }
    }
};
