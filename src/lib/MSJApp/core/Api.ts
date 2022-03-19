import { utils } from "elmer-common";
import { loaderFlag, TypeLoaderResult } from "./MLoader";
import { Model, ModelFlag } from "./Model";
import { getAppState } from "./ApiExport";

type TypeApiOptions = {
    useModels?: any;
    attachApis?: any;
};

export class Api<UseModel={}> {
    private useModels: UseModel;
    private useModelObjs: any;
    constructor(option: TypeApiOptions) {
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
                })
            }
        });
    }
    /**
     * 异步调用模块方法
     * @param model 定义的模块id
     * @param method 模块方法
     * @param args 自定义传递参数
     * @returns 
     */
    callApi<Name extends keyof UseModel>(model: Name, method: keyof UseModel[Name], ...args:any[]):Promise<any> {
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
}
