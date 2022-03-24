import { Model } from "../core/Model";
import { IMenuItem, IMenuList } from "../types/IAdmin";

const CONSTADMINDATAKEY = "MSJApp_Admin_Menu_202203241437";
const CONSTADMINREGISTCONFIG = "MSJApp_Admin_Config_202203241839";

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
    registeConfig<T={}>(name: string, config: T): void {
        const configData:any = this.api.getData(CONSTADMINREGISTCONFIG) || {};
        if(!configData[name]) {
            configData[name] = config;
            this.api.setData(CONSTADMINREGISTCONFIG, configData);
        } else {
            throw new Error(`注册配置key冲突，请重新设置。(${name})`);
        }
    }
    getConfig<T={}>(name: string): T | null {
        const configData:any = this.api.getData(CONSTADMINREGISTCONFIG) || {};
        return configData[name];
    }
    private getMenuStoreData():any {
        return this.api.getData(CONSTADMINDATAKEY) || {};
    }
    private setMenuStoreData(menuData: any): void {
        this.api.setData(CONSTADMINDATAKEY, menuData);
    }
}
