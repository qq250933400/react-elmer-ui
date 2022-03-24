import { Model } from "../core/Model";
import { Api } from "../core/Api";

export interface IMSJAppOptions<M={}, TP={}> {
    attachApi?: {[P in keyof TP]: (api: Api) => Function };
    models?: {[P in keyof M]: Model};
}

export interface IMSJAppRunOpt<T={}> {
    /** 系统默认路径 */
    location?: string;
    /** 传递到impl.init方法参数 */
    implInit?: T;
    workspace: string;
}