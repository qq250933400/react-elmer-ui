import React, { useEffect, useState } from "react";
import { app } from "./AppModel";
import styles from "./App.module.scss";


const MSJApp = () => {
    const [ asynData, setAsynData ] = useState({});
    useEffect(()=>{
        app.run();
        console.log(app);app.hello();
        return () => app.destory();
    },[]);
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
