import styles from "./style.module.scss";
import { ControllPanel } from "./components/ControllPanel";
import { useState } from "react";
import { AppStore } from "./data";

const App = (props: any) => {
    const [ initState ] = useState(props.initData);
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