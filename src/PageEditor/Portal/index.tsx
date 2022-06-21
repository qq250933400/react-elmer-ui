import styles from "./style.module.scss";
import { ActionButtonSection, ActionLinkSection } from "./Action";
import { FormattedMessage } from "@HOC/withI18n";
import { Info } from "./Info";
import { cn } from "src/utils";
import { StoreContainer } from "./DataStore";
import { useRootStore } from "../data";
import { useEffect } from "react";
import { editApp } from "../config";

const Portal = () => {
    const rootStore = useRootStore(["currentApp"]);
    useEffect(()=>{
        if(rootStore.data.currentApp) {
            editApp.goto("app", rootStore.data.currentApp);
        }
    }, []);
    return rootStore.data.currentApp ? <></> : (
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
