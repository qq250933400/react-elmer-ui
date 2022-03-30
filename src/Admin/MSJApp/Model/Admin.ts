import BaseModel from "./Base";
import { queueCallFunc } from "elmer-common";
import { IMenuItem, IMenuList } from "@MSJApp/types/IAdmin";

export default class Admin extends BaseModel {
    initLoad(): Promise<any> {
        return queueCallFunc([
            {
                id: "leftMenu",
                fn: () => this.api.getMenu("adminLeftMenu")
            }, {
                id: "sysInfo",
                fn: () => this.api.getConfig("sysInfo")
            }, {
                id: "adminProfileMenu",
                fn: () => this.api.getMenu("adminProfileMenu")
            }
        ], undefined, {
            throwException: true
        });
    }
    onLeftMenuChange(menuItem: IMenuItem, menuList: IMenuList): void {
        if(menuItem.type === "Api") {
            this.api.callApiEx(menuItem.value, menuItem, menuList);
        }
    }
    getNotifyList(endPoint: string) {
        return this.api.ajax({
            endPoint: endPoint,
            throwException: true
        });
    }
    switchLang(): void {
        const locale = this.api.getLocale();
        console.log("change locale: ", locale);
        if(locale === "en") {
            this.api.setLocale("zh");
        } else {
            this.api.setLocale("en");
        }
    }
}