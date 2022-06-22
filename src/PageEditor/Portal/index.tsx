/* eslint-disable react-hooks/exhaustive-deps */
import styles from "./style.module.scss";
import { ActionButtonSection, ActionLinkSection } from "./Action";
import { FormattedMessage } from "@HOC/withI18n";
import { Info } from "./Info";
import { cn } from "src/utils";
import { StoreContainer } from "./DataStore";
import { useRootStore } from "../data";
import { useEffect, useState } from "react";
import { editApp } from "../config";

const Portal = () => {
    const rootStore = useRootStore(["currentApp"]);
    const [ shouldInApp, setShouldInApp ] = useState( !!rootStore.data.currentApp );

    useEffect(()=>{
        if(shouldInApp) {
            editApp.goto("app", rootStore.data.currentApp).catch((err) => {
                console.error(err.exception || err);
                editApp.alert({
                    title: "错误项目",
                    message: err.message,
                    msgIcon: "Error"
                });
                setShouldInApp(false);
            });
        }
    }, []);
    return rootStore.data.currentApp && shouldInApp ? <></> : (
        <StoreContainer>
            <div className={cn(styles.portal, "Container")}>
                <div style={{ maxWidth: 1000, margin: "0 auto" }}>
                    <h1 className={cn(styles.title, "TitleColor")}><FormattedMessage id="applicationTitle"/></h1>
                    <div className={styles.actionLayout}>
                        <section className={styles.actionLayoutLeft}>
                            <ActionButtonSection />
                            <ActionLinkSection />
                        </section>
                        <section className={styles.actionLayoutSplit} />
                        <section className={styles.actionLayoutRight}>
                            <Info />
                        </section>
                    </div>
                </div>
            </div>
        </StoreContainer>
    );
};

export default Portal;
