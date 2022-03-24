import { Observe } from "elmer-common/lib/BaseModule/Observe";
import { utils } from "elmer-common/lib/utils";
import { loaderFlag, TypeLoaderResult } from "./MLoader";
import { Model, ModelFlag } from "./Model";
import { getAppState } from "./ApiExport";
import { Impl } from "./Impl";
import { getPageById } from "./PageStorage";
import { IPageInfo } from "../types/IPage";
import { IEventHandlers } from "../types/IEventHandler";

type TypeApiOptions = {
    useModels?: any;
    attachApis?: any;
};

export class Api<UseModel={}> extends Observe<IEventHandlers> {
    public impl!: Impl<UseModel>;
    public urlPrefix!: string;
    private useModels: UseModel;
    private useModelObjs: any;
    constructor(option: TypeApiOptions) {
        super();
        this.useModels = option.useModels || {};
        this.useModelObjs = {};
        if(option.attachApis) {
            Object.keys(option.attachApis).forEach((apiName: string): void => {
                if(!(this as any)[apiName]) {
                    const fn = option.attachApis[apiName];
                    if(typeof fn === "function") {
                        const createApi = fn(this);
                        if(typeof createApi !== "function") {
                            throw new Error("绑定Api必须返回执行逻辑方法。")
                        }
                        (this as any)[apiName] = createApi;
                    } else {
                        (this as any)[apiName] = fn;
                    }
                }
            });
        }
    }
    /**
     * 使用asynData引入的数据
     * @param name - 定义数据name
     * @returns 
     */
    useData<T={}>(name: string): Promise<T> {
        return new Promise((resolve, reject) => {
            const useData:any = getAppState("useData") || {};
            if(useData[name]) {
                const data = useData[name];
                if(data.init) {
                    resolve(data.data);
                } else {
                    (data.loader as TypeLoaderResult).load().then((resp: any)=>{
                        resolve(resp.default);
                    }).catch(reject);
                }
            } else {
                reject({
                    code: "Data_404",
                    msg: `引用数据不存在${name}。`
                });
            }
        });
    }
    /**
     * 调用Model方法
     * @param target - 指定调用model和方法名，示例: admin.log
     * @param args - 传递参数
     * @returns 
     */
    callApiEx(target: string, ...args: any[]): Promise<any> {
        const NM = /^[a-z0-9_]{1,}\.[a-z0-9_]{1,}$/i.exec(target);
        const model = NM ? NM[1] : "";
        const method = NM ? NM[2] : "";
        return this.callApi(model as any, method as any, ...args);
    }
    /**
     * 异步调用模块方法
     * @param model 定义的模块id
     * @param method 模块方法
     * @param args 自定义传递参数
     * @returns 
     */
    callApi<Name extends keyof UseModel>(model: Name, method: Exclude<keyof UseModel[Name], "api">, ...args:any[]):Promise<any> {
        return new Promise((resolve, reject) => {
            let instance = this.useModelObjs[model];
            if(instance) {
                if(typeof instance[method] === "function") {
                    this.invoke(instance[method] as Function, instance, ...args).then(resolve).catch(reject);
                } else {
                    reject({
                        code: "Api404",
                        msg: `调用模块${model}上不存在方法${method}，请检查模块代码。`
                    });
                }
            } else {
                // 不存在instance获取model初始化
                const ModelFn:any = this.useModels[model];
                if(!ModelFn) {
                    reject({
                        code: "Api404",
                        msg: `调用模块${model}未定义。`
                    });
                }
                if(ModelFn.flag === loaderFlag) {
                    // 异步模块
                    (ModelFn as TypeLoaderResult)
                        .load()
                        .then((resp) => {
                            const fn: Model = resp.default;
                            if(((fn as unknown) as typeof Model).flag === ModelFlag) {
                                // 调用模块必须继承至/core/Model
                                instance = new (fn as any)(this);
                                if(typeof instance[method] === "function") {
                                    this.invoke(instance[method] as Function, instance, ...args).then(resolve).catch(reject);
                                } else {
                                    reject({
                                        code: "Api404",
                                        msg: `调用模块${model}上不存在方法${method}，请检查模块代码。`
                                    });
                                }
                            } else {
                                reject({
                                    code: "Api501",
                                    msg: "引用模块必须继承至Model。"
                                });
                            }
                        }).catch((err) => {
                            reject({
                                code: "Api500",
                                msg: `加载模块错误。(${model})`
                            });
                        })
                } else if(((ModelFn as unknown) as typeof Model).flag === ModelFlag) {
                    instance = new ModelFn(this);
                    if(typeof instance[method] === "function") {
                        this.invoke(instance[method] as Function, instance, ...args).then(resolve).catch(reject);
                    } else {
                        reject({
                            code: "Api404",
                            msg: `调用模块${model}上不存在方法${method}，请检查模块代码。`
                        });
                    }
                } else {
                    reject({
                        code: "Api502",
                        msg: `不合法的模块，调用模块${model}必须继承Model请检查模块代码。`
                    });
                }
            }
        });
    }
    /**
     * 调用未知返回结果类型的方法，以Promise方式返回
     * @param fn - 调用方法
     * @param target - 需要绑定的对象
     * @param args - 传递参数
     * @returns 
     */
    invoke<T={}>(fn: Function,target: any, ...args: any[]): Promise<T> {
        return new Promise((resolve, reject) => {
            if(typeof fn === "function") {
                const fnResult = fn.apply(target, args);
                if(utils.isPromise(fnResult)) {
                    fnResult.then(resolve).catch(reject);
                } else {
                    resolve(fnResult);
                }
            } else {
                reject({
                    code: "INV_500",
                    msg: "invoke方法第一个参数必须是Function."
                });
            }
        });
    }
    /**
     * 返回当前App保存的所有数据
     * @returns 所有数据
     */
    getStoreData(): any {
        return this.impl.getData();
    }
    /**
     * 获取页面信息
     * @param pageId - 页面ID
     * @returns 
     */
    getPageById<T={}>(pageId: string): (IPageInfo & T) | null {
        const workspaceName = this.getWorkspaceName();
        const gotoPageId = /\./.test(pageId) ? pageId : [workspaceName, pageId].join(".");
        return getPageById<T>(gotoPageId);
    }
    /**
     * 保存数据
     * @param key - 指定key 
     * @param data - 保存数据
     */
    setData<T={}>(key: string, data: T): void {
        const allData:any = { ...(this.impl.getData() || {}) };
        allData[key] = data;
        this.impl.setData(allData); 
    }
    /**
     * 获取数据
     * @param key - 指定数据ID
     * @returns 
     */
    getData<T={}>(key: string): T {
        const allData: any = this.impl.getData() || {};
        return allData[key];
    }
    /**
     * 显示错误信息
     * @param err 
     */
    showException(err: any): void {
        const errMsg = err?.exception?.exception?.stack || err?.exception?.stack || err?.stack || err?.message || err;
        console.error(errMsg);
    }
    navigateTo<T={}>(pageInfo: IPageInfo & T, ...args: any[]): Promise<any> {
        return this.impl.nativateTo(pageInfo, ...args);
    }
    private getWorkspaceName(): string {
        return (this as any).workspace;
    }
}
