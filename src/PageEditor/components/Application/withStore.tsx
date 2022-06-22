import { IWithStore, IWithStoreContext, IWithStoreResult } from "./IApplication";
import React, { useContext, createContext, useMemo, useState, useEffect } from "react";
import { AppContext } from "./Application";
import { utils } from "elmer-common";
import { editApp } from "src/PageEditor/config";

const WithStoreContext = createContext<IWithStoreContext>({
    rootData: {},
    rootPath: "",
    data: {},
    dispatchs: {},
    parentPatchs: {},
    name: "",
    currentPath: "",
    updateData: () => {}
});
const CONST_STORE_DATA_KEY = "CONST_STORE_DATA_KEY";
/**
 * 将需要本地化存储的数据节点信息保存到sessionStorage
 * @param key - 数据节点
 */
const updateLocalData = (key: string): void => {
    const txt = sessionStorage.getItem(CONST_STORE_DATA_KEY);
    const data: string[] = txt && !utils.isEmpty(txt) ? JSON.parse(txt) : [];
    if(data.indexOf(key) < 0) {
        data.push(key);
        sessionStorage.setItem(CONST_STORE_DATA_KEY, JSON.stringify(data));
    }
};
/**
 * 将数据本地化存储，检测数据节点是否需要做本地化存储
 * 通过对每个数据节点手动设置是否本地化存储用于减少优化数据存储
 * @param localKey - 数据节点
 * @param saveData - 保存数据
 */
const saveDataToStorage = (localKey: string, saveData: any): void => {
    const txt = sessionStorage.getItem(CONST_STORE_DATA_KEY);
    const data: string[] = txt && !utils.isEmpty(txt) ? JSON.parse(txt) : [];
    if(data.indexOf(localKey) >= 0) {
        // 只有需要本地化存储的数据在更新时同步到sessionStorage
        let saveToLocal = "";
        if(utils.isObject(saveData) || utils.isArray(saveData)) {
            saveToLocal = "JSON|" + JSON.stringify(saveData); 
        } else if(utils.isNumeric(saveData)) {
            saveToLocal = "Number|" + saveData;
        } else if(utils.isBoolean(saveData)) {
            saveToLocal = "Boolean|" + saveData;
        } else {
            saveToLocal = "String|" + saveData;
        }
        if(null !== saveData && undefined !== saveData) {
            sessionStorage.setItem(localKey, saveToLocal);
        } else {
            sessionStorage.removeItem(localKey);
        }
    }
};
/**
 * 获取本地存储的数据，恢复原有数据结构
 * @param path - context节点
 * @param dispatchs - context保存数据方法结构
 * @returns 
 */
const getSaveLocalData = (path: string, dispatchs: any): any => {
    const resultData: any = {};
    const txt = sessionStorage.getItem(CONST_STORE_DATA_KEY);
    const data: string[] = txt && !utils.isEmpty(txt) ? JSON.parse(txt) : [];
    Object.keys(dispatchs).forEach((key: string) => {
        const dataKey = (path + "." + key).replace(/^\./,"");
        if(data.indexOf(dataKey) >= 0) {
            const dataTxt:string = sessionStorage.getItem(dataKey) || "";
            const valData = dataTxt.replace(/^[a-z]{1,}\|/i, "");
            let finalData:any = dataTxt;
            if(/^JSON\|/.test(dataTxt)) {
                finalData = JSON.parse(valData);
            } else if(/^Number\|/.test(dataTxt)) {
                finalData = /\./.test(valData) ? parseFloat(valData) : parseInt(valData);
            } else if(/^Boolean\|/.test(dataTxt)) {
                finalData = /^true$/i.test(dataTxt);
            }
            resultData[key] = finalData;
        }
    });
    return resultData;
};
export const withStore = function<T={}, P={}>(option: IWithStore<T>){
    return (WrapperComponent: React.ComponentType<any>):IWithStoreResult<T,P> => {
        const StoreApp = (props:any) => {
            const appObj = useContext(AppContext);
            const topStore = useContext(WithStoreContext);
            const [ currentData, setCurrentData ] = useState(() => {
                const currentPath = topStore.rootPath + "." + option.name;
                (option as any).path = currentPath.replace(/^\./,"");
                return getSaveLocalData(currentPath, option.dispatch || {});
            });
            const currentStore = useMemo(() => {
                const rootPath = utils.isEmpty(topStore.rootPath) ? option.name : topStore.rootPath + "." + option.name;
                const parentDispatchs:any = {};
                if(topStore.dispatchs) {
                    Object.keys(topStore.dispatchs).forEach((topPKey: string) => {
                        const newKey = topStore.rootPath + "." + topPKey;
                        parentDispatchs[newKey] = {
                            dispatch: topStore.dispatchs[topPKey], // 保存方法
                            updateData: topStore.updateData // 保存数据方法也需要继承下去
                        };
                    });
                }
                return {
                    name: option.name,
                    rootData: appObj.data,
                    rootPath,
                    data: currentData,
                    dispatchs: option.dispatch || {},
                    parentPatchs: {
                        ...(topStore.parentPatchs || {}),
                        ...parentDispatchs
                    },
                    currentPath: (option as any).path,
                    updateData: (dataKey: string, newData: any): void => {
                        const newStoreData:any = { ...currentData };
                        newStoreData[dataKey] = newData;
                        setCurrentData(newStoreData);
                    }
                };
            }, [ appObj, currentData, topStore]);
            useEffect(()=>{
                const removeStoreEvent = editApp.on("onRemoveFromStore", (dataKey: string) => {
                    const rootPath = dataKey.replace(/\.[a-z0-9_-]{1,}$/i,"");
                    const keyMatch = /\.([a-z0-9_-]{1,})$/i.exec(dataKey);
                    if(rootPath === (option as any).path && keyMatch) {
                        const key = keyMatch[1];
                        currentStore.updateData(key, null);
                        saveDataToStorage(dataKey, null);
                    }
                });
                return () => {
                    removeStoreEvent();
                };
            }, [currentStore]);
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
                const inDefineContext = currentStore.currentPath === (option as any).path;
                useKeys.forEach((key: any) => {
                    const fallbackKey = (option as any).path + "." + key;
                    const findDispatchPatch = inDefineContext ? currentStore.dispatchs[key] : currentStore.parentPatchs[fallbackKey]?.dispatch;
                    // 当findDispatchPath为undefined或者null时，有可能是第一次渲染
                    if(findDispatchPatch) {
                        const updateData = inDefineContext ? currentStore.updateData : currentStore.parentPatchs[fallbackKey]?.updateData; // 当调用Store处于自己一层的Context才可以使用Context的update方法
                        newData[key] = currentStore.data[key];
                        newAction[key] = ((dataKey: string, dispatch: Function, setData: Function, actionPath: string) => {
                            return (saveData: any) => {
                                const dispatchSaveData = dispatch((newSaveData: any, localized?: boolean) => {
                                    const saveKey = newSaveData?.dataKey || dataKey;
                                    const saveData = newSaveData?.dataKey || newSaveData;
                                    const localKey = actionPath + "." + saveKey;
                                    localized && updateLocalData(localKey); // 需要本地化数据先将key保存，在恢复数据时使用
                                    saveDataToStorage(localKey, saveData);
                                    return {
                                        dataKey: saveKey,
                                        data: saveData
                                    }
                                }, appObj.data)(saveData);
                                setData(dispatchSaveData.dataKey, dispatchSaveData.data);
                            };
                        })(key, findDispatchPatch, updateData, (option as any).path);
                    }
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