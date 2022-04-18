import { queueCallFunc } from "elmer-common";
import Base from "./Base";

export default class Lang extends Base {
    private i18nData: any = {};
    private notAllowDeleteKeys: string[] = [];
    updateNotAllowDeleteKeys(keys: string[]): void {
        this.notAllowDeleteKeys = keys || {};
    }
    updateData(data: any): void {
        this.i18nData = data;
    }
    init() {
        return queueCallFunc([
            {
                id: "data",
                fn: () => this.i18nData
            }
        ]);
    }
}