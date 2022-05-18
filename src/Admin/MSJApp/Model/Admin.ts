import BaseModel from "./Base";
import { queueCallFunc } from "elmer-common";
import { IMenuItem, IMenuList } from "@MSJApp/types/IAdmin";
import { message } from "antd";
import { IPageInfoEx } from "../Types/IPageInfoEx";
import { IBreadCrumbList } from "../Types/IBreadCrumb";
import { IMenuListEx } from "../Types/IMenuItemEx";
import { utils } from "elmer-common";

export default class Admin extends BaseModel {
    private mainPage!: IPageInfoEx;
    private isAdminPageLoading: boolean = false;
    // admin layout init
    initLoad(): Promise<any> {
        return queueCallFunc([
            {
                id: "leftMenu",
                fn: () => {
                    return new Promise(async(resolve) => {
                        const menuList = await this.api.getMenu("adminLeftMenu");
                        const allPageData = this.api.getAllPages() || {};
                        resolve(this.menuAndPageMapping(menuList, allPageData || {}));
                    });
                }
            }, {
                id: "sysInfo",
                fn: () => this.api.getConfig("sysInfo")
            }, {
                id: "adminProfileMenu",
                fn: () => this.api.getMenu("adminProfileMenu")
            }, {
                id: "mainPage",
                fn: () => this.api.callApi("admin", "getMainPage")
            }
        ], undefined, {
            throwException: true
        });
    }
    onLeftMenuChange(menuItem: IMenuItem, menuList: IMenuList): any {
        if(menuItem.type === "Api") {
            this.api.callApiEx(menuItem.value, menuItem, menuList);
        } else {
            if(this.isAdminPageLoading) {
                message.warning("页面加载中。。。");
                throw new Error("当前页面加载中不做跳转。");
            }
            // goto new page
            const page = this.api.getPageById(menuItem.value);
            if(page) {
                this.api.navigateTo(page);
                this.api.save("currentMenu", menuItem);
                return page;
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
        if(locale === "en-GB") {
            this.api.setLocale("zh-CN");
        } else {
            this.api.setLocale("en-GB");
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
    setMainPage(pageInfo:IPageInfoEx) {
        this.mainPage = pageInfo;
    }
    getMainPage():IPageInfoEx {
        return this.mainPage;
    }
    calcBreadCrumb(page: IPageInfoEx, leftMenuList: IMenuListEx): IBreadCrumbList {
        const breadCrumbList: IBreadCrumbList = [];
        this.findMenuByPage(page, leftMenuList, breadCrumbList);
        return breadCrumbList;
    }
    getLeftMenuSelectKey(page: IPageInfoEx, leftMenuList: IMenuListEx): string|undefined {
        for(const item of leftMenuList) {
            if(item.type !== "Api" && page.id === item.value) {
                return item.key;
            } else {
                if(item.subMenu) {
                    const findKey = this.getLeftMenuSelectKey(page, item.subMenu);
                    if(!utils.isEmpty(findKey)) {
                        return findKey;
                    }
                }
            }
        }
    }
    setAdminPageLoading(loadingStatus: boolean): void {
        this.isAdminPageLoading = loadingStatus;
    }
    onPageHeaderButtonClick(opt: any): void {
        const { evtBtn, buttons} = opt;
        if(evtBtn.type === "Api") {
            this.api.callApiEx(evtBtn.value, buttons).then((data) => {
                this.api.emit("onPHBClick", {
                    name: evtBtn.name,
                    id: evtBtn.id,
                    ...(data||{})
                });
            });
        } else {
            // -- redirect to new page
            this.api.navigateTo(evtBtn.page);
        }
    }
    private findMenuByPage(page: IPageInfoEx, menuList: IMenuListEx, breadCrumbList: IBreadCrumbList): boolean {
        const allPageData:any = this.api.getAllPages();
        for(const menuItem of menuList) {
            if(menuItem.type !== "Api" && menuItem.value === page.id) {
                breadCrumbList.push({
                    title: menuItem.title,
                    page: undefined
                });
                return true;
            } else {
                if(menuItem.subMenu && menuItem.subMenu.length > 0) {
                    const menuPage:IPageInfoEx = allPageData[menuItem.value];
                    const findMenuList: IBreadCrumbList = [{
                        title: menuItem.title,
                        page: menuPage
                    }];
                    if(this.findMenuByPage(page, menuItem.subMenu, findMenuList)) {
                        breadCrumbList.push(...findMenuList);
                        return true;
                    }
                }
            }
        }
        return false;
    }
    private menuAndPageMapping(menuList: IMenuList, pageData: any): IMenuList {
        const newMenuList:IMenuList = [];
        menuList.forEach((item) => {
            const subMenuList = item.subMenu && item.subMenu.length > 0 ? this.menuAndPageMapping(item.subMenu, pageData) : null;
            if(item.type !== "Api") {
                const page = pageData[item.value];
                if(page) {
                    newMenuList.push({
                        ...item,
                        path: page.navigateTo || page.path,
                        subMenu: subMenuList
                    } as any);
                } else {
                    newMenuList.push({...item, subMenu: subMenuList} as any);
                }
            } else {
                newMenuList.push({...item, subMenu: subMenuList} as any);
            }
        });
        return newMenuList;
    }
}