
export type TypeEditableInputType = "text"|"number";
export type TypeTopOption = "topLeft"|"topCenter"|"topRight"|"none";
export type TypeBottomOption = "bottomLeft"|"bottomCenter"|"bottomRight"|"none";

export interface IEditableData {
    inputType: TypeEditableInputType;
    data: any;
};

export interface IDataItem {
    key: string|number;
    editing?: boolean;
};

export interface IEditConfig {
    text?: {
        placeHolder: string|JSX.Element;
    },
    number?: {
        placeHolder: string|JSX.Element;
        max?: number;
        min?: number;
    }
};
