import { CheckCircleTwoTone, CloseCircleTwoTone, InfoCircleTwoTone, QuestionCircleTwoTone, WarningTwoTone } from "@ant-design/icons";
import React, { useMemo, useState } from "react";
import { IAlertOption, TypeAlertIcon, TypeAlertMsg } from "./IWindowModel";
import styles from "../style.module.scss";
import cn from "classnames"

type TypeIconData = { [P in TypeAlertIcon]: React.ComponentType<any> }
type TypeAlertProps = {
    msgIcon: TypeAlertIcon;
    children: any;
};
export type TypeAlertButton = "Confirm" | "Cancel" | "Retry";

type TypeClickCallback = (type: TypeAlertButton, options: IAlertOption) => void;

export const Alert = (props: TypeAlertProps) => {
    const [ IconData ] = useState<TypeIconData>({
        Info: InfoCircleTwoTone,
        Error: CloseCircleTwoTone,
        Question: QuestionCircleTwoTone,
        Success: CheckCircleTwoTone,
        Warn: WarningTwoTone
    });
    const Icon = useMemo(()=> (IconData as any)[props.msgIcon], [IconData,props.msgIcon]);
    return (<div className={cn(styles.alert, "Alert", props.msgIcon)}>
        <section className={cn(styles.alertIcon, "Icon")}>{ Icon && <Icon />}</section>
        <section className={cn(styles.alertMsg, "Message")}>{props.children}</section>
    </div>);
};

export const createAlertButton = (msgType: TypeAlertMsg, options: IAlertOption, fn: TypeClickCallback) => {
    const defaultOKText = "Ok", defaultCancelText = "Cancel", defaultRetryText = "Retry";
    const btnClassName = "btn_large";
    const onClick = (type: TypeAlertButton) => {
        fn(type, options);
    };
    const buttons: JSX.Element[] = [
        <button type="button" className={cn(btnClassName,"Confirm")} onClick={() => onClick("Confirm")}>{options.okText || defaultOKText}</button>
    ];
    
    switch(msgType) {
        case "OkCancel": {
            buttons.push(<button type="button" className={cn(btnClassName,"Cancel")} onClick={() => onClick("Cancel")}>{options.cancelText || defaultCancelText}</button>);
            break;
        }
        case "OkCancelRetry" : {
            buttons.push(<button type="button" className={cn(btnClassName,"Cancel")} onClick={() => onClick("Cancel")}>{options.cancelText || defaultCancelText}</button>);
            buttons.push(<button type="button" className={cn(btnClassName,"Retry")} onClick={() => onClick("Retry")}>{options.retryText || defaultRetryText}</button>);
            break;
        }
    }
    return buttons;
};