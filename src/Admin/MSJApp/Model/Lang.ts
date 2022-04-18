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
        const allData = this.i18nData;
        const newData: any = {};
        const lngList: string[] = [];
        Object.keys(allData).forEach((lng: string) => {
            const lngData = allData[lng];
            const listData: any[] = [];
            Object.keys(lngData).forEach((key: string) => {
                const deleteble = this.notAllowDeleteKeys.indexOf(key) < 0;
                listData.push({
                    key: key,
                    text: lngData[key],
                    deleteble
                });
            });
            newData[lng] = listData;
            lngList.push(lng);
        });
        return {
            data: newData,
            srcData: this.i18nData,
            lngList
        };
    }
}