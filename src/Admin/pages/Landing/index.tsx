import React, { useEffect, useMemo } from "react";
import styles from "./style.module.scss";
import CardLoading from "../../../components/CarLoading";
import { useInitData } from "@Admin/hooks";
import { msjApi } from "@Admin/MSJApp";
import { IPageInfoEx } from "@Admin/MSJApp/Types/IPageInfoEx";

const Landing = () => {
    const data = useInitData();
    const isAdminPage = useMemo(()=> data.navTo?.isAdminPage, [data]);
    useEffect(()=>{
        const navTo:IPageInfoEx = data.navTo || {};
        if(typeof navTo.onBeforeEnter === "string" && navTo.onBeforeEnter.length > 0) {
            navTo.isAdminPage && msjApi.emit("onAdminPageLoading", true);
            navTo.isAdminPage && msjApi.callApi("admin", "setAdminPageLoading", true);
            msjApi.callApiEx(navTo.onBeforeEnter).then(() => {
                msjApi.navigateTo({
                    ...navTo,
                    redirect: true
                });
                navTo.isAdminPage && msjApi.emit("onAdminPageLoading", false);
                navTo.isAdminPage && msjApi.callApi("admin", "setAdminPageLoading", false);
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