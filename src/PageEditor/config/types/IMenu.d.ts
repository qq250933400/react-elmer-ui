
type TypeMenuType = "Normal" | "Split";

export interface IMenuInfo {
    title: string|object;
    type?: TypeMenuType;
    hotKey?: string;
    value?: any;
    checked?: boolean;
    args?: any;
    items?: TypeMenuInfo[];
};

export interface IMenuList extends Array<IMenuInfo> {

};
