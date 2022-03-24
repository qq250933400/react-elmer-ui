import { Api } from "./Api";
import { TypeModel } from "../model";
import { IFormDataSchema } from "../types/ISchema";
import { IMenuList, TypeCreateMenuResult } from "../types/IAdmin";

type TypeAttachApiExcludeN<T, PN> = { [K in Exclude<keyof T, PN>]: T[K] };
type TypeAttachApiFunc<T={}> = { [ P in keyof T]: (api: Api<TypeModel> & { [K in keyof TypeAttachApiExcludeN<T, P>]: T[K] }) => T[P] };

export type TypeAttachApi = {
    /**
     * 注册FormData配置
     * @param schema - form字段定义
     */
    registeFormSchema<T={}, TypeFormatCallbacks={}, TypeCommonCallbacks={}>(schema: IFormDataSchema<T, TypeFormatCallbacks, TypeCommonCallbacks>): Promise<boolean>;
    /**
     * 创建菜单列表数据
     * @param menuName - 菜单名称
     * @param menuList - 菜单数据
     */
    createMenu<T={}>(menuName: string, menuList: IMenuList<T>): Promise<TypeCreateMenuResult<T>>;
    getMenu<T={}>(menuName: string): Promise<IMenuList<T>>;
};

export const attachApi: TypeAttachApiFunc<TypeAttachApi> = {
    createMenu: (api) => (name, menuListData) => api.callApi("MAJApp_Admin_202203241748", "createMenu", name, menuListData) as any,
    getMenu: (api) => (name) => api.callApi("MAJApp_Admin_202203241748","getMenu", name),
    registeFormSchema: (api) => (schema) => {
        return api.callApi("MSJApp_FormData_202203241448", "registeFormSchame", schema);
    }
};