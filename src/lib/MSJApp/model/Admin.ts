import { Model } from "../core/Model";
import { IMenuItem, IMenuList } from "../types/IAdmin";

const CONSTADMINDATAKEY = "MSJApp_Admin_202203241437";

export default class Admin extends Model {

    createMenu<T={}>(menuName: string, menuList: IMenuList<T>): any {
        const menuListData: IMenuList<T> = menuList || [];
        const menuData: any = this.getMenuStoreData();
        if(menuData[menuName]) {
            throw new Error("定义菜单已经存在，请检查menuName设置。");
        } else {
            menuData[menuName] = menuListData;
            this.setMenuStoreData(menuData);
            const obj = {
                addMenuItem(menuItem: IMenuItem<T> & T): any {
                    menuListData.push(menuItem);
                    return obj;
                }
            };
            return obj;
        }
    }
    getMenu<T={}>(menuName: string): IMenuList<T> {
        const menuData:any = this.getMenuStoreData() || {};
        return menuData[menuName];
    }
    private getMenuStoreData():any {
        return this.api.getData(CONSTADMINDATAKEY) || {};
    }
    private setMenuStoreData(menuData: any): void {
        this.api.setData(CONSTADMINDATAKEY, menuData);
    }
}
