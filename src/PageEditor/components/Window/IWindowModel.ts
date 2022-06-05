import React from "react";

export interface IWindowProps {
    title: string;
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
};