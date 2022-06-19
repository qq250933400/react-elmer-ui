/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "../style.module.scss";
import { cn } from "../../../utils";
import { CloseOutlined, CodeSandboxOutlined, ExpandAltOutlined, ExpandOutlined, MinusOutlined } from "@ant-design/icons";
import { useNodeDrag } from "src/hook/useNodeDrag";
import { eventBus } from "./EventHandler";

type TypeWindowOptions = {
    hideClose?: boolean;
    hideMax?: boolean;
    hideMin?: boolean;
    canMove?: boolean;
    showAnimation?: string;
    hideAnimation?: string;
};
type TypeWindowProps = {
    bottom?: any;
    title?: string|number|object;
    children?: any;
    icon?: any;
    hideIcon?: boolean;
    options?: TypeWindowOptions;
    onClose?: Function;
    uid?: string;
};

export const Window = (props: TypeWindowProps) => {
    const [ formState ] = useState({
        left: "0",
        top: "0",
        width: "auto",
        height: "auto",
        offsetHeight: "0",
        isMax: false,
        isClose: false,
        showAnimation: props.options?.showAnimation || styles.animationZoomIn,
        hideAnimation: props.options?.hideAnimation || styles.animationZoomOut
    });
    const [ eventOptions ] = useState({
        closeOption: {}
    });
    const [ formAnimation, setFormAnimation ] = useState("");
    const [ bottom ] = useState(props.bottom);
    const [ icon ] = useState(props.icon || <CodeSandboxOutlined/>);
    const [ zoomIcon, setZoomIcon ] = useState(<ExpandAltOutlined />);
    const [ dragNode, setDragNode ] = useState(null);
    const formRef = useRef(null),
        headerRef = useRef(null),
        contentRef = useRef(null),
        bottomRef = useRef(null);
    const calcClientHeight = useCallback(() => {
        const headerHeight = headerRef.current ? (headerRef.current as HTMLHeadElement).clientHeight : 0;
        const bottomHeight = bottomRef.current ? (bottomRef.current as HTMLHeadElement).clientHeight : 0;
        const formHeight = formRef.current ? (formRef.current as HTMLHeadElement).clientHeight : 0;
        const clientHeight = formHeight - headerHeight - bottomHeight;
        return clientHeight + "px";
    }, [headerRef, bottomRef, formRef]);
    const onMaxClick = useCallback(() => {
        if(formRef.current) {
            const formNode:HTMLDivElement = formRef.current;
            if(formState.isMax) {
                formNode.style.left = formState.left.toString();
                formNode.style.top = formState.top.toString();
                formNode.style.width = formState.width;
                formNode.style.height = formState.height;
                formState.isMax = false;
                if(contentRef.current) {
                    (contentRef.current as HTMLElement).style.height = formState.offsetHeight;
                }
                setZoomIcon(<ExpandAltOutlined />);
            } else {
                formState.left = formNode.offsetLeft + "px";
                formState.top = formNode.offsetTop + "px";
                formState.width = formNode.clientWidth + "px";
                formState.height = formNode.clientHeight + "px";
                formState.isMax = true;
                formNode.style.left = "0px";
                formNode.style.top = "0px";
                formNode.style.width = "100vw";
                formNode.style.height = "100vh";
                if(contentRef.current) {
                    (contentRef.current as HTMLElement).style.height = calcClientHeight();
                }
                setZoomIcon(<ExpandOutlined />);
            }
        }
    }, [formState, contentRef, calcClientHeight]);
    const onCloseClick = useCallback(() => {
        formState.isClose = true;
        setFormAnimation(formState.hideAnimation);
    }, [formState]);
    const onFormAnimationEnd = useCallback(() => {
        if(formState.isClose) {
            typeof props.onClose === "function" && props.onClose(props.uid, eventOptions.closeOption);
            return;
        }
    }, [formState, props]);
    useNodeDrag(dragNode as any, {
        moveTarget: formRef.current,
        limitRect: {
            left: 0,
            top: 0,
            right: formRef.current ? (document.body.clientWidth - (formRef.current as HTMLDivElement).clientWidth) : document.body.clientWidth,
            bottom: formRef.current ? (document.body.clientHeight - (formRef.current as HTMLDivElement).clientHeight) : document.body.clientHeight,
        }
    });
    useEffect(()=>{
        formState.offsetHeight = calcClientHeight();
        if(formRef.current) {
            const cWidth = (formRef.current as HTMLDivElement).clientWidth,
                cHeight = (formRef.current as HTMLDivElement).clientHeight;
            const wWidth = document.body.clientWidth,
                wHeight = document.body.clientHeight;
            const initLeft = (wWidth - cWidth) / 2, initTop = (wHeight - cHeight) / 2;
            formState.left = initLeft + "px";
            formState.top = initTop + "px";
            (formRef.current as HTMLDivElement).style.left = formState.left;
            (formRef.current as HTMLDivElement).style.top = formState.top;
        }
        formState.isClose = false;
        setDragNode(headerRef.current);
        setFormAnimation(formState.showAnimation);
        // -----
        const removeClose = eventBus.on("close", (uid, option) => {
            if(uid === props.uid) {
                eventOptions.closeOption = option;
                onCloseClick();
            }
        });
        return () => {
            removeClose();
        }
    }, []);
    return (
        <div ref={formRef}
            className={cn(styles.window, formAnimation, "Window")}
            onSelect={(event) => {
                event.preventDefault();
                return false;
            }}
            onAnimationEnd={onFormAnimationEnd}
        >
            <header className={cn(styles.header, "Header")} ref={headerRef}>
                { !props.hideIcon && icon && <i className="Icon">{icon}</i> }
                <span className="Title">{props.title}</span>
                <div className="Buttons">
                    {!props.options?.hideMin && <button type="button" className="BtnMin"><MinusOutlined /></button> }
                    {!props.options?.hideMax && <button type="button" className="BtnMax" onClick={onMaxClick}>{zoomIcon}</button> }
                    {!props.options?.hideClose && <button type="button" className="BtnClose" onClick={onCloseClick}><CloseOutlined /></button> }
                </div>
            </header>
            <section ref={contentRef} className={cn(styles.content, "Content")}>
                {props.children}
            </section>
            { bottom && <section ref={bottomRef} className={cn(styles.bottom, "Bottom")}>{bottom}</section> }
        </div>
    );
};