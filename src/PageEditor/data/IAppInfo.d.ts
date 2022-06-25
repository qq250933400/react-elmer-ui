import React from "react";
import { TypeModels } from "../config/model"
type TypeAppType = "WebPage" | "Markdown";

export interface IPanel {
    Icon: React.ComponentType<any>;
    title: string;
    value: string;
    Component: React.ComponentType<any>;
    onBeforeEnter?: string;
}

export declare interface IAppInfo {
    name: string;
    type: TypeAppType;
    fileName: string;
}

export declare interface IAppData {
    app: IAppInfo;
    appKey: keyof TypeModels;
    panels: IPanel[];
}