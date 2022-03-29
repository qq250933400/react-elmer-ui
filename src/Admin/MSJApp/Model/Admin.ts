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
                id: "timeout",
                fn: () => {
                    return new Promise((resolve) => {
                        setTimeout(() => resolve({}), 2000);
                    })
                }
            }
        ], undefined, {
            throwException: true
        });
    }
    onLeftMenuChange(menuItem: IMenuItem, menuList: IMenuList): void {
        console.log(menuItem, menuList);
    }
}