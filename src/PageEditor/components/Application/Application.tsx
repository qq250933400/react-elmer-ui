import React, { createContext, useState, useCallback, useMemo, useEffect } from "react";
import { editApp } from "../../config";
import { IApplicationContext, IApplication } from "./IApplication";

type TypeAppInfo<T={}> = {
    actions: {[P in keyof T]: IApplication }
}

const appStore: TypeAppInfo = {
    actions: {}
};

export const registeApp = (app: IApplication): void => {
    (appStore.actions as any)[app.name] = app;
};

export const AppContext = createContext<IApplicationContext>({
    data: {},
    setData: () => {}
});

export const Application = (props: any) => {
    const [ appData, setData ] = useState({});
    const [ execApp, setExecApp ] = useState<any[]>([]);
    const updateAppData = useCallback((key: string, value: any) => {
        const updateData:any = { ...appData };
        updateData[key] = value;
        setData(updateData);
    }, [appData]);
    const appState = useMemo<IApplicationContext>(() => ({
        data: appData || {},
        setData: updateAppData
    }), [ appData, updateAppData ]);
    const renderChildren = useMemo(() => props.children, [props]);
    useEffect(()=>{
        const removeAppChange = editApp.on("onApplicationChange", (name: string, ...args: any[]) => {
            let inExecApp = false;
            const newAppList = [];
            const runApp = (appStore.actions as any)[name];
            if(runApp) {
                for(const app of execApp) {
                    if(app.name === name) {
                        inExecApp = true;
                        newAppList.push({
                            name,
                            args
                        });
                    } else {
                        newAppList.push({...app});
                    }
                }
                if(!inExecApp) {
                    newAppList.push({
                        name,
                        args
                    });
                }
                setExecApp(newAppList);
            } else {
                console.error(`运行执行App不存在。(${name})`);
            }
        });
        return () => {
            removeAppChange();
        };
    }, [ execApp ]);

    return (
        <AppContext.Provider value={appState}>
            {renderChildren}
            {
                execApp && execApp.length > 0 && (execApp.map((app:any, index):any => {
                    const AppFn = (appStore.actions as any)[app.name]?.render;
                    if(AppFn && (typeof AppFn === "function" || typeof AppFn.render === "function")) {
                        const appProps = app.args[0] || {};
                        return <AppFn key={index} {...appProps}/>
                    } else {
                        return <React.Fragment key={index}/>
                    }
                }))
            }
        </AppContext.Provider>
    );
};