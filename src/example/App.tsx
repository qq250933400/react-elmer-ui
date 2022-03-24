import React, { useEffect, useState } from "react";
import { app } from "./AppModel";
import styles from "./App.module.scss";


const MSJApp = () => {
    const [ asynData, setAsynData ] = useState({});
    const [ appState, setAppState ] = useState({});
    const [ implUpdate, setImplUpdate ] = useState(true);
    useEffect(()=>{
        app.run({
            implInit: {
                setState: (state: any) => {
                    setImplUpdate(true);console.log("newState---", state);
                    setAppState(state);
                }
            }
        });
        console.log(app);
        return () => app.destory();
    },[setAppState]);
    useEffect(()=>{
        !implUpdate && app.refreshStoreData(appState);
    },[appState, implUpdate]);
    console.log(appState, "---");
    return (<div className={styles.exampleApp}>
        <span>Hello world</span>
        <button onClick={() => {
            app.useData("test").then((data) => {
                setAsynData(data);
            })
        }}>引用Json数据</button>
        <div>数据： {JSON.stringify(asynData)}</div>
    </div>);
};

export default MSJApp;
