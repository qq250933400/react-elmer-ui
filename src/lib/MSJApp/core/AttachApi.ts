import { Api } from "./Api";
import { TypeModel } from "../model";
import { IFormDataSchema, IGlobalDataSchema } from "../types/ISchema";
import { CONST_ENTRY_CONFIG_KEY, IMenuList, TypeCreateMenuResult, TypeEntryRule } from "../types/IAdmin";

type TypeAttachApiExcludeN<T, PN> = { [K in Exclude<keyof T, PN>]: T[K] };

export type TypeAttachApiFunc<T={}, ApiEvent={}> = { [ P in keyof T]: (api: Api<TypeModel, ApiEvent> & { [K in keyof TypeAttachApiExcludeN<T, P>]: T[K] }) => T[P] };


export type TypeAttachApi = {
    /**
     * 注册FormData配置
     * @param schema - form字段定义
     */
    registeFormSchema<T={}, TypeFormatCallbacks={}, TypeCommonCallbacks={}>(schema: IFormDataSchema<T, TypeFormatCallbacks, TypeCommonCallbacks>): Promise<boolean>;
    /**
     * 注册全局数据保存字段配置
     * @param schema - 全局存储字段配置
     */
    registGlobalSchema<T={}, TypeFormatCallbacks={}>(schema: IGlobalDataSchema<T, TypeFormatCallbacks>): void;
    /**
     * 注册配置信息
     * @param name - 配置节点名称
     * @param config - 配置详细参数
     */
    registeConfig<T={}>(name: string, config:T): void;
    /**
     * 注册入口校验规则
     * @param rules 
     */
    registeEntryRules<T={}>(rules: (TypeEntryRule & T)[]): void;
    /**
     * 创建菜单列表数据
     * @param menuName - 菜单名称
     * @param menuList - 菜单数据
     */
    createMenu<T={}>(menuName: string, menuList: IMenuList<T>): Promise<TypeCreateMenuResult<T>>;
    /**
     * 根据菜单分组名称获取对应的菜单数据
     * @param menuName - 定义的菜单名称
     */
    getMenu<T={}>(menuName: string): Promise<IMenuList<T>>;
    /**
     * 根据定义配置名称获取数据
     * @param name - 配置名称
     */
    getConfig<T={}>(name: string): Promise<T>;
    /**
     * 保存数据
     * @param key - 字段名
     * @param data - 保存数据
     */
    save(key: string, data: any):void;
    /**
     * 保存数据到指定formData
     * @param key - 字段名称
     * @param data - 保存数据
     * @param formCode - 指定formCode
     */
    saveFormDataByCode(key: string, data: any, formCode: string): void;
    /**
     * 获取数据
     * @param key - 指定字段名称
     */
    get<T={}>(key: string): Promise<T>;
     /**
     * 获取指定form 部分数据，设置key获取指定字段值，key为null或undefined或空字符串将返回整个formData
     * @param formCode - 指定formCode
     * @param key - [可选参数]指定字段
     * @param isSrc - [可选参数]是否获取原始保存数据，不经过Format格式化的数据
     * @returns 
     */
    getFormDataByCode<T={}>(formCode: string, key?: string, isSrc?: boolean): Promise<T>
};

export const attachApi: TypeAttachApiFunc<TypeAttachApi> = {
    createMenu: (api) => (name, menuListData) => api.callApi("MAJApp_Admin_202203241748", "createMenu", name, menuListData) as any,
    getMenu: (api) => (name) => api.callApi("MAJApp_Admin_202203241748","getMenu", name),
    getConfig: (api) => (name) => api.callApi("MAJApp_Admin_202203241748", "getConfig", name),
    get: (api) => (key) => api.callApi("MSJApp_FormData_202203241448","get", key),
    getFormDataByCode: (api) => <T={}>(formCode: string, key?: string, isSrc?: boolean) => api.callApi("MSJApp_FormData_202203241448","getFormData", formCode, key, isSrc),
    registeFormSchema: (api) => (schema) => {
        return api.callApi("MSJApp_FormData_202203241448", "registeFormSchame", schema);
    },
    registeConfig: (api) => <T={}>(name: string, config: T) => api.callApi("MAJApp_Admin_202203241748", "registeConfig", name, config),
    registeEntryRules: (api) => <T={}>(rules: (TypeEntryRule & T)[]) => api.callApi("MAJApp_Admin_202203241748", "registeConfig", CONST_ENTRY_CONFIG_KEY, rules),
    registGlobalSchema: (api) => <T={},FormatCallbacks={}>(schema: IGlobalDataSchema<T,FormatCallbacks>) => api.callApi("MSJApp_FormData_202203241448","registGlobalSchema", schema),
    save: (api) => (key: string, data: any) => api.callApi("MSJApp_FormData_202203241448", "save", key, data),
    saveFormDataByCode: (api) => (key: string, data: any, formCode: string) => api.callApi("MSJApp_FormData_202203241448", "saveFormData", key, data, formCode)
};