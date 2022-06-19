import { IWithStore, IWithStoreContext, IWithStoreResult } from "./IApplication";
import React, { useContext, useEffect, createContext, useMemo, useState } from "react";
import { AppContext } from "./Application";
import { utils } from "elmer-common";

const WithStoreContext = createContext<IWithStoreContext>({
    rootData: {},
    rootPath: "",
    data: {},
    dispatchs: {},
    updateData: () => {}
});

export const withStore = function<T={}, P={}>(option: IWithStore<T>){
    return (WrapperComponent: React.ComponentType<any>):IWithStoreResult<T,P> => {
        const StoreApp = (props:any) => {
            const appObj = useContext(AppContext);
            const topStore = useContext(WithStoreContext);
            const [ currentData, setCurrentData ] = useState({});
            const currentStore = useMemo(() => {
                const rootPath = utils.isEmpty(topStore.rootPath) ? option.name : topStore + "." + option.name;
                return {
                    rootData: appObj.data,
                    rootPath,
                    data: currentData,
                    dispatchs: option.dispatch || {},
                    updateData: (dataKey: string, newData: any): void => {
                        const newStoreData:any = { ...currentData };
                        newStoreData[dataKey] = newData;
                        setCurrentData(newStoreData);
                    }
                };
            }, [ appObj, currentData, topStore]);
            return (
                <WithStoreContext.Provider value={currentStore}>
                    <WrapperComponent {...props}/>
                </WithStoreContext.Provider>
            );
        };
        StoreApp.useData = <Names extends keyof T>(useKeys: Names[]): any => {
            const appObj = useContext(AppContext);
            const currentStore = useContext(WithStoreContext);
            return useMemo(()=>{
                const newData:any = {};
                const newAction: any = {};
                useKeys.forEach((key: any) => {
                    newData[key] = currentStore.data[key];
                    newAction[key] = ((dataKey: string, dispatch: Function) => {
                        return (saveData: any) => {
                            const dispatchSaveData = dispatch((newSaveData: any) => {
                                const saveKey = newSaveData.dataKey || dataKey;
                                const saveData = newSaveData.dataKey || newSaveData;
                                return {
                                    dataKey: saveKey,
                                    data: saveData
                                }
                            }, appObj.data)(saveData);
                            currentStore.updateData(dispatchSaveData.dataKey, dispatchSaveData.data);
                        };
                    })(key, currentStore.dispatchs[key]);
                });
                return {
                    data: newData,
                    action: newAction
                };
            }, [currentStore, appObj.data,useKeys]);
        };
        return StoreApp;
    }
};