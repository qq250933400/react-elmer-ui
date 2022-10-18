import { TypeServiceSendOptions } from "../HOC/withService/ElmerService";
import { TypeServiceRequestOptions } from "../HOC/withService";
import { IPageData } from "./IApi";
import React from "react";

export type TypeProtectApi = "registe" | "registeEx" | "unRegiste" | "unRegisteEx";

export declare interface IApi<IExternalAPI={}, IExternalEvent={}> {
    registe: <Name extends keyof IExternalAPI>(name: Name, callback: (api: Omit<IApi & IExternalAPI, TypeProtectApi>) => IExternalAPI[Name]) => void;
    registeEx: <ExAPI extends Omit<IApi & IExternalAPI, TypeProtectApi>>(api: {[P in keyof ExAPI]?: (api: Omit<IApi & IExternalAPI, TypeProtectApi>) => ExAPI[P]}) => void;
    unRegiste: (name: keyof Omit<IApi & IExternalAPI, TypeProtectApi>) => void;
    unRegisteEx: <Name extends keyof Omit<IApi & IExternalAPI, TypeProtectApi>>(name: Name[]) => void;
    on: <EventName extends keyof IExternalEvent>(eventName: EventName, callback: IExternalEvent[EventName]) => void;
    emit: <EventName extends keyof IExternalEvent>(eventName: EventName, ...args: any[]) => any;
}

export declare interface IApiEvent {
    onAdminBreadcrumbChange: (data: IAdminBreadcurmb[]) => void;
}

export declare interface IException {
    title?: string;
    message?: string;
    pageId?: string;
    className?: string;
    onBack?: Function;
    toException?: boolean;
}

export declare interface IAdminBreadcurmb {
    title: string|object;
    pageId?: string;
}

export declare interface IExternalModule {
    render: () => {};
    getFunc: (funcId: string) => Function|null;
    getComponent: (componentId: string) => React.ComponentType<any> | null;
}

export declare interface IUseApi {
    showLoading: () => void;
    hideLoading: () => void;
    navigateTo: (pathname: string, state?: any) => void;
    goto: (pageId: string, state?: any, exception?: IException) => void;
    get: <TData={}>(key?: string) => TData;
    getPageById: (id: string) => IPageData|null;
    save: (name: string, data?: any) => void;
    ajax: <T={}>(option?: TypeServiceSendOptions, opt?: TypeServiceRequestOptions) => Promise<T>;
    useModule: (moduleId: string) => Promise<IExternalModule>;
    /** 只可以在默认后台模板系统中使用 */
    updateAdminBreadcrumb: (data: IAdminBreadcurmb[]) => void;
    /** 只可以在默认后台模板系统中使用 */
    getAdminBreadcrumb: () => IAdminBreadcurmb[];
}

export declare type TypeUseApi = IApi<IUseApi, IApiEvent> & IUseApi;

export declare const useApi: () => TypeUseApi;

export declare const ApiProvider: () => React.ReactNode;

