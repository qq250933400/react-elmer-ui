import { IPageInfo } from "@MSJApp/types/IPage";

interface IPageHeadButton {
    title: string;
    type: "Api" | "Page";
    value?: any;
    id?: string;
    name?: string;
    className?: string;
}

export interface IPageInfoEx extends IPageInfo {
    navigateTo?: string;
    isAdminPage?: boolean;
    override?: boolean;
    fullPage?: boolean;
    buttons?: IPageHeadButton[];
}
