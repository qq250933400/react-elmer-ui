import styles from "./style.module.scss";
import { ControllPanel } from "./components/ControllPanel";
import { useState } from "react";

const App = (props: any) => {
    const [ initState ] = useState(props.initData);
    console.log(initState);
    return (<div className={styles.workspace}>
        <ControllPanel />
        <section className={styles.editPanel}>
            Editor
        </section>
    </div>);
}

export default App;