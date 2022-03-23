import { Impl, ImplFlag } from "./Impl";
import { utils } from "elmer-common";
import { Api } from "./Api";
import { IMSJAppOptions, IMSJAppRunOpt } from "../types/IMSJApp";

export class MSJApp<UseModel={}, AllApi={}> {
    public api: Api<UseModel> & AllApi;
    private impl: Impl;
    private appId: string;
    constructor(ImplApi: typeof Impl, options: IMSJAppOptions<UseModel, AllApi>) {
        if(ImplApi.flag !== ImplFlag) {
            throw new Error(`参数ImplApi必须是继承Impl的类。`);
        }
        this.appId = "MSJApp_" + utils.guid();
        this.api = new Api<UseModel>({
            useModels: options.models,
            attachApis: options.attachApi
        }) as any;
        this.impl = new (ImplApi as any)(this.api);
        this.api.impl = this.impl as any;
        Object.defineProperty(this.api, "app", {
            value: this,
            enumerable: false,
            configurable: false,
            writable: false
        });
    }
    run<InitIMPL={}>(opt: IMSJAppRunOpt<InitIMPL>): void {
        this.impl.init(opt?.implInit);
    }
    destory(): void {
        console.log("release all resource");
    }
}
