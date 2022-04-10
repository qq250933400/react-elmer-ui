import { IPageInfo } from "@MSJApp/types/IPage";

export interface IPageInfoEx extends IPageInfo {
    navigateTo?: string;
    isAdminPage?: boolean;
}
