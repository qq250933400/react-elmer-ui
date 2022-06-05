import { TypeModels } from "../model";
import { Api as ApiModel } from "@MSJApp/core/Api";
import { IWindowProps } from "../../components/Window/IWindowModel";

export type TypeApiEvent = {
    onMenuChange: (menuList: any[]) => void;
    onFullScreenChange: (isFullScreen: boolean) => void;
    onCreateWindow: (opt: any) => void;
};

type TypeEditorApi = ApiModel<TypeModels, TypeApiEvent>;

export type TypeApi = {
    createWindow: (option: IWindowProps) => void;
};

export const Api: {[P in keyof TypeApi]: (api: TypeEditorApi) => TypeApi[P]} = {
    createWindow: (api) => (option) => api.emit("onCreateWindow", option)
};