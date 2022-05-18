import { IPageInfo } from "@MSJApp/types/IPage";

export interface IPageHeadButton {
    title: string;
    type: "Api" | "Page";
    value?: any;
    id?: string;
    name?: string;
    className?: string;
    attrs?: any;
}

export interface IPageInfoEx extends IPageInfo {
    navigateTo?: string;
    isAdminPage?: boolean;
    override?: boolean;
    fullPage?: boolean;
    buttons?: IPageHeadButton[];
}
