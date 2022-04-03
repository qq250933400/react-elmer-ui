import BaseModel from "./Base";
import { queueCallFunc } from "elmer-common";
import { IMenuItem, IMenuList } from "@MSJApp/types/IAdmin";
import { message } from "antd";

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
        } else {
            // goto new page
            const page = this.api.getPageById(menuItem.value);
            const newPath = (page as any).navigateTo || page?.path;
            if(page) {
                this.api.navigateTo({
                    ...page,
                    path: newPath
                });
            } else {
                message.error(`定义参数错误，PageId不存在。${menuItem.value}`);
            }
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
    initRightConfig() {
        return queueCallFunc([
            {
                id: "delay",
                fn: () => {
                    return new Promise((resolve) => {
                        setTimeout(() => resolve({}), 5000);
                    });
                }
            }
        ]);
    }
}