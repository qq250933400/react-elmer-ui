import React from "react";
import styles from "./style.module.scss";
import CardLoading from "../../../components/CarLoading";
import { useInitData } from "@Admin/hooks";
const Landing = () => {
    const data = useInitData();
    console.log(data);
    return (
        <div className={styles.landing}>
            <CardLoading className={styles.spin}/>
        </div>
    );
};

export default Landing;