import React from "react";
import { IPanel } from "../../data/IAppInfo";

type TypePanelType = "List" | "TreeView";

interface IPanelSection<D={}> {
    title: string;
    type: TypePanelType;
    data?: D;
    value: string|number;
    Component: React.ComponentType<any>;
}

export declare interface IAppEvent {
    onPanelChange(data: IPanel): void;
}

export declare interface IPanelData<D={}> extends Array<IPanelSection<D>> {
}
