import { TypeAttachApiFunc } from "@MSJApp";
import { TypeServiceSendOptions } from "@HOC/withService/ElmerService";
import { IPageHeadButton } from "../Types/IPageInfoEx";

type TypeApiState = {
    showLoading: boolean;
};

type TypePHBClickEvent = {
    name?: string;
    id?: string;
    buttons: IPageHeadButton[];
};

type TypeLang = "en-GB" | "zh-CN";

const apiState: TypeApiState = {
    showLoading: false
};

export type TypeApiEvent = {
    onShowLoading(visible: boolean): void;
    onAdminPageLoading(loading: boolean): void;
    /**
     * 页面顶部按钮单击事件
     * @param event - 单击事件参数
     */
    onPHBClick(event: TypePHBClickEvent): void;
};

export type TypeJSXApi = {
    /**
     * 显示Loading
     */
    showLoading(): void;
    /**
     * 隐藏Loading
     */
    hideLoading(): void;
    /**
     * 发起Http请求
     * @param option - 请求参数
     */
    ajax<T={}>(option: TypeServiceSendOptions): Promise<T>;
    /**
     * 切换语言
     * @param locale - 语言
     */
    setLocale<Lng="en-GB">(locale: TypeLang | Lng): void;
    /**
     * 获取当前系统设置语言
     */
    getLocale<Lng="en-GB">(): TypeLang | Lng;
};

export const JSXApi: TypeAttachApiFunc<TypeJSXApi, TypeApiEvent> = {
    showLoading: (api) => () => {
        if(!apiState.showLoading) {
            apiState.showLoading = true;
            api.emit("onShowLoading", true);
        }
    },
    hideLoading: (api) => () => {
        apiState.showLoading = false;
        api.emit("onShowLoading", false);
    },
    ajax: (api) => (opt) => {
        return api.impl.ajax(opt);
    },
    setLocale: (api) => (locale) => {
        return (api.impl as any).setLocale(locale);
    },
    getLocale: (api) => () => (api.impl as any).getLocale()
};