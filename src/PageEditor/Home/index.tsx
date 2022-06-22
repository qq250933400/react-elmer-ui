/* eslint-disable react-hooks/exhaustive-deps */
import { withI18n } from "@HOC/withI18n";
import React, { useEffect, useMemo, useState, useRef } from "react";
import i18nData from "../i18n";
import styles from "../styles/theme.module.scss";
import homeStyles from "./styles.module.scss";
import { editApp } from "../config";
import { ApplicationHeader } from "../components/ApplicationHeader";
import { Container } from "../components/Window";
import { WindowOperate } from "./WindowOperate";
import StatusBar from "../components/StatusBar";
import cn from "classnames";
import { ServiceConfig } from "../config/ServiceConfig";
import withService, { useService } from "@HOC/withService";
import { Application } from "../components/Application";
import { RootStore, EmitValidation } from "../data";


const AppInit = (props: any) => {
    const [ CurrentPage, setCurrentPage ] = useState({
        page: null,
        state: null,
        data: null
    });
    const RenderPage = useMemo<React.ComponentType<any>>(() => (CurrentPage.page as any)?.Component, [CurrentPage]);
    const serviceObj = useService();
    useEffect(()=>{
        const removeBeforeEvent = editApp.on("onBeforeNavigateTo", () => {
            editApp.showLoading({
                position: "absolute"
            });
        });
        const removeAfterEvent = editApp.on("onAfterNavigateTo", () => {
            editApp.hideLoaidng();
        });
        editApp.run({
            location: "/",
            workspace: "PageEditApplicaton",
            implInit: {
                navigateTo: (pageInfo: any, state: any, data: any) => {
                    setCurrentPage({
                        page: pageInfo,
                        state,
                        data
                    });
                }
            }
        });
        editApp.setService(serviceObj);
        return () => {
            removeBeforeEvent();
            removeAfterEvent();
        };
    },[]);
    return (
        <div className={styles.routerLayout}>
            <ApplicationHeader />
            <div className={cn(homeStyles.pageContainer, "Container")}>
                {
                    RenderPage && <RenderPage initState={CurrentPage.state} initData={CurrentPage.data}/>
                }
            </div>
            <StatusBar />
        </div>
    );
};

const Home = () => {
    const [ theme ] = useState("theme_dark");
    const rootRef = useRef(null);

    useEffect(() => {
        const unBind = editApp.on("onFullScreenChange", (isFullScreen) => {
            if(rootRef && rootRef.current) {
                if(isFullScreen) {
                    editApp.callApi("menu","setFullScreen", (rootRef.current as HTMLDivElement));
                } else {
                    editApp.callApi("menu", "exitFullscreen");
                }
            }
        });
        const onResize = () => {
            editApp.callApi("menu", "onWindowResize");
        };
        window.addEventListener("resize", onResize);
        return () => {
            unBind();
            window.removeEventListener("resize", onResize);
        };
    }, [rootRef]);
    return (
        <div ref={rootRef} className={cn(styles.page_editor, theme, styles.editorApplication)} onContextMenu={(event) => {
            event.preventDefault();
            return false;
        }}>
            <EmitValidation>
                <Application>
                    <RootStore>
                        <Container>
                            <AppInit />
                            <WindowOperate />
                        </Container>
                    </RootStore>
                </Application>
            </EmitValidation>
        </div>
    );
};


export default withI18n({
    name: "page_editor_app",
    i18n: i18nData
})(
    withService({
        config: ServiceConfig
    })(
        Home
    )
);