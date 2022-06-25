/* eslint-disable react-hooks/exhaustive-deps */
import styles from "../../style.module.scss";
import cn from "classnames";
import { IPanel } from "../../../data/IAppInfo";
import { useEffect, useMemo, useState } from "react";
import Loading from "../../../components/Loading";
import { editApp } from "../../../config";
import {  } from "../../../data";

type TypePanelProps = {
    title: string|JSX.Element;
    data: IPanel;
    visible: boolean;
}

export const Panel = (props:TypePanelProps) => {
    const PanelNode = useMemo(() => props.data.Component, [props.data]);
    const [ loading, setLoading ] = useState(true);
    useEffect(()=>{
        if(props.data.onBeforeEnter) {
            setLoading(true)
            editApp.callApiEx(props.data.onBeforeEnter, props.data).then((data) => {
                console.log("data", data);
                setLoading(false);
            }).catch((err) => {
                console.error(err);
                setLoading(false);
            });
        }
    }, [props.data.onBeforeEnter]);
    return (
        <section className={cn(styles.panel)} style={{display: props.visible ? "block" : "none"}}>
            <label className="TitleColor">
                <span>{props.title}</span>
            </label>
            <div className={styles.panelContainer}>
                { !loading && PanelNode && <PanelNode /> }
                <Loading visible={loading} position="absolute"/>
            </div>
        </section>
    );
};