import React from "react";

export interface IWindowProps {
    title: string|number;
    icon?: React.ComponentType<any>;
    hideClose?: boolean;
    hideMax?: boolean;
    hideMin?: boolean;
    hideIcon?: boolean;
    hasMask?: boolean;
    showAnimation?: string;
    showBottom?: boolean;
    hideAnimation?: string;
    onClose?: Function;
    canMove?: boolean;
    context?: any;
    bottom?: any;
    uid?: string;
};

export type TypeAlertIcon = "Info" | "Warn" | "Question" | "Error" | "Success"
export type TypeAlertMsg = "OkOnly" | "OkCancel" | "OkCancelRetry";
export interface IAlertOption {
    title: string|number;
    message: string|number|object;
    icon?: React.ComponentType<any>;
    hideIcon?: boolean;
    msgIcon?: TypeAlertIcon;
    msgType?: TypeAlertMsg;
    okText?: string;
    cancelText?: string;
    retryText?: string;
    onConfirm?: Function;
    onCancel?: Function;
    onRetry?: Function;
};
