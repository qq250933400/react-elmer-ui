import { IMenuItem } from "@MSJApp/types/IAdmin";

export interface IMenuItemEx extends IMenuItem {
    path?: string;
    key?: string;
}

export interface IMenuListEx extends Array<IMenuItemEx> {

}
