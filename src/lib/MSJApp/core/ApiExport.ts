import { IMSJAppOptions, IMSJAppRunOpt } from "../types/IMSJApp";
import { Api } from "./Api";
import { MSJApp } from "./App";
import { Impl } from "./Impl";
import { MLoader } from "./MLoader";
import { utils } from "elmer-common";
import { TypeAttachApi, attachApi } from "./AttachApi";
import Model, { TypeModel } from "../model";


type TypeInstanceApi = {
    /**
     * 开始运行MSJApp
     */
    run<InitIMPL={}>(opt?: IMSJAppRunOpt<InitIMPL>): void;
    /**
     * 销毁调用资源
     */
    destory(): void;
    /** 强制更新数据，不建议使用此方法更新数据 */
    refreshStoreData(newData: any): void;
} & TypeAttachApi;

type TypeAppState = {
    useData: any;
};

const appState: TypeAppState = {
    useData: {}
};
/**
 * 创建程序运行实例
 * @param ImplApi - 关键方法实现对象
 * @param options - 自定义模块以及API配置
 * @returns 
 */
export const createInstance = <UseModel={}, AttachApi={}, DefineEvent={}>(
    ImplApi: typeof Impl,
    options: IMSJAppOptions):Api<UseModel & TypeModel, DefineEvent> & TypeInstanceApi & AttachApi => {
    if(options.attachApi) {
        const limitName: string[] = [];
        Object.keys(options.attachApi).forEach((name) => {
            if(["run","destory"].indexOf(name)>=0) {
                limitName.push(name);
            }
        });
        if(limitName.length > 0) {
            throw new Error(`方法名冲突：${limitName.join(",")}为系统保留方法名`)
        }
    }
    const app = new MSJApp<UseModel & TypeModel, AttachApi & TypeInstanceApi>(ImplApi, {
        ...options,
        models: {
            ...(options.models || {}),
            ...Model
        },
        attachApi: {
            ...(options.attachApi || {}) as any,
            ...attachApi,
            run: (api:Api<UseModel> & AttachApi & { app: Exclude<MSJApp<UseModel, AttachApi>, ["api"]> }) => function(){
                const args: any[] = [];
                for(let i=0;i<arguments.length;i++) {
                    args.push(arguments[i]);
                }
                return api.app.run.apply(api.app, args as any);
            },
            destory: (api: Api<UseModel> & AttachApi & { app: Exclude<MSJApp<UseModel, AttachApi>, ["api"]> }) => () => {
                return api.app.destory();
            },
            refreshStoreData: (api: Api<UseModel> & AttachApi & { app: Exclude<MSJApp<UseModel, AttachApi>, ["api"]> }) => (newData: any) => {
                return api.impl.setData(newData);
            }
        }
    } as any);
    return app.api;
};
/**
 * 定义静态数据引用
 * @param name - 定义数据名
 * @param loader - 数据加载import方法
 */
export const asynData = (name: string, loader: ()=>Promise<any>) => {
    if(!appState.useData[name]) {
        appState.useData[name] = {
            init: false,
            loader: MLoader(loader)
        };
    } else {
        throw new Error(`引用数据name已经存在。${name}`);
    }
};
/**
 * 获取全局变量
 * @param key - 指定全局变量Key
 * @returns 
 */
export const getAppState = (key: keyof TypeAppState) => {
    return utils.getValue(appState, key);
};
