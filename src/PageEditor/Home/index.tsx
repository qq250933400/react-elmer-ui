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

const Home = () => {
    const [ CurrentPage, setCurrentPage ] = useState({
        page: null,
        state: null
    });
    const [ theme ] = useState("theme_dark");
    const RenderPage = useMemo<React.ComponentType<any>>(() => (CurrentPage.page as any)?.Component, [CurrentPage]);
    const rootRef = useRef(null);
    useEffect(()=>{
        editApp.run({
            location: "/",
            workspace: "PageEditApplicaton",
            implInit: {
                navigateTo: (pageInfo: any, state: any) => {
                    setCurrentPage({
                        page: pageInfo,
                        state
                    });
                }
            }
        });
    },[]);
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
    <Container data={[]}>
        <div ref={rootRef} className={cn(styles.page_editor, styles.editorApplication)} onContextMenu={(event) => {
            event.preventDefault();
            return false;
        }}>
            <div className={theme}>
                <ApplicationHeader />
                <div className={cn(homeStyles.pageContainer, "Container")}>
                    {
                        RenderPage && <RenderPage initState={CurrentPage.state}/>
                    }
                </div>
                <StatusBar />
            </div>
            <WindowOperate />
        </div>
    </Container>);
};

export default withI18n({
    name: "page_editor_app",
    i18n: i18nData
})(Home);