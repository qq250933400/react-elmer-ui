import { useApi as useApiHook, IApi } from "../../hook/useApi";
import { TypeServiceSendOptions } from "../../HOC/withService/ElmerService";
import { TypeServiceRequestOptions } from "../../HOC/withService";
import { IPageData } from "./Data";

interface IApiEvent {
    onAdminBreadcrumbChange: (data: IAdminBreadcurmb[]) => void;
}

export interface IException {
    title?: string;
    message?: string;
    pageId?: string;
    className?: string;
    onBack?: Function;
    toException?: boolean;
}

export interface IAdminBreadcurmb {
    title: string|object;
    pageId?: string;
}

export interface IExternalModule {
    render: () => {};
    getFunc: (funcId: string) => Function|null;
    getComponent: (componentId: string) => React.ComponentType<any> | null;
};

export interface IUseApi {
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

export type TypeUseApi = IApi<IUseApi, IApiEvent> & IUseApi;

export const useApi = () => useApiHook<IUseApi, IApiEvent>();
