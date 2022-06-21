import { TypeModels } from "../model";
import { Api as ApiModel } from "@MSJApp/core/Api";
import { IWindowProps, IAlertOption, IModal } from "../../components/Window/IWindowModel";
import { FormattedMessage } from "@HOC/withI18n";
import { IApplication } from "../../components/Application/IApplication";
import { registeApp } from "../../components/Application";
import { IWithServiceApi } from "@HOC/withService";

export type TypeApiEvent = {
    onMenuChange: (menuList: any[]) => void;
    onFullScreenChange: (isFullScreen: boolean) => void;
    onCreateWindow: (opt: any) => void;
    onCreateAlert: (opt: IAlertOption) => void;
    onCreateModal: (opt: IModal) => void;
    onApplicationChange: (name: string, ...args: any[]) => void;
    onBeforeCreateApp: () => boolean;
    onAfterCreateApp: (data: any) => void;
    onRemoveFromStore: (key: string) => void;
};

type TypeEditorApi = ApiModel<TypeModels, TypeApiEvent>;
type TypeLoadingOpt = {
    title?: string;
};

export type TypeApi = {
    createWindow: (option: IWindowProps) => void;
    alert: (option: IAlertOption) => void;
    modal: (option: IModal) => void;
    registeApp: (app: IApplication) => void;
    showLoading: (opt?: TypeLoadingOpt) => void;
    hideLoaidng: () => void;
    setService: (obj: IWithServiceApi) => void;
};

export const Api: {[P in keyof TypeApi]: (api: TypeEditorApi) => TypeApi[P]} = {
    createWindow: (api) => (option) => api.emit("onCreateWindow", option),
    alert: (api) => (option) => api.emit("onCreateAlert", {
        ...option,
        okText: option.okText || <FormattedMessage id="btnConfirm"/>,
        cancelText: option.cancelText || <FormattedMessage id="btnCancel"/>,
        retryText: option.retryText || <FormattedMessage id="btnRetry"/>
    }),
    modal: (api) => (option) => {
        api.emit("onCreateModal", {
            ...option,
            okText: option.okText || <FormattedMessage id="btnConfirm"/>,
            cancelText: option.cancelText || <FormattedMessage id="btnCancel"/>,
            retryText: option.retryText || <FormattedMessage id="btnRetry"/>
        });
    },
    registeApp: () => (app) => registeApp(app),
    showLoading: (api) => (opt: any) => {
        api.emit("onApplicationChange", "showLoading", {
            ...(opt || {}),
            visible: true
        });
    },
    hideLoaidng: (api) => () => {
        api.emit("onApplicationChange", "showLoading", {
            visible: false
        });
    },
    setService: (api) => (obj) => {
        (api as any).service = obj;
    }
};