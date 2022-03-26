import BaseModel from "./Base";
import { queueCallFunc } from "elmer-common";

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
                        setTimeout(() => resolve({}), 5000);
                    })
                }
            }
        ], undefined, {
            throwException: true
        });
    }
}