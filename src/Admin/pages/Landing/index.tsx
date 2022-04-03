import React, { useEffect, useMemo } from "react";
import styles from "./style.module.scss";
import CardLoading from "../../../components/CarLoading";
import { useInitData } from "@Admin/hooks";
import { msjApi } from "@Admin/MSJApp";

const Landing = () => {
    const data = useInitData();
    const isAdminPage = useMemo(()=> data.navTo?.isAdminPage, [data]);
    useEffect(()=>{
        const navTo = data.navTo || {};
        if(typeof navTo.onBeforeEnter === "string" && navTo.onBeforeEnter.length > 0) {
            msjApi.callApiEx(navTo.onBeforeEnter).then(() => {
                msjApi.navigateTo({
                    ...navTo,
                    redirect: true
                });
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);
    return (
        <div className={isAdminPage ? styles.adminLanding : styles.landing}>
            <CardLoading className={styles.spin}/>
        </div>
    );
};

export default Landing;