import { IMSJAppOptions } from "../types/IMSJApp";
import { Api } from "./Api";
import { MSJApp } from "./App";
import { Impl } from "./Impl";
import { MLoader } from "./MLoader";
import { utils } from "elmer-common";

type TypeInstance = {
    /**
     * 开始运行MSJApp
     */
    run(): void;
    /**
     * 销毁调用资源
     */
    destory(): void;
};

type TypeAppState = {
    useData: any;
};

const appState: TypeAppState = {
    useData: {}
};

export const createInstance = <UseModel={}, AttachApi={}>(
    ImplApi: typeof Impl,
    options: IMSJAppOptions):Api<UseModel> & TypeInstance & AttachApi => {
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
    const app = new MSJApp<UseModel, AttachApi & TypeInstance>(ImplApi, {
        ...options,
        attachApi: {
            ...(options.attachApi || {}) as any,
            run: (api:Api<UseModel> & AttachApi & { app: Exclude<MSJApp<UseModel, AttachApi>, ["api"]> }) => function(){
                const args: any[] = [];
                for(let i=0;i<arguments.length;i++) {
                    args.push(arguments[i]);
                }
                return api.app.run.apply(api.app, args as any);
            },
            destory: (api:Api<UseModel> & AttachApi & { app: Exclude<MSJApp<UseModel, AttachApi>, ["api"]> }) => () => {
                api.app.destory();
            }
        }
    } as any);
    return app.api;
};

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

export const getAppState = (key: keyof TypeAppState) => {
    return utils.getValue(appState, key);
};
