import styles from "./style.module.scss";
import { ControllPanel } from "./components/ControllPanel";
import { useEffect, useState } from "react";
import { AppStore } from "./data";
import { editApp } from "../config";
import { IAppData } from "../data/IAppInfo";

const App = (props: any) => {
    const [ initState ] = useState<IAppData>(props.initData);
    useEffect(() => {
        editApp.showLoading();
        editApp.callApiEx(`${initState.appKey}.init`).then(() => {
            editApp.hideLoaidng();
        }).catch(() => {
            editApp.hideLoaidng();
        });
        return () => {
            editApp.callApiEx(`${initState.appKey}.destory`);
        }
    }, []);
    return (<AppStore initData={{
        appData: initState
    }}>
        <div className={styles.workspace}>
            <ControllPanel />
            <section className={styles.editPanel}>
                Editor
            </section>
        </div>
    </AppStore>);
}

export default App;